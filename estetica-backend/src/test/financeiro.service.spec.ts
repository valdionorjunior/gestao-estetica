import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { FinanceiroService } from '../application/use-cases/financeiro.service';
import { FinanceiroRepository } from '../infrastructure/repositories/financeiro.repository';
import { ContaFinanceira } from '../domain/entities/conta-financeira.entity';
import { ContaStatus, ContaTipo } from '../domain/entities/financeiro.enums';

const mockConta: ContaFinanceira = {
  id: 'uuid-conta-1',
  clinicaId: 'uuid-clinica-1',
  tipo: ContaTipo.RECEITA,
  descricao: 'Consulta Botox',
  valor: 1200.0,
  dataVencimento: new Date('2025-08-10'),
  dataPagamento: null,
  status: ContaStatus.PENDENTE,
  formaPagamento: null,
  categoria: 'Injetáveis',
  pacienteId: null,
  agendamentoId: null,
  observacoes: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('FinanceiroService', () => {
  let service: FinanceiroService;
  let repo: jest.Mocked<FinanceiroRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinanceiroService,
        {
          provide: FinanceiroRepository,
          useValue: {
            findById: jest.fn(),
            list: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            dashboard: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FinanceiroService>(FinanceiroService);
    repo = module.get(FinanceiroRepository);
  });

  describe('findOne', () => {
    it('deve retornar conta existente', async () => {
      repo.findById.mockResolvedValue(mockConta);
      const result = await service.findOne('uuid-conta-1');
      expect(result.id).toBe('uuid-conta-1');
    });

    it('deve lançar NotFoundException', async () => {
      repo.findById.mockResolvedValue(null);
      await expect(service.findOne('nao-existe')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('deve criar receita com status PENDENTE por padrão', async () => {
      repo.create.mockResolvedValue(mockConta);
      const result = await service.create(
        {
          tipo: ContaTipo.RECEITA,
          descricao: 'Consulta Botox',
          valor: 1200.0,
          dataVencimento: '2025-08-10',
        },
        'uuid-clinica-1',
      );
      expect(repo.create).toHaveBeenCalledTimes(1);
      const call = repo.create.mock.calls[0][0] as any;
      expect(call.status).toBe(ContaStatus.PENDENTE);
    });
  });

  describe('markAsPaid', () => {
    it('deve atualizar status para PAGO', async () => {
      repo.findById.mockResolvedValue(mockConta);
      repo.update.mockResolvedValue();
      await service.markAsPaid('uuid-conta-1');
      const call = repo.update.mock.calls[0][1] as any;
      expect(call.status).toBe(ContaStatus.PAGO);
      expect(call.dataPagamento).toBeDefined();
    });
  });

  describe('cancel', () => {
    it('deve marcar conta como CANCELADO', async () => {
      repo.findById.mockResolvedValue(mockConta);
      repo.update.mockResolvedValue();
      await service.cancel('uuid-conta-1');
      const call = repo.update.mock.calls[0][1] as any;
      expect(call.status).toBe(ContaStatus.CANCELADO);
    });
  });

  describe('dashboard', () => {
    it('deve calcular saldo corretamente', async () => {
      repo.dashboard.mockResolvedValue([
        { tipo: 'RECEITA', status: 'PAGO', total: '3000.00' },
        { tipo: 'DESPESA', status: 'PAGO', total: '1000.00' },
        { tipo: 'RECEITA', status: 'PENDENTE', total: '500.00' },
      ]);
      const result = await service.dashboard('uuid-clinica-1', {});
      expect(result.totalReceitas).toBe(3000);
      expect(result.totalDespesas).toBe(1000);
      expect(result.saldo).toBe(2000);
      expect(result.receitasPendentes).toBe(500);
    });
  });
});
