import { MovimentacaoTipo } from './movimentacao-tipo.enum';
import { Produto } from './produto.entity';
export declare class MovimentacaoEstoque {
    id: string;
    clinicaId: string | null;
    produtoId: string;
    produto: Produto;
    tipo: MovimentacaoTipo;
    quantidade: number;
    estoqueAnterior: number;
    estoquePosterior: number;
    motivo: string | null;
    usuarioId: string | null;
    createdAt: Date;
}
