export declare class ListPacientesDto {
    search?: string;
    ativo?: boolean;
    page?: number;
    limit?: number;
    orderBy?: 'nome' | 'createdAt';
}
