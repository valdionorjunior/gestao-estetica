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
exports.AgendaService = void 0;
const common_1 = require("@nestjs/common");
const agenda_repository_1 = require("../../infrastructure/repositories/agenda.repository");
const agendamento_status_enum_1 = require("../../domain/entities/agendamento-status.enum");
let AgendaService = class AgendaService {
    agendaRepository;
    constructor(agendaRepository) {
        this.agendaRepository = agendaRepository;
    }
    async list(clinicaId, filters) {
        const { data, total } = await this.agendaRepository.list(clinicaId, filters);
        const { page = 1, limit = 50 } = filters;
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findOne(id) {
        const agendamento = await this.agendaRepository.findById(id);
        if (!agendamento)
            throw new common_1.NotFoundException('Agendamento não encontrado');
        return agendamento;
    }
    async create(dto, clinicaId) {
        const inicio = new Date(dto.dataHoraInicio);
        const fim = new Date(dto.dataHoraFim);
        if (fim <= inicio) {
            throw new common_1.BadRequestException('Data/hora de fim deve ser posterior ao início');
        }
        const conflitos = await this.agendaRepository.findConflicts(dto.profissionalId, inicio, fim);
        if (conflitos.length > 0) {
            throw new common_1.ConflictException('Profissional já possui agendamento neste horário');
        }
        return this.agendaRepository.create({
            pacienteId: dto.pacienteId,
            profissionalId: dto.profissionalId,
            procedimentoId: dto.procedimentoId ?? null,
            dataHoraInicio: inicio,
            dataHoraFim: fim,
            observacoes: dto.observacoes ?? null,
            valor: dto.valor ?? null,
            clinicaId,
            status: agendamento_status_enum_1.AgendamentoStatus.AGENDADO,
        });
    }
    async update(id, dto) {
        const existing = await this.findOne(id);
        if (dto.dataHoraInicio || dto.dataHoraFim) {
            const inicio = dto.dataHoraInicio ? new Date(dto.dataHoraInicio) : existing.dataHoraInicio;
            const fim = dto.dataHoraFim ? new Date(dto.dataHoraFim) : existing.dataHoraFim;
            if (fim <= inicio) {
                throw new common_1.BadRequestException('Data/hora de fim deve ser posterior ao início');
            }
            const profissionalId = dto.profissionalId ?? existing.profissionalId;
            const conflitos = await this.agendaRepository.findConflicts(profissionalId, inicio, fim, id);
            if (conflitos.length > 0) {
                throw new common_1.ConflictException('Profissional já possui agendamento neste horário');
            }
        }
        await this.agendaRepository.update(id, {
            ...(dto.pacienteId && { pacienteId: dto.pacienteId }),
            ...(dto.profissionalId && { profissionalId: dto.profissionalId }),
            ...(dto.procedimentoId !== undefined && { procedimentoId: dto.procedimentoId }),
            ...(dto.dataHoraInicio && { dataHoraInicio: new Date(dto.dataHoraInicio) }),
            ...(dto.dataHoraFim && { dataHoraFim: new Date(dto.dataHoraFim) }),
            ...(dto.observacoes !== undefined && { observacoes: dto.observacoes }),
            ...(dto.valor !== undefined && { valor: dto.valor }),
        });
        return this.findOne(id);
    }
    async updateStatus(id, dto) {
        await this.findOne(id);
        const now = new Date();
        const update = { status: dto.status };
        if (dto.status === agendamento_status_enum_1.AgendamentoStatus.CONFIRMADO)
            update.confirmadoEm = now;
        if (dto.status === agendamento_status_enum_1.AgendamentoStatus.CANCELADO) {
            update.canceladoEm = now;
            update.motivoCancelamento = dto.motivoCancelamento ?? null;
        }
        await this.agendaRepository.update(id, update);
        return this.findOne(id);
    }
    async cancel(id, motivo) {
        return this.updateStatus(id, {
            status: agendamento_status_enum_1.AgendamentoStatus.CANCELADO,
            motivoCancelamento: motivo,
        });
    }
};
exports.AgendaService = AgendaService;
exports.AgendaService = AgendaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [agenda_repository_1.AgendaRepository])
], AgendaService);
//# sourceMappingURL=agenda.service.js.map