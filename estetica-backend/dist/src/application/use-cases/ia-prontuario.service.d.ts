import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { IaConsultaLog, IaOperacao } from '../../domain/entities/ia-consulta-log.entity';
export interface ResultadoTranscricao {
    transcricao: string;
    duracao?: number;
    idioma?: string;
    simulado: boolean;
    logId: string;
}
export interface ResultadoResumo {
    resumo: string;
    topicos: string[];
    proximasAcoes: string[];
    simulado: boolean;
    logId: string;
}
export interface ResultadoHipotese {
    hipoteses: Array<{
        condicao: string;
        probabilidade: 'ALTA' | 'MEDIA' | 'BAIXA';
        descricao: string;
    }>;
    procedimentosSugeridos: string[];
    observacoesClinicas: string;
    simulado: boolean;
    logId: string;
}
export declare class IaProntuarioService {
    private readonly repo;
    private readonly config;
    private readonly logger;
    private readonly MODELO_CHAT;
    private readonly MODELO_AUDIO;
    constructor(repo: Repository<IaConsultaLog>, config: ConfigService);
    transcreverAudio(params: {
        audioPath: string;
        audioNome: string;
        pacienteId?: string;
        prontuarioId?: string;
        profissionalId?: string;
    }): Promise<ResultadoTranscricao>;
    resumirConsulta(params: {
        texto: string;
        pacienteId?: string;
        prontuarioId?: string;
        profissionalId?: string;
    }): Promise<ResultadoResumo>;
    sugerirHipotese(params: {
        queixas: string;
        historicoRelevante?: string;
        pacienteId?: string;
        prontuarioId?: string;
        profissionalId?: string;
    }): Promise<ResultadoHipotese>;
    listarLogs(params: {
        pacienteId?: string;
        operacao?: IaOperacao;
        page?: number;
        limit?: number;
    }): Promise<{
        data: IaConsultaLog[];
        total: number;
    }>;
    statusConfig(): {
        openAiConfigurado: boolean;
        modelo: string;
    };
    private salvarLog;
}
