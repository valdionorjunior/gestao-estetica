import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ConsultaInterativaService } from '../application/use-cases/consulta-interativa.service';
import { ConsultaFoto, TipoFotoConsulta } from '../domain/entities/consulta-foto.entity';
import { AnotacaoDto } from '../application/dtos/consulta/consulta-foto.dto';

const mockFoto: ConsultaFoto = {
  id: 'foto-uuid-1',
  pacienteId: 'pac-uuid-1',
  prontuarioId: null,
  profissionalId: null,
  tipo: TipoFotoConsulta.ANTES,
  fotoUrl: 'http://localhost:3000/uploads/consulta_test.jpg',
  descricao: 'Avaliação inicial',
  anotacoesJson: null,
  dataConsulta: new Date('2026-04-17'),
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockRepo = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    addOrderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([mockFoto]),
  })),
};

describe('ConsultaInterativaService', () => {
  let service: ConsultaInterativaService;
  let repo: jest.Mocked<Repository<ConsultaFoto>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsultaInterativaService,
        { provide: getRepositoryToken(ConsultaFoto), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<ConsultaInterativaService>(ConsultaInterativaService);
    repo = module.get(getRepositoryToken(ConsultaFoto));
    jest.clearAllMocks();
  });

  // ─── criarFoto ─────────────────────────────────────────────────────────────

  describe('criarFoto', () => {
    it('deve lançar BadRequestException se arquivo não for fornecido', async () => {
      await expect(
        service.criarFoto(
          { pacienteId: 'pac-uuid-1', tipo: TipoFotoConsulta.ANTES },
          undefined,
          'http://localhost:3000',
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve lançar BadRequestException para extensão inválida', async () => {
      const arquivo = { originalname: 'virus.exe', filename: 'consulta_test.exe' } as Express.Multer.File;
      await expect(
        service.criarFoto(
          { pacienteId: 'pac-uuid-1', tipo: TipoFotoConsulta.ANTES },
          arquivo,
          'http://localhost:3000',
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve criar foto com dados válidos', async () => {
      const arquivo = { originalname: 'foto.jpg', filename: 'consulta_uuid.jpg' } as Express.Multer.File;
      mockRepo.create.mockReturnValue({ ...mockFoto });
      mockRepo.save.mockResolvedValue({ ...mockFoto });

      const resultado = await service.criarFoto(
        { pacienteId: 'pac-uuid-1', tipo: TipoFotoConsulta.ANTES, descricao: 'Avaliação inicial' },
        arquivo,
        'http://localhost:3000',
      );

      expect(resultado.pacienteId).toBe('pac-uuid-1');
      expect(resultado.tipo).toBe(TipoFotoConsulta.ANTES);
      expect(mockRepo.save).toHaveBeenCalledTimes(1);
    });
  });

  // ─── listarPorPaciente ──────────────────────────────────────────────────────

  describe('listarPorPaciente', () => {
    it('deve retornar lista de fotos do paciente', async () => {
      const lista = await service.listarPorPaciente('pac-uuid-1');
      expect(lista).toHaveLength(1);
      expect(lista[0].pacienteId).toBe('pac-uuid-1');
    });

    it('deve retornar lista vazia para paciente inexistente', async () => {
      mockRepo.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      });
      const lista = await service.listarPorPaciente('nao-existe');
      expect(lista).toHaveLength(0);
    });
  });

  // ─── buscarPorId ────────────────────────────────────────────────────────────

  describe('buscarPorId', () => {
    it('deve retornar foto pelo ID', async () => {
      mockRepo.findOne.mockResolvedValue(mockFoto);
      const foto = await service.buscarPorId('foto-uuid-1');
      expect(foto.id).toBe('foto-uuid-1');
    });

    it('deve lançar NotFoundException para ID inexistente', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.buscarPorId('nao-existe')).rejects.toThrow(NotFoundException);
    });
  });

  // ─── salvarAnotacoes ────────────────────────────────────────────────────────

  describe('salvarAnotacoes', () => {
    it('deve salvar anotações e retornar foto atualizada', async () => {
      const anotacoes: AnotacaoDto[] = [
        { id: 'a1', x: 45.2, y: 30.1, texto: 'Aplicar botox', cor: '#D4AF37', forma: 'circulo' },
      ];
      const fotoComAnotacoes = { ...mockFoto, anotacoesJson: JSON.stringify(anotacoes) };
      mockRepo.findOne.mockResolvedValue({ ...mockFoto });
      mockRepo.save.mockResolvedValue(fotoComAnotacoes);

      const resultado = await service.salvarAnotacoes('foto-uuid-1', anotacoes);

      expect(resultado.anotacoes).toHaveLength(1);
      expect(resultado.anotacoes[0].texto).toBe('Aplicar botox');
    });

    it('deve lançar NotFoundException se foto não existir', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.salvarAnotacoes('nao-existe', [])).rejects.toThrow(NotFoundException);
    });
  });

  // ─── remover ────────────────────────────────────────────────────────────────

  describe('remover', () => {
    it('deve lançar NotFoundException se foto não existir', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.remover('nao-existe')).rejects.toThrow(NotFoundException);
    });

    it('deve remover foto existente', async () => {
      mockRepo.findOne.mockResolvedValue(mockFoto);
      mockRepo.remove.mockResolvedValue(undefined);
      await expect(service.remover('foto-uuid-1')).resolves.not.toThrow();
      expect(mockRepo.remove).toHaveBeenCalledWith(mockFoto);
    });
  });
});
