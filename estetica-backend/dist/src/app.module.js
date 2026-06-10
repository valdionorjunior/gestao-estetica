"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const throttler_1 = require("@nestjs/throttler");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth.module");
const pacientes_module_1 = require("./pacientes.module");
const agenda_module_1 = require("./agenda.module");
const prontuario_module_1 = require("./prontuario.module");
const financeiro_module_1 = require("./financeiro.module");
const estoque_module_1 = require("./estoque.module");
const relatorios_module_1 = require("./relatorios.module");
const lgpd_module_1 = require("./lgpd.module");
const usuarios_module_1 = require("./usuarios.module");
const marketing_module_1 = require("./marketing.module");
const consulta_interativa_module_1 = require("./consulta-interativa.module");
const videos_clinico_module_1 = require("./videos-clinico.module");
const chat_module_1 = require("./chat.module");
const integracoes_module_1 = require("./integracoes.module");
const ia_prontuario_module_1 = require("./ia-prontuario.module");
const telemedicina_module_1 = require("./telemedicina.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(process.cwd(), 'uploads'),
                serveRoot: '/uploads',
                serveStaticOptions: { index: false },
            }),
            throttler_1.ThrottlerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => [
                    {
                        ttl: config.get('THROTTLE_TTL', 60000),
                        limit: config.get('THROTTLE_LIMIT', 100),
                    },
                ],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    type: 'postgres',
                    host: config.get('DB_HOST', 'localhost'),
                    port: config.get('DB_PORT', 5432),
                    database: config.get('DB_NAME', 'estetica_ns'),
                    username: config.get('DB_USER', 'estetica_user'),
                    password: config.get('DB_PASSWORD', 'estetica_pass'),
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    synchronize: false,
                    logging: config.get('NODE_ENV') === 'development',
                }),
            }),
            auth_module_1.AuthModule,
            pacientes_module_1.PacientesModule,
            agenda_module_1.AgendaModule,
            prontuario_module_1.ProntuarioModule,
            financeiro_module_1.FinanceiroModule,
            estoque_module_1.EstoqueModule,
            relatorios_module_1.RelatoriosModule,
            lgpd_module_1.LgpdModule,
            usuarios_module_1.UsuariosModule,
            marketing_module_1.MarketingModule,
            consulta_interativa_module_1.ConsultaInterativaModule,
            videos_clinico_module_1.VideosClinicoModule,
            chat_module_1.ChatModule,
            integracoes_module_1.IntegracoesModule,
            ia_prontuario_module_1.IaProntuarioModule,
            telemedicina_module_1.TelemediicinaModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map