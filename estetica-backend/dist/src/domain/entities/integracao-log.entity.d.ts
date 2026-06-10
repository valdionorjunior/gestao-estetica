export declare enum PlataformaIntegracao {
    RD_STATION = "RD_STATION",
    LEADLOVERS = "LEADLOVERS"
}
export declare enum IntegracaoAcao {
    SINCRONIZAR_CONTATO = "SINCRONIZAR_CONTATO",
    REGISTRAR_EVENTO = "REGISTRAR_EVENTO",
    WEBHOOK_RECEBIDO = "WEBHOOK_RECEBIDO",
    WEBHOOK_LEAD = "WEBHOOK_LEAD"
}
export declare enum IntegracaoStatus {
    SUCESSO = "SUCESSO",
    FALHOU = "FALHOU",
    SIMULADO = "SIMULADO"
}
export declare class IntegracaoLog {
    id: string;
    plataforma: PlataformaIntegracao;
    acao: IntegracaoAcao;
    status: IntegracaoStatus;
    pacienteId: string | null;
    idExterno: string | null;
    payloadJson: string | null;
    resposta: string | null;
    createdAt: Date;
}
