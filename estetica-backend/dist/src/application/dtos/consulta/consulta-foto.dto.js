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
exports.ConsultaFotoResponseDto = exports.UpdateAnotacoesDto = exports.CreateConsultaFotoDto = exports.AnotacaoDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const consulta_foto_entity_1 = require("../../../domain/entities/consulta-foto.entity");
class AnotacaoDto {
    id;
    x;
    y;
    texto;
    cor;
    forma;
}
exports.AnotacaoDto = AnotacaoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID único da anotação' }),
    __metadata("design:type", String)
], AnotacaoDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Posição X relativa (0–100%)', example: 45.2 }),
    __metadata("design:type", Number)
], AnotacaoDto.prototype, "x", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Posição Y relativa (0–100%)', example: 30.1 }),
    __metadata("design:type", Number)
], AnotacaoDto.prototype, "y", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Texto da marcação', example: 'Aplicar bioestimulador' }),
    __metadata("design:type", String)
], AnotacaoDto.prototype, "texto", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Cor da marcação', example: '#D4AF37' }),
    __metadata("design:type", String)
], AnotacaoDto.prototype, "cor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['circulo', 'seta', 'retangulo', 'ponto'], description: 'Forma da marcação' }),
    __metadata("design:type", String)
], AnotacaoDto.prototype, "forma", void 0);
class CreateConsultaFotoDto {
    pacienteId;
    prontuarioId;
    profissionalId;
    tipo;
    descricao;
    dataConsulta;
}
exports.CreateConsultaFotoDto = CreateConsultaFotoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID do paciente (UUID)' }),
    (0, class_validator_1.IsUUID)('4', { message: 'pacienteId deve ser um UUID válido' }),
    __metadata("design:type", String)
], CreateConsultaFotoDto.prototype, "pacienteId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID do prontuário vinculado' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'prontuarioId deve ser um UUID válido' }),
    __metadata("design:type", String)
], CreateConsultaFotoDto.prototype, "prontuarioId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID do profissional' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'profissionalId deve ser um UUID válido' }),
    __metadata("design:type", String)
], CreateConsultaFotoDto.prototype, "profissionalId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: consulta_foto_entity_1.TipoFotoConsulta, description: 'Tipo da foto' }),
    (0, class_validator_1.IsEnum)(consulta_foto_entity_1.TipoFotoConsulta, { message: 'tipo deve ser ANTES, DEPOIS, DURANTE ou REFERENCIA' }),
    __metadata("design:type", String)
], CreateConsultaFotoDto.prototype, "tipo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Descrição da foto / contexto clínico' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200, { message: 'Descrição máxima de 200 caracteres' }),
    __metadata("design:type", String)
], CreateConsultaFotoDto.prototype, "descricao", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Data da consulta (YYYY-MM-DD)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateConsultaFotoDto.prototype, "dataConsulta", void 0);
class UpdateAnotacoesDto {
    anotacoes;
}
exports.UpdateAnotacoesDto = UpdateAnotacoesDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [AnotacaoDto], description: 'Lista de anotações/marcações na foto' }),
    __metadata("design:type", Array)
], UpdateAnotacoesDto.prototype, "anotacoes", void 0);
class ConsultaFotoResponseDto {
    id;
    pacienteId;
    prontuarioId;
    tipo;
    fotoUrl;
    descricao;
    anotacoes;
    dataConsulta;
    createdAt;
    updatedAt;
}
exports.ConsultaFotoResponseDto = ConsultaFotoResponseDto;
//# sourceMappingURL=consulta-foto.dto.js.map