import { AgendaRepository } from '../../infrastructure/repositories/agenda.repository';
import { CreateAgendamentoDto } from '../dtos/agenda/create-agendamento.dto';
import { UpdateAgendamentoDto } from '../dtos/agenda/update-agendamento.dto';
import { ListAgendamentosDto } from '../dtos/agenda/list-agendamentos.dto';
import { UpdateAgendamentoStatusDto } from '../dtos/agenda/update-agendamento-status.dto';
export declare class AgendaService {
    private readonly agendaRepository;
    constructor(agendaRepository: AgendaRepository);
    list(clinicaId: string | null, filters: ListAgendamentosDto): Promise<{
        data: import("../../domain/entities/agendamento.entity").Agendamento[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<import("../../domain/entities/agendamento.entity").Agendamento>;
    create(dto: CreateAgendamentoDto, clinicaId: string | null): Promise<import("../../domain/entities/agendamento.entity").Agendamento>;
    update(id: string, dto: UpdateAgendamentoDto): Promise<import("../../domain/entities/agendamento.entity").Agendamento>;
    updateStatus(id: string, dto: UpdateAgendamentoStatusDto): Promise<import("../../domain/entities/agendamento.entity").Agendamento>;
    cancel(id: string, motivo?: string): Promise<import("../../domain/entities/agendamento.entity").Agendamento>;
}
