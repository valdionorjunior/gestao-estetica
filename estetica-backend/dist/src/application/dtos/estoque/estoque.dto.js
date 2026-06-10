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
exports.ListProdutosDto = exports.MovimentarEstoqueDto = exports.CreateProdutoDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const movimentacao_tipo_enum_1 = require("../../../domain/entities/movimentacao-tipo.enum");
class CreateProdutoDto {
    nome;
    descricao;
    unidade;
    estoqueMinimo;
    precoCusto;
    categoriaId;
}
exports.CreateProdutoDto = CreateProdutoDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateProdutoDto.prototype, "nome", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProdutoDto.prototype, "descricao", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 'UN' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CreateProdutoDto.prototype, "unidade", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateProdutoDto.prototype, "estoqueMinimo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateProdutoDto.prototype, "precoCusto", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], CreateProdutoDto.prototype, "categoriaId", void 0);
class MovimentarEstoqueDto {
    tipo;
    quantidade;
    motivo;
}
exports.MovimentarEstoqueDto = MovimentarEstoqueDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: movimentacao_tipo_enum_1.MovimentacaoTipo }),
    (0, class_validator_1.IsEnum)(movimentacao_tipo_enum_1.MovimentacaoTipo),
    __metadata("design:type", String)
], MovimentarEstoqueDto.prototype, "tipo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ minimum: 0.001 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.Min)(0.001),
    __metadata("design:type", Number)
], MovimentarEstoqueDto.prototype, "quantidade", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(300),
    __metadata("design:type", String)
], MovimentarEstoqueDto.prototype, "motivo", void 0);
class ListProdutosDto {
    search;
    abaixoMinimo;
    page = 1;
    limit = 30;
}
exports.ListProdutosDto = ListProdutosDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ListProdutosDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'true = apenas abaixo do estoque mínimo' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], ListProdutosDto.prototype, "abaixoMinimo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], ListProdutosDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 30 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], ListProdutosDto.prototype, "limit", void 0);
//# sourceMappingURL=estoque.dto.js.map