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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultaInterativaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const consulta_foto_entity_1 = require("../../domain/entities/consulta-foto.entity");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
let ConsultaInterativaService = class ConsultaInterativaService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async criarFoto(dto, arquivo, baseUrl) {
        if (!arquivo) {
            throw new common_1.BadRequestException('Arquivo de imagem é obrigatório');
        }
        const extensoesPermitidas = ['.jpg', '.jpeg', '.png', '.webp'];
        const ext = path.extname(arquivo.originalname).toLowerCase();
        if (!extensoesPermitidas.includes(ext)) {
            throw new common_1.BadRequestException('Formato de imagem inválido. Use JPG, PNG ou WebP');
        }
        const fotoUrl = `${baseUrl}/uploads/${arquivo.filename}`;
        const foto = this.repo.create({
            pacienteId: dto.pacienteId,
            prontuarioId: dto.prontuarioId ?? null,
            profissionalId: dto.profissionalId ?? null,
            tipo: dto.tipo,
            descricao: dto.descricao ?? null,
            fotoUrl,
            dataConsulta: dto.dataConsulta ? new Date(dto.dataConsulta) : null,
            anotacoesJson: null,
        });
        const salva = await this.repo.save(foto);
        return this.toResponse(salva);
    }
    async listarPorPaciente(pacienteId, tipo) {
        const qb = this.repo
            .createQueryBuilder('cf')
            .where('cf.pacienteId = :pacienteId', { pacienteId })
            .orderBy('cf.dataConsulta', 'DESC')
            .addOrderBy('cf.createdAt', 'DESC');
        if (tipo) {
            qb.andWhere('cf.tipo = :tipo', { tipo });
        }
        const fotos = await qb.getMany();
        return fotos.map((f) => this.toResponse(f));
    }
    async buscarPorId(id) {
        const foto = await this.repo.findOne({ where: { id } });
        if (!foto)
            throw new common_1.NotFoundException('Foto de consulta não encontrada');
        return this.toResponse(foto);
    }
    async salvarAnotacoes(id, anotacoes) {
        const foto = await this.repo.findOne({ where: { id } });
        if (!foto)
            throw new common_1.NotFoundException('Foto de consulta não encontrada');
        foto.anotacoesJson = JSON.stringify(anotacoes);
        const atualizada = await this.repo.save(foto);
        return this.toResponse(atualizada);
    }
    async remover(id) {
        const foto = await this.repo.findOne({ where: { id } });
        if (!foto)
            throw new common_1.NotFoundException('Foto de consulta não encontrada');
        const filePath = path.join(process.cwd(), 'uploads', path.basename(foto.fotoUrl));
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        await this.repo.remove(foto);
    }
    toResponse(foto) {
        let anotacoes = [];
        if (foto.anotacoesJson) {
            try {
                anotacoes = JSON.parse(foto.anotacoesJson);
            }
            catch {
                anotacoes = [];
            }
        }
        return {
            id: foto.id,
            pacienteId: foto.pacienteId,
            prontuarioId: foto.prontuarioId,
            tipo: foto.tipo,
            fotoUrl: foto.fotoUrl,
            descricao: foto.descricao,
            anotacoes,
            dataConsulta: foto.dataConsulta
                ? foto.dataConsulta.toISOString().split('T')[0]
                : null,
            createdAt: foto.createdAt,
            updatedAt: foto.updatedAt,
        };
    }
};
exports.ConsultaInterativaService = ConsultaInterativaService;
exports.ConsultaInterativaService = ConsultaInterativaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(consulta_foto_entity_1.ConsultaFoto)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ConsultaInterativaService);
//# sourceMappingURL=consulta-interativa.service.js.map