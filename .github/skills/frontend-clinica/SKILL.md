---
name: frontend-clinica-estetica
description: "Desenvolvimento de interfaces para clínicas de estética com React, Tailwind CSS e design premium. Use when: criar componentes clínicos, dashboards de gestão, agenda médica, prontuário eletrônico, formulários de paciente, tabelas de dados clínicos, gráficos, cards de resumo, estoque, financeiro de clínica, layouts responsivos, validação de formulários, formatação de moeda, estados de loading."
---

# Skill: Frontend de Sistemas para Clínicas de Estética

## Quando Usar

Esta skill se aplica quando você está:
- Criando dashboards clínicos (agenda do dia, KPIs, ocupação)
- Desenvolvendo a agenda médica (calendário, agendamentos, status)
- Implementando prontuário eletrônico (fichas, prescrições, documentos, timeline)
- Criando formulários de paciente, procedimento ou orçamento
- Implementando tabelas de dados clínicos com filtros
- Criando cards de resumo (KPIs, indicadores de ocupação, faturamento)
- Implementando gráficos de desempenho (procedimentos, faturamento, pacientes)
- Gerenciando estoque (produtos, entradas, saídas)
- Trabalhando com financeiro da clínica (fluxo de caixa, orçamentos, pacotes, contratos)
- Formatando valores monetários e percentuais
- Validando inputs em tempo real

## Idioma Obrigatório

**Todo o frontend deve estar em pt-BR:**
- Labels, placeholders, mensagens de erro e feedback
- Menus, botões, tooltips, modals
- Datas formatadas com `date-fns` + locale `ptBR`
- Valores monetários em R$ (BRL)
- Enums traduzidos (status, tipos, roles)

## Identidade Visual — Estética Natalia Salvador

### Branding
- **Nome**: Estética Natalia Salvador
- **Logo**: Monograma "NS" dourado — arquivos em `public/logo-ns.svg`, `public/logo-ns-compact.svg`, `public/favicon.svg`
- **Cor primária de marca**: Dourado `#D4AF37` / `#C9A96E`

### Paleta de Cores CSS Custom Properties

```css
:root {
  --color-bg: #F8F7F4;
  --color-surface: #FFFFFF;
  --color-border: #E8E4DD;
  --color-text: #1A1A1A;
  --color-text-muted: #6B6560;
  --color-primary: #D4AF37;
  --color-primary-dark: #B8962E;
  --color-primary-light: #F0E6C8;
  --color-accent: #1A1A1A;
  --color-success: #22C55E;
  --color-danger: #EF4444;
  --color-warning: #F59E0B;
  --color-info: #3B82F6;
  --color-shadow: rgba(212, 175, 55, 0.08);
}

.dark {
  --color-bg: #0F0F0F;
  --color-surface: #1A1A1A;
  --color-border: #2A2724;
  --color-text: #F5F3EF;
  --color-text-muted: #9A9590;
  --color-primary: #D4AF37;
  --color-primary-dark: #E5C44A;
  --color-primary-light: #2A2418;
  --color-accent: #F5F3EF;
  --color-success: #22C55E;
  --color-danger: #EF4444;
  --color-warning: #F59E0B;
  --color-info: #3B82F6;
  --color-shadow: rgba(212, 175, 55, 0.05);
}
```

### Tipografia
- Font principal: fonte serif ou sans-serif elegante (definida pela skill `frontend-design`)
- Headings: `font-bold tracking-tight`
- Body: `text-sm leading-relaxed`
- Border radius: `rounded-xl` (12px) para cards, `rounded-lg` (8px) para inputs/botões
- Padding de cards: `p-6`
- Espaçamento entre seções: `gap-6`

### Regra 60-30-10
- **60%** → fundo neutro claro/escuro (`--color-bg`)
- **30%** → superfícies (cards, sidebar) (`--color-surface`)
- **10%** → destaque dourado (`--color-primary`) + preto/branco (`--color-accent`)

## Referência de UI/UX

Ao implementar qualquer tela, use as skills `ui-ux-pro-max` e `frontend-design` como referência principal de design. Não use um template fixo. Priorize:
- Cards com sombras suaves, bordas arredondadas, hierarquia visual clara
- Contraste adequado, feedbacks visuais
- Botões com hover states elegantes, inputs com focus rings dourados
- Tabelas limpas com estados de loading (skeleton)
- Responsividade mobile-first

## Stack e Ferramentas

```javascript
// Core
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Styling
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Forms
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Charts
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie, Line, Bar, Doughnut } from 'react-chartjs-2';

// Formatação (SEMPRE pt-BR)
import { format, parseISO, isToday, isTomorrow, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Ícones
import { LucideIcon } from 'lucide-react';
```

## Componentes Base Clínicos

### 1. Card de KPI Clínico

```tsx
interface ClinicKPICardProps {
  titulo: string;
  valor: string | number;
  icone?: React.ComponentType<{ className?: string }>;
  variante?: 'padrao' | 'sucesso' | 'alerta' | 'perigo' | 'dourado';
  tendencia?: {
    percentual: number;
    direcao: 'alta' | 'baixa';
    periodo: string;
  };
}

export function ClinicKPICard({
  titulo,
  valor,
  icone: Icone,
  variante = 'padrao',
  tendencia
}: ClinicKPICardProps) {
  const classeVariante = {
    padrao: 'bg-[var(--color-surface)] border-[var(--color-border)]',
    sucesso: 'bg-green-50 border-green-200',
    alerta: 'bg-yellow-50 border-yellow-200',
    perigo: 'bg-red-50 border-red-200',
    dourado: 'bg-[var(--color-primary-light)] border-[var(--color-primary)]'
  };

  return (
    <div className={cn(
      "p-6 rounded-xl border shadow-sm transition-all hover:shadow-md",
      classeVariante[variante]
    )}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-[var(--color-text-muted)]">
          {titulo}
        </span>
        {Icone && (
          <div className="p-2 bg-[var(--color-primary)] rounded-lg text-white">
            <Icone className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-[var(--color-text)]">{valor}</div>
      {tendencia && (
        <div className="flex items-center text-sm mt-2">
          <span className={cn(
            "font-medium",
            tendencia.direcao === 'alta' ? 'text-green-600' : 'text-red-600'
          )}>
            {tendencia.direcao === 'alta' ? '↗' : '↘'} {tendencia.percentual}%
          </span>
          <span className="text-[var(--color-text-muted)] ml-2">{tendencia.periodo}</span>
        </div>
      )}
    </div>
  );
}
```

### 2. Card de Agendamento

```tsx
interface AgendamentoCardProps {
  horario: string;
  paciente: string;
  procedimento: string;
  profissional: string;
  status: 'agendado' | 'confirmado' | 'em_atendimento' | 'concluido' | 'cancelado' | 'faltou';
  onConfirmar?: () => void;
  onIniciar?: () => void;
  onCancelar?: () => void;
}

const statusConfig = {
  agendado: { label: 'Agendado', cor: 'bg-blue-100 text-blue-800' },
  confirmado: { label: 'Confirmado', cor: 'bg-green-100 text-green-800' },
  em_atendimento: { label: 'Em Atendimento', cor: 'bg-yellow-100 text-yellow-800' },
  concluido: { label: 'Concluído', cor: 'bg-gray-100 text-gray-800' },
  cancelado: { label: 'Cancelado', cor: 'bg-red-100 text-red-700' },
  faltou: { label: 'Faltou', cor: 'bg-orange-100 text-orange-800' },
};

export function AgendamentoCard({
  horario, paciente, procedimento, profissional, status,
  onConfirmar, onIniciar, onCancelar
}: AgendamentoCardProps) {
  const { label, cor } = statusConfig[status];

  return (
    <div className="flex items-center gap-4 p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl hover:shadow-sm transition-all">
      <div className="text-lg font-bold text-[var(--color-primary)] min-w-[60px]">
        {horario}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-[var(--color-text)] truncate">{paciente}</p>
        <p className="text-sm text-[var(--color-text-muted)]">{procedimento} • {profissional}</p>
      </div>
      <span className={cn("px-3 py-1 rounded-full text-xs font-medium", cor)}>
        {label}
      </span>
    </div>
  );
}
```

### 3. Timeline do Prontuário

```tsx
interface EntradaProntuario {
  id: string;
  data: string;
  tipo: 'atendimento' | 'prescricao' | 'documento' | 'foto' | 'anotacao';
  titulo: string;
  descricao: string;
  profissional: string;
}

export function ProntuarioTimeline({ entradas }: { entradas: EntradaProntuario[] }) {
  const iconesTipo = {
    atendimento: '📋',
    prescricao: '💊',
    documento: '📄',
    foto: '📸',
    anotacao: '✏️',
  };

  return (
    <div className="space-y-4">
      {entradas.map((entrada, idx) => (
        <div key={entrada.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <span className="text-xl">{iconesTipo[entrada.tipo]}</span>
            {idx < entradas.length - 1 && (
              <div className="w-px flex-1 bg-[var(--color-border)] mt-2" />
            )}
          </div>
          <div className="flex-1 pb-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-[var(--color-text)]">{entrada.titulo}</span>
              <span className="text-xs text-[var(--color-text-muted)]">
                {format(parseISO(entrada.data), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </span>
            </div>
            <p className="text-sm text-[var(--color-text-muted)]">{entrada.descricao}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Dr(a). {entrada.profissional}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
```

### 4. Tabela de Estoque

```tsx
interface ProdutoEstoque {
  id: string;
  nome: string;
  categoria: string;
  quantidade: number;
  estoqueMinimo: number;
  unidade: string;
  ultimaMovimentacao: string;
}

export function EstoqueTable({ produtos, loading }: { produtos: ProdutoEstoque[]; loading?: boolean }) {
  if (loading) return <TableSkeleton linhas={5} colunas={6} />;

  return (
    <div className="bg-[var(--color-surface)] rounded-xl shadow-sm border border-[var(--color-border)] overflow-hidden">
      <div className="px-6 py-4 border-b border-[var(--color-border)]">
        <h3 className="text-lg font-semibold text-[var(--color-text)]">Estoque de Produtos</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[var(--color-border)]">
          <thead className="bg-[var(--color-bg)]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase">Produto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase">Categoria</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-[var(--color-text-muted)] uppercase">Quantidade</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-[var(--color-text-muted)] uppercase">Mínimo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase">Última Movimentação</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-[var(--color-text-muted)] uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {produtos.map((produto) => {
              const estoqueBaixo = produto.quantidade <= produto.estoqueMinimo;
              return (
                <tr key={produto.id} className="hover:bg-[var(--color-bg)] transition-colors">
                  <td className="px-6 py-4 font-medium text-[var(--color-text)]">{produto.nome}</td>
                  <td className="px-6 py-4 text-sm text-[var(--color-text-muted)]">{produto.categoria}</td>
                  <td className="px-6 py-4 text-center text-sm">{produto.quantidade} {produto.unidade}</td>
                  <td className="px-6 py-4 text-center text-sm text-[var(--color-text-muted)]">{produto.estoqueMinimo}</td>
                  <td className="px-6 py-4 text-sm text-[var(--color-text-muted)]">
                    {format(parseISO(produto.ultimaMovimentacao), 'dd/MM/yyyy', { locale: ptBR })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      estoqueBaixo ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                    )}>
                      {estoqueBaixo ? 'Estoque Baixo' : 'Normal'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

### 5. Input Monetário (Financeiro Clínico)

```tsx
interface MoneyInputProps {
  label: string;
  valor: number;
  onChange: (valor: number) => void;
  placeholder?: string;
  erro?: string;
  desabilitado?: boolean;
}

export function MoneyInput({ label, valor, onChange, placeholder, erro, desabilitado }: MoneyInputProps) {
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    setDisplayValue(formatarMoedaInput(valor));
  }, [valor]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const numerico = parseMoedaInput(raw);
    setDisplayValue(formatarMoedaInput(numerico));
    onChange(numerico);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[var(--color-text)]">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-[var(--color-text-muted)] text-sm">R$</span>
        </div>
        <input
          type="text"
          value={displayValue}
          onChange={handleChange}
          disabled={desabilitado}
          placeholder={placeholder}
          className={cn(
            "block w-full pl-10 pr-3 py-3 border rounded-lg text-[var(--color-text)]",
            "focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent",
            "bg-[var(--color-surface)] shadow-sm transition-all",
            erro ? "border-red-300 focus:ring-red-500" : "border-[var(--color-border)]",
            desabilitado && "opacity-50 cursor-not-allowed"
          )}
        />
      </div>
      {erro && <p className="text-sm text-red-600">{erro}</p>}
    </div>
  );
}
```

## Validação e Formatação

### Schemas Zod para Formulários Clínicos

```typescript
export const agendamentoSchema = z.object({
  pacienteId: z.string().uuid("Paciente inválido"),
  profissionalId: z.string().uuid("Profissional inválido"),
  procedimentoId: z.string().uuid("Procedimento inválido"),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD"),
  horario: z.string().regex(/^\d{2}:\d{2}$/, "Horário deve estar no formato HH:mm"),
  observacoes: z.string().max(500, "Máximo de 500 caracteres").optional(),
});

export const pacienteSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").max(255),
  cpf: z.string().regex(/^\d{11}$/, "CPF inválido"),
  email: z.string().email("E-mail inválido").optional().or(z.literal('')),
  telefone: z.string().min(10, "Telefone inválido").max(11),
  dataNascimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  endereco: z.object({
    cep: z.string().regex(/^\d{8}$/, "CEP inválido").optional(),
    logradouro: z.string().optional(),
    numero: z.string().optional(),
    bairro: z.string().optional(),
    cidade: z.string().optional(),
    estado: z.string().length(2, "UF inválida").optional(),
  }).optional(),
});

export const orcamentoSchema = z.object({
  pacienteId: z.string().uuid("Paciente inválido"),
  itens: z.array(z.object({
    procedimentoId: z.string().uuid("Procedimento inválido"),
    quantidade: z.number().int().positive("Quantidade deve ser positiva"),
    valorUnitario: z.number().positive("Valor deve ser positivo").multipleOf(0.01),
    desconto: z.number().min(0).max(100, "Desconto máximo é 100%").optional(),
  })).min(1, "Adicione pelo menos um procedimento"),
  validade: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  observacoes: z.string().max(1000).optional(),
});
```

### Utilitários de Formatação (pt-BR)

```typescript
export const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);
};

export const formatarData = (data: string | Date): string => {
  const d = typeof data === 'string' ? parseISO(data) : data;
  return format(d, 'dd/MM/yyyy', { locale: ptBR });
};

export const formatarDataHora = (data: string | Date): string => {
  const d = typeof data === 'string' ? parseISO(data) : data;
  return format(d, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
};

export const formatarTelefone = (telefone: string): string => {
  const limpo = telefone.replace(/\D/g, '');
  if (limpo.length === 11) return limpo.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  if (limpo.length === 10) return limpo.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  return telefone;
};

export const formatarCPF = (cpf: string): string => {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};
```

## Checklist de Implementação

- [ ] Todas as labels, mensagens e textos em pt-BR
- [ ] Logo "NS" presente na sidebar/navbar
- [ ] Paleta dourada aplicada como cor primária
- [ ] Datas formatadas com locale ptBR (`dd/MM/yyyy`)
- [ ] Moedas formatadas como R$ (`Intl.NumberFormat pt-BR`)
- [ ] Telefones formatados com máscara brasileira
- [ ] CPF formatado com máscara
- [ ] Status traduzidos para português
- [ ] Responsividade mobile-first testada
- [ ] Skeleton loading para estados de carregamento
- [ ] Empty states com mensagem em português e ação sugerida
- [ ] Acessibilidade: contraste ≥ 4.5:1, labels em inputs, focus visible
- [ ] Dark mode com variáveis CSS alternadas

## Referências Visuais do Nicho (Estética / Saúde Premium)

Consulte estas referências antes de desenhar qualquer tela. Absorva padrões, não copie layouts.

### Dashboards clínicos (estrutura, KPIs, densidade)
- [Nexura Care Dashboard — Healthcare Platform](https://www.behance.net/gallery/246611721) — Mohammed Agami
  *Absorver: grade de KPIs 4-col, cards com borda sutil, hierarquia clara.*
- [Clinicgo — Medical Clinic Management Dashboard](https://www.behance.net/gallery/244279075) — Ananto Nugroho Putra
  *Absorver: timeline de agenda, lista de pacientes em linha editorial.*
- [Dental Clinic Dashboard | Bright Smile](https://www.behance.net/gallery/245817173)
  *Absorver: uso de cor de marca como accent discreto.*

### Estética / cosmetologia (tom premium, tipografia, dourado)
- [Skin Science | Cosmetology clinic](https://www.behance.net/gallery/240578269)
- [Клиника эстетической медицины | Cosmetology clinic](https://www.behance.net/gallery/246096077) — Irina Shilnikova
- [The Place — Aesthetics & Wellness](https://www.behance.net/gallery/237621135) — Four Studio&CO
- [Cosmetology Clinic Website](https://www.behance.net/gallery/231018027) — Julia Emelianova
  *Absorver: tipografia serif editorial, ouro discreto, fotografia emotiva.*
- [Orskin Aesthetic Clinic Website](https://www.behance.net/gallery/246341293)
- [Сosmetology beauty clinic — UX/UI](https://www.behance.net/gallery/244220549) — Margarita Torokhova

### Sistemas de gestão de clínica (fluxos operacionais)
- [كلينيكا Clinic Management System UX/UI](https://www.behance.net/gallery/239932145)
- [IMDAD — Digital Application in the Aesthetic Industry](https://www.behance.net/gallery/208114965)
- [Nursing Management & Patient Monitoring](https://www.behance.net/gallery/245001703)

### Outros (catálogos para inspiração)
- Dribbble tag: https://dribbble.com/tags/clinic-dashboard
- Dribbble tag: https://dribbble.com/tags/aesthetic-clinic

## Pairings Tipográficos Pré-Aprovados

Escolha **um** por projeto (nunca misture pairings).

| Pair | Display (H1–H3) | Body | Tom |
|---|---|---|---|
| **Elegância Clássica** *(padrão recomendado)* | Playfair Display | Inter | Sofisticação atemporal |
| **Editorial Refinado** | Cormorant Garamond | DM Sans | Alta costura, luxo |
| **Moderno Premium** | Fraunces | Geist | Contemporâneo com caráter |

**NUNCA** use: Inter puro sem display serif, Roboto, Arial, Comic Sans, Montserrat como display único.

## Exemplos Faça / Não Faça

### Card KPI
✅ Faça: fundo `--color-surface`, borda 1px `--color-border`, label em sans uppercase tracking-wide muted, valor grande em **serif** (Playfair), variação vs período anterior em sans com seta Lucide, sombra `0 1px 2px var(--color-shadow)`.

❌ Não faça: fundo gradiente roxo→azul, ícone emoji (📊), valor em Inter bold, sombra dramática tipo "neumorphism".

### Linha de Agenda
✅ Faça: hora em serif à esquerda, nome do paciente em sans medium, procedimento em sans muted, fio dourado 2px à esquerda para status "confirmado", borda inferior 1px `--color-border`, hover sutil com bg `--color-primary-light`.

❌ Não faça: status como "badge" colorido grande, alternância de cor de linha (zebrado), ícones emoji.

### Ficha de Paciente
✅ Faça: foto circular 80px com borda 2px `--color-primary`, nome H1 serif, meta em sans muted, abas em sans com underline dourado no ativo, densidade editorial (max-width 960px).

❌ Não faça: tabs estilo "pill" colorido, avatar quadrado, layout full-width sem margens.

### Tabela Financeira
✅ Faça: header em sans uppercase tracking-wide muted, valores em **tabular-nums** alinhados à direita, positivo em `--color-success`, negativo em `--color-danger`, linhas com padding vertical generoso (py-4).

❌ Não faça: bordas em toda célula (grade completa), cores de fundo alternadas berrantes, valores centralizados.
