import { IntegracoesService } from '../../application/use-cases/integracoes.service';
import { PlataformaIntegracao } from '../../domain/entities/integracao-log.entity';
declare class SincronizarContatoDto {
    pacienteId: string;
    nome: string;
    email?: string;
    telefone?: string;
    plataforma?: PlataformaIntegracao;
}
declare class RegistrarEventoDto {
    tipo: string;
    email?: string;
    pacienteId?: string;
    valor?: number;
    dados?: Record<string, unknown>;
}
export declare class IntegracoesController {
    private readonly service;
    constructor(service: IntegracoesService);
    statusConfig(): {
        rdStation: boolean;
        leadlovers: boolean;
    };
    estatisticas(): Promise<import("../../application/use-cases/integracoes.service").LogSummary[]>;
    logs(plataforma?: PlataformaIntegracao, page?: string, limit?: string): Promise<{
        data: import("../../domain/entities/integracao-log.entity").IntegracaoLog[];
        total: number;
    }>;
    sincronizarContato(dto: SincronizarContatoDto): Promise<{
        resultados: Record<string, unknown>[];
    }>;
    registrarEvento(dto: RegistrarEventoDto): Promise<{
        status: import("../../domain/entities/integracao-log.entity").IntegracaoStatus;
        id: string;
    }>;
    webhookRdStation(payload: Record<string, unknown>): Promise<{
        recebido: boolean;
        logId: string;
    }>;
    webhookLeadLovers(payload: Record<string, unknown>): Promise<{
        recebido: boolean;
        logId: string;
    }>;
}
export {};
