import { MovimentacaoTipo } from '../../../domain/entities/movimentacao-tipo.enum';
export declare class CreateProdutoDto {
    nome: string;
    descricao?: string;
    unidade?: string;
    estoqueMinimo?: number;
    precoCusto?: number;
    categoriaId?: string;
}
export declare class MovimentarEstoqueDto {
    tipo: MovimentacaoTipo;
    quantidade: number;
    motivo?: string;
}
export declare class ListProdutosDto {
    search?: string;
    abaixoMinimo?: boolean;
    page?: number;
    limit?: number;
}
