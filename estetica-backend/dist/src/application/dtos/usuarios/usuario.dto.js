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
exports.UsuarioResponseDto = exports.UpdateUsuarioDto = exports.CreateUsuarioDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const user_role_enum_1 = require("../../../domain/entities/user-role.enum");
class CreateUsuarioDto {
    email;
    password;
    nome;
    role;
    clinicaId;
}
exports.CreateUsuarioDto = CreateUsuarioDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'medico@clinica.com' }),
    (0, class_validator_1.IsEmail)({}, { message: 'E-mail inválido' }),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Senha@123', minLength: 8, description: 'Senha temporária — exigir troca no primeiro login' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8, { message: 'Senha deve ter no mínimo 8 caracteres' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Senha muito longa' }),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Dr. João Silva' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "nome", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: user_role_enum_1.UserRole, description: 'Role do usuário no sistema' }),
    (0, class_validator_1.IsEnum)(user_role_enum_1.UserRole, { message: 'Role inválida' }),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'UUID da clínica (opcional para multi-clínica)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'clinicaId deve ser um UUID válido' }),
    __metadata("design:type", String)
], CreateUsuarioDto.prototype, "clinicaId", void 0);
class UpdateUsuarioDto {
    nome;
    role;
    ativo;
}
exports.UpdateUsuarioDto = UpdateUsuarioDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Dr. João Silva' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateUsuarioDto.prototype, "nome", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: user_role_enum_1.UserRole }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(user_role_enum_1.UserRole, { message: 'Role inválida' }),
    __metadata("design:type", String)
], UpdateUsuarioDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Ativar ou desativar conta' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateUsuarioDto.prototype, "ativo", void 0);
class UsuarioResponseDto {
    id;
    email;
    nome;
    role;
    ativo;
    clinicaId;
    createdAt;
    ultimoLogin;
}
exports.UsuarioResponseDto = UsuarioResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UsuarioResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UsuarioResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UsuarioResponseDto.prototype, "nome", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: user_role_enum_1.UserRole }),
    __metadata("design:type", String)
], UsuarioResponseDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], UsuarioResponseDto.prototype, "ativo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], UsuarioResponseDto.prototype, "clinicaId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], UsuarioResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], UsuarioResponseDto.prototype, "ultimoLogin", void 0);
//# sourceMappingURL=usuario.dto.js.map