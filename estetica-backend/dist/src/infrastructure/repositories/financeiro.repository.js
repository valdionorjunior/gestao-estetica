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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceiroRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const conta_financeira_entity_1 = require("../../domain/entities/conta-financeira.entity");
let FinanceiroRepository = class FinanceiroRepository {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async findById(id) {
        return this.repo.findOne({ where: { id } });
    }
    async list(clinicaId, filters) {
        const { tipo, status, dataInicio, dataFim, page = 1, limit = 30 } = filters;
        const skip = (page - 1) * limit;
        const qb = this.repo.createQueryBuilder('c').skip(skip).take(limit).orderBy('c.dataVencimento', 'ASC');
        if (clinicaId)
            qb.andWhere('c.clinicaId = :clinicaId', { clinicaId });
        if (tipo)
            qb.andWhere('c.tipo = :tipo', { tipo });
        if (status)
            qb.andWhere('c.status = :status', { status });
        if (dataInicio)
            qb.andWhere('c.dataVencimento >= :dataInicio', { dataInicio });
        if (dataFim)
            qb.andWhere('c.dataVencimento <= :dataFim', { dataFim });
        const [data, total] = await qb.getManyAndCount();
        return { data, total };
    }
    async create(data) {
        const conta = this.repo.create(data);
        return this.repo.save(conta);
    }
    async update(id, data) {
        await this.repo.update(id, data);
    }
    async dashboard(clinicaId, dataInicio, dataFim) {
        const qb = this.repo.createQueryBuilder('c').select([
            'c.tipo AS tipo',
            'c.status AS status',
            'SUM(c.valor) AS total',
        ]);
        if (clinicaId)
            qb.andWhere('c.clinicaId = :clinicaId', { clinicaId });
        if (dataInicio)
            qb.andWhere('c.dataVencimento >= :dataInicio', { dataInicio });
        if (dataFim)
            qb.andWhere('c.dataVencimento <= :dataFim', { dataFim });
        return qb.groupBy('c.tipo, c.status').getRawMany();
    }
};
exports.FinanceiroRepository = FinanceiroRepository;
exports.FinanceiroRepository = FinanceiroRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(conta_financeira_entity_1.ContaFinanceira)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FinanceiroRepository);
//# sourceMappingURL=financeiro.repository.js.map