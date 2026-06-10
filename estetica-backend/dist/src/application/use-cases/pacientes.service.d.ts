import { PacienteRepository } from '../../infrastructure/repositories/paciente.repository';
import { CreatePacienteDto } from '../dtos/pacientes/create-paciente.dto';
import { UpdatePacienteDto } from '../dtos/pacientes/update-paciente.dto';
import { ListPacientesDto } from '../dtos/pacientes/list-pacientes.dto';
import { Paciente } from '../../domain/entities/paciente.entity';
export declare class PacientesService {
    private readonly pacienteRepository;
    private readonly encryptKey;
    constructor(pacienteRepository: PacienteRepository);
    list(clinicaId: string | null, filters: ListPacientesDto): Promise<{
        data: (Omit<Paciente, "cpfEncrypted"> & {
            cpfMasked: string | null;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<Paciente>;
    create(dto: CreatePacienteDto, clinicaId: string | null): Promise<Paciente>;
    update(id: string, dto: UpdatePacienteDto): Promise<Paciente>;
    remove(id: string): Promise<void>;
    private sanitize;
}
