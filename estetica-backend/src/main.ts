import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './presentation/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Segurança — Helmet com Content Security Policy restritivo
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"], // necessário para Swagger UI
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
      crossOriginEmbedderPolicy: false, // necessário para Swagger UI funcionar
    }),
  );

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3001',
    credentials: true,
  });

  // Prefixo global da API
  app.setGlobalPrefix('api/v1');

  // Filtro global de exceções — resposta padronizada em JSON
  app.useGlobalFilters(new HttpExceptionFilter());

  // Validação global com mensagens em pt-BR
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Swagger / OpenAPI 3.0
  const config = new DocumentBuilder()
    .setTitle('Estética Natalia Salvador — API')
    .setDescription(
      `## API REST — Sistema de Gestão Clínica

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
| 500 | Erro interno do servidor |`,
    )
    .setVersion('1.0.0')
    .setContact('Estética Natalia Salvador', '', 'contato@esteticanataliasalvador.com.br')
    .setLicense('Proprietary', '')
    .addServer(`http://localhost:${process.env.PORT ?? 3000}`, 'Desenvolvimento Local')
    .addServer('https://api.esteticanataliasalvador.com.br', 'Produção')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Insira o accessToken JWT obtido no login',
      },
      'JWT',
    )
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

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
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

