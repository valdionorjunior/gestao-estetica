export declare class Produto {
    id: string;
    clinicaId: string | null;
    categoriaId: string | null;
    nome: string;
    descricao: string | null;
    unidade: string;
    estoqueAtual: number;
    estoqueMinimo: number;
    precoCusto: number | null;
    ativo: boolean;
    createdAt: Date;
    updatedAt: Date;
}
