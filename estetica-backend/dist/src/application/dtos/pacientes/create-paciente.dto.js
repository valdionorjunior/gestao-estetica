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
exports.CreatePacienteDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreatePacienteDto {
    nome;
    cpf;
    dataNascimento;
    telefone;
    email;
    endereco;
    cidade;
    estado;
    cep;
}
exports.CreatePacienteDto = CreatePacienteDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Maria da Silva' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreatePacienteDto.prototype, "nome", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '123.456.789-00', description: 'CPF (será criptografado)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/, { message: 'CPF inválido' }),
    __metadata("design:type", String)
], CreatePacienteDto.prototype, "cpf", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1990-05-15' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Data de nascimento inválida' }),
    __metadata("design:type", String)
], CreatePacienteDto.prototype, "dataNascimento", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '(11) 99999-9999' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CreatePacienteDto.prototype, "telefone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'maria@email.com' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: 'E-mail inválido' }),
    __metadata("design:type", String)
], CreatePacienteDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(300),
    __metadata("design:type", String)
], CreatePacienteDto.prototype, "endereco", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreatePacienteDto.prototype, "cidade", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'SP' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(2, 2, { message: 'Estado deve ter 2 letras (UF)' }),
    __metadata("design:type", String)
], CreatePacienteDto.prototype, "estado", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '01310-100' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(9),
    __metadata("design:type", String)
], CreatePacienteDto.prototype, "cep", void 0);
//# sourceMappingURL=create-paciente.dto.js.map