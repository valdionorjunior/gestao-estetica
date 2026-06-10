---
name: prototipo-visual
description: "Use when: iniciar qualquer etapa de frontend da clínica Estética Natalia Salvador, antes de criar componentes .tsx ou páginas. Workflow obrigatório de referências → design tokens → mockup HTML estático → aprovação do usuário. Evita UI genérica 'cara de IA' e retrabalho."
---

# Skill: Protótipo Visual Antes do Código

## Regra de Ouro (BLOQUEANTE)

**Nenhum arquivo `.tsx` de página ou componente de layout é criado antes de:**
1. Referências visuais coletadas e documentadas.
2. Design tokens aprovados em `src/app/globals.css` (Tailwind v4 `@theme`).
3. Mockup HTML estático gerado em `docs/prototipos/<modulo>.html`.
4. Aprovação explícita do usuário ("aprovado" ou ajustes resolvidos).

Se o usuário pedir para pular essa etapa, **pergunte** explicitamente para confirmar — não assuma.

## Workflow em 5 Passos

### Passo 1 — Coleta de Referências (5 min)

Selecione 3–5 referências do catálogo do nicho (ver `frontend-clinica/SKILL.md` → "Referências Visuais do Nicho"). Documente em comentário no topo do mockup:

```html
<!--
Referências:
- Nexura Care Dashboard (Behance) → estrutura de KPIs com cards em grade 4-col
- Skin Science Cosmetology → tipografia serif editorial + dourado discreto
- The Place Aesthetics & Wellness → densidade editorial, muito espaço negativo
Padrões absorvidos: serif no H1, sans no body, dourado como accent (nunca dominante),
cards com borda 1px em neutro quente (#E8E4DD), sombra suave e sutil.
-->
```

### Passo 2 — Design Tokens

Use uma destas abordagens (em ordem de preferência):

**A) tweakcn.com (recomendado)**
Abra `https://tweakcn.com/ai` e use o prompt:
> "Luxury aesthetic medicine clinic dashboard. Primary gold #D4AF37 used as refined accent (never dominant). Cream background #F8F7F4. Warm neutrals. Serif display font (Playfair Display or Cormorant Garamond) pairing with elegant sans (Inter or DM Sans). Soft borders, subtle warm shadows. High contrast AA. Tailwind v4 OKLCH format."

Export → CSS `@theme` → cole em `estetica-frontend/src/app/globals.css`.

**B) Configuração manual**
Use os tokens de `frontend-clinica/SKILL.md` como base. Nunca invente cores novas fora da paleta.

**Validação obrigatória após tokens:**
```bash
cd estetica-frontend && npm run build
```
Build deve passar. Abra `/` e confirme que `bg-background`, `text-primary`, `font-serif` renderizam corretamente antes de avançar.

### Passo 3 — Mockup HTML Estático

Crie `docs/prototipos/<modulo>.html` **self-contained** (sem build, sem framework). Use Tailwind via CDN para velocidade:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Protótipo — [Módulo] — Estética Natalia Salvador</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --color-bg: #F8F7F4; --color-surface: #FFFFFF; --color-border: #E8E4DD;
      --color-text: #1A1A1A; --color-muted: #6B6560;
      --color-primary: #D4AF37; --color-primary-dark: #B8962E;
    }
    body { font-family: 'Inter', sans-serif; background: var(--color-bg); color: var(--color-text); }
    h1, h2, h3, .serif { font-family: 'Playfair Display', serif; }
  </style>
</head>
<body>
  <!-- Layout completo com dados fake em pt-BR -->
  <!-- Logo NS visível, paleta dourada discreta, densidade editorial -->
</body>
</html>
```

**Requisitos do mockup:**
- **Dados fake em pt-BR**: "Maria Clara Andrade", "Limpeza de Pele Profunda", "R$ 1.250,00", "14/04/2026 às 09:30".
- **Logo NS presente** (inline SVG ou `<img src="../../estetica-frontend/public/logo-ns.svg">`).
- **Pelo menos 1 tela completa** por módulo (ex: agenda → vista semanal + card de agendamento).
- **Estados**: pelo menos 1 vazio, 1 com dados, 1 de hover/foco.
- **Responsivo**: conferir em 375px e 1440px.

### Passo 4 — Alternativa: v0.app

Se preferir iteração conversacional, forneça ao usuário este prompt pronto:

> "Build a dashboard page for a Brazilian aesthetic medicine clinic called 'Estética Natalia Salvador'. Language: pt-BR. Primary color: gold #D4AF37 used sparingly as accent. Background: cream #F8F7F4. Typography: Playfair Display (headings) + Inter (body). Components: left sidebar with nav (Agenda, Pacientes, Prontuário, Financeiro, Estoque), top bar with user avatar, main area with 4 KPI cards (Agendamentos hoje, Faturamento do mês, Taxa de ocupação, Pacientes ativos), agenda timeline for today, recent patients table. Editorial density, generous whitespace, subtle warm shadows, 1px borders in warm neutral #E8E4DD. No purple gradients. No emoji as icons — use Lucide. Framework: Next.js + Tailwind + shadcn/ui."

Import do resultado: usuário cola o output em `docs/prototipos/`.

### Passo 5 — Aprovação

Apresente o caminho do arquivo: `docs/prototipos/<modulo>.html`. Peça:

> "Abra o arquivo no navegador e confirme:
> 1. Paleta está como esperada?
> 2. Tipografia transmite sofisticação da clínica?
> 3. Hierarquia visual está clara?
> 4. Densidade está confortável (nem vazio, nem apertado)?
>
> Responda 'aprovado' ou liste os ajustes."

**Iterar até aprovação.** Só então prosseguir para `.tsx`.

## Checklist Anti-AI-Genérico (Obrigatório)

Aplique este checklist ANTES de entregar o mockup e DEPOIS de implementar cada página:

- [ ] **Tipografia**: usa pair serif+sans distintivo (Playfair/Inter, Cormorant/DM Sans, Fraunces/Geist). **NÃO** usa Inter puro ou Roboto.
- [ ] **Cor**: dourado como accent refinado (~5% da tela), neutros quentes dominantes. **NÃO** tem gradiente roxo/azul genérico.
- [ ] **Ícones**: Lucide React ou Phosphor. **ZERO emojis** como ícones funcionais.
- [ ] **Assinatura visual**: pelo menos 1 elemento memorável (monograma NS, fio dourado 1px decorativo, divisor serifado, numeração com ordinais em serif).
- [ ] **Densidade**: editorial com espaço negativo generoso. **NÃO** parece "template admin genérico".
- [ ] **Motion**: staggered reveal no page load (Framer Motion `variants` + `staggerChildren`). Hover states sutis (150–250ms).
- [ ] **Acessibilidade**: contraste ≥ 4.5:1 (validado via DevTools), focus ring visível, touch targets ≥ 44px.
- [ ] **pt-BR**: 100% dos textos, datas `dd/MM/yyyy`, moeda `R$ 1.234,56`, telefone `(XX) XXXXX-XXXX`.
- [ ] **Logo NS**: presente no sidebar/navbar e no login.
- [ ] **Sem "Lorem ipsum"**: dados fake realistas e contextuais à estética.

## Design Review Pós-Implementação

Após codar um módulo, tire screenshot da página real e compare lado-a-lado com o mockup aprovado. Se divergir em tipografia, paleta, espaçamento ou hierarquia, **corrija antes de marcar a etapa como concluída**.

## Quando Pular Esta Skill

Só pule quando:
- A tarefa for exclusivamente backend / DB / config.
- For correção pontual em componente existente (< 20 linhas).
- Usuário pedir explicitamente "sem protótipo".

## Referências Consolidadas

- `frontend-clinica/SKILL.md` — paleta, tipografia, identidade NS
- `frontend-design/SKILL.md` — regras anti-genérico
- `ui-ux-pro-max/SKILL.md` — 161 paletas, 57 pairings, 99 UX guidelines
- `accessibility/SKILL.md` — WCAG 2.2
