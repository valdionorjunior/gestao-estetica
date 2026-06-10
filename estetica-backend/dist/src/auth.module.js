"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const user_entity_1 = require("./domain/entities/user.entity");
const user_repository_1 = require("./infrastructure/repositories/user.repository");
const auth_service_1 = require("./application/use-cases/auth.service");
const auth_controller_1 = require("./presentation/controllers/auth.controller");
const jwt_strategy_1 = require("./presentation/guards/jwt.strategy");
const jwt_auth_guard_1 = require("./presentation/guards/jwt-auth.guard");
const roles_guard_1 = require("./presentation/guards/roles.guard");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    secret: config.get('JWT_SECRET'),
                    signOptions: { expiresIn: '15m' },
                }),
            }),
        ],
        providers: [user_repository_1.UserRepository, auth_service_1.AuthService, jwt_strategy_1.JwtStrategy, jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard],
        controllers: [auth_controller_1.AuthController],
        exports: [user_repository_1.UserRepository, jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard, jwt_1.JwtModule],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map