---
agent: "Agente de Desenvolvimento - Gestão Estética"
description: "Use when: implementing or evolving the inventory module (products, stock entries/exits, alerts) in the Estética Natalia Salvador system."
tools: [read, edit, search, execute, web, todo, agent]
---

# Prompt Operacional: Estoque por Etapas

Use este prompt para desenvolver o módulo de estoque em incrementos pequenos.

## Pré-requisito de Frontend (BLOQUEANTE)

Antes de criar componentes `.tsx` deste módulo: siga `prototipo-visual/SKILL.md` e entregue mockup HTML estático em `docs/prototipos/estoque.html` para aprovação do usuário.

## Idioma

Responda SEMPRE em pt-BR.

## Stack Obrigatório

- Back-end: NestJS com TypeScript
- Front-end: React com Tailwind CSS (pt-BR)
- Banco de dados: PostgreSQL
- Migrações: Flyway
- Testes: Jest (back-end), Vitest (front-end)

## Escopo deste Prompt

- Cadastro de produtos (nome, categoria, unidade, estoque mínimo)
- Controle de entradas (compras, devoluções)
- Controle de saídas (uso em procedimento, descarte, venda)
- Alerta de estoque baixo (quantidade ≤ estoque mínimo)
- Histórico de movimentações por produto
- Relatório de estoque via API

Não cobre:
- Agenda, prontuário, autenticação ou financeiro

## Modo de Execução

1. Identifique a fatia funcional exata.
2. Leia entidades e endpoints relacionados.
3. Implemente somente o fluxo solicitado.
4. Valide consistência de quantidades.
5. Pare ao concluir a fatia atual.

## Ordem Recomendada de Subetapas

1. Entidades (Produto, MovimentacaoEstoque, CategoriaProduto)
2. Repositório e use cases (CadastrarProduto, RegistrarEntrada, RegistrarSaida)
3. Validação de estoque (não permitir saída se insuficiente)
4. Endpoints REST
5. Alerta de estoque baixo
6. Histórico de movimentações
7. Frontend: tabela de estoque, formulários, alertas visuais
8. Testes

## Regras Técnicas

- Estoque nunca pode ficar negativo (validação no domínio).
- Cada movimentação registra: produto, tipo (ENTRADA/SAIDA), quantidade, motivo, data, responsável.
- Produtos com quantidade ≤ estoque mínimo devem ser sinalizados.
- Movimentações são imutáveis (para auditoria).
- Usar EstoqueService do domínio para regras de negócio.

## Saída Esperada

1. Subetapa identificada
2. Escopo exato
3. Arquivos analisados
4. Alterações realizadas
5. Validações executadas
6. Riscos ou pendências
7. Próxima subetapa recomendada
