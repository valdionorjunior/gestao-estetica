import { FinanceiroRepository } from '../../infrastructure/repositories/financeiro.repository';
import { CreateContaDto, ListContasDto, DashboardFinanceiroDto } from '../dtos/financeiro/conta.dto';
export declare class FinanceiroService {
    private readonly financeiroRepository;
    constructor(financeiroRepository: FinanceiroRepository);
    list(clinicaId: string | null, filters: ListContasDto): Promise<{
        data: import("../../domain/entities/conta-financeira.entity").ContaFinanceira[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<import("../../domain/entities/conta-financeira.entity").ContaFinanceira>;
    create(dto: CreateContaDto, clinicaId: string | null): Promise<import("../../domain/entities/conta-financeira.entity").ContaFinanceira>;
    markAsPaid(id: string, formaPagamento?: string): Promise<import("../../domain/entities/conta-financeira.entity").ContaFinanceira>;
    cancel(id: string): Promise<import("../../domain/entities/conta-financeira.entity").ContaFinanceira>;
    dashboard(clinicaId: string | null, filters: DashboardFinanceiroDto): Promise<{
        totalReceitas: number;
        totalDespesas: number;
        receitasPendentes: number;
        despesasPendentes: number;
        saldo: number;
    }>;
}
