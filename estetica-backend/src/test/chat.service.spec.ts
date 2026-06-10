import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChatService } from '../application/use-cases/chat.service';
import { ChatMensagem, MensagemTipo } from '../domain/entities/chat-mensagem.entity';

const mockMensagem: ChatMensagem = {
  id: 'msg-uuid-1',
  remetenteId: 'user-uuid-1',
  remetenteNome: 'Dra. Natalia',
  remetenteRole: 'MEDICO',
  canal: 'geral',
  conteudo: 'Olá a todos!',
  tipo: MensagemTipo.TEXTO,
  respostaParaId: null,
  lidaPorJson: null,
  editada: false,
  createdAt: new Date(),
};

const mockQb = {
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  getMany: jest.fn().mockResolvedValue([mockMensagem]),
};

const mockRepo = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  createQueryBuilder: jest.fn(() => mockQb),
};

describe('ChatService', () => {
  let service: ChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        { provide: getRepositoryToken(ChatMensagem), useValue: mockRepo },
      ],
    }).compile();
    service = module.get<ChatService>(ChatService);
    jest.clearAllMocks();
    mockRepo.createQueryBuilder.mockReturnValue(mockQb);
    mockQb.getMany.mockResolvedValue([mockMensagem]);
  });

  // ─── salvar ──────────────────────────────────────────────────────────────────

  describe('salvar', () => {
    it('deve salvar mensagem de texto', async () => {
      mockRepo.create.mockReturnValue({ ...mockMensagem });
      mockRepo.save.mockResolvedValue({ ...mockMensagem });

      const msg = await service.salvar({
        remetenteId: 'user-uuid-1',
        remetenteNome: 'Dra. Natalia',
        remetenteRole: 'MEDICO',
        canal: 'geral',
        conteudo: 'Olá a todos!',
      });

      expect(msg.conteudo).toBe('Olá a todos!');
      expect(msg.canal).toBe('geral');
      expect(mockRepo.save).toHaveBeenCalledTimes(1);
    });

    it('deve truncar conteúdo a 4000 caracteres', async () => {
      const conteudoLongo = 'x'.repeat(5000);
      mockRepo.create.mockImplementation((d) => ({ ...d }));
      mockRepo.save.mockImplementation((d) => Promise.resolve({ ...d, id: 'uuid', createdAt: new Date() }));

      await service.salvar({
        remetenteId: 'user-uuid-1',
        remetenteNome: 'Admin',
        remetenteRole: 'ADMIN',
        canal: 'geral',
        conteudo: conteudoLongo,
      });

      const chamada = mockRepo.create.mock.calls[0][0];
      expect(chamada.conteudo.length).toBe(4000);
    });

    it('deve sanitizar canal com caracteres inválidos', async () => {
      mockRepo.create.mockImplementation((d) => ({ ...d }));
      mockRepo.save.mockImplementation((d) => Promise.resolve({ ...d, id: 'uuid', createdAt: new Date() }));

      await service.salvar({
        remetenteId: 'user-uuid-1',
        remetenteNome: 'Admin',
        remetenteRole: 'ADMIN',
        canal: 'canal com espaços e <script>',
        conteudo: 'teste',
      });

      const chamada = mockRepo.create.mock.calls[0][0];
      expect(chamada.canal).not.toContain(' ');
      expect(chamada.canal).not.toContain('<');
    });
  });

  // ─── historico ──────────────────────────────────────────────────────────────

  describe('historico', () => {
    it('deve retornar histórico do canal', async () => {
      const msgs = await service.historico('geral', 50);
      expect(msgs).toHaveLength(1);
      expect(msgs[0].canal).toBe('geral');
    });

    it('deve respeitar limite máximo de 100 mensagens', async () => {
      await service.historico('geral', 200);
      expect(mockQb.take).toHaveBeenCalledWith(100);
    });
  });

  // ─── canaisFixos ─────────────────────────────────────────────────────────────

  describe('canaisFixos', () => {
    it('deve retornar 4 canais fixos', () => {
      const canais = service.canaisFixos();
      expect(canais).toContain('geral');
      expect(canais).toContain('agenda');
      expect(canais).toHaveLength(4);
    });
  });

  // ─── canalPrivado ─────────────────────────────────────────────────────────────

  describe('canalPrivado', () => {
    it('deve gerar canal privado com IDs ordenados', () => {
      const canal1 = service.canalPrivado('zzz', 'aaa');
      const canal2 = service.canalPrivado('aaa', 'zzz');
      expect(canal1).toBe(canal2);
      expect(canal1).toMatch(/^priv_/);
    });
  });

  // ─── marcarLida ──────────────────────────────────────────────────────────────

  describe('marcarLida', () => {
    it('deve marcar mensagem como lida pelo usuário', async () => {
      mockRepo.findOne.mockResolvedValue({ ...mockMensagem });
      mockRepo.save.mockResolvedValue({ ...mockMensagem, lidaPorJson: '["user-uuid-2"]' });

      await expect(service.marcarLida('msg-uuid-1', 'user-uuid-2')).resolves.not.toThrow();
    });

    it('não deve duplicar userId no lidaPorJson', async () => {
      mockRepo.findOne.mockResolvedValue({
        ...mockMensagem,
        lidaPorJson: '["user-uuid-2"]',
      });
      mockRepo.save.mockResolvedValue(mockMensagem);

      await service.marcarLida('msg-uuid-1', 'user-uuid-2');
      // Se salvar, o array não deve ter duplicatas
      const chamada = mockRepo.save.mock.calls[0]?.[0];
      if (chamada) {
        const lidas = JSON.parse(chamada.lidaPorJson) as string[];
        const unicos = new Set(lidas);
        expect(lidas.length).toBe(unicos.size);
      }
    });

    it('deve ignorar mensagem inexistente silenciosamente', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.marcarLida('nao-existe', 'user-1')).resolves.not.toThrow();
    });
  });
});
