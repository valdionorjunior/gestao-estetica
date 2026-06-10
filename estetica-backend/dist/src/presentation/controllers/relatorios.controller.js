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
exports.RelatoriosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_2 = require("@nestjs/swagger");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const roles_guard_1 = require("../guards/roles.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
const current_user_decorator_1 = require("../decorators/current-user.decorator");
const user_role_enum_1 = require("../../domain/entities/user-role.enum");
const agendamento_entity_1 = require("../../domain/entities/agendamento.entity");
const agendamento_status_enum_1 = require("../../domain/entities/agendamento-status.enum");
const conta_financeira_entity_1 = require("../../domain/entities/conta-financeira.entity");
const financeiro_enums_1 = require("../../domain/entities/financeiro.enums");
const paciente_entity_1 = require("../../domain/entities/paciente.entity");
class RelatorioFiltroDto {
    dataInicio;
    dataFim;
}
__decorate([
    (0, swagger_2.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], RelatorioFiltroDto.prototype, "dataInicio", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], RelatorioFiltroDto.prototype, "dataFim", void 0);
let RelatoriosController = class RelatoriosController {
    agendamentos;
    contas;
    pacientes;
    constructor(agendamentos, contas, pacientes) {
        this.agendamentos = agendamentos;
        this.contas = contas;
        this.pacientes = pacientes;
    }
    async agenda(filters, user) {
        const qb = this.agendamentos
            .createQueryBuilder('a')
            .select([
            "TO_CHAR(a.dataHoraInicio, 'YYYY-MM-DD') AS data",
            'COUNT(*) AS total',
            `SUM(CASE WHEN a.status = '${agendamento_status_enum_1.AgendamentoStatus.CONCLUIDO}' THEN 1 ELSE 0 END) AS concluidos`,
            `SUM(CASE WHEN a.status = '${agendamento_status_enum_1.AgendamentoStatus.CANCELADO}' THEN 1 ELSE 0 END) AS cancelados`,
        ])
            .groupBy('data')
            .orderBy('data', 'ASC');
        if (user.clinicaId)
            qb.andWhere('a.clinicaId = :c', { c: user.clinicaId });
        if (filters.dataInicio)
            qb.andWhere('a.dataHoraInicio >= :di', { di: filters.dataInicio });
        if (filters.dataFim)
            qb.andWhere('a.dataHoraInicio <= :df', { df: filters.dataFim });
        const rows = await qb.getRawMany();
        return rows.map(r => ({
            data: r.data,
            total: parseInt(r.total, 10),
            concluidos: parseInt(r.concluidos, 10),
            cancelados: parseInt(r.cancelados, 10),
        }));
    }
    async financeiro(filters, user) {
        const qb = this.contas
            .createQueryBuilder('c')
            .select([
            "TO_CHAR(c.dataVencimento, 'YYYY-MM') AS mes",
            `SUM(CASE WHEN c.tipo = '${financeiro_enums_1.ContaTipo.RECEITA}' AND c.status = '${financeiro_enums_1.ContaStatus.PAGO}' THEN c.valor ELSE 0 END) AS totalReceitas`,
            `SUM(CASE WHEN c.tipo = '${financeiro_enums_1.ContaTipo.DESPESA}' AND c.status = '${financeiro_enums_1.ContaStatus.PAGO}' THEN c.valor ELSE 0 END) AS totalDespesas`,
        ])
            .groupBy('mes')
            .orderBy('mes', 'ASC');
        if (user.clinicaId)
            qb.andWhere('c.clinicaId = :c', { c: user.clinicaId });
        if (filters.dataInicio)
            qb.andWhere('c.dataVencimento >= :di', { di: filters.dataInicio });
        if (filters.dataFim)
            qb.andWhere('c.dataVencimento <= :df', { df: filters.dataFim });
        const rows = await qb.getRawMany();
        return rows.map(r => {
            const totalReceitas = parseFloat(r.totalreceitas || 0);
            const totalDespesas = parseFloat(r.totaldespesas || 0);
            return {
                mes: r.mes,
                totalReceitas,
                totalDespesas,
                saldo: totalReceitas - totalDespesas,
            };
        });
    }
    async novosPacientes(filters, user) {
        const qb = this.pacientes
            .createQueryBuilder('p')
            .select(["TO_CHAR(p.createdAt, 'YYYY-MM') AS mes", 'COUNT(*) AS total'])
            .groupBy('mes')
            .orderBy('mes', 'ASC');
        if (user.clinicaId)
            qb.andWhere('p.clinicaId = :c', { c: user.clinicaId });
        if (filters.dataInicio)
            qb.andWhere('p.createdAt >= :di', { di: filters.dataInicio });
        if (filters.dataFim)
            qb.andWhere('p.createdAt <= :df', { df: filters.dataFim });
        const rows = await qb.getRawMany();
        return rows.map(r => ({
            mes: r.mes,
            total: parseInt(r.total, 10),
        }));
    }
};
exports.RelatoriosController = RelatoriosController;
__decorate([
    (0, common_1.Get)('agenda'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Relatório de agendamentos por período' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Array de { data, total, concluidos, cancelados }' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Não autenticado' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Sem permissão (apenas ADMIN)' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RelatorioFiltroDto, Object]),
    __metadata("design:returntype", Promise)
], RelatoriosController.prototype, "agenda", null);
__decorate([
    (0, common_1.Get)('financeiro'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Relatório financeiro por período (agrupado por mês)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Array de { mes, totalReceitas, totalDespesas, saldo }' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Não autenticado' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Sem permissão (apenas ADMIN)' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RelatorioFiltroDto, Object]),
    __metadata("design:returntype", Promise)
], RelatoriosController.prototype, "financeiro", null);
__decorate([
    (0, common_1.Get)('pacientes/novos'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Novos pacientes cadastrados por mês' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Array de { mes, total }' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Não autenticado' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Sem permissão (apenas ADMIN)' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RelatorioFiltroDto, Object]),
    __metadata("design:returntype", Promise)
], RelatoriosController.prototype, "novosPacientes", null);
exports.RelatoriosController = RelatoriosController = __decorate([
    (0, swagger_1.ApiTags)('Relatórios'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('relatorios'),
    __param(0, (0, typeorm_1.InjectRepository)(agendamento_entity_1.Agendamento)),
    __param(1, (0, typeorm_1.InjectRepository)(conta_financeira_entity_1.ContaFinanceira)),
    __param(2, (0, typeorm_1.InjectRepository)(paciente_entity_1.Paciente)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], RelatoriosController);
//# sourceMappingURL=relatorios.controller.js.map