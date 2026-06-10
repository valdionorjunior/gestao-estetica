"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacientesService = void 0;
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
const paciente_repository_1 = require("../../infrastructure/repositories/paciente.repository");
const CIPHER = 'aes-256-gcm';
function encrypt(text, key) {
    const iv = crypto.randomBytes(12);
    const keyBuffer = Buffer.from(key, 'hex');
    const cipher = crypto.createCipheriv(CIPHER, keyBuffer, iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return Buffer.concat([iv, tag, encrypted]).toString('base64');
}
let PacientesService = class PacientesService {
    pacienteRepository;
    encryptKey;
    constructor(pacienteRepository) {
        this.pacienteRepository = pacienteRepository;
        this.encryptKey = process.env.ENCRYPTION_KEY ?? '0'.repeat(64);
    }
    async list(clinicaId, filters) {
        const { data, total } = await this.pacienteRepository.list(clinicaId, filters);
        const { page = 1, limit = 20 } = filters;
        return {
            data: data.map((p) => this.sanitize(p)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        const paciente = await this.pacienteRepository.findById(id);
        if (!paciente)
            throw new common_1.NotFoundException('Paciente não encontrado');
        return paciente;
    }
    async create(dto, clinicaId) {
        const cpfEncrypted = dto.cpf ? encrypt(dto.cpf, this.encryptKey) : null;
        return this.pacienteRepository.create({
            nome: dto.nome,
            cpfEncrypted,
            dataNascimento: dto.dataNascimento ? new Date(dto.dataNascimento) : null,
            telefone: dto.telefone ?? null,
            email: dto.email ?? null,
            endereco: dto.endereco ?? null,
            cidade: dto.cidade ?? null,
            estado: dto.estado ?? null,
            cep: dto.cep ?? null,
            clinicaId,
        });
    }
    async update(id, dto) {
        const existing = await this.findOne(id);
        const cpfEncrypted = dto.cpf ? encrypt(dto.cpf, this.encryptKey) : existing.cpfEncrypted;
        await this.pacienteRepository.update(id, {
            ...(dto.nome && { nome: dto.nome }),
            cpfEncrypted,
            ...(dto.dataNascimento && { dataNascimento: new Date(dto.dataNascimento) }),
            ...(dto.telefone !== undefined && { telefone: dto.telefone }),
            ...(dto.email !== undefined && { email: dto.email }),
            ...(dto.endereco !== undefined && { endereco: dto.endereco }),
            ...(dto.cidade !== undefined && { cidade: dto.cidade }),
            ...(dto.estado !== undefined && { estado: dto.estado }),
            ...(dto.cep !== undefined && { cep: dto.cep }),
        });
        return this.findOne(id);
    }
    async remove(id) {
        await this.findOne(id);
        await this.pacienteRepository.softDelete(id);
    }
    sanitize(p) {
        const { cpfEncrypted, ...rest } = p;
        return { ...rest, cpfMasked: cpfEncrypted ? '***.***.***-**' : null };
    }
};
exports.PacientesService = PacientesService;
exports.PacientesService = PacientesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [paciente_repository_1.PacienteRepository])
], PacientesService);
//# sourceMappingURL=pacientes.service.js.map