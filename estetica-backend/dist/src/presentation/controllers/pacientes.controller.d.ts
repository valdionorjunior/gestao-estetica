import { PacientesService } from '../../application/use-cases/pacientes.service';
import { CreatePacienteDto } from '../../application/dtos/pacientes/create-paciente.dto';
import { UpdatePacienteDto } from '../../application/dtos/pacientes/update-paciente.dto';
import { ListPacientesDto } from '../../application/dtos/pacientes/list-pacientes.dto';
export declare class PacientesController {
    private readonly pacientesService;
    constructor(pacientesService: PacientesService);
    list(filters: ListPacientesDto, user: {
        clinicaId: string | null;
    }): Promise<{
        data: (Omit<import("../../domain/entities/paciente.entity").Paciente, "cpfEncrypted"> & {
            cpfMasked: string | null;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<import("../../domain/entities/paciente.entity").Paciente>;
    create(dto: CreatePacienteDto, user: {
        clinicaId: string | null;
    }): Promise<import("../../domain/entities/paciente.entity").Paciente>;
    update(id: string, dto: UpdatePacienteDto): Promise<import("../../domain/entities/paciente.entity").Paciente>;
    remove(id: string): Promise<void>;
}
