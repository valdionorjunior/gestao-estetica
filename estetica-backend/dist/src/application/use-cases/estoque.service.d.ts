import { EstoqueRepository } from '../../infrastructure/repositories/estoque.repository';
import { CreateProdutoDto, ListProdutosDto, MovimentarEstoqueDto } from '../dtos/estoque/estoque.dto';
export declare class EstoqueService {
    private readonly estoqueRepository;
    constructor(estoqueRepository: EstoqueRepository);
    listProdutos(clinicaId: string | null, filters: ListProdutosDto): Promise<{
        data: import("../../domain/entities/produto.entity").Produto[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<import("../../domain/entities/produto.entity").Produto>;
    create(dto: CreateProdutoDto, clinicaId: string | null): Promise<import("../../domain/entities/produto.entity").Produto>;
    movimentar(produtoId: string, dto: MovimentarEstoqueDto, usuarioId: string, clinicaId: string | null): Promise<import("../../domain/entities/movimentacao-estoque.entity").MovimentacaoEstoque>;
    listMovimentacoes(produtoId: string): Promise<import("../../domain/entities/movimentacao-estoque.entity").MovimentacaoEstoque[]>;
    alertasEstoqueMinimo(clinicaId: string | null): Promise<import("../../domain/entities/produto.entity").Produto[]>;
}
