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
exports.UpdateAgendamentoStatusDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const agendamento_status_enum_1 = require("../../../domain/entities/agendamento-status.enum");
class UpdateAgendamentoStatusDto {
    status;
    motivoCancelamento;
}
exports.UpdateAgendamentoStatusDto = UpdateAgendamentoStatusDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: agendamento_status_enum_1.AgendamentoStatus }),
    (0, class_validator_1.IsEnum)(agendamento_status_enum_1.AgendamentoStatus),
    __metadata("design:type", String)
], UpdateAgendamentoStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(300),
    __metadata("design:type", String)
], UpdateAgendamentoStatusDto.prototype, "motivoCancelamento", void 0);
//# sourceMappingURL=update-agendamento-status.dto.js.map