export declare enum IaOperacao {
    TRANSCRICAO_AUDIO = "TRANSCRICAO_AUDIO",
    RESUMO_CONSULTA = "RESUMO_CONSULTA",
    HIPOTESE_DIAGNOSTICA = "HIPOTESE_DIAGNOSTICA"
}
export declare enum IaStatus {
    SUCESSO = "SUCESSO",
    FALHOU = "FALHOU",
    SIMULADO = "SIMULADO"
}
export declare class IaConsultaLog {
    id: string;
    operacao: IaOperacao;
    status: IaStatus;
    pacienteId: string | null;
    prontuarioId: string | null;
    profissionalId: string | null;
    entrada: string | null;
    resultado: string | null;
    tokensUtilizados: number | null;
    modeloIa: string | null;
    createdAt: Date;
}
