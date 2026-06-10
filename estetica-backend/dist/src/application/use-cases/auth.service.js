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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcrypt"));
const user_repository_1 = require("../../infrastructure/repositories/user.repository");
const user_role_enum_1 = require("../../domain/entities/user-role.enum");
const BCRYPT_ROUNDS = 12;
let AuthService = class AuthService {
    userRepository;
    jwtService;
    config;
    constructor(userRepository, jwtService, config) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.config = config;
    }
    async register(dto) {
        const existing = await this.userRepository.findByEmail(dto.email);
        if (existing) {
            throw new common_1.ConflictException('E-mail já cadastrado');
        }
        const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
        const user = await this.userRepository.create({
            email: dto.email,
            passwordHash,
            nome: dto.nome,
            role: dto.role ?? user_role_enum_1.UserRole.RECEPCIONISTA,
            clinicaId: dto.clinicaId ?? undefined,
        });
        return this.buildTokens(user.id, user.email, user.role, user.clinicaId);
    }
    async login(dto) {
        const user = await this.userRepository.findByEmail(dto.email);
        if (!user || !user.ativo) {
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        }
        const valid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!valid) {
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        }
        await this.userRepository.updateUltimoLogin(user.id);
        return this.buildTokens(user.id, user.email, user.role, user.clinicaId);
    }
    async refresh(userId, rawToken) {
        const user = await this.userRepository.findById(userId);
        if (!user || !user.ativo || !user.refreshTokenHash) {
            throw new common_1.UnauthorizedException('Refresh token inválido');
        }
        const valid = await bcrypt.compare(rawToken, user.refreshTokenHash);
        if (!valid) {
            await this.userRepository.updateRefreshToken(user.id, null);
            throw new common_1.UnauthorizedException('Refresh token inválido ou reutilizado');
        }
        return this.buildTokens(user.id, user.email, user.role, user.clinicaId);
    }
    async logout(userId) {
        await this.userRepository.updateRefreshToken(userId, null);
    }
    async buildTokens(userId, email, role, clinicaId) {
        const payload = { sub: userId, email, role, clinicaId };
        const accessToken = this.jwtService.sign(payload, {
            secret: this.config.get('JWT_SECRET'),
            expiresIn: '15m',
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.config.get('JWT_REFRESH_SECRET'),
            expiresIn: '7d',
        });
        const refreshTokenHash = await bcrypt.hash(refreshToken, BCRYPT_ROUNDS);
        await this.userRepository.updateRefreshToken(userId, refreshTokenHash);
        const user = await this.userRepository.findById(userId);
        return {
            accessToken,
            refreshToken,
            user: {
                id: userId,
                email,
                nome: user?.nome ?? '',
                role,
                clinicaId,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map