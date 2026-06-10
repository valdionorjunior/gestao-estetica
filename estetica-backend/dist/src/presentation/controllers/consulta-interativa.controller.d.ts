import { ConsultaInterativaService } from '../../application/use-cases/consulta-interativa.service';
import { CreateConsultaFotoDto, UpdateAnotacoesDto } from '../../application/dtos/consulta/consulta-foto.dto';
import { TipoFotoConsulta } from '../../domain/entities/consulta-foto.entity';
export declare class ConsultaInterativaController {
    private readonly service;
    constructor(service: ConsultaInterativaService);
    uploadFoto(arquivo: Express.Multer.File | undefined, dto: CreateConsultaFotoDto, req: import('express').Request): Promise<import("../../application/dtos/consulta/consulta-foto.dto").ConsultaFotoResponseDto>;
    listarPorPaciente(pacienteId: string, tipo?: TipoFotoConsulta): Promise<import("../../application/dtos/consulta/consulta-foto.dto").ConsultaFotoResponseDto[]>;
    buscarPorId(id: string): Promise<import("../../application/dtos/consulta/consulta-foto.dto").ConsultaFotoResponseDto>;
    salvarAnotacoes(id: string, dto: UpdateAnotacoesDto): Promise<import("../../application/dtos/consulta/consulta-foto.dto").ConsultaFotoResponseDto>;
    remover(id: string): Promise<void>;
}
