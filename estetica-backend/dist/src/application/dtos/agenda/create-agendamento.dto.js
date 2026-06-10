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
exports.CreateAgendamentoDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class CreateAgendamentoDto {
    pacienteId;
    profissionalId;
    procedimentoId;
    dataHoraInicio;
    dataHoraFim;
    observacoes;
    valor;
}
exports.CreateAgendamentoDto = CreateAgendamentoDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], CreateAgendamentoDto.prototype, "pacienteId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], CreateAgendamentoDto.prototype, "profissionalId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], CreateAgendamentoDto.prototype, "procedimentoId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-08-10T09:00:00-03:00' }),
    (0, class_validator_1.IsDateString)({}, { message: 'Data/hora de início inválida' }),
    __metadata("design:type", String)
], CreateAgendamentoDto.prototype, "dataHoraInicio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-08-10T10:00:00-03:00' }),
    (0, class_validator_1.IsDateString)({}, { message: 'Data/hora de fim inválida' }),
    __metadata("design:type", String)
], CreateAgendamentoDto.prototype, "dataHoraFim", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateAgendamentoDto.prototype, "observacoes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Valor em R$' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'Valor inválido' }),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateAgendamentoDto.prototype, "valor", void 0);
//# sourceMappingURL=create-agendamento.dto.js.map