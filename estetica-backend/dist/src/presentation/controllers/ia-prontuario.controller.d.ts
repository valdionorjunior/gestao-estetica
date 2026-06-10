import { IaProntuarioService } from '../../application/use-cases/ia-prontuario.service';
import { IaOperacao } from '../../domain/entities/ia-consulta-log.entity';
declare class ResumoDto {
    texto: string;
    pacienteId?: string;
    prontuarioId?: string;
}
declare class HipoteseDto {
    queixas: string;
    historicoRelevante?: string;
    pacienteId?: string;
    prontuarioId?: string;
}
export declare class IaProntuarioController {
    private readonly service;
    constructor(service: IaProntuarioService);
    statusConfig(): {
        openAiConfigurado: boolean;
        modelo: string;
    };
    transcrever(file: Express.Multer.File, pacienteId?: string, prontuarioId?: string): Promise<import("../../application/use-cases/ia-prontuario.service").ResultadoTranscricao | {
        erro: string;
    }>;
    resumir(dto: ResumoDto): Promise<import("../../application/use-cases/ia-prontuario.service").ResultadoResumo>;
    hipotese(dto: HipoteseDto): Promise<import("../../application/use-cases/ia-prontuario.service").ResultadoHipotese>;
    logs(pacienteId?: string, operacao?: IaOperacao, page?: string): Promise<{
        data: import("../../domain/entities/ia-consulta-log.entity").IaConsultaLog[];
        total: number;
    }>;
}
export {};
