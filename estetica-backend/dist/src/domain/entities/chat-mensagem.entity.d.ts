export declare enum MensagemTipo {
    TEXTO = "TEXTO",
    IMAGEM = "IMAGEM",
    ARQUIVO = "ARQUIVO",
    SISTEMA = "SISTEMA"
}
export declare class ChatMensagem {
    id: string;
    remetenteId: string;
    remetenteNome: string;
    remetenteRole: string;
    canal: string;
    conteudo: string;
    tipo: MensagemTipo;
    respostaParaId: string | null;
    lidaPorJson: string | null;
    editada: boolean;
    createdAt: Date;
}
