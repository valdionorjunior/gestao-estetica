import { Repository } from 'typeorm';
import { ConsultaFoto, TipoFotoConsulta } from '../../domain/entities/consulta-foto.entity';
import { AnotacaoDto, ConsultaFotoResponseDto, CreateConsultaFotoDto } from '../dtos/consulta/consulta-foto.dto';
export declare class ConsultaInterativaService {
    private readonly repo;
    constructor(repo: Repository<ConsultaFoto>);
    criarFoto(dto: CreateConsultaFotoDto, arquivo: Express.Multer.File | undefined, baseUrl: string): Promise<ConsultaFotoResponseDto>;
    listarPorPaciente(pacienteId: string, tipo?: TipoFotoConsulta): Promise<ConsultaFotoResponseDto[]>;
    buscarPorId(id: string): Promise<ConsultaFotoResponseDto>;
    salvarAnotacoes(id: string, anotacoes: AnotacaoDto[]): Promise<ConsultaFotoResponseDto>;
    remover(id: string): Promise<void>;
    private toResponse;
}
