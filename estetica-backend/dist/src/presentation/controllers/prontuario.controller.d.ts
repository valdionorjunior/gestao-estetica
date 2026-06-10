import { ProntuarioService } from '../../application/use-cases/prontuario.service';
import { UpdateProntuarioDto } from '../../application/dtos/prontuario/update-prontuario.dto';
import { CreateFichaDto, UpdateFichaDto } from '../../application/dtos/prontuario/ficha.dto';
export declare class ProntuarioController {
    private readonly prontuarioService;
    constructor(prontuarioService: ProntuarioService);
    get(pacienteId: string, user: {
        clinicaId: string | null;
    }): Promise<{
        historicoMedico: string | null;
        alergias: string | null;
        medicamentosUso: string | null;
        historicoMedicoEncrypted: undefined;
        alergiasEncrypted: undefined;
        medicamentosUsoEncrypted: undefined;
        id: string;
        clinicaId: string | null;
        pacienteId: string;
        paciente: import("../../domain/entities/paciente.entity").Paciente;
        observacoes: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(pacienteId: string, dto: UpdateProntuarioDto, user: {
        clinicaId: string | null;
    }): Promise<{
        historicoMedico: string | null;
        alergias: string | null;
        medicamentosUso: string | null;
        historicoMedicoEncrypted: undefined;
        alergiasEncrypted: undefined;
        medicamentosUsoEncrypted: undefined;
        id: string;
        clinicaId: string | null;
        pacienteId: string;
        paciente: import("../../domain/entities/paciente.entity").Paciente;
        observacoes: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    listFichas(pacienteId: string): Promise<import("../../domain/entities/ficha-atendimento.entity").FichaAtendimento[]>;
    createFicha(pacienteId: string, dto: CreateFichaDto, user: {
        id: string;
        clinicaId: string | null;
    }): Promise<import("../../domain/entities/ficha-atendimento.entity").FichaAtendimento>;
    updateFicha(fichaId: string, dto: UpdateFichaDto, user: {
        id: string;
    }): Promise<import("../../domain/entities/ficha-atendimento.entity").FichaAtendimento | null>;
}
