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
exports.PacienteRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const paciente_entity_1 = require("../../domain/entities/paciente.entity");
let PacienteRepository = class PacienteRepository {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async findById(id) {
        return this.repo.findOne({ where: { id } });
    }
    async findByEmail(email) {
        return this.repo.findOne({ where: { email } });
    }
    async list(clinicaId, filters) {
        const { search, ativo, page = 1, limit = 20, orderBy = 'nome' } = filters;
        const skip = (page - 1) * limit;
        const where = {};
        if (clinicaId)
            where.clinicaId = clinicaId;
        if (ativo !== undefined)
            where.ativo = ativo;
        if (search) {
            where.nome = (0, typeorm_2.ILike)(`%${search}%`);
        }
        const [data, total] = await this.repo.findAndCount({
            where,
            order: { [orderBy]: 'ASC' },
            skip,
            take: limit,
        });
        return { data, total };
    }
    async create(data) {
        const paciente = this.repo.create(data);
        return this.repo.save(paciente);
    }
    async update(id, data) {
        await this.repo.update(id, data);
    }
    async softDelete(id) {
        await this.repo.update(id, { ativo: false });
    }
};
exports.PacienteRepository = PacienteRepository;
exports.PacienteRepository = PacienteRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(paciente_entity_1.Paciente)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PacienteRepository);
//# sourceMappingURL=paciente.repository.js.map