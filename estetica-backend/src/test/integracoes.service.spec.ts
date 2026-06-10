import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { IntegracoesService } from '../application/use-cases/integracoes.service';
import {
  IntegracaoLog,
  IntegracaoAcao,
  IntegracaoStatus,
  PlataformaIntegracao,
} from '../domain/entities/integracao-log.entity';

const mockSave = jest.fn();
const mockCreate = jest.fn((dto) => ({ ...dto }));
const mockQB = {
  select: jest.fn().mockReturnThis(),
  addSelect: jest.fn().mockReturnThis(),
  groupBy: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
  getRawMany: jest.fn().mockResolvedValue([]),
};
const mockRepo = {
  create: mockCreate,
  save: mockSave,
  createQueryBuilder: jest.fn().mockReturnValue(mockQB),
};

function buildService(envVars: Record<string, string> = {}) {
  const configGet = jest.fn((key: string) => envVars[key] ?? undefined);
  return { configGet };
}

describe('IntegracoesService', () => {
  let service: IntegracoesService;
  let configGet: jest.Mock;

  beforeEach(async () => {
    jest.clearAllMocks();
    const { configGet: cg } = buildService({});
    configGet = cg;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IntegracoesService,
        {
          provide: getRepositoryToken(IntegracaoLog),
          useValue: mockRepo as unknown as Repository<IntegracaoLog>,
        },
        {
          provide: ConfigService,
          useValue: { get: configGet },
        },
      ],
    }).compile();

    service = module.get(IntegracoesService);
  });

  // ─── statusConfig ────────────────────────────────────────────────────────────

  describe('statusConfig', () => {
    it('retorna rdStation=false e leadlovers=false sem env vars', () => {
      const result = service.statusConfig();
      expect(result.rdStation).toBe(false);
      expect(result.leadlovers).toBe(false);
    });

    it('retorna rdStation=true quando RD_STATION_API_KEY está configurada', () => {
      configGet.mockImplementation((key: string) =>
        key === 'RD_STATION_API_KEY' ? 'fake-key' : undefined,
      );
      const result = service.statusConfig();
      expect(result.rdStation).toBe(true);
    });

    it('retorna leadlovers=true quando LEADLOVERS_API_KEY e MAQUINA_ID estão configurados', () => {
      configGet.mockImplementation((key: string) => {
        const map: Record<string, string> = {
          LEADLOVERS_API_KEY: 'key',
          LEADLOVERS_MAQUINA_ID: '123',
        };
        return map[key];
      });
      const result = service.statusConfig();
      expect(result.leadlovers).toBe(true);
    });
  });

  // ─── rdStationSincronizarContato — simulado ──────────────────────────────────

  describe('rdStationSincronizarContato', () => {
    beforeEach(() => {
      mockSave.mockImplementation((entity) => Promise.resolve({ id: 'log-uuid', ...entity }));
    });

    it('salva log com status SIMULADO quando API key não configurada', async () => {
      const log = await service.rdStationSincronizarContato('pac-1', {
        nome: 'Ana Silva',
        email: 'ana@test.com',
      });

      expect(mockSave).toHaveBeenCalled();
      const saved = mockCreate.mock.calls[0][0] as Partial<IntegracaoLog>;
      expect(saved.plataforma).toBe(PlataformaIntegracao.RD_STATION);
      expect(saved.acao).toBe(IntegracaoAcao.SINCRONIZAR_CONTATO);
      expect(saved.status).toBe(IntegracaoStatus.SIMULADO);
      expect(saved.pacienteId).toBe('pac-1');
      expect(log).toBeDefined();
    });
  });

  // ─── leadloversSincronizarContato — simulado ─────────────────────────────────

  describe('leadloversSincronizarContato', () => {
    beforeEach(() => {
      mockSave.mockImplementation((entity) => Promise.resolve({ id: 'log-uuid', ...entity }));
    });

    it('salva log com status SIMULADO quando credenciais não configuradas', async () => {
      await service.leadloversSincronizarContato('pac-2', { nome: 'João Teste' });
      const saved = mockCreate.mock.calls[0][0] as Partial<IntegracaoLog>;
      expect(saved.plataforma).toBe(PlataformaIntegracao.LEADLOVERS);
      expect(saved.status).toBe(IntegracaoStatus.SIMULADO);
    });
  });

  // ─── rdStationRegistrarEvento — simulado ─────────────────────────────────────

  describe('rdStationRegistrarEvento', () => {
    beforeEach(() => {
      mockSave.mockImplementation((entity) => Promise.resolve({ id: 'log-uuid', ...entity }));
    });

    it('registra evento com status SIMULADO sem API key', async () => {
      await service.rdStationRegistrarEvento(null, {
        tipo: 'SALE',
        email: 'test@test.com',
        valor: 500,
      });
      const saved = mockCreate.mock.calls[0][0] as Partial<IntegracaoLog>;
      expect(saved.acao).toBe(IntegracaoAcao.REGISTRAR_EVENTO);
      expect(saved.status).toBe(IntegracaoStatus.SIMULADO);
    });
  });

  // ─── processarWebhook ────────────────────────────────────────────────────────

  describe('processarWebhook', () => {
    beforeEach(() => {
      mockSave.mockImplementation((entity) => Promise.resolve({ id: 'log-uuid', ...entity }));
    });

    it('processa webhook RD Station e salva log', async () => {
      const payload = { email: 'lead@test.com', name: 'Lead Teste' };
      await service.processarWebhook(PlataformaIntegracao.RD_STATION, payload);
      const saved = mockCreate.mock.calls[0][0] as Partial<IntegracaoLog>;
      expect(saved.plataforma).toBe(PlataformaIntegracao.RD_STATION);
      expect(saved.acao).toBe(IntegracaoAcao.WEBHOOK_RECEBIDO);
      expect(saved.status).toBe(IntegracaoStatus.SUCESSO);
    });

    it('processa webhook LeadLovers e salva log', async () => {
      const payload = { email_lead: 'lead@leadlovers.com', nome_lead: 'Lead LL' };
      await service.processarWebhook(PlataformaIntegracao.LEADLOVERS, payload);
      const saved = mockCreate.mock.calls[0][0] as Partial<IntegracaoLog>;
      expect(saved.plataforma).toBe(PlataformaIntegracao.LEADLOVERS);
      expect(saved.status).toBe(IntegracaoStatus.SUCESSO);
    });
  });

  // ─── listar ──────────────────────────────────────────────────────────────────

  describe('listar', () => {
    it('retorna dados paginados', async () => {
      mockQB.getManyAndCount.mockResolvedValueOnce([[{ id: '1' }, { id: '2' }], 2]);
      const result = await service.listar({ page: 1, limit: 10 });
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
    });

    it('usa page mínima 1', async () => {
      mockQB.getManyAndCount.mockResolvedValueOnce([[], 0]);
      await service.listar({ page: -5 });
      expect(mockQB.skip).toHaveBeenCalledWith(0);
    });
  });

  // ─── estatisticas ────────────────────────────────────────────────────────────

  describe('estatisticas', () => {
    it('retorna array com contagens convertidas para número', async () => {
      mockQB.getRawMany.mockResolvedValueOnce([
        {
          plataforma: 'RD_STATION',
          sucesso: '5',
          falha: '2',
          simulado: '10',
          ultimaSincronizacao: '2024-01-01T00:00:00Z',
        },
      ]);
      const result = await service.estatisticas();
      expect(result[0].plataforma).toBe('RD_STATION');
      expect(result[0].sucesso).toBe(5);
      expect(result[0].falha).toBe(2);
      expect(result[0].simulado).toBe(10);
      expect(result[0].ultimaSincronizacao).toBeInstanceOf(Date);
    });

    it('retorna ultimaSincronizacao null quando não há registros', async () => {
      mockQB.getRawMany.mockResolvedValueOnce([
        { plataforma: 'LEADLOVERS', sucesso: '0', falha: '0', simulado: '0', ultimaSincronizacao: null },
      ]);
      const result = await service.estatisticas();
      expect(result[0].ultimaSincronizacao).toBeNull();
    });
  });
});
