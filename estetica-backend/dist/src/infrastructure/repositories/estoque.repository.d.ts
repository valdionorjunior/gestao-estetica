import { Repository } from 'typeorm';
import { Produto } from '../../domain/entities/produto.entity';
import { MovimentacaoEstoque } from '../../domain/entities/movimentacao-estoque.entity';
import { ListProdutosDto } from '../../application/dtos/estoque/estoque.dto';
export declare class EstoqueRepository {
    private readonly produtoRepo;
    private readonly movimentacaoRepo;
    constructor(produtoRepo: Repository<Produto>, movimentacaoRepo: Repository<MovimentacaoEstoque>);
    findProdutoById(id: string): Promise<Produto | null>;
    listProdutos(clinicaId: string | null, filters: ListProdutosDto): Promise<{
        data: Produto[];
        total: number;
    }>;
    createProduto(data: Partial<Produto>): Promise<Produto>;
    updateProduto(id: string, data: Partial<Produto>): Promise<void>;
    listMovimentacoes(produtoId: string): Promise<MovimentacaoEstoque[]>;
    createMovimentacao(data: Partial<MovimentacaoEstoque>): Promise<MovimentacaoEstoque>;
}
