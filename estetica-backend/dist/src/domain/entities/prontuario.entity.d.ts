import { Paciente } from './paciente.entity';
export declare class Prontuario {
    id: string;
    clinicaId: string | null;
    pacienteId: string;
    paciente: Paciente;
    historicoMedicoEncrypted: string | null;
    alergiasEncrypted: string | null;
    medicamentosUsoEncrypted: string | null;
    observacoes: string | null;
    createdAt: Date;
    updatedAt: Date;
}
