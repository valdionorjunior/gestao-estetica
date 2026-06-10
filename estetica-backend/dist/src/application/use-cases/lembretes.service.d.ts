import { Repository } from 'typeorm';
import { Agendamento } from '../../domain/entities/agendamento.entity';
import { Paciente } from '../../domain/entities/paciente.entity';
import { ComunicacaoService } from '../use-cases/comunicacao.service';
export declare class LembretesService {
    private readonly agendamentoRepo;
    private readonly pacienteRepo;
    private readonly comunicacaoService;
    private readonly logger;
    constructor(agendamentoRepo: Repository<Agendamento>, pacienteRepo: Repository<Paciente>, comunicacaoService: ComunicacaoService);
    enviarLembretesAgendamentos(): Promise<void>;
    enviarAniversarios(): Promise<void>;
}
