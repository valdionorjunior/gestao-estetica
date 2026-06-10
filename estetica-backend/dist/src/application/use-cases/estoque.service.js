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
exports.EstoqueService = void 0;
const common_1 = require("@nestjs/common");
const estoque_repository_1 = require("../../infrastructure/repositories/estoque.repository");
const movimentacao_tipo_enum_1 = require("../../domain/entities/movimentacao-tipo.enum");
let EstoqueService = class EstoqueService {
    estoqueRepository;
    constructor(estoqueRepository) {
        this.estoqueRepository = estoqueRepository;
    }
    async listProdutos(clinicaId, filters) {
        const { data, total } = await this.estoqueRepository.listProdutos(clinicaId, filters);
        const { page = 1, limit = 30 } = filters;
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findOne(id) {
        const produto = await this.estoqueRepository.findProdutoById(id);
        if (!produto)
            throw new common_1.NotFoundException('Produto não encontrado');
        return produto;
    }
    async create(dto, clinicaId) {
        return this.estoqueRepository.createProduto({
            nome: dto.nome,
            descricao: dto.descricao ?? null,
            unidade: dto.unidade ?? 'UN',
            estoqueMinimo: dto.estoqueMinimo ?? 0,
            precoCusto: dto.precoCusto ?? null,
            categoriaId: dto.categoriaId ?? null,
            clinicaId,
            estoqueAtual: 0,
        });
    }
    async movimentar(produtoId, dto, usuarioId, clinicaId) {
        const produto = await this.findOne(produtoId);
        const estoqueAnterior = Number(produto.estoqueAtual);
        let estoquePosterior;
        switch (dto.tipo) {
            case movimentacao_tipo_enum_1.MovimentacaoTipo.ENTRADA:
                estoquePosterior = estoqueAnterior + Number(dto.quantidade);
                break;
            case movimentacao_tipo_enum_1.MovimentacaoTipo.SAIDA:
                estoquePosterior = estoqueAnterior - Number(dto.quantidade);
                if (estoquePosterior < 0) {
                    throw new common_1.BadRequestException(`Estoque insuficiente. Disponível: ${estoqueAnterior}`);
                }
                break;
            case movimentacao_tipo_enum_1.MovimentacaoTipo.AJUSTE:
                estoquePosterior = Number(dto.quantidade);
                break;
        }
        await this.estoqueRepository.updateProduto(produtoId, { estoqueAtual: estoquePosterior });
        return this.estoqueRepository.createMovimentacao({
            produtoId,
            clinicaId,
            tipo: dto.tipo,
            quantidade: dto.quantidade,
            estoqueAnterior,
            estoquePosterior,
            motivo: dto.motivo ?? null,
            usuarioId,
        });
    }
    async listMovimentacoes(produtoId) {
        await this.findOne(produtoId);
        return this.estoqueRepository.listMovimentacoes(produtoId);
    }
    async alertasEstoqueMinimo(clinicaId) {
        const { data } = await this.estoqueRepository.listProdutos(clinicaId, { abaixoMinimo: true, limit: 100 });
        return data.filter((p) => Number(p.estoqueAtual) < Number(p.estoqueMinimo));
    }
};
exports.EstoqueService = EstoqueService;
exports.EstoqueService = EstoqueService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [estoque_repository_1.EstoqueRepository])
], EstoqueService);
//# sourceMappingURL=estoque.service.js.map