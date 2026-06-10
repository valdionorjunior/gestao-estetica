import { TipoFotoConsulta } from '../../../domain/entities/consulta-foto.entity';
export declare class AnotacaoDto {
    id: string;
    x: number;
    y: number;
    texto: string;
    cor?: string;
    forma?: 'circulo' | 'seta' | 'retangulo' | 'ponto';
}
export declare class CreateConsultaFotoDto {
    pacienteId: string;
    prontuarioId?: string;
    profissionalId?: string;
    tipo: TipoFotoConsulta;
    descricao?: string;
    dataConsulta?: string;
}
export declare class UpdateAnotacoesDto {
    anotacoes: AnotacaoDto[];
}
export declare class ConsultaFotoResponseDto {
    id: string;
    pacienteId: string;
    prontuarioId: string | null;
    tipo: TipoFotoConsulta;
    fotoUrl: string;
    descricao: string | null;
    anotacoes: AnotacaoDto[];
    dataConsulta: string | null;
    createdAt: Date;
    updatedAt: Date;
}
