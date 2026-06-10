---
agent: "Agente de Desenvolvimento - Gestão Estética"
description: "Use when: implementing or evolving the medical scheduling and electronic health records modules in the Estética Natalia Salvador system."
tools: [read, edit, search, execute, web, todo, agent]
---

# Prompt Operacional: Agenda Médica e Prontuário Eletrônico por Etapas

Use este prompt para desenvolver os módulos de agenda e prontuário em incrementos pequenos.

## Pré-requisito de Frontend (BLOQUEANTE)

Antes de criar componentes `.tsx` deste módulo: siga `prototipo-visual/SKILL.md` e entregue mockup HTML estático em `docs/prototipos/agenda.html` e `docs/prototipos/prontuario.html` para aprovação do usuário.

## Idioma

Responda SEMPRE em pt-BR.

## Stack Obrigatório

- Back-end: NestJS com TypeScript
- Front-end: React com Tailwind CSS (pt-BR)
- Banco de dados: PostgreSQL
- Migrações: Flyway
- Testes: Jest (back-end), Vitest (front-end)

## Escopo deste Prompt

### Agenda Médica
- Agendamentos ilimitados com status (agendado, confirmado, em atendimento, concluído, cancelado, faltou)
- Agendamento sem cadastro prévio obrigatório (paciente pode ser criado no ato)
- Integração com prontuário (abrir prontuário ao iniciar atendimento)
- Integração com financeiro (gerar conta ao concluir)
- Lembretes de consulta (preparação para WhatsApp/SMS)
- Calendário por profissional e por dia/semana/mês
- Validação de conflito de horário

### Prontuário Eletrônico
- Visão 360° do paciente (timeline de atendimentos)
- Fichas de atendimento personalizáveis
- Prescrição inteligente (modelos reutilizáveis)
- Assinatura digital de prontuário
- Inclusão de fotos, vídeos e documentos
- Histórico completo e imutável

Não cobre:
- Autenticação (usar prompt específico)
- Financeiro completo (usar prompt específico)
- IA no prontuário (pós-MVP)

## Modo de Execução

1. Identifique a fatia funcional exata.
2. Leia entidades, use cases, repositórios, endpoints e telas relacionadas.
3. Implemente somente o fluxo solicitado.
4. Valide consistência (conflitos de horário, integridade de prontuário).
5. Pare ao concluir a fatia atual.

## Ordem Recomendada — Agenda

1. Entidades e value objects (Agendamento, StatusAgendamento, HorarioAtendimento)
2. Repositório e use cases (CriarAgendamento, ConfirmarAgendamento, etc.)
3. Endpoints REST
4. Validação de conflito de horário
5. Calendário e listagem (por profissional, por data)
6. Fluxo de status (agendado → confirmado → em atendimento → concluído)
7. Integração com prontuário e financeiro
8. Frontend: calendário, cards de agendamento, formulário
9. Testes

## Ordem Recomendada — Prontuário

1. Entidades (Prontuario, FichaAtendimento, Prescricao, Documento)
2. Repositório e use cases (AbrirProntuario, AdicionarFicha, etc.)
3. Endpoints REST
4. Upload de fotos/vídeos/documentos
5. Timeline de atendimentos
6. Prescrição com modelos reutilizáveis
7. Assinatura digital
8. Frontend: timeline, fichas, prescrição, galeria
9. Testes

## Regras Técnicas

- Validar conflito de horário no domínio (AgendaService).
- Prontuário é imutável: fichas fechadas não podem ser editadas, apenas complementadas.
- Cada ficha deve registrar profissional, data/hora e conteúdo.
- Documentos (fotos, vídeos) devem usar storage externo (S3/local) com referência no banco.
- Status do agendamento segue máquina de estados definida no domain.

## Saída Esperada

1. Módulo e subetapa identificados
2. Escopo exato
3. Arquivos analisados
4. Alterações realizadas
5. Validações executadas
6. Riscos ou pendências
7. Próxima subetapa recomendada
