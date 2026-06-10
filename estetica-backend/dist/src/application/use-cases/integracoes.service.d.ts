import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { IntegracaoLog, PlataformaIntegracao } from '../../domain/entities/integracao-log.entity';
interface ContatoPayload {
    nome: string;
    email?: string;
    telefone?: string;
    tags?: string[];
    camposExtras?: Record<string, string>;
}
interface EventoPayload {
    tipo: string;
    email?: string;
    valor?: number;
    dados?: Record<string, unknown>;
}
export interface LogSummary {
    plataforma: string;
    sucesso: number;
    falha: number;
    simulado: number;
    ultimaSincronizacao: Date | null;
}
export declare class IntegracoesService {
    private readonly repo;
    private readonly config;
    private readonly logger;
    constructor(repo: Repository<IntegracaoLog>, config: ConfigService);
    rdStationSincronizarContato(pacienteId: string, contato: ContatoPayload): Promise<IntegracaoLog>;
    rdStationRegistrarEvento(pacienteId: string | null, evento: EventoPayload): Promise<IntegracaoLog>;
    leadloversSincronizarContato(pacienteId: string, contato: ContatoPayload): Promise<IntegracaoLog>;
    processarWebhook(plataforma: PlataformaIntegracao, payload: Record<string, unknown>): Promise<IntegracaoLog>;
    listar(params: {
        plataforma?: PlataformaIntegracao;
        page?: number;
        limit?: number;
    }): Promise<{
        data: IntegracaoLog[];
        total: number;
    }>;
    estatisticas(): Promise<LogSummary[]>;
    statusConfig(): {
        rdStation: boolean;
        leadlovers: boolean;
    };
    private executar;
}
export {};
