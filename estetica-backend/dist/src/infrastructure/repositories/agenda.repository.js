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
exports.AgendaRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const agendamento_entity_1 = require("../../domain/entities/agendamento.entity");
const agendamento_status_enum_1 = require("../../domain/entities/agendamento-status.enum");
let AgendaRepository = class AgendaRepository {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async findById(id) {
        return this.repo.findOne({ where: { id }, relations: ['paciente'] });
    }
    async list(clinicaId, filters) {
        const { data, dataInicio, dataFim, profissionalId, pacienteId, status, page = 1, limit = 50 } = filters;
        const skip = (page - 1) * limit;
        const qb = this.repo
            .createQueryBuilder('a')
            .leftJoinAndSelect('a.paciente', 'paciente')
            .orderBy('a.dataHoraInicio', 'ASC')
            .skip(skip)
            .take(limit);
        if (clinicaId)
            qb.andWhere('a.clinicaId = :clinicaId', { clinicaId });
        if (profissionalId)
            qb.andWhere('a.profissionalId = :profissionalId', { profissionalId });
        if (pacienteId)
            qb.andWhere('a.pacienteId = :pacienteId', { pacienteId });
        if (status)
            qb.andWhere('a.status = :status', { status });
        if (data) {
            const start = new Date(`${data}T00:00:00.000Z`);
            const end = new Date(`${data}T23:59:59.999Z`);
            qb.andWhere('a.dataHoraInicio BETWEEN :start AND :end', { start, end });
        }
        else if (dataInicio && dataFim) {
            qb.andWhere('a.dataHoraInicio BETWEEN :dataInicio AND :dataFim', { dataInicio, dataFim });
        }
        const [result, total] = await qb.getManyAndCount();
        return { data: result, total };
    }
    async create(data) {
        const agendamento = this.repo.create(data);
        return this.repo.save(agendamento);
    }
    async update(id, data) {
        await this.repo.update(id, data);
    }
    async findConflicts(profissionalId, dataHoraInicio, dataHoraFim, excludeId) {
        const qb = this.repo
            .createQueryBuilder('a')
            .where('a.profissionalId = :profissionalId', { profissionalId })
            .andWhere('a.status NOT IN (:...cancelados)', {
            cancelados: [agendamento_status_enum_1.AgendamentoStatus.CANCELADO, agendamento_status_enum_1.AgendamentoStatus.FALTA],
        })
            .andWhere('a.dataHoraInicio < :fim AND a.dataHoraFim > :inicio', {
            inicio: dataHoraInicio,
            fim: dataHoraFim,
        });
        if (excludeId) {
            qb.andWhere('a.id != :excludeId', { excludeId });
        }
        return qb.getMany();
    }
};
exports.AgendaRepository = AgendaRepository;
exports.AgendaRepository = AgendaRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(agendamento_entity_1.Agendamento)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AgendaRepository);
//# sourceMappingURL=agenda.repository.js.map