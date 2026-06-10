import { AgendaService } from '../../application/use-cases/agenda.service';
import { CreateAgendamentoDto } from '../../application/dtos/agenda/create-agendamento.dto';
import { UpdateAgendamentoDto } from '../../application/dtos/agenda/update-agendamento.dto';
import { ListAgendamentosDto } from '../../application/dtos/agenda/list-agendamentos.dto';
import { UpdateAgendamentoStatusDto } from '../../application/dtos/agenda/update-agendamento-status.dto';
export declare class AgendaController {
    private readonly agendaService;
    constructor(agendaService: AgendaService);
    list(filters: ListAgendamentosDto, user: {
        clinicaId: string | null;
    }): Promise<{
        data: import("../../domain/entities/agendamento.entity").Agendamento[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<import("../../domain/entities/agendamento.entity").Agendamento>;
    create(dto: CreateAgendamentoDto, user: {
        clinicaId: string | null;
    }): Promise<import("../../domain/entities/agendamento.entity").Agendamento>;
    update(id: string, dto: UpdateAgendamentoDto): Promise<import("../../domain/entities/agendamento.entity").Agendamento>;
    updateStatus(id: string, dto: UpdateAgendamentoStatusDto): Promise<import("../../domain/entities/agendamento.entity").Agendamento>;
    cancel(id: string): Promise<import("../../domain/entities/agendamento.entity").Agendamento>;
}
