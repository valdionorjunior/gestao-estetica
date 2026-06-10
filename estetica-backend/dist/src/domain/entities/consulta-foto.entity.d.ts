export declare enum TipoFotoConsulta {
    ANTES = "ANTES",
    DEPOIS = "DEPOIS",
    DURANTE = "DURANTE",
    REFERENCIA = "REFERENCIA"
}
export declare class ConsultaFoto {
    id: string;
    pacienteId: string;
    prontuarioId: string | null;
    profissionalId: string | null;
    tipo: TipoFotoConsulta;
    fotoUrl: string;
    descricao: string | null;
    anotacoesJson: string | null;
    dataConsulta: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
