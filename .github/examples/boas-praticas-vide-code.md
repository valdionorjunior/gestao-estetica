# 🚀 Boas Práticas: Desenvolvimento com Claude Code

Este guia estabelece as diretrizes para maximizar a eficiência e precisão ao utilizar o Claude Code como seu agente de desenvolvimento.

## 1. Gestão de Contexto
*   **Arquivo CLAUDE.md**: Mantenha este arquivo na raiz do projeto com comandos de build, teste e padrões de código. O Claude Code lê este arquivo automaticamente para se orientar.
*   **Contexto Limpo**: Use o comando `/clear` ao iniciar uma nova tarefa para evitar que o histórico anterior cause erros de lógica.
*   **Referências**: Utilize `@nome-do-arquivo` para forçar a leitura de arquivos específicos antes de solicitar alterações.

## 2. Fluxo de Trabalho (Workflow)
1.  **Planejamento**: Antes de pedir código, use o comando `/plan` para discutir a estratégia de implementação.
2.  **Passo a Passo**: Divida tarefas grandes em pequenos commits. O Claude trabalha melhor em mudanças modulares.
3.  **Validação**: Após cada alteração, peça ao Claude para rodar os testes e o linter no terminal.

## 3. Qualidade e Segurança
*   **TDD (Test-Driven Development)**: Instrua o Claude a escrever e rodar os testes antes de implementar a lógica.
*   **Revisões**: Use o comando `/review` para buscar vulnerabilidades ou problemas de performance antes de finalizar a tarefa.
*   **Segurança**: Nunca compartilhe chaves de API ou segredos reais; use arquivos `.env.example` como referência.

## 4. Comandos Essenciais
*   `/init`: Carrega as regras do projeto.
*   `/bug`: Inicia um diagnóstico de erro.
*   `/compact`: Resume a conversa para economizar tokens mantendo o contexto.
