import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AgendaRepository } from '../../infrastructure/repositories/agenda.repository';
import { CreateAgendamentoDto } from '../dtos/agenda/create-agendamento.dto';
import { UpdateAgendamentoDto } from '../dtos/agenda/update-agendamento.dto';
import { ListAgendamentosDto } from '../dtos/agenda/list-agendamentos.dto';
import { UpdateAgendamentoStatusDto } from '../dtos/agenda/update-agendamento-status.dto';
import { AgendamentoStatus } from '../../domain/entities/agendamento-status.enum';

@Injectable()
export class AgendaService {
  constructor(private readonly agendaRepository: AgendaRepository) {}

  async list(clinicaId: string | null, filters: ListAgendamentosDto) {
    const { data, total } = await this.agendaRepository.list(clinicaId, filters);
    const { page = 1, limit = 50 } = filters;
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const agendamento = await this.agendaRepository.findById(id);
    if (!agendamento) throw new NotFoundException('Agendamento não encontrado');
    return agendamento;
  }

  async create(dto: CreateAgendamentoDto, clinicaId: string | null) {
    const inicio = new Date(dto.dataHoraInicio);
    const fim = new Date(dto.dataHoraFim);

    if (fim <= inicio) {
      throw new BadRequestException('Data/hora de fim deve ser posterior ao início');
    }

    const conflitos = await this.agendaRepository.findConflicts(dto.profissionalId, inicio, fim);
    if (conflitos.length > 0) {
      throw new ConflictException('Profissional já possui agendamento neste horário');
    }

    return this.agendaRepository.create({
      pacienteId: dto.pacienteId,
      profissionalId: dto.profissionalId,
      procedimentoId: dto.procedimentoId ?? null,
      dataHoraInicio: inicio,
      dataHoraFim: fim,
      observacoes: dto.observacoes ?? null,
      valor: dto.valor ?? null,
      clinicaId,
      status: AgendamentoStatus.AGENDADO,
    });
  }

  async update(id: string, dto: UpdateAgendamentoDto) {
    const existing = await this.findOne(id);

    if (dto.dataHoraInicio || dto.dataHoraFim) {
      const inicio = dto.dataHoraInicio ? new Date(dto.dataHoraInicio) : existing.dataHoraInicio;
      const fim = dto.dataHoraFim ? new Date(dto.dataHoraFim) : existing.dataHoraFim;

      if (fim <= inicio) {
        throw new BadRequestException('Data/hora de fim deve ser posterior ao início');
      }

      const profissionalId = dto.profissionalId ?? existing.profissionalId;
      const conflitos = await this.agendaRepository.findConflicts(profissionalId, inicio, fim, id);
      if (conflitos.length > 0) {
        throw new ConflictException('Profissional já possui agendamento neste horário');
      }
    }

    await this.agendaRepository.update(id, {
      ...(dto.pacienteId && { pacienteId: dto.pacienteId }),
      ...(dto.profissionalId && { profissionalId: dto.profissionalId }),
      ...(dto.procedimentoId !== undefined && { procedimentoId: dto.procedimentoId }),
      ...(dto.dataHoraInicio && { dataHoraInicio: new Date(dto.dataHoraInicio) }),
      ...(dto.dataHoraFim && { dataHoraFim: new Date(dto.dataHoraFim) }),
      ...(dto.observacoes !== undefined && { observacoes: dto.observacoes }),
      ...(dto.valor !== undefined && { valor: dto.valor }),
    });

    return this.findOne(id);
  }

  async updateStatus(id: string, dto: UpdateAgendamentoStatusDto) {
    await this.findOne(id);
    const now = new Date();
    const update: Record<string, unknown> = { status: dto.status };

    if (dto.status === AgendamentoStatus.CONFIRMADO) update.confirmadoEm = now;
    if (dto.status === AgendamentoStatus.CANCELADO) {
      update.canceladoEm = now;
      update.motivoCancelamento = dto.motivoCancelamento ?? null;
    }

    await this.agendaRepository.update(id, update as any);
    return this.findOne(id);
  }

  async cancel(id: string, motivo?: string) {
    return this.updateStatus(id, {
      status: AgendamentoStatus.CANCELADO,
      motivoCancelamento: motivo,
    });
  }
}
