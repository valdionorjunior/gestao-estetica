# Estética Natalia Salvador — Sistema de Gestão de Clínica

Sistema completo de gestão para a clínica de estética **Natalia Salvador**, com módulos de agenda, prontuário eletrônico, financeiro, estoque, relatórios, marketing, telemedicina e IA aplicada ao prontuário.

> **Status:** MVP em desenvolvimento incremental seguindo Clean Architecture, DDD e SOLID.

---

## Sumário

- [Finalidade](#finalidade)
- [Arquitetura](#arquitetura)
- [Stack Tecnológica](#stack-tecnológica)
- [Estrutura do Repositório](#estrutura-do-repositório)
- [Pré-requisitos](#pré-requisitos)
- [Configuração e Execução](#configuração-e-execução)
- [Módulos do Sistema](#módulos-do-sistema)
- [Modelo de Dados](#modelo-de-dados)
- [Segurança e LGPD](#segurança-e-lgpd)
- [Testes](#testes)
- [Documentação da API](#documentação-da-api)
- [Roadmap](#roadmap)
- [Convenções de Desenvolvimento](#convenções-de-desenvolvimento)

---

## Finalidade

A plataforma centraliza a operação de uma clínica de estética, oferecendo:

- **Agenda médica** com lembretes automáticos via WhatsApp/SMS/e-mail.
- **Prontuário eletrônico** com fichas personalizáveis, prescrições, fotos, vídeos e documentos.
- **Gestão financeira** completa: fluxo de caixa, orçamentos, pacotes de sessões e contratos.
- **Controle de estoque** de produtos e insumos.
- **Relatórios e dashboards** para tomada de decisão.
- **Marketing**, **telemedicina**, **chat interno**, **vídeos interativos** e **IA no prontuário** (transcrição, resumo de agenda em áudio, hipótese diagnóstica).
- **Conformidade LGPD** com auditoria, consentimento, exportação e anonimização de dados.

---

## Arquitetura

O projeto segue **Clean Architecture + DDD** com separação clara entre camadas:

```
domain/         → Entidades, Value Objects, Interfaces de Repositórios
application/    → Use Cases, DTOs, Mappers
infrastructure/ → ORM (TypeORM), Repositórios, Serviços externos, Cache
presentation/   → Controllers, Guards, Filters, Interceptors, Gateways (WebSocket)
```

**Princípios:**

- **SOLID** em todas as classes e módulos.
- **Design Patterns:** Repository, Strategy, Factory, Observer.
- **API RESTful** versionada (`/api/v1/`) com Swagger/OpenAPI 3.0.
- **Tratamento de erros** padronizado (Global Exception Handler) com mensagens em pt-BR.
- **Logs estruturados** em JSON (Winston) e tabela de auditoria.

---

## Stack Tecnológica

### Back-end (`estetica-backend/`)

| Camada | Tecnologia |
|---|---|
| Runtime | Node.js + TypeScript |
| Framework | NestJS 11 |
| ORM | TypeORM |
| Banco de Dados | PostgreSQL 17 |
| Migrações | Flyway (SQL versionado) |
| Cache / Sessão | Redis 7 (ioredis + cache-manager) |
| Autenticação | JWT (access + refresh) + Passport + OAuth2 |
| Validação | class-validator + class-transformer |
| WebSockets | Socket.IO (chat interno, telemedicina) |
| Documentação | Swagger / OpenAPI 3.0 |
| Logs | Winston (JSON estruturado) |
| Segurança | Helmet, Throttler, bcrypt (cost ≥ 12), AES-256 |
| Testes | Jest (unit, integration, e2e) |

### Front-end (`estetica-frontend/`)

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS v4 + ShadcnUI + Aceternity UI |
| State | Zustand |
| Realtime | socket.io-client |
| Testes | Vitest + Testing Library + jsdom |
| Linguagem | TypeScript |

### Infraestrutura

- **Docker + docker-compose** (Postgres, Redis, backend, frontend)
- **CI/CD:** GitHub Actions

---

## Estrutura do Repositório

```
gestao-estetica/
├── docker-compose.yml
├── estetica-backend/            # API NestJS
│   ├── src/
│   │   ├── domain/              # Entidades, VOs, interfaces
│   │   ├── application/         # Use cases, DTOs, mappers
│   │   ├── infrastructure/      # DB, repositórios, serviços
│   │   ├── presentation/        # Controllers, guards, filters
│   │   └── config/              # JWT, DB, Swagger
│   ├── migrations/              # Flyway SQL (V1__, V2__, R__)
│   ├── test/                    # e2e e integration
│   ├── api-docs/swagger.json
│   └── scripts/
├── estetica-frontend/           # App Next.js 16
│   ├── src/
│   │   ├── app/                 # App Router (auth) + (app)
│   │   ├── components/          # ui, layout, charts
│   │   ├── services/            # API calls
│   │   ├── stores/              # Zustand
│   │   └── middleware.ts        # Proteção de rotas
│   └── public/                  # logo-ns.svg, favicon
└── README.md
```

---

## Pré-requisitos

- **Docker** ≥ 24 e **docker-compose** ≥ 2.x
- **Node.js** ≥ 20 (apenas para desenvolvimento local sem Docker)
- **Flyway CLI** (para rodar migrações fora do Docker)

---

## Configuração e Execução

### 1. Clonar e configurar variáveis de ambiente

```bash
git clone <repo-url> gestao-estetica
cd gestao-estetica

cp estetica-backend/.env.example estetica-backend/.env
cp estetica-frontend/.env.example estetica-frontend/.env
```

Edite os arquivos `.env` com as credenciais necessárias (banco, JWT secret, integrações).

> ⚠️ **Nunca** commite arquivos `.env` ou credenciais reais.

### 2. Subir o ambiente com Docker (recomendado)

```bash
docker-compose up -d
```

Serviços disponíveis:

| Serviço | URL | Porta |
|---|---|---|
| Frontend (Next.js) | http://localhost:3001 | 3001 |
| Backend (NestJS) | http://localhost:3000 | 3000 |
| Swagger | http://localhost:3000/api/docs | 3000 |
| PostgreSQL | localhost | 5432 |
| Redis | localhost | 6379 |

### 3. Rodar migrações Flyway

```bash
flyway -url=jdbc:postgresql://localhost:5432/estetica_ns \
       -user=estetica_user -password=estetica_pass \
       -locations=filesystem:./estetica-backend/migrations migrate
```

### 4. Execução em modo desenvolvimento (sem Docker)

**Backend:**

```bash
cd estetica-backend
npm install
npm run start:dev
```

**Frontend:**

```bash
cd estetica-frontend
npm install
npm run dev
```

---

## Módulos do Sistema

### MVP

1. **Autenticação & Autorização** — JWT + RBAC (`ADMIN`, `MEDICO`, `RECEPCIONISTA`, `PACIENTE`)
2. **Pacientes** — CRUD completo com dados pessoais, contato e endereço
3. **Agenda Médica** — Calendário, status, lembretes automáticos
4. **Prontuário Eletrônico** — Fichas, prescrições, documentos, timeline 360°
5. **Financeiro** — Fluxo de caixa, orçamentos, pacotes de sessões, contratos
6. **Estoque** — Produtos, movimentações e alertas
7. **Relatórios** — Agenda, financeiro, pacientes, estoque, exportação Excel

### Pós-MVP

8. **Marketing** — Comunicações via SMS, e-mail e WhatsApp
9. **Consulta Interativa** — Marcações em fotos, biblioteca de imagens
10. **Vídeos Interativos** — Simulações de procedimentos
11. **Chat Interno** — Comunicação entre profissionais (WebSocket)
12. **Integrações** — RD Station, LeadLovers
13. **IA no Prontuário** — Transcrição, resumo em áudio, hipótese diagnóstica
14. **Telemedicina** — Videochamada e compartilhamento de arquivos

---

## Modelo de Dados

Principais entidades persistidas em PostgreSQL via TypeORM:

`User`, `Clinica`, `Profissional`, `Paciente`, `Agendamento`, `Prontuario`, `FichaAtendimento`, `Prescricao`, `Procedimento`, `Produto`, `MovimentacaoEstoque`, `ContaFinanceira`, `Orcamento`, `PacoteSessao`, `Contrato`, `Documento`, `Comunicacao`, `AuditLog`.

**Regras de dados:**

- Valores monetários: `DECIMAL(12,2)`.
- Campos sensíveis (CPF, dados médicos): criptografados com **AES-256**.
- Migrações versionadas: `V1__create_users_clinicas.sql` … `V15__create_sessoes_telemedicina.sql`.
- Seeds via repeatable migrations: `R__seed_procedimentos_categorias.sql`.

---

## Segurança e LGPD

- **JWT** com access + refresh token (rotation e detecção de reuso).
- **OAuth2 Google** para login social.
- **RBAC** com 4 papéis e guards por rota.
- **Logout** com blacklist no Redis.
- **HTTPS/TLS**, **AES-256** para dados sensíveis, **bcrypt** (cost ≥ 12).
- Proteção contra **SQL Injection**, **XSS**, **CSRF**.
- **Rate Limiting**: 100 req/min usuário, 20 req/min em login.
- **Helmet.js** + Content Security Policy.
- **LGPD:** exportação de dados, exclusão de conta, registro de consentimento, anonimização e auditoria completa.

---

## Testes

### Backend

```bash
cd estetica-backend
npm test                  # unit
npm run test:cov          # cobertura
npm run test:integration  # integração
npm run test:e2e          # end-to-end
```

Cobertura mínima exigida: **80%** nas camadas de domínio e aplicação.

### Frontend

```bash
cd estetica-frontend
npm test                  # vitest
npm run test:coverage
```

---

## Documentação da API

Disponível via Swagger UI em desenvolvimento:

- **UI interativa:** http://localhost:3000/api/docs
- **JSON exportado:** [`estetica-backend/api-docs/swagger.json`](estetica-backend/api-docs/swagger.json)

Para regenerar o JSON:

```bash
cd estetica-backend
npm run swagger:export
```

---

## Roadmap

| Fase | Entregável | Status |
|---|---|---|
| 1 | Setup do projeto e Docker | ✅ |
| 2 | Modelo de dados e migrações Flyway | ✅ |
| 3 | Autenticação e RBAC | ✅ |
| 4 | Módulo Pacientes | ✅ |
| 5 | Agenda Médica | ✅ |
| 6 | Prontuário Eletrônico | ✅ |
| 7 | Financeiro | ✅ |
| 8 | Estoque | ✅ |
| 9 | Relatórios | ✅ |
| 10 | Frontend — Fundação | 🚧 |
| 11 | Frontend — Módulos MVP | 🚧 |
| 12 | Swagger e documentação | ✅ |
| 13 | CI/CD e testes | 🚧 |
| 14 | Revisão de segurança e LGPD | 🚧 |
| 15-21 | Pós-MVP (Marketing, IA, Telemedicina, etc.) | ⏳ |

---

## Convenções de Desenvolvimento

- **Idioma:** todo o código de domínio, interface e mensagens em **pt-BR**.
- **Datas:** `date-fns` com locale `ptBR` (`dd/MM/yyyy`).
- **Moeda:** `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`.
- **Máscaras:** CPF `XXX.XXX.XXX-XX`, telefone `(XX) XXXXX-XXXX`.
- **Identidade visual:** monograma "NS" dourado (`#D4AF37`) — `estetica-frontend/public/logo-ns.svg`.
- **Commits:** incrementais, pequenos e com testes verdes.
- **Lint:** ESLint + Prettier obrigatórios antes do commit.
- **Segredos:** sempre via `.env`, nunca hardcoded.

---

## Licença

Projeto privado — **UNLICENSED**. Uso restrito à clínica Estética Natalia Salvador.
