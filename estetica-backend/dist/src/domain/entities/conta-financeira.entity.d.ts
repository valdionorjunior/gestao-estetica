import { ContaTipo, ContaStatus, FormaPagamento } from './financeiro.enums';
export declare class ContaFinanceira {
    id: string;
    clinicaId: string | null;
    tipo: ContaTipo;
    descricao: string;
    valor: number;
    dataVencimento: Date;
    dataPagamento: Date | null;
    status: ContaStatus;
    formaPagamento: FormaPagamento | null;
    categoria: string | null;
    pacienteId: string | null;
    agendamentoId: string | null;
    observacoes: string | null;
    createdAt: Date;
    updatedAt: Date;
}
