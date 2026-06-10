import { ContaTipo, ContaStatus, FormaPagamento } from '../../../domain/entities/financeiro.enums';
export declare class CreateContaDto {
    tipo: ContaTipo;
    descricao: string;
    valor: number;
    dataVencimento: string;
    dataPagamento?: string;
    status?: ContaStatus;
    formaPagamento?: FormaPagamento;
    categoria?: string;
    pacienteId?: string;
    agendamentoId?: string;
    observacoes?: string;
}
export declare class ListContasDto {
    tipo?: ContaTipo;
    status?: ContaStatus;
    dataInicio?: string;
    dataFim?: string;
    page?: number;
    limit?: number;
}
export declare class DashboardFinanceiroDto {
    dataInicio?: string;
    dataFim?: string;
}
