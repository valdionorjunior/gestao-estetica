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
exports.ListAgendamentosDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const agendamento_status_enum_1 = require("../../../domain/entities/agendamento-status.enum");
class ListAgendamentosDto {
    data;
    dataInicio;
    dataFim;
    profissionalId;
    pacienteId;
    status;
    page = 1;
    limit = 50;
}
exports.ListAgendamentosDto = ListAgendamentosDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filtrar por data (YYYY-MM-DD)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ListAgendamentosDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Data inicial do intervalo' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ListAgendamentosDto.prototype, "dataInicio", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Data final do intervalo' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ListAgendamentosDto.prototype, "dataFim", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], ListAgendamentosDto.prototype, "profissionalId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], ListAgendamentosDto.prototype, "pacienteId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: agendamento_status_enum_1.AgendamentoStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(agendamento_status_enum_1.AgendamentoStatus),
    __metadata("design:type", String)
], ListAgendamentosDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], ListAgendamentosDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 50 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], ListAgendamentosDto.prototype, "limit", void 0);
//# sourceMappingURL=list-agendamentos.dto.js.map