"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = __importDefault(require("helmet"));
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./presentation/filters/http-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", 'data:', 'https:'],
                connectSrc: ["'self'"],
                fontSrc: ["'self'"],
                objectSrc: ["'none'"],
                upgradeInsecureRequests: [],
            },
        },
        crossOriginEmbedderPolicy: false,
    }));
    app.enableCors({
        origin: process.env.FRONTEND_URL ?? 'http://localhost:3001',
        credentials: true,
    });
    app.setGlobalPrefix('api/v1');
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Estética Natalia Salvador — API')
        .setDescription(`## API REST — Sistema de Gestão Clínica

Sistema de gestão completo para a clínica **Estética Natalia Salvador**.

### Autenticação
Todas as rotas protegidas exigem um **Bearer Token JWT** no header:
\`\`\`
Authorization: Bearer <access_token>
\`\`\`

### Fluxo de autenticação
1. \`POST /auth/register\` — Criar conta

2. \`POST /auth/login\` — Obter \`accessToken\` e \`refreshToken\`

3. \`POST /auth/refresh\` — Renovar \`accessToken\` com o \`refreshToken\`

4. \`POST /auth/logout\` — Invalidar sessão

### Roles disponíveis
| Role | Acesso |
|------|--------|
| \`ADMIN\` | Acesso total |
| \`MEDICO\` | Agenda, prontuário, relatórios |
| \`RECEPCIONISTA\` | Agenda, pacientes |
| \`PACIENTE\` | Acesso ao próprio histórico |

### Respostas de erro padrão
| Código | Descrição |
|--------|-----------|
| 400 | Dados inválidos ou validação falhou |
| 401 | Não autenticado (token ausente ou expirado) |
| 403 | Sem permissão (role insuficiente) |
| 404 | Recurso não encontrado |
| 409 | Conflito (ex: e-mail já cadastrado) |
| 429 | Rate limit excedido |
| 500 | Erro interno do servidor |`)
        .setVersion('1.0.0')
        .setContact('Estética Natalia Salvador', '', 'contato@esteticanataliasalvador.com.br')
        .setLicense('Proprietary', '')
        .addServer(`http://localhost:${process.env.PORT ?? 3000}`, 'Desenvolvimento Local')
        .addServer('https://api.esteticanataliasalvador.com.br', 'Produção')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Insira o accessToken JWT obtido no login',
    }, 'JWT')
        .addTag('Autenticação', 'Registro, login, refresh token e logout')
        .addTag('Usuários', 'Gestão de usuários do sistema — apenas ADMIN')
        .addTag('Pacientes', 'Gestão completa de pacientes da clínica')
        .addTag('Agenda', 'Agendamentos, calendário e controle de status')
        .addTag('Prontuário', 'Prontuário eletrônico e fichas de atendimento')
        .addTag('Financeiro', 'Contas a pagar/receber e dashboard financeiro')
        .addTag('Estoque', 'Produtos, movimentações e alertas de estoque')
        .addTag('Relatórios', 'Relatórios gerenciais por período')
        .addTag('Marketing', 'Comunicações via Email, SMS e WhatsApp — lembretes e campanhas')
        .addTag('LGPD', 'Conformidade com a Lei Geral de Proteção de Dados (Lei 13.709/2018)')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
            tagsSorter: 'alpha',
            operationsSorter: 'method',
            docExpansion: 'none',
            filter: true,
            showRequestDuration: true,
        },
        customSiteTitle: 'Estética NS — API Docs',
        customfavIcon: '/favicon.ico',
        customCss: `
      .swagger-ui .topbar { background-color: #1A1A1A; }
      .swagger-ui .topbar-wrapper img { content: url('data:image/svg+xml,<svg/>'); width: 0; }
      .swagger-ui .topbar-wrapper::after { content: "Estética Natalia Salvador"; color: #D4AF37; font-size: 1.2rem; font-weight: bold; }
      .swagger-ui .info h2.title { color: #1A1A1A; }
    `,
    });
    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    console.log(`🚀 Backend rodando em http://localhost:${port}`);
    console.log(`📖 Swagger em http://localhost:${port}/api/docs`);
    console.log(`📄 OpenAPI JSON em http://localhost:${port}/api/docs-json`);
}
bootstrap();
//# sourceMappingURL=main.js.map