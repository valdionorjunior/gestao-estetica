export declare enum SessaoStatus {
    AGENDADA = "AGENDADA",
    EM_ANDAMENTO = "EM_ANDAMENTO",
    ENCERRADA = "ENCERRADA",
    CANCELADA = "CANCELADA"
}
export declare enum PlataformaVideo {
    JITSI = "JITSI",
    DAILY_CO = "DAILY_CO"
}
export declare class SessaoTelemedicina {
    id: string;
    pacienteId: string;
    pacienteNome: string;
    pacienteEmail: string | null;
    pacienteTelefone: string | null;
    profissionalId: string | null;
    profissionalNome: string;
    agendamentoId: string | null;
    status: SessaoStatus;
    plataforma: PlataformaVideo;
    roomName: string;
    roomUrl: string;
    tokenPaciente: string | null;
    tokenProfissional: string | null;
    agendadoPara: Date | null;
    iniciadoEm: Date | null;
    encerradoEm: Date | null;
    observacoes: string | null;
    arquivosJson: string;
    createdAt: Date;
    updatedAt: Date;
}
