# Roteiro de Execução — Estética Natalia Salvador

Passo a passo para desenvolver o sistema de gestão da clínica do zero usando o agente especializado e os prompts criados.

## Pré-requisitos

- VS Code com GitHub Copilot
- Docker e Docker Compose instalados
- Node.js 20+ e npm
- PostgreSQL 15+ (ou via Docker)
- Git configurado

## Execução Completa

### Fase 1: Fundação do Projeto

#### Etapa 1.1 — Setup Inicial
```
@estetica Setup inicial completo do projeto — criar estetica-backend com NestJS, estetica-frontend com React+Vite+Tailwind, Docker, docker-compose, .env, estrutura de pastas conforme agente.
```

**Validação:**
- [ ] Estrutura de pastas criada corretamente
- [ ] docker-compose.yml funcional (backend, frontend, postgres, redis)
- [ ] Variáveis de ambiente configuradas (.env.example)
- [ ] `npm install` executa sem erros em ambos os projetos
- [ ] Logo NS presente em `estetica-frontend/public/`

#### Etapa 1.2 — Configuração do Banco
```
/prompt-banco-migracoes-estetica
Configuração inicial do PostgreSQL com Flyway — setup de conexão, configuração de migrations e estrutura básica.
```

**Validação:**
- [ ] Conexão com banco estabelecida
- [ ] Flyway configurado corretamente
- [ ] Pasta migrations/ criada

---

### Fase 2: Modelo de Dados e Migrações

#### Etapa 2.1 — Entidades Base
```
/prompt-banco-migracoes-estetica
Criar migrações para User e Clinica com relacionamentos e constraints.
```

#### Etapa 2.2 — Entidades Clínicas Core
```
/prompt-banco-migracoes-estetica
Criar migrações para Profissional, Paciente, Procedimento com tipos e validações.
```

#### Etapa 2.3 — Entidades de Agenda
```
/prompt-banco-migracoes-estetica
Criar migração para Agendamento com status, horários, relacionamentos e índices.
```

#### Etapa 2.4 — Entidades de Prontuário
```
/prompt-banco-migracoes-estetica
Criar migrações para Prontuario, FichaAtendimento, Prescricao e Documento.
```

#### Etapa 2.5 — Entidades Financeiras
```
/prompt-banco-migracoes-estetica
Criar migrações para ContaFinanceira, Orcamento, PacoteSessao, Contrato.
```

#### Etapa 2.6 — Entidades de Estoque
```
/prompt-banco-migracoes-estetica
Criar migrações para Produto, MovimentacaoEstoque, CategoriaProduto.
```

#### Etapa 2.7 — Entidades Complementares
```
/prompt-banco-migracoes-estetica
Criar migrações para Comunicacao, AuditLog e seeds de procedimentos padrão.
```

**Validação da Fase 2:**
- [ ] Todas as migrações executam sem erro
- [ ] Schema reflete o modelo esperado
- [ ] Procedimentos padrão inseridos
- [ ] Relacionamentos funcionam

---

### Fase 3: Autenticação e Autorização

#### Etapa 3.1 — Entidades de Domínio
```
/prompt-autenticacao-estetica
Criar entidades User com roles (ADMIN, MEDICO, RECEPCIONISTA, PACIENTE) seguindo DDD.
```

#### Etapa 3.2 — DTOs e Validações
```
/prompt-autenticacao-estetica
Criar DTOs para registro, login e atualização com validações em pt-BR.
```

#### Etapa 3.3 — JWT e Refresh Token
```
/prompt-autenticacao-estetica
Implementar JWT strategy, Passport, refresh token rotation.
```

#### Etapa 3.4 — Guards e RBAC
```
/prompt-autenticacao-estetica
Criar guards para 4 roles: ADMIN, MEDICO, RECEPCIONISTA, PACIENTE.
```

#### Etapa 3.5 — Controllers
```
/prompt-autenticacao-estetica
Endpoints de registro, login, refresh, logout e recuperação de senha.
```

**Validação da Fase 3:**
- [ ] Registro funciona
- [ ] Login retorna JWT válido
- [ ] Refresh token rotation implementado
- [ ] RBAC protege rotas
- [ ] Logout invalida tokens

---

### Fase 4: Módulo de Pacientes

```
@estetica CRUD completo de Pacientes com entidades DDD, DTOs validados, use cases, endpoints REST, busca e paginação.
```

**Validação:**
- [ ] Criar, listar, buscar, editar e desativar pacientes
- [ ] Busca por nome, CPF, telefone
- [ ] Paginação funcionando
- [ ] Validações de CPF e telefone

---

### Fase 5: Módulo de Agenda Médica

#### Etapa 5.1 — Backend da Agenda
```
/prompt-agenda-prontuario
Entidades, use cases e endpoints de agendamento com validação de conflito de horário.
```

#### Etapa 5.2 — Fluxo de Status
```
/prompt-agenda-prontuario
Máquina de estados do agendamento: agendado → confirmado → em atendimento → concluído.
```

#### Etapa 5.3 — Calendário e Listagem
```
/prompt-agenda-prontuario
Endpoints de calendário por profissional e por período (dia/semana/mês).
```

**Validação da Fase 5:**
- [ ] Agendamentos funcionam sem conflito
- [ ] Status transiciona corretamente
- [ ] Calendário filtra por profissional e período

---

### Fase 6: Módulo de Prontuário Eletrônico

#### Etapa 6.1 — Backend do Prontuário
```
/prompt-agenda-prontuario
Entidades e endpoints do prontuário: criar, adicionar fichas, prescrições.
```

#### Etapa 6.2 — Upload de Documentos
```
/prompt-agenda-prontuario
Upload de fotos, vídeos e documentos vinculados ao prontuário.
```

#### Etapa 6.3 — Timeline
```
/prompt-agenda-prontuario
Endpoint de timeline do paciente com histórico completo ordenado.
```

**Validação da Fase 6:**
- [ ] Prontuário criado automaticamente ou manualmente
- [ ] Fichas adicionadas e imutáveis após fechamento
- [ ] Documentos armazenados corretamente
- [ ] Timeline retorna histórico completo

---

### Fase 7: Módulo Financeiro de Clínica

#### Etapa 7.1 — Fluxo de Caixa
```
/prompt-financeiro-clinica
Entidades e endpoints para receitas e despesas com fluxo de caixa.
```

#### Etapa 7.2 — Orçamentos
```
/prompt-financeiro-clinica
Criar e gerenciar orçamentos com itens, descontos e validade.
```

#### Etapa 7.3 — Pacotes de Sessões
```
/prompt-financeiro-clinica
Pacotes com desconto progressivo e controle de sessões utilizadas.
```

#### Etapa 7.4 — Contratos
```
/prompt-financeiro-clinica
Contratos vinculados a pacotes/orçamentos com status.
```

**Validação da Fase 7:**
- [ ] Receitas e despesas registradas
- [ ] Orçamentos com cálculo correto de totais e descontos
- [ ] Pacotes controlam sessões
- [ ] Contratos vinculados

---

### Fase 8: Módulo de Estoque

```
/prompt-estoque
Módulo completo: cadastro de produtos, entradas, saídas, alertas de estoque baixo.
```

**Validação:**
- [ ] Produtos cadastrados
- [ ] Entradas e saídas registradas
- [ ] Estoque não fica negativo
- [ ] Alerta de estoque baixo

---

### Fase 9: Relatórios e Dashboards (API)

```
/prompt-relatorios-estetica
Endpoints de relatório: agenda, financeiro, pacientes, estoque, KPIs do dashboard.
```

**Validação:**
- [ ] Dados agregados corretos
- [ ] Filtros por período funcionam
- [ ] KPIs calculam valores precisos

---

### Fase 10: Frontend — Fundação

```
@estetica Frontend React: layout base com sidebar, navbar com logo NS, dark mode, roteamento, auth (login/registro), componentes base (cards, inputs, tabelas, skeleton).
```

**Validação:**
- [ ] App React roda sem erros
- [ ] Tailwind configurado com paleta dourada
- [ ] Logo NS na sidebar e login
- [ ] Dark mode funciona
- [ ] Toda interface em pt-BR
- [ ] Login/registro conectam ao backend

---

### Fase 11: Frontend — Módulos MVP

#### 11.1 — Dashboard
```
@estetica Dashboard principal com KPIs, agenda do dia e gráficos.
```

#### 11.2 — Agenda
```
@estetica Tela de agenda: calendário, cards de agendamento, formulário, filtros.
```

#### 11.3 — Pacientes
```
@estetica Tela de pacientes: listagem, busca, cadastro, edição.
```

#### 11.4 — Prontuário
```
@estetica Tela de prontuário: timeline, fichas, prescrições, galeria de documentos.
```

#### 11.5 — Financeiro
```
@estetica Tela financeira: fluxo de caixa, orçamentos, pacotes, contratos.
```

#### 11.6 — Estoque
```
@estetica Tela de estoque: produtos, movimentações, alertas.
```

#### 11.7 — Relatórios
```
@estetica Tela de relatórios: gráficos, filtros dinâmicos, exportação Excel.
```

**Validação da Fase 11:**
- [ ] Todas as telas funcionais e conectadas ao backend
- [ ] Interface responsiva
- [ ] Dados reais renderizados
- [ ] Exportação para Excel funciona

---

### Fase 12: Documentação

```
@estetica Swagger/OpenAPI completo para todos os endpoints + documentação funcional dos módulos.
```

---

### Fase 13: Testes e CI/CD

```
@estetica Testes unitários (Jest/Vitest) com cobertura ≥ 80% + testes de integração + CI pipeline.
```

---

### Fase 14: Segurança e LGPD

```
@estetica Rate limiting, headers de segurança, criptografia AES-256, endpoints LGPD, auditoria completa.
```

---

### Fase 14.5: Painel de Usuários (Admin)

> **Contexto:** O endpoint `POST /auth/register` cria usuários apenas com role `PACIENTE` por segurança. Para gerenciar usuários staff (ADMIN, MEDICO, RECEPCIONISTA), o ADMIN precisa de um módulo dedicado. Esta fase deve ser implementada antes ou logo após o frontend de autenticação estar funcional.

```
@estetica Painel de Usuários: endpoints e tela para o ADMIN criar, listar, editar e desativar usuários com qualquer role (ADMIN, MEDICO, RECEPCIONISTA, PACIENTE). Inclui backend (CRUD /usuarios protegido por role ADMIN) e frontend (tela de gestão de usuários com formulário de criação/edição de role, status ativo/inativo e busca por nome/email).
```

**Backend a implementar:**
- `GET    /api/v1/usuarios`         — listar todos (ADMIN only, paginado)
- `GET    /api/v1/usuarios/:id`     — buscar por ID (ADMIN only)
- `POST   /api/v1/usuarios`         — criar usuário com qualquer role (ADMIN only)
- `PATCH  /api/v1/usuarios/:id`     — editar nome, role, status ativo (ADMIN only)
- `DELETE /api/v1/usuarios/:id`     — desativar conta (ADMIN only, soft delete)

**Frontend a implementar:**
- Tela `/usuarios` na sidebar (visível apenas para ADMIN)
- Tabela com busca por nome/email, filtro por role e status
- Modal de criação com campos: nome, email, senha temporária, role
- Modal de edição de role e status
- Badge colorido por role (ADMIN=dourado, MEDICO=azul, RECEPCIONISTA=verde, PACIENTE=cinza)

**Validação:**
- [ ] ADMIN consegue criar usuário MEDICO/RECEPCIONISTA via painel
- [ ] Não-ADMIN recebe 403 ao acessar `/usuarios`
- [ ] Edição de role e desativação funcionam
- [ ] Tela lista todos os usuários com paginação
- [ ] Senha temporária exige troca no primeiro login

---

## Fases Pós-MVP (15–21)

Executar sob demanda, uma por vez, usando `@estetica` com descrição da funcionalidade:

| Fase | Módulo | Comando |
|------|--------|---------|
| 15 | Marketing | `@estetica Marketing: lembretes e comunicações via SMS, email e WhatsApp` |
| 16 | Consulta interativa | `@estetica Consulta interativa: simulações e marcações em fotos` |
| 17 | Vídeos interativos | `@estetica Vídeos interativos: simulações de procedimentos` |
| 18 | Chat interno | `@estetica Chat de comunicação interna entre profissionais` |
| 19 | Integrações | `@estetica Integrações com RD Station e LeadLovers` |
| 20 | IA no prontuário | `@estetica IA: resumo de agenda em áudio, transcrição, hipótese diagnóstica` |
| 21 | Telemedicina | `@estetica Telemedicina: videochamada, envio de link, compartilhamento de arquivos` |
