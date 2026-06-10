import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Agendamento } from '../../domain/entities/agendamento.entity';
import { AgendamentoStatus } from '../../domain/entities/agendamento-status.enum';
import { ListAgendamentosDto } from '../../application/dtos/agenda/list-agendamentos.dto';

@Injectable()
export class AgendaRepository {
  constructor(
    @InjectRepository(Agendamento)
    private readonly repo: Repository<Agendamento>,
  ) {}

  async findById(id: string): Promise<Agendamento | null> {
    return this.repo.findOne({ where: { id }, relations: ['paciente'] });
  }

  async list(
    clinicaId: string | null,
    filters: ListAgendamentosDto,
  ): Promise<{ data: Agendamento[]; total: number }> {
    const { data, dataInicio, dataFim, profissionalId, pacienteId, status, page = 1, limit = 50 } = filters;
    const skip = (page - 1) * limit;

    const qb = this.repo
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.paciente', 'paciente')
      .orderBy('a.dataHoraInicio', 'ASC')
      .skip(skip)
      .take(limit);

    if (clinicaId) qb.andWhere('a.clinicaId = :clinicaId', { clinicaId });
    if (profissionalId) qb.andWhere('a.profissionalId = :profissionalId', { profissionalId });
    if (pacienteId) qb.andWhere('a.pacienteId = :pacienteId', { pacienteId });
    if (status) qb.andWhere('a.status = :status', { status });

    if (data) {
      // Filtra dia completo em UTC
      const start = new Date(`${data}T00:00:00.000Z`);
      const end = new Date(`${data}T23:59:59.999Z`);
      qb.andWhere('a.dataHoraInicio BETWEEN :start AND :end', { start, end });
    } else if (dataInicio && dataFim) {
      qb.andWhere('a.dataHoraInicio BETWEEN :dataInicio AND :dataFim', { dataInicio, dataFim });
    }

    const [result, total] = await qb.getManyAndCount();
    return { data: result, total };
  }

  async create(data: Partial<Agendamento>): Promise<Agendamento> {
    const agendamento = this.repo.create(data);
    return this.repo.save(agendamento);
  }

  async update(id: string, data: Partial<Agendamento>): Promise<void> {
    await this.repo.update(id, data);
  }

  async findConflicts(
    profissionalId: string,
    dataHoraInicio: Date,
    dataHoraFim: Date,
    excludeId?: string,
  ): Promise<Agendamento[]> {
    const qb = this.repo
      .createQueryBuilder('a')
      .where('a.profissionalId = :profissionalId', { profissionalId })
      .andWhere('a.status NOT IN (:...cancelados)', {
        cancelados: [AgendamentoStatus.CANCELADO, AgendamentoStatus.FALTA],
      })
      .andWhere('a.dataHoraInicio < :fim AND a.dataHoraFim > :inicio', {
        inicio: dataHoraInicio,
        fim: dataHoraFim,
      });

    if (excludeId) {
      qb.andWhere('a.id != :excludeId', { excludeId });
    }

    return qb.getMany();
  }
}
