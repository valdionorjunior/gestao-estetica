import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { IaProntuarioService } from '../application/use-cases/ia-prontuario.service';
import {
  IaConsultaLog,
  IaOperacao,
  IaStatus,
} from '../domain/entities/ia-consulta-log.entity';

const mockSave = jest.fn();
const mockCreate = jest.fn((dto) => ({ ...dto }));
const mockQB = {
  andWhere: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
};
const mockRepo = {
  create: mockCreate,
  save: mockSave,
  createQueryBuilder: jest.fn().mockReturnValue(mockQB),
} as unknown as Repository<IaConsultaLog>;

describe('IaProntuarioService', () => {
  let service: IaProntuarioService;
  let configGet: jest.Mock;

  beforeEach(async () => {
    jest.clearAllMocks();
    configGet = jest.fn().mockReturnValue(undefined);
    mockSave.mockImplementation((entity) => Promise.resolve({ id: 'log-uuid', ...entity }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IaProntuarioService,
        { provide: getRepositoryToken(IaConsultaLog), useValue: mockRepo },
        { provide: ConfigService, useValue: { get: configGet } },
      ],
    }).compile();

    service = module.get(IaProntuarioService);
  });

  describe('statusConfig', () => {
    it('retorna openAiConfigurado=false sem OPENAI_API_KEY', () => {
      const r = service.statusConfig();
      expect(r.openAiConfigurado).toBe(false);
      expect(r.modelo).toBe('SIMULADO');
    });

    it('retorna openAiConfigurado=true quando OPENAI_API_KEY esta configurada', () => {
      configGet.mockImplementation((key) =>
        key === 'OPENAI_API_KEY' ? 'sk-test-key' : undefined,
      );
      const r = service.statusConfig();
      expect(r.openAiConfigurado).toBe(true);
      expect(r.modelo).toBe('gpt-4o-mini');
    });
  });

  describe('transcreverAudio', () => {
    it('retorna transcricao SIMULADA quando API key nao configurada', async () => {
      const r = await service.transcreverAudio({
        audioPath: '/tmp/fake.webm',
        audioNome: 'gravacao.webm',
        pacienteId: 'pac-uuid',
      });
      expect(r.simulado).toBe(true);
      expect(r.transcricao).toBeTruthy();
      expect(r.logId).toBeDefined();
      const saved = mockCreate.mock.calls[0][0];
      expect(saved.operacao).toBe(IaOperacao.TRANSCRICAO_AUDIO);
      expect(saved.status).toBe(IaStatus.SIMULADO);
    });
  });

  describe('resumirConsulta', () => {
    it('retorna resumo SIMULADO quando API key nao configurada', async () => {
      const r = await service.resumirConsulta({
        texto: 'Paciente queixa-se de dor na regiao do procedimento.',
        pacienteId: 'pac-uuid',
      });
      expect(r.simulado).toBe(true);
      expect(r.resumo).toBeTruthy();
      expect(Array.isArray(r.topicos)).toBe(true);
      expect(Array.isArray(r.proximasAcoes)).toBe(true);
      expect(r.logId).toBeDefined();
      const saved = mockCreate.mock.calls[0][0];
      expect(saved.operacao).toBe(IaOperacao.RESUMO_CONSULTA);
      expect(saved.status).toBe(IaStatus.SIMULADO);
    });
  });

  describe('sugerirHipotese', () => {
    it('retorna hipoteses SIMULADAS quando API key nao configurada', async () => {
      const r = await service.sugerirHipotese({
        queixas: 'Paciente relata vermelhidao e inchaco no local do procedimento.',
        pacienteId: 'pac-uuid',
      });
      expect(r.simulado).toBe(true);
      expect(Array.isArray(r.hipoteses)).toBe(true);
      expect(r.hipoteses.length).toBeGreaterThan(0);
      expect(Array.isArray(r.procedimentosSugeridos)).toBe(true);
      expect(r.observacoesClinicas).toBeTruthy();
      expect(r.logId).toBeDefined();
      const saved = mockCreate.mock.calls[0][0];
      expect(saved.operacao).toBe(IaOperacao.HIPOTESE_DIAGNOSTICA);
      expect(saved.status).toBe(IaStatus.SIMULADO);
    });

    it('cada hipotese tem probabilidade valida', async () => {
      const r = await service.sugerirHipotese({ queixas: 'Dor intensa e edema apos botox.' });
      for (const h of r.hipoteses) {
        expect(['ALTA', 'MEDIA', 'BAIXA']).toContain(h.probabilidade);
      }
    });
  });

  describe('listarLogs', () => {
    it('retorna dados paginados', async () => {
      mockQB.getManyAndCount.mockResolvedValueOnce([[{ id: '1' }, { id: '2' }], 2]);
      const result = await service.listarLogs({ page: 1 });
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
    });

    it('filtra por pacienteId', async () => {
      mockQB.getManyAndCount.mockResolvedValueOnce([[], 0]);
      await service.listarLogs({ pacienteId: 'pac-uuid' });
      expect(mockQB.andWhere).toHaveBeenCalledWith(
        'l.pacienteId = :pacienteId',
        { pacienteId: 'pac-uuid' },
      );
    });

    it('filtra por operacao', async () => {
      mockQB.getManyAndCount.mockResolvedValueOnce([[], 0]);
      await service.listarLogs({ operacao: IaOperacao.TRANSCRICAO_AUDIO });
      expect(mockQB.andWhere).toHaveBeenCalledWith(
        'l.operacao = :operacao',
        { operacao: IaOperacao.TRANSCRICAO_AUDIO },
      );
    });
  });
});
