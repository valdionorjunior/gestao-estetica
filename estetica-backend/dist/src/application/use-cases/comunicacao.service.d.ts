import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { ComunicacaoLog, ComunicacaoMotivo, ComunicacaoStatus, ComunicacaoTipo } from '../../domain/entities/comunicacao-log.entity';
export interface EnvioParams {
    pacienteId: string;
    agendamentoId?: string;
    tipo: ComunicacaoTipo;
    motivo: ComunicacaoMotivo;
    destinatario: string;
    assunto: string;
    mensagem: string;
}
export declare class ComunicacaoService {
    private readonly repo;
    private readonly config;
    private readonly logger;
    constructor(repo: Repository<ComunicacaoLog>, config: ConfigService);
    enviar(params: EnvioParams): Promise<ComunicacaoLog>;
    private enviarEmail;
    private enviarSms;
    private enviarWhatsApp;
    listar(params: {
        page: number;
        limit: number;
        tipo?: ComunicacaoTipo;
        status?: ComunicacaoStatus;
        pacienteId?: string;
    }): Promise<{
        data: ComunicacaoLog[];
        total: number;
    }>;
    estatisticas(): Promise<{
        totalEnviados: number;
        totalSimulados: number;
        totalFalhas: number;
        porTipo: Record<string, number>;
    }>;
}
