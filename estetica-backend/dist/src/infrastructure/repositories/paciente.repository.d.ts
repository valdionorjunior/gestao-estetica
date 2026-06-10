import { Repository } from 'typeorm';
import { Paciente } from '../../domain/entities/paciente.entity';
import { ListPacientesDto } from '../../application/dtos/pacientes/list-pacientes.dto';
export declare class PacienteRepository {
    private readonly repo;
    constructor(repo: Repository<Paciente>);
    findById(id: string): Promise<Paciente | null>;
    findByEmail(email: string): Promise<Paciente | null>;
    list(clinicaId: string | null, filters: ListPacientesDto): Promise<{
        data: Paciente[];
        total: number;
    }>;
    create(data: Partial<Paciente>): Promise<Paciente>;
    update(id: string, data: Partial<Paciente>): Promise<void>;
    softDelete(id: string): Promise<void>;
}
