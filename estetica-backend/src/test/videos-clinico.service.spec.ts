import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { VideosClinicoService } from '../application/use-cases/videos-clinico.service';
import { VideoCategoria, VideoClinico, VideoTipo } from '../domain/entities/video-clinico.entity';

const mockVideo: VideoClinico = {
  id: 'video-uuid-1',
  titulo: 'Botox — Técnica Frontal',
  descricao: 'Demonstração de botox',
  videoUrl: 'https://www.youtube.com/embed/test123',
  thumbnailUrl: null,
  categoria: VideoCategoria.TOXINA_BOTULINICA,
  tipo: VideoTipo.TECNICA,
  procedimentoNome: 'Toxina Botulínica',
  duracaoSegundos: 480,
  tags: 'botox,fronte',
  ativo: true,
  visivelPaciente: false,
  totalVisualizacoes: 10,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockQb = {
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  addSelect: jest.fn().mockReturnThis(),
  groupBy: jest.fn().mockReturnThis(),
  getManyAndCount: jest.fn().mockResolvedValue([[mockVideo], 1]),
  getMany: jest.fn().mockResolvedValue([mockVideo]),
  getRawMany: jest.fn().mockResolvedValue([
    { categoria: 'TOXINA_BOTULINICA', total: '5', visualizacoes: '42' },
  ]),
};

const mockRepo = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
  increment: jest.fn().mockResolvedValue(undefined),
  createQueryBuilder: jest.fn(() => mockQb),
};

describe('VideosClinicoService', () => {
  let service: VideosClinicoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VideosClinicoService,
        { provide: getRepositoryToken(VideoClinico), useValue: mockRepo },
      ],
    }).compile();
    service = module.get<VideosClinicoService>(VideosClinicoService);
    jest.clearAllMocks();
    mockRepo.createQueryBuilder.mockReturnValue(mockQb);
    mockQb.getManyAndCount.mockResolvedValue([[mockVideo], 1]);
  });

  // ─── listar ─────────────────────────────────────────────────────────────────

  describe('listar', () => {
    it('deve retornar lista paginada de vídeos', async () => {
      const res = await service.listar({ page: 1, limit: 12 });
      expect(res.data).toHaveLength(1);
      expect(res.total).toBe(1);
      expect(res.page).toBe(1);
    });

    it('deve formatar duração corretamente', async () => {
      const res = await service.listar({});
      expect(res.data[0].duracaoFormatada).toBe('8:00');
    });

    it('deve separar tags em array', async () => {
      const res = await service.listar({});
      expect(res.data[0].tags).toEqual(['botox', 'fronte']);
    });
  });

  // ─── buscarPorId ────────────────────────────────────────────────────────────

  describe('buscarPorId', () => {
    it('deve retornar vídeo pelo ID', async () => {
      mockRepo.findOne.mockResolvedValue(mockVideo);
      const video = await service.buscarPorId('video-uuid-1');
      expect(video.titulo).toBe('Botox — Técnica Frontal');
    });

    it('deve lançar NotFoundException para ID inexistente', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.buscarPorId('nao-existe')).rejects.toThrow(NotFoundException);
    });
  });

  // ─── criar ──────────────────────────────────────────────────────────────────

  describe('criar', () => {
    it('deve criar vídeo com sucesso', async () => {
      mockRepo.create.mockReturnValue({ ...mockVideo });
      mockRepo.save.mockResolvedValue({ ...mockVideo });

      const resultado = await service.criar({
        titulo: 'Botox — Técnica Frontal',
        videoUrl: 'https://www.youtube.com/embed/test',
        categoria: VideoCategoria.TOXINA_BOTULINICA,
        tipo: VideoTipo.TECNICA,
      });

      expect(resultado.titulo).toBe('Botox — Técnica Frontal');
      expect(mockRepo.save).toHaveBeenCalledTimes(1);
    });
  });

  // ─── atualizar ───────────────────────────────────────────────────────────────

  describe('atualizar', () => {
    it('deve atualizar vídeo existente', async () => {
      const atualizado = { ...mockVideo, titulo: 'Botox Atualizado' };
      mockRepo.findOne.mockResolvedValue({ ...mockVideo });
      mockRepo.save.mockResolvedValue(atualizado);

      const res = await service.atualizar('video-uuid-1', { titulo: 'Botox Atualizado' });
      expect(res.titulo).toBe('Botox Atualizado');
    });

    it('deve lançar NotFoundException se vídeo não existir', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.atualizar('nao-existe', {})).rejects.toThrow(NotFoundException);
    });
  });

  // ─── remover ────────────────────────────────────────────────────────────────

  describe('remover', () => {
    it('deve desativar vídeo (soft delete)', async () => {
      mockRepo.findOne.mockResolvedValue({ ...mockVideo });
      mockRepo.save.mockResolvedValue({ ...mockVideo, ativo: false });
      await service.remover('video-uuid-1');
      expect(mockRepo.save).toHaveBeenCalledWith(expect.objectContaining({ ativo: false }));
    });

    it('deve lançar NotFoundException se vídeo não existir', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.remover('nao-existe')).rejects.toThrow(NotFoundException);
    });
  });

  // ─── registrarVisualizacao ──────────────────────────────────────────────────

  describe('registrarVisualizacao', () => {
    it('deve chamar increment sem bloquear a thread', () => {
      expect(() => service.registrarVisualizacao('video-uuid-1')).not.toThrow();
    });
  });

  // ─── estatisticas ───────────────────────────────────────────────────────────

  describe('estatisticas', () => {
    it('deve retornar estatísticas por categoria', async () => {
      const stats = await service.estatisticas();
      expect(stats).toHaveLength(1);
      expect(stats[0].categoria).toBe('TOXINA_BOTULINICA');
      expect(stats[0].visualizacoes).toBe(42);
    });
  });
});
