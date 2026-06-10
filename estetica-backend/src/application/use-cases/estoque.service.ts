import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EstoqueRepository } from '../../infrastructure/repositories/estoque.repository';
import {
  CreateProdutoDto,
  ListProdutosDto,
  MovimentarEstoqueDto,
} from '../dtos/estoque/estoque.dto';
import { MovimentacaoTipo } from '../../domain/entities/movimentacao-tipo.enum';

@Injectable()
export class EstoqueService {
  constructor(private readonly estoqueRepository: EstoqueRepository) {}

  async listProdutos(clinicaId: string | null, filters: ListProdutosDto) {
    const { data, total } = await this.estoqueRepository.listProdutos(clinicaId, filters);
    const { page = 1, limit = 30 } = filters;
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const produto = await this.estoqueRepository.findProdutoById(id);
    if (!produto) throw new NotFoundException('Produto não encontrado');
    return produto;
  }

  async create(dto: CreateProdutoDto, clinicaId: string | null) {
    return this.estoqueRepository.createProduto({
      nome: dto.nome,
      descricao: dto.descricao ?? null,
      unidade: dto.unidade ?? 'UN',
      estoqueMinimo: dto.estoqueMinimo ?? 0,
      precoCusto: dto.precoCusto ?? null,
      categoriaId: dto.categoriaId ?? null,
      clinicaId,
      estoqueAtual: 0,
    });
  }

  async movimentar(
    produtoId: string,
    dto: MovimentarEstoqueDto,
    usuarioId: string,
    clinicaId: string | null,
  ) {
    const produto = await this.findOne(produtoId);
    const estoqueAnterior = Number(produto.estoqueAtual);
    let estoquePosterior: number;

    switch (dto.tipo) {
      case MovimentacaoTipo.ENTRADA:
        estoquePosterior = estoqueAnterior + Number(dto.quantidade);
        break;
      case MovimentacaoTipo.SAIDA:
        estoquePosterior = estoqueAnterior - Number(dto.quantidade);
        if (estoquePosterior < 0) {
          throw new BadRequestException(
            `Estoque insuficiente. Disponível: ${estoqueAnterior}`,
          );
        }
        break;
      case MovimentacaoTipo.AJUSTE:
        estoquePosterior = Number(dto.quantidade);
        break;
    }

    await this.estoqueRepository.updateProduto(produtoId, { estoqueAtual: estoquePosterior });

    return this.estoqueRepository.createMovimentacao({
      produtoId,
      clinicaId,
      tipo: dto.tipo,
      quantidade: dto.quantidade,
      estoqueAnterior,
      estoquePosterior,
      motivo: dto.motivo ?? null,
      usuarioId,
    });
  }

  async listMovimentacoes(produtoId: string) {
    await this.findOne(produtoId);
    return this.estoqueRepository.listMovimentacoes(produtoId);
  }

  async alertasEstoqueMinimo(clinicaId: string | null) {
    const { data } = await this.estoqueRepository.listProdutos(clinicaId, { abaixoMinimo: true, limit: 100 });
    return data.filter((p) => Number(p.estoqueAtual) < Number(p.estoqueMinimo));
  }
}
