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
exports.MovimentacaoEstoque = void 0;
const typeorm_1 = require("typeorm");
const movimentacao_tipo_enum_1 = require("./movimentacao-tipo.enum");
const produto_entity_1 = require("./produto.entity");
let MovimentacaoEstoque = class MovimentacaoEstoque {
    id;
    clinicaId;
    produtoId;
    produto;
    tipo;
    quantidade;
    estoqueAnterior;
    estoquePosterior;
    motivo;
    usuarioId;
    createdAt;
};
exports.MovimentacaoEstoque = MovimentacaoEstoque;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], MovimentacaoEstoque.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'clinica_id', nullable: true }),
    __metadata("design:type", Object)
], MovimentacaoEstoque.prototype, "clinicaId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'produto_id' }),
    __metadata("design:type", String)
], MovimentacaoEstoque.prototype, "produtoId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => produto_entity_1.Produto),
    (0, typeorm_1.JoinColumn)({ name: 'produto_id' }),
    __metadata("design:type", produto_entity_1.Produto)
], MovimentacaoEstoque.prototype, "produto", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: movimentacao_tipo_enum_1.MovimentacaoTipo }),
    __metadata("design:type", String)
], MovimentacaoEstoque.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 3 }),
    __metadata("design:type", Number)
], MovimentacaoEstoque.prototype, "quantidade", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'estoque_anterior', type: 'decimal', precision: 12, scale: 3 }),
    __metadata("design:type", Number)
], MovimentacaoEstoque.prototype, "estoqueAnterior", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'estoque_posterior', type: 'decimal', precision: 12, scale: 3 }),
    __metadata("design:type", Number)
], MovimentacaoEstoque.prototype, "estoquePosterior", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 300, nullable: true }),
    __metadata("design:type", Object)
], MovimentacaoEstoque.prototype, "motivo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'usuario_id', nullable: true }),
    __metadata("design:type", Object)
], MovimentacaoEstoque.prototype, "usuarioId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], MovimentacaoEstoque.prototype, "createdAt", void 0);
exports.MovimentacaoEstoque = MovimentacaoEstoque = __decorate([
    (0, typeorm_1.Entity)('movimentacoes_estoque')
], MovimentacaoEstoque);
//# sourceMappingURL=movimentacao-estoque.entity.js.map