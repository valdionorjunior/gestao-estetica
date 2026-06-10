import { FinanceiroService } from '../../application/use-cases/financeiro.service';
import { CreateContaDto, ListContasDto, DashboardFinanceiroDto } from '../../application/dtos/financeiro/conta.dto';
export declare class FinanceiroController {
    private readonly financeiroService;
    constructor(financeiroService: FinanceiroService);
    dashboard(filters: DashboardFinanceiroDto, user: {
        clinicaId: string | null;
    }): Promise<{
        totalReceitas: number;
        totalDespesas: number;
        receitasPendentes: number;
        despesasPendentes: number;
        saldo: number;
    }>;
    list(filters: ListContasDto, user: {
        clinicaId: string | null;
    }): Promise<{
        data: import("../../domain/entities/conta-financeira.entity").ContaFinanceira[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<import("../../domain/entities/conta-financeira.entity").ContaFinanceira>;
    create(dto: CreateContaDto, user: {
        clinicaId: string | null;
    }): Promise<import("../../domain/entities/conta-financeira.entity").ContaFinanceira>;
    markAsPaid(id: string): Promise<import("../../domain/entities/conta-financeira.entity").ContaFinanceira>;
    cancel(id: string): Promise<import("../../domain/entities/conta-financeira.entity").ContaFinanceira>;
}
