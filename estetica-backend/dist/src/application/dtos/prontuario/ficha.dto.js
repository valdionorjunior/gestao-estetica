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
exports.UpdateFichaDto = exports.CreateFichaDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const ficha_atendimento_entity_1 = require("../../../domain/entities/ficha-atendimento.entity");
class CreateFichaDto {
    titulo;
    conteudo;
    agendamentoId;
}
exports.CreateFichaDto = CreateFichaDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateFichaDto.prototype, "titulo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Conteúdo da ficha (será criptografado)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFichaDto.prototype, "conteudo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], CreateFichaDto.prototype, "agendamentoId", void 0);
class UpdateFichaDto {
    titulo;
    conteudo;
    status;
}
exports.UpdateFichaDto = UpdateFichaDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], UpdateFichaDto.prototype, "titulo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateFichaDto.prototype, "conteudo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ficha_atendimento_entity_1.FichaStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(ficha_atendimento_entity_1.FichaStatus),
    __metadata("design:type", String)
], UpdateFichaDto.prototype, "status", void 0);
//# sourceMappingURL=ficha.dto.js.map