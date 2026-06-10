import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { SessaoStatus, SessaoTelemedicina } from '../../domain/entities/sessao-telemedicina.entity';
export interface CriarSessaoParams {
    pacienteId: string;
    pacienteNome: string;
    pacienteEmail?: string;
    pacienteTelefone?: string;
    profissionalId?: string;
    profissionalNome: string;
    agendamentoId?: string;
    agendadoPara?: Date;
    observacoes?: string;
}
export interface ArquivoSessao {
    nome: string;
    url: string;
    tipo: string;
    tamanho: number;
    uploadadoEm: string;
}
export interface SessaoComputada extends SessaoTelemedicina {
    duracaoMinutos: number | null;
    arquivos: ArquivoSessao[];
    urlEntradaPaciente: string;
    urlEntradaProfissional: string;
}
export declare class TelemedicinavService {
    private readonly repo;
    private readonly config;
    private readonly logger;
    private readonly JITSI_BASE;
    private readonly DAILY_API;
    constructor(repo: Repository<SessaoTelemedicina>, config: ConfigService);
    criar(params: CriarSessaoParams): Promise<SessaoComputada>;
    iniciar(id: string): Promise<SessaoComputada>;
    encerrar(id: string): Promise<SessaoComputada>;
    cancelar(id: string): Promise<SessaoComputada>;
    adicionarArquivo(id: string, arquivo: Omit<ArquivoSessao, 'uploadadoEm'>): Promise<SessaoComputada>;
    buscarPorId(id: string): Promise<SessaoComputada>;
    listar(params: {
        pacienteId?: string;
        profissionalId?: string;
        status?: SessaoStatus;
        page?: number;
        limit?: number;
    }): Promise<{
        data: SessaoComputada[];
        total: number;
    }>;
    statusConfig(): {
        plataforma: 'DAILY_CO' | 'JITSI';
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
    private criarSalaDailyCo;
    private criarTokenDailyCo;
    private encerrarSalaDailyCo;
    private buscarEntidade;
    private computar;
}
