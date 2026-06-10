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
exports.DashboardFinanceiroDto = exports.ListContasDto = exports.CreateContaDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const financeiro_enums_1 = require("../../../domain/entities/financeiro.enums");
class CreateContaDto {
    tipo;
    descricao;
    valor;
    dataVencimento;
    dataPagamento;
    status;
    formaPagamento;
    categoria;
    pacienteId;
    agendamentoId;
    observacoes;
}
exports.CreateContaDto = CreateContaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: financeiro_enums_1.ContaTipo }),
    (0, class_validator_1.IsEnum)(financeiro_enums_1.ContaTipo),
    __metadata("design:type", String)
], CreateContaDto.prototype, "tipo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(300),
    __metadata("design:type", String)
], CreateContaDto.prototype, "descricao", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateContaDto.prototype, "valor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-08-31' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateContaDto.prototype, "dataVencimento", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2025-08-10' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateContaDto.prototype, "dataPagamento", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: financeiro_enums_1.ContaStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(financeiro_enums_1.ContaStatus),
    __metadata("design:type", String)
], CreateContaDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: financeiro_enums_1.FormaPagamento }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(financeiro_enums_1.FormaPagamento),
    __metadata("design:type", String)
], CreateContaDto.prototype, "formaPagamento", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateContaDto.prototype, "categoria", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], CreateContaDto.prototype, "pacienteId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], CreateContaDto.prototype, "agendamentoId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateContaDto.prototype, "observacoes", void 0);
class ListContasDto {
    tipo;
    status;
    dataInicio;
    dataFim;
    page = 1;
    limit = 30;
}
exports.ListContasDto = ListContasDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: financeiro_enums_1.ContaTipo }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(financeiro_enums_1.ContaTipo),
    __metadata("design:type", String)
], ListContasDto.prototype, "tipo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: financeiro_enums_1.ContaStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(financeiro_enums_1.ContaStatus),
    __metadata("design:type", String)
], ListContasDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ListContasDto.prototype, "dataInicio", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ListContasDto.prototype, "dataFim", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], ListContasDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 30 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], ListContasDto.prototype, "limit", void 0);
class DashboardFinanceiroDto {
    dataInicio;
    dataFim;
}
exports.DashboardFinanceiroDto = DashboardFinanceiroDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], DashboardFinanceiroDto.prototype, "dataInicio", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], DashboardFinanceiroDto.prototype, "dataFim", void 0);
//# sourceMappingURL=conta.dto.js.map