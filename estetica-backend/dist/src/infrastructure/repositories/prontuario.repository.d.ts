import { Repository } from 'typeorm';
import { Prontuario } from '../../domain/entities/prontuario.entity';
import { FichaAtendimento } from '../../domain/entities/ficha-atendimento.entity';
export declare class ProntuarioRepository {
    private readonly prontuarioRepo;
    private readonly fichaRepo;
    constructor(prontuarioRepo: Repository<Prontuario>, fichaRepo: Repository<FichaAtendimento>);
    findByPacienteId(pacienteId: string): Promise<Prontuario | null>;
    findById(id: string): Promise<Prontuario | null>;
    createProntuario(data: Partial<Prontuario>): Promise<Prontuario>;
    updateProntuario(id: string, data: Partial<Prontuario>): Promise<void>;
    listFichas(prontuarioId: string): Promise<FichaAtendimento[]>;
    findFichaById(id: string): Promise<FichaAtendimento | null>;
    createFicha(data: Partial<FichaAtendimento>): Promise<FichaAtendimento>;
    updateFicha(id: string, data: Partial<FichaAtendimento>): Promise<void>;
}
