"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceiroService = void 0;
const common_1 = require("@nestjs/common");
const financeiro_repository_1 = require("../../infrastructure/repositories/financeiro.repository");
const financeiro_enums_1 = require("../../domain/entities/financeiro.enums");
let FinanceiroService = class FinanceiroService {
    financeiroRepository;
    constructor(financeiroRepository) {
        this.financeiroRepository = financeiroRepository;
    }
    async list(clinicaId, filters) {
        const { data, total } = await this.financeiroRepository.list(clinicaId, filters);
        const { page = 1, limit = 30 } = filters;
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findOne(id) {
        const conta = await this.financeiroRepository.findById(id);
        if (!conta)
            throw new common_1.NotFoundException('Conta financeira não encontrada');
        return conta;
    }
    async create(dto, clinicaId) {
        return this.financeiroRepository.create({
            clinicaId,
            tipo: dto.tipo,
            descricao: dto.descricao,
            valor: dto.valor,
            dataVencimento: new Date(dto.dataVencimento),
            dataPagamento: dto.dataPagamento ? new Date(dto.dataPagamento) : null,
            status: dto.status ?? financeiro_enums_1.ContaStatus.PENDENTE,
            formaPagamento: dto.formaPagamento ?? null,
            categoria: dto.categoria ?? null,
            pacienteId: dto.pacienteId ?? null,
            agendamentoId: dto.agendamentoId ?? null,
            observacoes: dto.observacoes ?? null,
        });
    }
    async markAsPaid(id, formaPagamento) {
        await this.findOne(id);
        await this.financeiroRepository.update(id, {
            status: financeiro_enums_1.ContaStatus.PAGO,
            dataPagamento: new Date(),
            ...(formaPagamento && { formaPagamento: formaPagamento }),
        });
        return this.findOne(id);
    }
    async cancel(id) {
        await this.findOne(id);
        await this.financeiroRepository.update(id, { status: financeiro_enums_1.ContaStatus.CANCELADO });
        return this.findOne(id);
    }
    async dashboard(clinicaId, filters) {
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
            if (row.tipo === 'RECEITA' && row.status === 'PAGO')
                result.totalReceitas += val;
            if (row.tipo === 'DESPESA' && row.status === 'PAGO')
                result.totalDespesas += val;
            if (row.tipo === 'RECEITA' && row.status === 'PENDENTE')
                result.receitasPendentes += val;
            if (row.tipo === 'DESPESA' && row.status === 'PENDENTE')
                result.despesasPendentes += val;
        }
        result.saldo = result.totalReceitas - result.totalDespesas;
        return result;
    }
};
exports.FinanceiroService = FinanceiroService;
exports.FinanceiroService = FinanceiroService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [financeiro_repository_1.FinanceiroRepository])
], FinanceiroService);
//# sourceMappingURL=financeiro.service.js.map