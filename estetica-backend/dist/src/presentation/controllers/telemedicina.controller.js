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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelemediicinaController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_2 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const roles_guard_1 = require("../guards/roles.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
const current_user_decorator_1 = require("../decorators/current-user.decorator");
const user_role_enum_1 = require("../../domain/entities/user-role.enum");
const telemedicina_service_1 = require("../../application/use-cases/telemedicina.service");
const sessao_telemedicina_entity_1 = require("../../domain/entities/sessao-telemedicina.entity");
class CriarSessaoDto {
    pacienteId;
    pacienteNome;
    pacienteEmail;
    pacienteTelefone;
    profissionalId;
    profissionalNome;
    agendamentoId;
    agendadoPara;
    observacoes;
}
__decorate([
    (0, swagger_2.ApiProperty)(),
    (0, class_validator_1.IsUUID)('4', { message: 'pacienteId deve ser UUID válido' }),
    __metadata("design:type", String)
], CriarSessaoDto.prototype, "pacienteId", void 0);
__decorate([
    (0, swagger_2.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CriarSessaoDto.prototype, "pacienteNome", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: 'E-mail do paciente inválido' }),
    __metadata("design:type", String)
], CriarSessaoDto.prototype, "pacienteEmail", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(30),
    __metadata("design:type", String)
], CriarSessaoDto.prototype, "pacienteTelefone", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], CriarSessaoDto.prototype, "profissionalId", void 0);
__decorate([
    (0, swagger_2.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CriarSessaoDto.prototype, "profissionalNome", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], CriarSessaoDto.prototype, "agendamentoId", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ description: 'ISO 8601 — ex: 2024-05-20T14:30:00Z' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'agendadoPara deve ser data ISO 8601 válida' }),
    __metadata("design:type", String)
], CriarSessaoDto.prototype, "agendadoPara", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], CriarSessaoDto.prototype, "observacoes", void 0);
class AdicionarArquivoDto {
    nome;
    url;
    tipo;
    tamanho;
}
__decorate([
    (0, swagger_2.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(300),
    __metadata("design:type", String)
], AdicionarArquivoDto.prototype, "nome", void 0);
__decorate([
    (0, swagger_2.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], AdicionarArquivoDto.prototype, "url", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ example: 'application/pdf' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdicionarArquivoDto.prototype, "tipo", void 0);
__decorate([
    (0, swagger_2.ApiProperty)(),
    __metadata("design:type", Number)
], AdicionarArquivoDto.prototype, "tamanho", void 0);
let TelemediicinaController = class TelemediicinaController {
    service;
    constructor(service) {
        this.service = service;
    }
    statusConfig() {
        return this.service.statusConfig();
    }
    async estatisticas() {
        return this.service.estatisticas();
    }
    async criar(dto) {
        return this.service.criar({
            pacienteId: dto.pacienteId,
            pacienteNome: dto.pacienteNome,
            pacienteEmail: dto.pacienteEmail,
            pacienteTelefone: dto.pacienteTelefone,
            profissionalId: dto.profissionalId,
            profissionalNome: dto.profissionalNome,
            agendamentoId: dto.agendamentoId,
            agendadoPara: dto.agendadoPara ? new Date(dto.agendadoPara) : undefined,
            observacoes: dto.observacoes,
        });
    }
    async listar(pacienteId, profissionalId, status, page) {
        return this.service.listar({
            pacienteId,
            profissionalId,
            status,
            page: page ? Number(page) : 1,
        });
    }
    async minhas(user, status, page) {
        return this.service.listar({
            profissionalId: user.sub,
            status,
            page: page ? Number(page) : 1,
        });
    }
    async buscar(id) {
        return this.service.buscarPorId(id);
    }
    async iniciar(id) {
        return this.service.iniciar(id);
    }
    async encerrar(id) {
        return this.service.encerrar(id);
    }
    async cancelar(id) {
        return this.service.cancelar(id);
    }
    async adicionarArquivo(id, dto) {
        return this.service.adicionarArquivo(id, {
            nome: dto.nome,
            url: dto.url,
            tipo: dto.tipo,
            tamanho: dto.tamanho,
        });
    }
    statusOpcoes() {
        return Object.values(sessao_telemedicina_entity_1.SessaoStatus);
    }
};
exports.TelemediicinaController = TelemediicinaController;
__decorate([
    (0, common_1.Get)('status'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.MEDICO, user_role_enum_1.UserRole.RECEPCIONISTA),
    (0, swagger_1.ApiOperation)({ summary: 'Status da plataforma de videoconferência configurada' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TelemediicinaController.prototype, "statusConfig", null);
__decorate([
    (0, common_1.Get)('estatisticas'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.MEDICO),
    (0, swagger_1.ApiOperation)({ summary: 'Estatísticas das sessões de telemedicina' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TelemediicinaController.prototype, "estatisticas", null);
__decorate([
    (0, common_1.Post)('sessoes'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.MEDICO, user_role_enum_1.UserRole.RECEPCIONISTA),
    (0, swagger_1.ApiOperation)({ summary: 'Criar nova sessão de telemedicina' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CriarSessaoDto]),
    __metadata("design:returntype", Promise)
], TelemediicinaController.prototype, "criar", null);
__decorate([
    (0, common_1.Get)('sessoes'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.MEDICO, user_role_enum_1.UserRole.RECEPCIONISTA),
    (0, swagger_1.ApiOperation)({ summary: 'Listar sessões de telemedicina' }),
    (0, swagger_1.ApiQuery)({ name: 'pacienteId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'profissionalId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: sessao_telemedicina_entity_1.SessaoStatus }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false }),
    __param(0, (0, common_1.Query)('pacienteId')),
    __param(1, (0, common_1.Query)('profissionalId')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], TelemediicinaController.prototype, "listar", null);
__decorate([
    (0, common_1.Get)('sessoes/minhas'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.MEDICO, user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Listar sessões do profissional logado' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], TelemediicinaController.prototype, "minhas", null);
__decorate([
    (0, common_1.Get)('sessoes/:id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.MEDICO, user_role_enum_1.UserRole.RECEPCIONISTA),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar sessão por ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TelemediicinaController.prototype, "buscar", null);
__decorate([
    (0, common_1.Post)('sessoes/:id/iniciar'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.MEDICO),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Iniciar sessão de telemedicina' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TelemediicinaController.prototype, "iniciar", null);
__decorate([
    (0, common_1.Post)('sessoes/:id/encerrar'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.MEDICO),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Encerrar sessão de telemedicina' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TelemediicinaController.prototype, "encerrar", null);
__decorate([
    (0, common_1.Post)('sessoes/:id/cancelar'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.MEDICO, user_role_enum_1.UserRole.RECEPCIONISTA),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Cancelar sessão de telemedicina' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TelemediicinaController.prototype, "cancelar", null);
__decorate([
    (0, common_1.Post)('sessoes/:id/arquivo'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.MEDICO, user_role_enum_1.UserRole.RECEPCIONISTA),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar arquivo compartilhado durante a sessão' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, AdicionarArquivoDto]),
    __metadata("design:returntype", Promise)
], TelemediicinaController.prototype, "adicionarArquivo", null);
__decorate([
    (0, common_1.Get)('status-opcoes'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.MEDICO, user_role_enum_1.UserRole.RECEPCIONISTA),
    (0, swagger_1.ApiOperation)({ summary: 'Opções de status para filtros' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TelemediicinaController.prototype, "statusOpcoes", null);
exports.TelemediicinaController = TelemediicinaController = __decorate([
    (0, swagger_1.ApiTags)('Telemedicina'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('telemedicina'),
    __metadata("design:paramtypes", [telemedicina_service_1.TelemedicinavService])
], TelemediicinaController);
//# sourceMappingURL=telemedicina.controller.js.map