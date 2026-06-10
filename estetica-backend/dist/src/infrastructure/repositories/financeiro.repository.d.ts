import { Repository } from 'typeorm';
import { ContaFinanceira } from '../../domain/entities/conta-financeira.entity';
import { ListContasDto } from '../../application/dtos/financeiro/conta.dto';
export declare class FinanceiroRepository {
    private readonly repo;
    constructor(repo: Repository<ContaFinanceira>);
    findById(id: string): Promise<ContaFinanceira | null>;
    list(clinicaId: string | null, filters: ListContasDto): Promise<{
        data: ContaFinanceira[];
        total: number;
    }>;
    create(data: Partial<ContaFinanceira>): Promise<ContaFinanceira>;
    update(id: string, data: Partial<ContaFinanceira>): Promise<void>;
    dashboard(clinicaId: string | null, dataInicio?: string, dataFim?: string): Promise<any[]>;
}
