import { Repository } from 'typeorm';
import { Agendamento } from '../../domain/entities/agendamento.entity';
import { ListAgendamentosDto } from '../../application/dtos/agenda/list-agendamentos.dto';
export declare class AgendaRepository {
    private readonly repo;
    constructor(repo: Repository<Agendamento>);
    findById(id: string): Promise<Agendamento | null>;
    list(clinicaId: string | null, filters: ListAgendamentosDto): Promise<{
        data: Agendamento[];
        total: number;
    }>;
    create(data: Partial<Agendamento>): Promise<Agendamento>;
    update(id: string, data: Partial<Agendamento>): Promise<void>;
    findConflicts(profissionalId: string, dataHoraInicio: Date, dataHoraFim: Date, excludeId?: string): Promise<Agendamento[]>;
}
