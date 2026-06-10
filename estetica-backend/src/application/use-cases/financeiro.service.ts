import { Injectable, NotFoundException } from '@nestjs/common';
import { FinanceiroRepository } from '../../infrastructure/repositories/financeiro.repository';
import { CreateContaDto, ListContasDto, DashboardFinanceiroDto } from '../dtos/financeiro/conta.dto';
import { ContaStatus } from '../../domain/entities/financeiro.enums';

@Injectable()
export class FinanceiroService {
  constructor(private readonly financeiroRepository: FinanceiroRepository) {}

  async list(clinicaId: string | null, filters: ListContasDto) {
    const { data, total } = await this.financeiroRepository.list(clinicaId, filters);
    const { page = 1, limit = 30 } = filters;
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const conta = await this.financeiroRepository.findById(id);
    if (!conta) throw new NotFoundException('Conta financeira não encontrada');
    return conta;
  }

  async create(dto: CreateContaDto, clinicaId: string | null) {
    return this.financeiroRepository.create({
      clinicaId,
      tipo: dto.tipo,
      descricao: dto.descricao,
      valor: dto.valor,
      dataVencimento: new Date(dto.dataVencimento),
      dataPagamento: dto.dataPagamento ? new Date(dto.dataPagamento) : null,
      status: dto.status ?? ContaStatus.PENDENTE,
      formaPagamento: dto.formaPagamento ?? null,
      categoria: dto.categoria ?? null,
      pacienteId: dto.pacienteId ?? null,
      agendamentoId: dto.agendamentoId ?? null,
      observacoes: dto.observacoes ?? null,
    });
  }

  async markAsPaid(id: string, formaPagamento?: string) {
    await this.findOne(id);
    await this.financeiroRepository.update(id, {
      status: ContaStatus.PAGO,
      dataPagamento: new Date(),
      ...(formaPagamento && { formaPagamento: formaPagamento as any }),
    });
    return this.findOne(id);
  }

  async cancel(id: string) {
    await this.findOne(id);
    await this.financeiroRepository.update(id, { status: ContaStatus.CANCELADO });
    return this.findOne(id);
  }

  async dashboard(clinicaId: string | null, filters: DashboardFinanceiroDto) {
    const raw = await this.financeiroRepository.dashboard(clinicaId, filters.dataInicio, filters.dataFim);

    const result = {
      totalReceitas: 0,
      totalDespesas: 0,
      receitasPendentes: 0,
      despesasPendentes: 0,
      saldo: 0,
    };

    for (const row of raw) {
      const val = parseFloat(row.total ?? 0);
      if (row.tipo === 'RECEITA' && row.status === 'PAGO') result.totalReceitas += val;
      if (row.tipo === 'DESPESA' && row.status === 'PAGO') result.totalDespesas += val;
      if (row.tipo === 'RECEITA' && row.status === 'PENDENTE') result.receitasPendentes += val;
      if (row.tipo === 'DESPESA' && row.status === 'PENDENTE') result.despesasPendentes += val;
    }

    result.saldo = result.totalReceitas - result.totalDespesas;
    return result;
  }
}
