---
agent: "Agente de Desenvolvimento - Gestão Estética"
description: "Use when: implementing or evolving the clinic financial module (cash flow, budgets, session packages, contracts) in the Estética Natalia Salvador system."
tools: [read, edit, search, execute, web, todo, agent]
---

# Prompt Operacional: Financeiro de Clínica por Etapas

Use este prompt para desenvolver o módulo financeiro da clínica em incrementos pequenos.

## Pré-requisito de Frontend (BLOQUEANTE)

Antes de criar componentes `.tsx` deste módulo: siga `prototipo-visual/SKILL.md` e entregue mockup HTML estático em `docs/prototipos/financeiro.html` para aprovação do usuário.

## Idioma

Responda SEMPRE em pt-BR.

## Stack Obrigatório

- Back-end: NestJS com TypeScript
- Front-end: React com Tailwind CSS (pt-BR)
- Banco de dados: PostgreSQL
- Migrações: Flyway
- Testes: Jest (back-end), Vitest (front-end)

## Escopo deste Prompt

- Fluxo de caixa (receitas e despesas)
- Orçamentos para pacientes (com itens, descontos, validade)
- Pacotes de sessões (ex: 10 sessões de laser com desconto progressivo)
- Contratos vinculados a pacotes/orçamentos
- Integração com agenda (gerar lançamento ao concluir atendimento)
- Formas de pagamento (dinheiro, cartão, PIX, parcelado)
- Relatórios financeiros via API

Não cobre:
- Autenticação (usar prompt específico)
- Agenda e prontuário (usar prompt específico)
- Estoque (usar prompt específico)

## Modo de Execução

1. Identifique a fatia funcional exata do financeiro.
2. Leia entidades, use cases, repositórios e endpoints relacionados.
3. Implemente somente a regra ou fluxo solicitado.
4. Valide impacto em saldos e consistência de dados.
5. Pare ao concluir a fatia atual.

## Ordem Recomendada de Subetapas

1. Entidades financeiras (ContaFinanceira, Orcamento, PacoteSessao, Contrato)
2. Value objects (Money, FormaPagamento, StatusOrcamento)
3. Use cases (GerarOrcamento, RegistrarReceita, RegistrarDespesa)
4. Lógica de desconto por pacote (Strategy Pattern)
5. Endpoints REST
6. Integração com agenda (lançamento automático pós-atendimento)
7. Contratos (geração e vinculação a pacotes/orçamentos)
8. Frontend: fluxo de caixa, formulário de orçamento, lista de contratos
9. Testes

## Regras Técnicas

- Valores monetários são Value Objects (Money), nunca primitivos.
- Operações financeiras devem ser atômicas.
- Desconto por pacote usa Strategy Pattern (DescontoPacoteStrategy).
- Todas as operações financeiras devem gerar AuditLog.
- Orçamentos têm validade e podem ser aprovados, recusados ou expirados.
- Contratos são vinculados a pacientes e podem referenciar pacotes.
- Formatar valores como R$ no frontend (Intl.NumberFormat pt-BR).

## Saída Esperada

1. Subetapa identificada
2. Escopo exato
3. Arquivos analisados
4. Alterações realizadas
5. Validações executadas
6. Riscos financeiros ou pendências
7. Próxima subetapa recomendada
