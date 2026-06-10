import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TelemedicinavService } from '../application/use-cases/telemedicina.service';
import {
  PlataformaVideo,
  SessaoStatus,
  SessaoTelemedicina,
} from '../domain/entities/sessao-telemedicina.entity';

const mockSave = jest.fn();
const mockCreate = jest.fn((dto) => ({ ...dto }));
const mockFindOne = jest.fn();
const mockCount = jest.fn();
const mockQB = {
  andWhere: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  addOrderBy: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  getCount: jest.fn().mockResolvedValue(0),
  getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
};
const mockRepo = {
  create: mockCreate,
  save: mockSave,
  findOne: mockFindOne,
  count: mockCount,
  createQueryBuilder: jest.fn().mockReturnValue(mockQB),
} as unknown as Repository<SessaoTelemedicina>;

// Sessão base para reusar nos testes
const sessaoBase: SessaoTelemedicina = {
  id: 'sessao-uuid',
  pacienteId: 'pac-uuid',
  pacienteNome: 'Ana Silva',
  pacienteEmail: 'ana@test.com',
  pacienteTelefone: '(11) 99999-0000',
  profissionalId: 'prof-uuid',
  profissionalNome: 'Dra. Natalia Salvador',
  agendamentoId: null,
  status: SessaoStatus.AGENDADA,
  plataforma: PlataformaVideo.JITSI,
  roomName: 'estetica-ns-abc123',
  roomUrl: 'https://meet.jit.si/estetica-ns-abc123',
  tokenPaciente: 'https://meet.jit.si/estetica-ns-abc123',
  tokenProfissional: 'https://meet.jit.si/estetica-ns-abc123',
  agendadoPara: null,
  iniciadoEm: null,
  encerradoEm: null,
  observacoes: null,
  arquivosJson: '[]',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('TelemedicinavService', () => {
  let service: TelemedicinavService;
  let configGet: jest.Mock;

  beforeEach(async () => {
    jest.clearAllMocks();
    configGet = jest.fn().mockReturnValue(undefined);
    mockSave.mockImplementation((entity) => Promise.resolve({ ...sessaoBase, ...entity }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TelemedicinavService,
        { provide: getRepositoryToken(SessaoTelemedicina), useValue: mockRepo },
        { provide: ConfigService, useValue: { get: configGet } },
      ],
    }).compile();

    service = module.get(TelemedicinavService);
  });

  // ─── statusConfig ────────────────────────────────────────────────────────────

  describe('statusConfig', () => {
    it('retorna JITSI quando DAILY_CO_API_KEY não configurada', () => {
      const r = service.statusConfig();
      expect(r.plataforma).toBe('JITSI');
      expect(r.configurado).toBe(true);
    });

    it('retorna DAILY_CO quando DAILY_CO_API_KEY configurada', () => {
      configGet.mockImplementation((key: string) =>
        key === 'DAILY_CO_API_KEY' ? 'daily-key-123' : undefined,
      );
      const r = service.statusConfig();
      expect(r.plataforma).toBe('DAILY_CO');
    });

    it('usa prefixo customizado quando TELEMEDICINA_ROOM_PREFIX configurado', () => {
      configGet.mockImplementation((key: string, def?: string) =>
        key === 'TELEMEDICINA_ROOM_PREFIX' ? 'minha-clinica' : def,
      );
      const r = service.statusConfig();
      expect(r.roomPrefix).toBe('minha-clinica');
    });
  });

  // ─── criar ────────────────────────────────────────────────────────────────────

  describe('criar', () => {
    it('cria sessão Jitsi sem API key', async () => {
      const r = await service.criar({
        pacienteId: 'pac-uuid',
        pacienteNome: 'Ana Silva',
        profissionalNome: 'Dra. Natalia',
      });
      expect(r.plataforma).toBe(PlataformaVideo.JITSI);
      expect(r.roomUrl).toContain('meet.jit.si');
      expect(r.urlEntradaPaciente).toContain('meet.jit.si');
      expect(r.arquivos).toEqual([]);
      expect(r.duracaoMinutos).toBeNull();
    });

    it('cria sessão com status AGENDADA', async () => {
      await service.criar({
        pacienteId: 'pac-uuid',
        pacienteNome: 'Ana Silva',
        profissionalNome: 'Dra. Natalia',
      });
      const saved = mockCreate.mock.calls[0][0];
      expect(saved.status).toBe(SessaoStatus.AGENDADA);
    });

    it('inclui agendadoPara quando fornecido', async () => {
      const data = new Date('2025-06-15T14:00:00Z');
      await service.criar({
        pacienteId: 'pac-uuid',
        pacienteNome: 'Ana Silva',
        profissionalNome: 'Dra. Natalia',
        agendadoPara: data,
      });
      const saved = mockCreate.mock.calls[0][0];
      expect(saved.agendadoPara).toEqual(data);
    });
  });

  // ─── iniciar ──────────────────────────────────────────────────────────────────

  describe('iniciar', () => {
    it('muda status para EM_ANDAMENTO e define iniciadoEm', async () => {
      mockFindOne.mockResolvedValueOnce({ ...sessaoBase });
      const r = await service.iniciar('sessao-uuid');
      expect(r.status).toBe(SessaoStatus.EM_ANDAMENTO);
      const saved = mockSave.mock.calls[0][0];
      expect(saved.iniciadoEm).toBeInstanceOf(Date);
    });

    it('lança NotFoundException quando sessão não existe', async () => {
      mockFindOne.mockResolvedValueOnce(null);
      await expect(service.iniciar('not-found')).rejects.toThrow(NotFoundException);
    });

    it('lança BadRequestException quando sessão já encerrada', async () => {
      mockFindOne.mockResolvedValueOnce({ ...sessaoBase, status: SessaoStatus.ENCERRADA });
      await expect(service.iniciar('sessao-uuid')).rejects.toThrow(BadRequestException);
    });
  });

  // ─── encerrar ─────────────────────────────────────────────────────────────────

  describe('encerrar', () => {
    it('muda status para ENCERRADA e define encerradoEm', async () => {
      mockFindOne.mockResolvedValueOnce({ ...sessaoBase, status: SessaoStatus.EM_ANDAMENTO });
      const r = await service.encerrar('sessao-uuid');
      expect(r.status).toBe(SessaoStatus.ENCERRADA);
      const saved = mockSave.mock.calls[0][0];
      expect(saved.encerradoEm).toBeInstanceOf(Date);
    });

    it('lança BadRequestException quando sessão já encerrada', async () => {
      mockFindOne.mockResolvedValueOnce({ ...sessaoBase, status: SessaoStatus.ENCERRADA });
      await expect(service.encerrar('sessao-uuid')).rejects.toThrow(BadRequestException);
    });
  });

  // ─── cancelar ─────────────────────────────────────────────────────────────────

  describe('cancelar', () => {
    it('muda status para CANCELADA', async () => {
      mockFindOne.mockResolvedValueOnce({ ...sessaoBase });
      const r = await service.cancelar('sessao-uuid');
      expect(r.status).toBe(SessaoStatus.CANCELADA);
    });

    it('não permite cancelar sessão encerrada', async () => {
      mockFindOne.mockResolvedValueOnce({ ...sessaoBase, status: SessaoStatus.ENCERRADA });
      await expect(service.cancelar('sessao-uuid')).rejects.toThrow(BadRequestException);
    });
  });

  // ─── adicionarArquivo ─────────────────────────────────────────────────────────

  describe('adicionarArquivo', () => {
    it('adiciona arquivo ao JSON da sessão', async () => {
      mockFindOne.mockResolvedValueOnce({ ...sessaoBase, arquivosJson: '[]' });
      const r = await service.adicionarArquivo('sessao-uuid', {
        nome: 'exame.pdf',
        url: 'https://storage.example.com/exame.pdf',
        tipo: 'application/pdf',
        tamanho: 102400,
      });
      expect(r.arquivos).toHaveLength(1);
      expect(r.arquivos[0].nome).toBe('exame.pdf');
    });

    it('inclui uploadadoEm no arquivo', async () => {
      mockFindOne.mockResolvedValueOnce({ ...sessaoBase, arquivosJson: '[]' });
      const r = await service.adicionarArquivo('sessao-uuid', {
        nome: 'doc.pdf',
        url: 'https://example.com/doc.pdf',
        tipo: 'application/pdf',
        tamanho: 1024,
      });
      expect(r.arquivos[0].uploadadoEm).toBeDefined();
    });
  });

  // ─── buscarPorId ──────────────────────────────────────────────────────────────

  describe('buscarPorId', () => {
    it('retorna sessão computada com campos extras', async () => {
      const inicio = new Date('2025-01-01T10:00:00Z');
      const fim = new Date('2025-01-01T10:30:00Z');
      mockFindOne.mockResolvedValueOnce({
        ...sessaoBase,
        status: SessaoStatus.ENCERRADA,
        iniciadoEm: inicio,
        encerradoEm: fim,
      });
      const r = await service.buscarPorId('sessao-uuid');
      expect(r.duracaoMinutos).toBe(30);
      expect(r.urlEntradaPaciente).toContain('meet.jit.si');
    });

    it('lança NotFoundException quando não encontrado', async () => {
      mockFindOne.mockResolvedValueOnce(null);
      await expect(service.buscarPorId('not-found')).rejects.toThrow(NotFoundException);
    });
  });

  // ─── listar ───────────────────────────────────────────────────────────────────

  describe('listar', () => {
    it('retorna sessões paginadas', async () => {
      mockQB.getManyAndCount.mockResolvedValueOnce([[{ ...sessaoBase, arquivosJson: '[]' }], 1]);
      const r = await service.listar({ page: 1 });
      expect(r.total).toBe(1);
      expect(r.data).toHaveLength(1);
    });

    it('aplica filtro de profissionalId', async () => {
      mockQB.getManyAndCount.mockResolvedValueOnce([[], 0]);
      await service.listar({ profissionalId: 'prof-uuid' });
      expect(mockQB.andWhere).toHaveBeenCalledWith(
        's.profissionalId = :profissionalId',
        { profissionalId: 'prof-uuid' },
      );
    });
  });
});
