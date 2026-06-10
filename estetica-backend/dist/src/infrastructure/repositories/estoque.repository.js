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
exports.EstoqueRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const produto_entity_1 = require("../../domain/entities/produto.entity");
const movimentacao_estoque_entity_1 = require("../../domain/entities/movimentacao-estoque.entity");
let EstoqueRepository = class EstoqueRepository {
    produtoRepo;
    movimentacaoRepo;
    constructor(produtoRepo, movimentacaoRepo) {
        this.produtoRepo = produtoRepo;
        this.movimentacaoRepo = movimentacaoRepo;
    }
    async findProdutoById(id) {
        return this.produtoRepo.findOne({ where: { id } });
    }
    async listProdutos(clinicaId, filters) {
        const { search, abaixoMinimo, page = 1, limit = 30 } = filters;
        const skip = (page - 1) * limit;
        const qb = this.produtoRepo.createQueryBuilder('p').where('p.ativo = true').skip(skip).take(limit).orderBy('p.nome', 'ASC');
        if (clinicaId)
            qb.andWhere('p.clinicaId = :clinicaId', { clinicaId });
        if (search)
            qb.andWhere('p.nome ILIKE :search', { search: `%${search}%` });
        if (abaixoMinimo)
            qb.andWhere('p.estoqueAtual < p.estoqueMinimo');
        const [data, total] = await qb.getManyAndCount();
        return { data, total };
    }
    async createProduto(data) {
        const p = this.produtoRepo.create(data);
        return this.produtoRepo.save(p);
    }
    async updateProduto(id, data) {
        await this.produtoRepo.update(id, data);
    }
    async listMovimentacoes(produtoId) {
        return this.movimentacaoRepo.find({
            where: { produtoId },
            order: { createdAt: 'DESC' },
            take: 50,
        });
    }
    async createMovimentacao(data) {
        const m = this.movimentacaoRepo.create(data);
        return this.movimentacaoRepo.save(m);
    }
};
exports.EstoqueRepository = EstoqueRepository;
exports.EstoqueRepository = EstoqueRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(produto_entity_1.Produto)),
    __param(1, (0, typeorm_1.InjectRepository)(movimentacao_estoque_entity_1.MovimentacaoEstoque)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], EstoqueRepository);
//# sourceMappingURL=estoque.repository.js.map