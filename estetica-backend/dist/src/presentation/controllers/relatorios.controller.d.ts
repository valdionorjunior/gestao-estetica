import { Repository } from 'typeorm';
import { Agendamento } from '../../domain/entities/agendamento.entity';
import { ContaFinanceira } from '../../domain/entities/conta-financeira.entity';
import { Paciente } from '../../domain/entities/paciente.entity';
declare class RelatorioFiltroDto {
    dataInicio?: string;
    dataFim?: string;
}
export declare class RelatoriosController {
    private readonly agendamentos;
    private readonly contas;
    private readonly pacientes;
    constructor(agendamentos: Repository<Agendamento>, contas: Repository<ContaFinanceira>, pacientes: Repository<Paciente>);
    agenda(filters: RelatorioFiltroDto, user: {
        clinicaId: string | null;
    }): Promise<{
        data: any;
        total: number;
        concluidos: number;
        cancelados: number;
    }[]>;
    financeiro(filters: RelatorioFiltroDto, user: {
        clinicaId: string | null;
    }): Promise<{
        mes: any;
        totalReceitas: number;
        totalDespesas: number;
        saldo: number;
    }[]>;
    novosPacientes(filters: RelatorioFiltroDto, user: {
        clinicaId: string | null;
    }): Promise<{
        mes: any;
        total: number;
    }[]>;
}
export {};
