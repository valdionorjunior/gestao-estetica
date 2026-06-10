import { ComunicacaoMotivo, ComunicacaoTipo } from '../../../domain/entities/comunicacao-log.entity';
export declare class EnviarMensagemDto {
    pacienteId: string;
    agendamentoId?: string;
    tipo: ComunicacaoTipo;
    motivo: ComunicacaoMotivo;
    mensagem: string;
    assunto?: string;
}
export declare class EnviarCampanhaDto {
    pacienteIds: string[];
    tipo: ComunicacaoTipo;
    assunto: string;
    mensagem: string;
}
