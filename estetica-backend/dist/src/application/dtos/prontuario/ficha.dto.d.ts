import { FichaStatus } from '../../../domain/entities/ficha-atendimento.entity';
export declare class CreateFichaDto {
    titulo: string;
    conteudo?: string;
    agendamentoId?: string;
}
export declare class UpdateFichaDto {
    titulo?: string;
    conteudo?: string;
    status?: FichaStatus;
}
