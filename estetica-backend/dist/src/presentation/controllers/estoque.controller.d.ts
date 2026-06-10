import { EstoqueService } from '../../application/use-cases/estoque.service';
import { CreateProdutoDto, ListProdutosDto, MovimentarEstoqueDto } from '../../application/dtos/estoque/estoque.dto';
export declare class EstoqueController {
    private readonly estoqueService;
    constructor(estoqueService: EstoqueService);
    alertas(user: {
        clinicaId: string | null;
    }): Promise<import("../../domain/entities/produto.entity").Produto[]>;
    listProdutos(filters: ListProdutosDto, user: {
        clinicaId: string | null;
    }): Promise<{
        data: import("../../domain/entities/produto.entity").Produto[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<import("../../domain/entities/produto.entity").Produto>;
    create(dto: CreateProdutoDto, user: {
        clinicaId: string | null;
    }): Promise<import("../../domain/entities/produto.entity").Produto>;
    movimentar(id: string, dto: MovimentarEstoqueDto, user: {
        id: string;
        clinicaId: string | null;
    }): Promise<import("../../domain/entities/movimentacao-estoque.entity").MovimentacaoEstoque>;
    listMovimentacoes(id: string): Promise<import("../../domain/entities/movimentacao-estoque.entity").MovimentacaoEstoque[]>;
}
