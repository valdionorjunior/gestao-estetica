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
exports.UsuariosService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../domain/entities/user.entity");
const BCRYPT_ROUNDS = 12;
let UsuariosService = class UsuariosService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async listar(params) {
        const { page, limit, busca } = params;
        const where = busca
            ? [{ nome: (0, typeorm_2.ILike)(`%${busca}%`) }, { email: (0, typeorm_2.ILike)(`%${busca}%`) }]
            : {};
        const [users, total] = await this.repo.findAndCount({
            where,
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return {
            data: users.map(this.toResponse),
            total,
            page,
            limit,
        };
    }
    async buscarPorId(id) {
        const user = await this.repo.findOne({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('Usuário não encontrado');
        return this.toResponse(user);
    }
    async criar(dto) {
        const existente = await this.repo.findOne({ where: { email: dto.email } });
        if (existente)
            throw new common_1.ConflictException('E-mail já cadastrado');
        const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
        const user = this.repo.create({
            email: dto.email,
            passwordHash,
            nome: dto.nome,
            role: dto.role,
            clinicaId: dto.clinicaId ?? undefined,
            ativo: true,
        });
        const saved = await this.repo.save(user);
        return this.toResponse(saved);
    }
    async atualizar(id, dto) {
        const user = await this.repo.findOne({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('Usuário não encontrado');
        if (dto.nome !== undefined)
            user.nome = dto.nome;
        if (dto.role !== undefined)
            user.role = dto.role;
        if (dto.ativo !== undefined)
            user.ativo = dto.ativo;
        const saved = await this.repo.save(user);
        return this.toResponse(saved);
    }
    async desativar(id) {
        const user = await this.repo.findOne({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('Usuário não encontrado');
        await this.repo.update(id, { ativo: false });
    }
    toResponse(user) {
        return {
            id: user.id,
            email: user.email,
            nome: user.nome,
            role: user.role,
            ativo: user.ativo,
            clinicaId: user.clinicaId,
            createdAt: user.createdAt,
            ultimoLogin: user.ultimoLogin,
        };
    }
};
exports.UsuariosService = UsuariosService;
exports.UsuariosService = UsuariosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsuariosService);
//# sourceMappingURL=usuarios.service.js.map