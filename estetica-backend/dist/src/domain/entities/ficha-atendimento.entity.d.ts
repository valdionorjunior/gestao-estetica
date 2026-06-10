import { Prontuario } from './prontuario.entity';
export declare enum FichaStatus {
    ABERTA = "ABERTA",
    FECHADA = "FECHADA"
}
export declare class FichaAtendimento {
    id: string;
    prontuarioId: string;
    prontuario: Prontuario;
    agendamentoId: string | null;
    profissionalId: string;
    titulo: string;
    conteudoEncrypted: string | null;
    status: FichaStatus;
    fechadaEm: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
