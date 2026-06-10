---
name: arquitetura-clinica-estetica
description: "Desenvolvimento de sistemas para clínicas de estética seguindo Clean Architecture, DDD e SOLID. Use when: implementar entidades clínicas, agregados de domínio, regras de negócio de agendamento/prontuário/estoque/financeiro, repositórios, casos de uso, validações, auditoria."
---

# Skill: Arquitetura de Sistemas para Clínicas de Estética

## Quando Usar

Esta skill se aplica quando você está:
- Desenvolvendo entidades clínicas (Paciente, Profissional, Agendamento, Prontuario, Procedimento, Produto)
- Implementando regras de negócio do domínio clínico estético
- Criando agregados e value objects para operações da clínica
- Definindo casos de uso clínicos (agendar, abrir prontuário, registrar atendimento, gerenciar estoque)
- Aplicando padrões DDD em contexto de gestão de clínicas
- Trabalhando com financeiro clínico (orçamentos, pacotes de sessões, contratos, fluxo de caixa)
- Validando consistência de dados médicos e integridade de prontuários

## Princípios Obrigatórios

### Clean Architecture para Domínio Clínico

```
src/
├── domain/
│   ├── entities/          # Paciente, Profissional, Agendamento, Prontuario, Procedimento, Produto
│   ├── value-objects/     # Money, HorarioAtendimento, StatusAgendamento, CPF, Telefone
│   ├── aggregates/        # PacienteAggregate, AgendamentoAggregate, ProntuarioAggregate
│   ├── repositories/      # Interfaces: IPacienteRepo, IAgendamentoRepo, IProntuarioRepo
│   └── services/          # DomainServices: AgendaService, EstoqueService, OrcamentoCalculator
├── application/
│   ├── use-cases/         # CriarAgendamento, AbrirProntuario, RegistrarAtendimento, GerarOrcamento
│   ├── dtos/              # CriarAgendamentoDto, CriarPacienteDto, etc.
│   └── mappers/           # Entity <-> DTO mappers
├── infrastructure/
│   ├── repositories/      # PacienteRepository, AgendamentoRepository
│   ├── persistence/       # TypeORM entities, migrations
│   └── external-services/ # WhatsApp API, Email, Storage (fotos/docs)
└── presentation/
    ├── controllers/       # PacienteController, AgendamentoController, ProntuarioController
    └── middlewares/       # AuthMiddleware, AuditMiddleware, RoleMiddleware
```

### Value Objects Obrigatórios

```typescript
// Money Value Object (reutilizado do domínio financeiro)
export class Money {
  constructor(
    private readonly amount: number,
    private readonly currency: Currency = Currency.BRL
  ) {
    this.validateAmount(amount);
  }

  private validateAmount(amount: number): void {
    if (!Number.isFinite(amount) || amount < 0) {
      throw new Error('Valor deve ser um número finito positivo');
    }
    if (this.hasMoreThan2Decimals(amount)) {
      throw new Error('Valor não pode ter mais de 2 casas decimais');
    }
  }

  add(other: Money): Money {
    this.ensureSameCurrency(other);
    return new Money(this.amount + other.amount, this.currency);
  }

  subtract(other: Money): Money {
    this.ensureSameCurrency(other);
    return new Money(this.amount - other.amount, this.currency);
  }

  toNumber(): number {
    return this.amount;
  }
}

// Horário de Atendimento Value Object
export class HorarioAtendimento {
  constructor(
    private readonly hora: number,
    private readonly minuto: number
  ) {
    if (hora < 0 || hora > 23) throw new Error('Hora inválida');
    if (minuto < 0 || minuto > 59) throw new Error('Minuto inválido');
  }

  toString(): string {
    return `${String(this.hora).padStart(2, '0')}:${String(this.minuto).padStart(2, '0')}`;
  }

  isAfter(other: HorarioAtendimento): boolean {
    return this.toMinutes() > other.toMinutes();
  }

  private toMinutes(): number {
    return this.hora * 60 + this.minuto;
  }
}

// Status de Agendamento
export enum StatusAgendamento {
  AGENDADO = 'AGENDADO',
  CONFIRMADO = 'CONFIRMADO',
  EM_ATENDIMENTO = 'EM_ATENDIMENTO',
  CONCLUIDO = 'CONCLUIDO',
  CANCELADO = 'CANCELADO',
  FALTOU = 'FALTOU',
}

// Tipo de Procedimento
export enum TipoProcedimento {
  FACIAL = 'FACIAL',
  CORPORAL = 'CORPORAL',
  CAPILAR = 'CAPILAR',
  LASER = 'LASER',
  INJETAVEL = 'INJETAVEL',
  CIRURGICO = 'CIRURGICO',
  OUTRO = 'OUTRO',
}

// Status do Prontuário
export enum StatusProntuario {
  ABERTO = 'ABERTO',
  EM_ATENDIMENTO = 'EM_ATENDIMENTO',
  FINALIZADO = 'FINALIZADO',
}
```

### Agregados de Domínio

```typescript
// Paciente Aggregate
export class PacienteAggregate {
  private constructor(
    public readonly id: PacienteId,
    private nome: string,
    private cpf: CPF,
    private telefone: Telefone,
    private email: string | null,
    private dataNascimento: Date,
    private prontuario: Prontuario | null = null,
    private agendamentos: Agendamento[] = []
  ) {}

  static create(dados: CriarPacienteData): PacienteAggregate {
    return new PacienteAggregate(
      PacienteId.generate(),
      dados.nome,
      new CPF(dados.cpf),
      new Telefone(dados.telefone),
      dados.email || null,
      dados.dataNascimento
    );
  }

  abrirProntuario(): Prontuario {
    if (this.prontuario) throw new Error('Paciente já possui prontuário');
    this.prontuario = Prontuario.criar(this.id);
    this.addDomainEvent(new ProntuarioAbertoEvent(this.id, this.prontuario.id));
    return this.prontuario;
  }

  agendarProcedimento(agendamento: Agendamento): void {
    this.agendamentos.push(agendamento);
    this.addDomainEvent(new AgendamentoCriadoEvent(this.id, agendamento.id));
  }
}

// Agendamento Aggregate
export class AgendamentoAggregate {
  private constructor(
    public readonly id: AgendamentoId,
    private pacienteId: PacienteId,
    private profissionalId: ProfissionalId,
    private procedimentoId: ProcedimentoId,
    private data: Date,
    private horarioInicio: HorarioAtendimento,
    private horarioFim: HorarioAtendimento,
    private status: StatusAgendamento,
    private observacoes: string | null
  ) {}

  static criar(dados: CriarAgendamentoData): AgendamentoAggregate {
    if (dados.horarioFim.isAfter(dados.horarioInicio) === false) {
      throw new Error('Horário de término deve ser posterior ao início');
    }
    return new AgendamentoAggregate(
      AgendamentoId.generate(),
      dados.pacienteId,
      dados.profissionalId,
      dados.procedimentoId,
      dados.data,
      dados.horarioInicio,
      dados.horarioFim,
      StatusAgendamento.AGENDADO,
      dados.observacoes || null
    );
  }

  confirmar(): void {
    if (this.status !== StatusAgendamento.AGENDADO) {
      throw new Error('Só é possível confirmar agendamentos com status AGENDADO');
    }
    this.status = StatusAgendamento.CONFIRMADO;
    this.addDomainEvent(new AgendamentoConfirmadoEvent(this.id));
  }

  iniciarAtendimento(): void {
    if (![StatusAgendamento.AGENDADO, StatusAgendamento.CONFIRMADO].includes(this.status)) {
      throw new Error('Não é possível iniciar atendimento neste status');
    }
    this.status = StatusAgendamento.EM_ATENDIMENTO;
  }

  concluir(): void {
    if (this.status !== StatusAgendamento.EM_ATENDIMENTO) {
      throw new Error('Só é possível concluir agendamentos em atendimento');
    }
    this.status = StatusAgendamento.CONCLUIDO;
    this.addDomainEvent(new AgendamentoConcluidoEvent(this.id));
  }

  cancelar(motivo: string): void {
    if (this.status === StatusAgendamento.CONCLUIDO) {
      throw new Error('Não é possível cancelar agendamento já concluído');
    }
    this.status = StatusAgendamento.CANCELADO;
    this.addDomainEvent(new AgendamentoCanceladoEvent(this.id, motivo));
  }

  marcarFalta(): void {
    this.status = StatusAgendamento.FALTOU;
  }
}

// Prontuário Aggregate
export class ProntuarioAggregate {
  private constructor(
    public readonly id: ProntuarioId,
    private pacienteId: PacienteId,
    private fichas: FichaAtendimento[],
    private prescricoes: Prescricao[],
    private documentos: Documento[],
    private dataCriacao: Date
  ) {}

  static criar(pacienteId: PacienteId): ProntuarioAggregate {
    return new ProntuarioAggregate(
      ProntuarioId.generate(),
      pacienteId,
      [],
      [],
      [],
      new Date()
    );
  }

  adicionarFicha(ficha: FichaAtendimento): void {
    this.fichas.push(ficha);
    this.addDomainEvent(new FichaAdicionadaEvent(this.id, ficha.id));
  }

  adicionarPrescricao(prescricao: Prescricao): void {
    this.prescricoes.push(prescricao);
  }

  anexarDocumento(documento: Documento): void {
    this.documentos.push(documento);
  }

  getHistorico(): (FichaAtendimento | Prescricao | Documento)[] {
    return [...this.fichas, ...this.prescricoes, ...this.documentos]
      .sort((a, b) => b.dataCriacao.getTime() - a.dataCriacao.getTime());
  }
}
```

## Padrões de Design Obrigatórios

### 1. Repository Pattern

```typescript
// Interfaces no domínio
export interface IPacienteRepository {
  save(paciente: PacienteAggregate): Promise<void>;
  findById(id: PacienteId): Promise<PacienteAggregate | null>;
  findByCpf(cpf: CPF): Promise<PacienteAggregate | null>;
  search(filtro: FiltroPaciente): Promise<PaginatedResult<PacienteAggregate>>;
}

export interface IAgendamentoRepository {
  save(agendamento: AgendamentoAggregate): Promise<void>;
  findById(id: AgendamentoId): Promise<AgendamentoAggregate | null>;
  findByData(data: Date, profissionalId?: ProfissionalId): Promise<AgendamentoAggregate[]>;
  findConflito(profissionalId: ProfissionalId, data: Date, inicio: HorarioAtendimento, fim: HorarioAtendimento): Promise<AgendamentoAggregate | null>;
}

export interface IProntuarioRepository {
  save(prontuario: ProntuarioAggregate): Promise<void>;
  findByPacienteId(pacienteId: PacienteId): Promise<ProntuarioAggregate | null>;
}

export interface IProdutoRepository {
  save(produto: Produto): Promise<void>;
  findById(id: ProdutoId): Promise<Produto | null>;
  findComEstoqueBaixo(): Promise<Produto[]>;
  registrarMovimentacao(movimentacao: MovimentacaoEstoque): Promise<void>;
}
```

### 2. Strategy Pattern para Cálculos de Orçamento

```typescript
interface IDescontoStrategy {
  calcular(valorBase: Money, parametros: any): Money;
}

class DescontoPacoteStrategy implements IDescontoStrategy {
  calcular(valorBase: Money, parametros: { sessoes: number }): Money {
    const percentual = parametros.sessoes >= 10 ? 0.15
      : parametros.sessoes >= 5 ? 0.10
      : parametros.sessoes >= 3 ? 0.05
      : 0;
    const desconto = valorBase.toNumber() * percentual;
    return new Money(desconto);
  }
}
```

### 3. Domain Services

```typescript
@Injectable()
export class AgendaService {
  constructor(
    private readonly agendamentoRepo: IAgendamentoRepository,
    private readonly profissionalRepo: IProfissionalRepository
  ) {}

  async agendar(dados: CriarAgendamentoData): Promise<AgendamentoAggregate> {
    const profissional = await this.profissionalRepo.findById(dados.profissionalId);
    if (!profissional || !profissional.isAtivo()) {
      throw new Error('Profissional não encontrado ou inativo');
    }

    const conflito = await this.agendamentoRepo.findConflito(
      dados.profissionalId, dados.data, dados.horarioInicio, dados.horarioFim
    );
    if (conflito) {
      throw new Error('Já existe um agendamento neste horário para este profissional');
    }

    const agendamento = AgendamentoAggregate.criar(dados);
    await this.agendamentoRepo.save(agendamento);
    return agendamento;
  }
}

@Injectable()
export class EstoqueService {
  constructor(private readonly produtoRepo: IProdutoRepository) {}

  async registrarEntrada(produtoId: ProdutoId, quantidade: number, motivo: string): Promise<void> {
    const produto = await this.produtoRepo.findById(produtoId);
    if (!produto) throw new Error('Produto não encontrado');

    produto.adicionarEstoque(quantidade);
    await this.produtoRepo.save(produto);
    await this.produtoRepo.registrarMovimentacao(
      MovimentacaoEstoque.criar({ produtoId, tipo: 'ENTRADA', quantidade, motivo })
    );
  }

  async registrarSaida(produtoId: ProdutoId, quantidade: number, motivo: string): Promise<void> {
    const produto = await this.produtoRepo.findById(produtoId);
    if (!produto) throw new Error('Produto não encontrado');
    if (produto.getQuantidade() < quantidade) throw new Error('Estoque insuficiente');

    produto.removerEstoque(quantidade);
    await this.produtoRepo.save(produto);
    await this.produtoRepo.registrarMovimentacao(
      MovimentacaoEstoque.criar({ produtoId, tipo: 'SAIDA', quantidade, motivo })
    );
  }
}
```

## Validações Clínicas Essenciais

### DTOs com Validações

```typescript
export class CriarAgendamentoDto {
  @IsNotEmpty({ message: 'Paciente é obrigatório' })
  @IsUUID(undefined, { message: 'ID de paciente inválido' })
  pacienteId: string;

  @IsNotEmpty({ message: 'Profissional é obrigatório' })
  @IsUUID(undefined, { message: 'ID de profissional inválido' })
  profissionalId: string;

  @IsNotEmpty({ message: 'Procedimento é obrigatório' })
  @IsUUID(undefined, { message: 'ID de procedimento inválido' })
  procedimentoId: string;

  @IsDateString({}, { message: 'Data inválida' })
  data: string;

  @Matches(/^\d{2}:\d{2}$/, { message: 'Horário deve estar no formato HH:mm' })
  horarioInicio: string;

  @Matches(/^\d{2}:\d{2}$/, { message: 'Horário deve estar no formato HH:mm' })
  horarioFim: string;

  @IsOptional()
  @MaxLength(500, { message: 'Observações devem ter no máximo 500 caracteres' })
  observacoes?: string;
}

export class CriarPacienteDto {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @Length(3, 255, { message: 'Nome deve ter entre 3 e 255 caracteres' })
  nome: string;

  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  @Matches(/^\d{10,11}$/, { message: 'Telefone deve ter 10 ou 11 dígitos' })
  telefone: string;

  @IsOptional()
  @Matches(/^\d{11}$/, { message: 'CPF deve ter 11 dígitos' })
  cpf?: string;

  @IsOptional()
  @IsEmail({}, { message: 'E-mail inválido' })
  email?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data de nascimento inválida' })
  dataNascimento?: string;
}
```

### Guards Clínicos

```typescript
@Injectable()
export class ClinicOperationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const method = request.method;
    const path = request.route.path;

    return this.checkClinicPermission(user, method, path);
  }

  private checkClinicPermission(user: UserPayload, method: string, path: string): boolean {
    if (user.role === 'ADMIN') return true;
    if (user.role === 'MEDICO') return this.isMedicoAllowed(method, path);
    if (user.role === 'RECEPCIONISTA') return this.isRecepcionistaAllowed(method, path);
    if (user.role === 'PACIENTE') return this.isPacienteAllowed(method, path);
    return false;
  }
}
```

## Checklist de Implementação

- [ ] Entidades carregam apenas regras de domínio, sem dependências externas
- [ ] Value objects são imutáveis e contêm validações intrínsecas
- [ ] Agregados controlam consistência de agendamentos e prontuários
- [ ] Repositórios abstraem persistência do domínio
- [ ] Casos de uso orquestram operações sem regras de domínio
- [ ] DTOs validam entrada de dados com mensagens em pt-BR
- [ ] Money é tratado como value object, não como number primitivo
- [ ] Conflitos de horário na agenda são validados no domínio
- [ ] Estoque valida quantidades e registra movimentações
- [ ] Prontuário mantém histórico completo e imutável
- [ ] Operações críticas são auditadas
- [ ] Guards protegem rotas por role (ADMIN, MÉDICO, RECEPCIONISTA, PACIENTE)

## Anti-Patterns a Evitar

- **Anemic Domain Model**: Entidades sem comportamento, apenas getters/setters
- **Fat Controllers**: Lógica de negócio em controllers
- **Direct Database Dependency**: Domain dependendo de TypeORM ou PostgreSQL
- **Primitive Obsession**: Usar string/number para CPF, telefone, valores monetários
- **Missing Conflict Validation**: Permitir agendamentos conflitantes
- **Prontuário Mutável**: Alterar fichas já fechadas sem auditoria
- **Weak Validation**: Permitir dados inválidos em qualquer camada
- **Mixed Concerns**: Misturar regra de agendamento com lógica financeira
