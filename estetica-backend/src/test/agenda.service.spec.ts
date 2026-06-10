import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { AgendaService } from '../application/use-cases/agenda.service';
import { AgendaRepository } from '../infrastructure/repositories/agenda.repository';
import { AgendamentoStatus } from '../domain/entities/agendamento-status.enum';
import { Agendamento } from '../domain/entities/agendamento.entity';

const now = new Date('2025-08-10T09:00:00Z');
const later = new Date('2025-08-10T10:00:00Z');

const mockAgendamento: Agendamento = {
  id: 'uuid-ag-1',
  clinicaId: 'uuid-clinica-1',
  pacienteId: 'uuid-pac-1',
  paciente: null as any,
  profissionalId: 'uuid-prof-1',
  procedimentoId: null,
  dataHoraInicio: now,
  dataHoraFim: later,
  status: AgendamentoStatus.AGENDADO,
  observacoes: null,
  valor: 180.0,
  lembreteEnviado: false,
  confirmadoEm: null,
  canceladoEm: null,
  motivoCancelamento: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('AgendaService', () => {
  let service: AgendaService;
  let repo: jest.Mocked<AgendaRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgendaService,
        {
          provide: AgendaRepository,
          useValue: {
            findById: jest.fn(),
            list: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            findConflicts: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AgendaService>(AgendaService);
    repo = module.get(AgendaRepository);
  });

  describe('findOne', () => {
    it('deve retornar agendamento existente', async () => {
      repo.findById.mockResolvedValue(mockAgendamento);
      const result = await service.findOne('uuid-ag-1');
      expect(result.id).toBe('uuid-ag-1');
    });

    it('deve lançar NotFoundException', async () => {
      repo.findById.mockResolvedValue(null);
      await expect(service.findOne('nao-existe')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('deve criar agendamento sem conflito', async () => {
      repo.findConflicts.mockResolvedValue([]);
      repo.create.mockResolvedValue(mockAgendamento);

      const result = await service.create(
        {
          pacienteId: 'uuid-pac-1',
          profissionalId: 'uuid-prof-1',
          dataHoraInicio: '2025-08-10T09:00:00Z',
          dataHoraFim: '2025-08-10T10:00:00Z',
          valor: 180,
        },
        'uuid-clinica-1',
      );
      expect(result.id).toBe('uuid-ag-1');
    });

    it('deve lançar ConflictException se horário ocupado', async () => {
      repo.findConflicts.mockResolvedValue([mockAgendamento]);
      await expect(
        service.create(
          {
            pacienteId: 'uuid-pac-1',
            profissionalId: 'uuid-prof-1',
            dataHoraInicio: '2025-08-10T09:00:00Z',
            dataHoraFim: '2025-08-10T10:00:00Z',
          },
          null,
        ),
      ).rejects.toThrow(ConflictException);
    });

    it('deve lançar BadRequestException se fim <= início', async () => {
      await expect(
        service.create(
          {
            pacienteId: 'uuid-pac-1',
            profissionalId: 'uuid-prof-1',
            dataHoraInicio: '2025-08-10T10:00:00Z',
            dataHoraFim: '2025-08-10T09:00:00Z',
          },
          null,
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateStatus', () => {
    it('deve atualizar status para CONFIRMADO', async () => {
      const updated = { ...mockAgendamento, status: AgendamentoStatus.CONFIRMADO };
      repo.findById.mockResolvedValueOnce(mockAgendamento).mockResolvedValueOnce(updated);
      repo.update.mockResolvedValue();
      const result = await service.updateStatus('uuid-ag-1', { status: AgendamentoStatus.CONFIRMADO });
      expect(result.status).toBe(AgendamentoStatus.CONFIRMADO);
    });

    it('deve incluir motivoCancelamento ao cancelar', async () => {
      repo.findById.mockResolvedValue(mockAgendamento);
      repo.update.mockResolvedValue();
      await service.updateStatus('uuid-ag-1', {
        status: AgendamentoStatus.CANCELADO,
        motivoCancelamento: 'Paciente desmarcou',
      });
      const updateCall = repo.update.mock.calls[0][1] as any;
      expect(updateCall.motivoCancelamento).toBe('Paciente desmarcou');
    });
  });

  describe('list', () => {
    it('deve retornar lista paginada', async () => {
      repo.list.mockResolvedValue({ data: [mockAgendamento], total: 1 });
      const result = await service.list('uuid-clinica-1', { page: 1, limit: 50 });
      expect(result.total).toBe(1);
      expect(result.totalPages).toBe(1);
    });
  });
});
