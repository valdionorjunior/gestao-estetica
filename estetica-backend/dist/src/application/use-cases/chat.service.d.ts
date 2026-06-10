import { Repository } from 'typeorm';
import { ChatMensagem, MensagemTipo } from '../../domain/entities/chat-mensagem.entity';
export interface MensagemPayload {
    id: string;
    remetenteId: string;
    remetenteNome: string;
    remetenteRole: string;
    canal: string;
    conteudo: string;
    tipo: MensagemTipo;
    respostaParaId: string | null;
    editada: boolean;
    createdAt: Date;
}
export declare class ChatService {
    private readonly repo;
    constructor(repo: Repository<ChatMensagem>);
    salvar(params: {
        remetenteId: string;
        remetenteNome: string;
        remetenteRole: string;
        canal: string;
        conteudo: string;
        tipo?: MensagemTipo;
        respostaParaId?: string | null;
    }): Promise<MensagemPayload>;
    historico(canal: string, limite?: number, antes?: string): Promise<MensagemPayload[]>;
    canaisFixos(): string[];
    canalPrivado(userIdA: string, userIdB: string): string;
    marcarLida(mensagemId: string, userId: string): Promise<void>;
    private sanitizarCanal;
    private toPayload;
}
