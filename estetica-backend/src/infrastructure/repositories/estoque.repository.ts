import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, LessThan, Repository } from 'typeorm';
import { Produto } from '../../domain/entities/produto.entity';
import { MovimentacaoEstoque } from '../../domain/entities/movimentacao-estoque.entity';
import { ListProdutosDto } from '../../application/dtos/estoque/estoque.dto';

@Injectable()
export class EstoqueRepository {
  constructor(
    @InjectRepository(Produto)
    private readonly produtoRepo: Repository<Produto>,
    @InjectRepository(MovimentacaoEstoque)
    private readonly movimentacaoRepo: Repository<MovimentacaoEstoque>,
  ) {}

  async findProdutoById(id: string): Promise<Produto | null> {
    return this.produtoRepo.findOne({ where: { id } });
  }

  async listProdutos(
    clinicaId: string | null,
    filters: ListProdutosDto,
  ): Promise<{ data: Produto[]; total: number }> {
    const { search, abaixoMinimo, page = 1, limit = 30 } = filters;
    const skip = (page - 1) * limit;
    const qb = this.produtoRepo.createQueryBuilder('p').where('p.ativo = true').skip(skip).take(limit).orderBy('p.nome', 'ASC');

    if (clinicaId) qb.andWhere('p.clinicaId = :clinicaId', { clinicaId });
    if (search) qb.andWhere('p.nome ILIKE :search', { search: `%${search}%` });
    if (abaixoMinimo) qb.andWhere('p.estoqueAtual < p.estoqueMinimo');

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  async createProduto(data: Partial<Produto>): Promise<Produto> {
    const p = this.produtoRepo.create(data);
    return this.produtoRepo.save(p);
  }

  async updateProduto(id: string, data: Partial<Produto>): Promise<void> {
    await this.produtoRepo.update(id, data);
  }

  async listMovimentacoes(produtoId: string): Promise<MovimentacaoEstoque[]> {
    return this.movimentacaoRepo.find({
      where: { produtoId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  async createMovimentacao(data: Partial<MovimentacaoEstoque>): Promise<MovimentacaoEstoque> {
    const m = this.movimentacaoRepo.create(data);
    return this.movimentacaoRepo.save(m);
  }
}
