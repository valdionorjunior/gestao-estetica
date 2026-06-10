import { Repository } from 'typeorm';
import { ComunicacaoService } from '../../application/use-cases/comunicacao.service';
import { Paciente } from '../../domain/entities/paciente.entity';
import { ComunicacaoStatus, ComunicacaoTipo } from '../../domain/entities/comunicacao-log.entity';
import { EnviarCampanhaDto, EnviarMensagemDto } from '../../application/dtos/marketing/marketing.dto';
export declare class MarketingController {
    private readonly comunicacaoService;
    private readonly pacienteRepo;
    constructor(comunicacaoService: ComunicacaoService, pacienteRepo: Repository<Paciente>);
    enviar(dto: EnviarMensagemDto): Promise<import("../../domain/entities/comunicacao-log.entity").ComunicacaoLog>;
    campanha(dto: EnviarCampanhaDto): Promise<{
        enviados: number;
        simulados: number;
        falhas: number;
        total: number;
    }>;
    lembreteManual(body: {
        agendamentoId: string;
        tipo: ComunicacaoTipo;
    }): Promise<{
        mensagem: string;
        agendamentoId: string;
        tipo: ComunicacaoTipo;
    }>;
    historico(page?: number, limit?: number, tipo?: ComunicacaoTipo, status?: ComunicacaoStatus, pacienteId?: string): Promise<{
        data: import("../../domain/entities/comunicacao-log.entity").ComunicacaoLog[];
        total: number;
    }>;
    estatisticas(): Promise<{
        totalEnviados: number;
        totalSimulados: number;
        totalFalhas: number;
        porTipo: Record<string, number>;
    }>;
    private resolverDestinatario;
    private interpolar;
}
