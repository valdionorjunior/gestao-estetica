import { AgendamentoStatus } from '../../../domain/entities/agendamento-status.enum';
export declare class ListAgendamentosDto {
    data?: string;
    dataInicio?: string;
    dataFim?: string;
    profissionalId?: string;
    pacienteId?: string;
    status?: AgendamentoStatus;
    page?: number;
    limit?: number;
}
