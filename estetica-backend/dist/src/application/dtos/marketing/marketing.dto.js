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
exports.EnviarCampanhaDto = exports.EnviarMensagemDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const comunicacao_log_entity_1 = require("../../../domain/entities/comunicacao-log.entity");
class EnviarMensagemDto {
    pacienteId;
    agendamentoId;
    tipo;
    motivo;
    mensagem;
    assunto;
}
exports.EnviarMensagemDto = EnviarMensagemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID do paciente destinatário' }),
    (0, class_validator_1.IsUUID)('4', { message: 'pacienteId deve ser um UUID válido' }),
    __metadata("design:type", String)
], EnviarMensagemDto.prototype, "pacienteId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID do agendamento relacionado (opcional)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], EnviarMensagemDto.prototype, "agendamentoId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: comunicacao_log_entity_1.ComunicacaoTipo, example: comunicacao_log_entity_1.ComunicacaoTipo.WHATSAPP }),
    (0, class_validator_1.IsEnum)(comunicacao_log_entity_1.ComunicacaoTipo, { message: 'Tipo inválido. Use EMAIL, SMS ou WHATSAPP' }),
    __metadata("design:type", String)
], EnviarMensagemDto.prototype, "tipo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: comunicacao_log_entity_1.ComunicacaoMotivo, example: comunicacao_log_entity_1.ComunicacaoMotivo.MANUAL }),
    (0, class_validator_1.IsEnum)(comunicacao_log_entity_1.ComunicacaoMotivo, { message: 'Motivo inválido' }),
    __metadata("design:type", String)
], EnviarMensagemDto.prototype, "motivo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Olá {nome}, sua consulta está agendada para amanhã às {hora}.' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5, { message: 'Mensagem muito curta' }),
    (0, class_validator_1.MaxLength)(1600, { message: 'Mensagem excede 1600 caracteres' }),
    __metadata("design:type", String)
], EnviarMensagemDto.prototype, "mensagem", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Lembrete de consulta — Estética Natalia Salvador' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], EnviarMensagemDto.prototype, "assunto", void 0);
class EnviarCampanhaDto {
    pacienteIds;
    tipo;
    assunto;
    mensagem;
}
exports.EnviarCampanhaDto = EnviarCampanhaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Lista de IDs de pacientes destinatários' }),
    (0, class_validator_1.IsUUID)('4', { each: true, message: 'Cada pacienteId deve ser um UUID válido' }),
    __metadata("design:type", Array)
], EnviarCampanhaDto.prototype, "pacienteIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: comunicacao_log_entity_1.ComunicacaoTipo }),
    (0, class_validator_1.IsEnum)(comunicacao_log_entity_1.ComunicacaoTipo),
    __metadata("design:type", String)
], EnviarCampanhaDto.prototype, "tipo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Promoção Especial de Verão!' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], EnviarCampanhaDto.prototype, "assunto", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Olá {nome}, temos uma promoção especial para você! 🌟' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(1600),
    __metadata("design:type", String)
], EnviarCampanhaDto.prototype, "mensagem", void 0);
//# sourceMappingURL=marketing.dto.js.map