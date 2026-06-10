import { AgendamentoStatus } from './agendamento-status.enum';
import { Paciente } from './paciente.entity';
export declare class Agendamento {
    id: string;
    clinicaId: string | null;
    pacienteId: string;
    paciente: Paciente;
    profissionalId: string;
    procedimentoId: string | null;
    dataHoraInicio: Date;
    dataHoraFim: Date;
    status: AgendamentoStatus;
    observacoes: string | null;
    valor: number | null;
    lembreteEnviado: boolean;
    confirmadoEm: Date | null;
    canceladoEm: Date | null;
    motivoCancelamento: string | null;
    createdAt: Date;
    updatedAt: Date;
}
