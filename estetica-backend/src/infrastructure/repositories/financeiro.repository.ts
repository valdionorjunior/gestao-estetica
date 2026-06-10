import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContaFinanceira } from '../../domain/entities/conta-financeira.entity';
import { ContaStatus, ContaTipo } from '../../domain/entities/financeiro.enums';
import { ListContasDto } from '../../application/dtos/financeiro/conta.dto';

@Injectable()
export class FinanceiroRepository {
  constructor(
    @InjectRepository(ContaFinanceira)
    private readonly repo: Repository<ContaFinanceira>,
  ) {}

  async findById(id: string): Promise<ContaFinanceira | null> {
    return this.repo.findOne({ where: { id } });
  }

  async list(
    clinicaId: string | null,
    filters: ListContasDto,
  ): Promise<{ data: ContaFinanceira[]; total: number }> {
    const { tipo, status, dataInicio, dataFim, page = 1, limit = 30 } = filters;
    const skip = (page - 1) * limit;
    const qb = this.repo.createQueryBuilder('c').skip(skip).take(limit).orderBy('c.dataVencimento', 'ASC');

    if (clinicaId) qb.andWhere('c.clinicaId = :clinicaId', { clinicaId });
    if (tipo) qb.andWhere('c.tipo = :tipo', { tipo });
    if (status) qb.andWhere('c.status = :status', { status });
    if (dataInicio) qb.andWhere('c.dataVencimento >= :dataInicio', { dataInicio });
    if (dataFim) qb.andWhere('c.dataVencimento <= :dataFim', { dataFim });

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  async create(data: Partial<ContaFinanceira>): Promise<ContaFinanceira> {
    const conta = this.repo.create(data);
    return this.repo.save(conta);
  }

  async update(id: string, data: Partial<ContaFinanceira>): Promise<void> {
    await this.repo.update(id, data);
  }

  async dashboard(clinicaId: string | null, dataInicio?: string, dataFim?: string) {
    const qb = this.repo.createQueryBuilder('c').select([
      'c.tipo AS tipo',
      'c.status AS status',
      'SUM(c.valor) AS total',
    ]);

    if (clinicaId) qb.andWhere('c.clinicaId = :clinicaId', { clinicaId });
    if (dataInicio) qb.andWhere('c.dataVencimento >= :dataInicio', { dataInicio });
    if (dataFim) qb.andWhere('c.dataVencimento <= :dataFim', { dataFim });

    return qb.groupBy('c.tipo, c.status').getRawMany();
  }
}
