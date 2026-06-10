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
exports.ProntuarioRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const prontuario_entity_1 = require("../../domain/entities/prontuario.entity");
const ficha_atendimento_entity_1 = require("../../domain/entities/ficha-atendimento.entity");
let ProntuarioRepository = class ProntuarioRepository {
    prontuarioRepo;
    fichaRepo;
    constructor(prontuarioRepo, fichaRepo) {
        this.prontuarioRepo = prontuarioRepo;
        this.fichaRepo = fichaRepo;
    }
    async findByPacienteId(pacienteId) {
        return this.prontuarioRepo.findOne({
            where: { pacienteId },
            relations: ['paciente'],
        });
    }
    async findById(id) {
        return this.prontuarioRepo.findOne({ where: { id }, relations: ['paciente'] });
    }
    async createProntuario(data) {
        const p = this.prontuarioRepo.create(data);
        return this.prontuarioRepo.save(p);
    }
    async updateProntuario(id, data) {
        await this.prontuarioRepo.update(id, data);
    }
    async listFichas(prontuarioId) {
        return this.fichaRepo.find({
            where: { prontuarioId },
            order: { createdAt: 'DESC' },
        });
    }
    async findFichaById(id) {
        return this.fichaRepo.findOne({ where: { id } });
    }
    async createFicha(data) {
        const f = this.fichaRepo.create(data);
        return this.fichaRepo.save(f);
    }
    async updateFicha(id, data) {
        await this.fichaRepo.update(id, data);
    }
};
exports.ProntuarioRepository = ProntuarioRepository;
exports.ProntuarioRepository = ProntuarioRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(prontuario_entity_1.Prontuario)),
    __param(1, (0, typeorm_1.InjectRepository)(ficha_atendimento_entity_1.FichaAtendimento)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ProntuarioRepository);
//# sourceMappingURL=prontuario.repository.js.map