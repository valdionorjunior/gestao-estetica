import { ProntuarioRepository } from '../../infrastructure/repositories/prontuario.repository';
import { UpdateProntuarioDto } from '../dtos/prontuario/update-prontuario.dto';
import { CreateFichaDto, UpdateFichaDto } from '../dtos/prontuario/ficha.dto';
export declare class ProntuarioService {
    private readonly prontuarioRepository;
    private readonly encryptKey;
    constructor(prontuarioRepository: ProntuarioRepository);
    getOrCreateByPacienteId(pacienteId: string, clinicaId: string | null): Promise<{
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
    update(pacienteId: string, dto: UpdateProntuarioDto, clinicaId: string | null): Promise<{
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
    createFicha(pacienteId: string, dto: CreateFichaDto, profissionalId: string, clinicaId: string | null): Promise<import("../../domain/entities/ficha-atendimento.entity").FichaAtendimento>;
    updateFicha(fichaId: string, dto: UpdateFichaDto, profissionalId: string): Promise<import("../../domain/entities/ficha-atendimento.entity").FichaAtendimento | null>;
    private decryptProntuario;
}
