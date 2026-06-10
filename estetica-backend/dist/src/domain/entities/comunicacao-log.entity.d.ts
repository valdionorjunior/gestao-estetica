export declare enum ComunicacaoTipo {
    EMAIL = "EMAIL",
    SMS = "SMS",
    WHATSAPP = "WHATSAPP"
}
export declare enum ComunicacaoStatus {
    PENDENTE = "PENDENTE",
    ENVIADO = "ENVIADO",
    FALHOU = "FALHOU",
    SIMULADO = "SIMULADO"
}
export declare enum ComunicacaoMotivo {
    LEMBRETE_AGENDAMENTO = "LEMBRETE_AGENDAMENTO",
    CONFIRMACAO_AGENDAMENTO = "CONFIRMACAO_AGENDAMENTO",
    CANCELAMENTO_AGENDAMENTO = "CANCELAMENTO_AGENDAMENTO",
    CAMPANHA_MARKETING = "CAMPANHA_MARKETING",
    ANIVERSARIO = "ANIVERSARIO",
    POS_ATENDIMENTO = "POS_ATENDIMENTO",
    MANUAL = "MANUAL"
}
export declare class ComunicacaoLog {
    id: string;
    pacienteId: string | null;
    agendamentoId: string | null;
    tipo: ComunicacaoTipo;
    motivo: ComunicacaoMotivo;
    status: ComunicacaoStatus;
    destinatario: string | null;
    assunto: string;
    mensagem: string;
    erroDetalhe: string | null;
    enviadoEm: Date | null;
    createdAt: Date;
}
