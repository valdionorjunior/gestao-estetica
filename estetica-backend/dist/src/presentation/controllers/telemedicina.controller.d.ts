import { TelemedicinavService } from '../../application/use-cases/telemedicina.service';
import { SessaoStatus } from '../../domain/entities/sessao-telemedicina.entity';
declare class CriarSessaoDto {
    pacienteId: string;
    pacienteNome: string;
    pacienteEmail?: string;
    pacienteTelefone?: string;
    profissionalId?: string;
    profissionalNome: string;
    agendamentoId?: string;
    agendadoPara?: string;
    observacoes?: string;
}
declare class AdicionarArquivoDto {
    nome: string;
    url: string;
    tipo: string;
    tamanho: number;
}
interface JwtPayload {
    sub: string;
    nome?: string;
    email?: string;
    role?: string;
}
export declare class TelemediicinaController {
    private readonly service;
    constructor(service: TelemedicinavService);
    statusConfig(): {
        plataforma: "DAILY_CO" | "JITSI";
        configurado: boolean;
        roomPrefix: string;
    };
    estatisticas(): Promise<{
        agendadas: number;
        emAndamento: number;
        encerradas: number;
        canceladas: number;
        totalHoje: number;
    }>;
    criar(dto: CriarSessaoDto): Promise<import("../../application/use-cases/telemedicina.service").SessaoComputada>;
    listar(pacienteId?: string, profissionalId?: string, status?: SessaoStatus, page?: string): Promise<{
        data: import("../../application/use-cases/telemedicina.service").SessaoComputada[];
        total: number;
    }>;
    minhas(user: JwtPayload, status?: SessaoStatus, page?: string): Promise<{
        data: import("../../application/use-cases/telemedicina.service").SessaoComputada[];
        total: number;
    }>;
    buscar(id: string): Promise<import("../../application/use-cases/telemedicina.service").SessaoComputada>;
    iniciar(id: string): Promise<import("../../application/use-cases/telemedicina.service").SessaoComputada>;
    encerrar(id: string): Promise<import("../../application/use-cases/telemedicina.service").SessaoComputada>;
    cancelar(id: string): Promise<import("../../application/use-cases/telemedicina.service").SessaoComputada>;
    adicionarArquivo(id: string, dto: AdicionarArquivoDto): Promise<import("../../application/use-cases/telemedicina.service").SessaoComputada>;
    statusOpcoes(): SessaoStatus[];
}
export {};
