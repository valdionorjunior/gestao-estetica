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
exports.ProntuarioService = void 0;
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
const prontuario_repository_1 = require("../../infrastructure/repositories/prontuario.repository");
const ficha_atendimento_entity_1 = require("../../domain/entities/ficha-atendimento.entity");
const CIPHER = 'aes-256-gcm';
function encrypt(text, key) {
    const iv = crypto.randomBytes(12);
    const keyBuffer = Buffer.from(key, 'hex');
    const cipher = crypto.createCipheriv(CIPHER, keyBuffer, iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return Buffer.concat([iv, tag, encrypted]).toString('base64');
}
function decrypt(encoded, key) {
    try {
        const buf = Buffer.from(encoded, 'base64');
        const iv = buf.subarray(0, 12);
        const tag = buf.subarray(12, 28);
        const content = buf.subarray(28);
        const keyBuffer = Buffer.from(key, 'hex');
        const decipher = crypto.createDecipheriv(CIPHER, keyBuffer, iv);
        decipher.setAuthTag(tag);
        return Buffer.concat([decipher.update(content), decipher.final()]).toString('utf8');
    }
    catch {
        return '';
    }
}
let ProntuarioService = class ProntuarioService {
    prontuarioRepository;
    encryptKey;
    constructor(prontuarioRepository) {
        this.prontuarioRepository = prontuarioRepository;
        this.encryptKey = process.env.ENCRYPTION_KEY ?? '0'.repeat(64);
    }
    async getOrCreateByPacienteId(pacienteId, clinicaId) {
        let prontuario = await this.prontuarioRepository.findByPacienteId(pacienteId);
        if (!prontuario) {
            prontuario = await this.prontuarioRepository.createProntuario({ pacienteId, clinicaId });
        }
        return this.decryptProntuario(prontuario);
    }
    async update(pacienteId, dto, clinicaId) {
        let prontuario = await this.prontuarioRepository.findByPacienteId(pacienteId);
        if (!prontuario) {
            prontuario = await this.prontuarioRepository.createProntuario({ pacienteId, clinicaId });
        }
        const updateData = {};
        if (dto.historicoMedico !== undefined)
            updateData.historicoMedicoEncrypted = dto.historicoMedico
                ? encrypt(dto.historicoMedico, this.encryptKey)
                : null;
        if (dto.alergias !== undefined)
            updateData.alergiasEncrypted = dto.alergias
                ? encrypt(dto.alergias, this.encryptKey)
                : null;
        if (dto.medicamentosUso !== undefined)
            updateData.medicamentosUsoEncrypted = dto.medicamentosUso
                ? encrypt(dto.medicamentosUso, this.encryptKey)
                : null;
        if (dto.observacoes !== undefined)
            updateData.observacoes = dto.observacoes;
        await this.prontuarioRepository.updateProntuario(prontuario.id, updateData);
        const updated = await this.prontuarioRepository.findByPacienteId(pacienteId);
        return this.decryptProntuario(updated);
    }
    async listFichas(pacienteId) {
        const prontuario = await this.prontuarioRepository.findByPacienteId(pacienteId);
        if (!prontuario)
            return [];
        return this.prontuarioRepository.listFichas(prontuario.id);
    }
    async createFicha(pacienteId, dto, profissionalId, clinicaId) {
        let prontuario = await this.prontuarioRepository.findByPacienteId(pacienteId);
        if (!prontuario) {
            prontuario = await this.prontuarioRepository.createProntuario({ pacienteId, clinicaId });
        }
        const conteudoEncrypted = dto.conteudo
            ? encrypt(dto.conteudo, this.encryptKey)
            : null;
        return this.prontuarioRepository.createFicha({
            prontuarioId: prontuario.id,
            titulo: dto.titulo,
            conteudoEncrypted,
            agendamentoId: dto.agendamentoId ?? null,
            profissionalId,
        });
    }
    async updateFicha(fichaId, dto, profissionalId) {
        const ficha = await this.prontuarioRepository.findFichaById(fichaId);
        if (!ficha)
            throw new common_1.NotFoundException('Ficha não encontrada');
        if (ficha.status === ficha_atendimento_entity_1.FichaStatus.FECHADA) {
            throw new common_1.ForbiddenException('Ficha fechada não pode ser editada');
        }
        const updateData = {};
        if (dto.titulo)
            updateData.titulo = dto.titulo;
        if (dto.conteudo !== undefined)
            updateData.conteudoEncrypted = dto.conteudo
                ? encrypt(dto.conteudo, this.encryptKey)
                : null;
        if (dto.status) {
            updateData.status = dto.status;
            if (dto.status === ficha_atendimento_entity_1.FichaStatus.FECHADA)
                updateData.fechadaEm = new Date();
        }
        await this.prontuarioRepository.updateFicha(fichaId, updateData);
        return this.prontuarioRepository.findFichaById(fichaId);
    }
    decryptProntuario(p) {
        return {
            ...p,
            historicoMedico: p.historicoMedicoEncrypted
                ? decrypt(p.historicoMedicoEncrypted, this.encryptKey)
                : null,
            alergias: p.alergiasEncrypted
                ? decrypt(p.alergiasEncrypted, this.encryptKey)
                : null,
            medicamentosUso: p.medicamentosUsoEncrypted
                ? decrypt(p.medicamentosUsoEncrypted, this.encryptKey)
                : null,
            historicoMedicoEncrypted: undefined,
            alergiasEncrypted: undefined,
            medicamentosUsoEncrypted: undefined,
        };
    }
};
exports.ProntuarioService = ProntuarioService;
exports.ProntuarioService = ProntuarioService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prontuario_repository_1.ProntuarioRepository])
], ProntuarioService);
//# sourceMappingURL=prontuario.service.js.map