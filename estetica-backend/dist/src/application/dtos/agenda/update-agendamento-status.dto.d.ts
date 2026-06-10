import { AgendamentoStatus } from '../../../domain/entities/agendamento-status.enum';
export declare class UpdateAgendamentoStatusDto {
    status: AgendamentoStatus;
    motivoCancelamento?: string;
}
