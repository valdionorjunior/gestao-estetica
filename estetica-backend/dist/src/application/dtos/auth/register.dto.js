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
exports.RegisterDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const user_role_enum_1 = require("../../../domain/entities/user-role.enum");
class RegisterDto {
    email;
    password;
    nome;
    role;
    clinicaId;
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'admin@clinica.com' }),
    (0, class_validator_1.IsEmail)({}, { message: 'E-mail inválido' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Senha@123', minLength: 8 }),
    (0, class_validator_1.IsString)({ message: 'Senha deve ser uma string' }),
    (0, class_validator_1.MinLength)(8, { message: 'Senha deve ter no mínimo 8 caracteres' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Senha muito longa' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Maria Silva' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], RegisterDto.prototype, "nome", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: user_role_enum_1.UserRole, default: user_role_enum_1.UserRole.RECEPCIONISTA }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(user_role_enum_1.UserRole, { message: 'Role inválida' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'UUID da clínica' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'clinicaId deve ser um UUID válido' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "clinicaId", void 0);
//# sourceMappingURL=register.dto.js.map