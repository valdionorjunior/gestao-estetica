# Lições Aprendidas — Desenvolvimento Gestão Estética

## 🔴 Problemas Identificados (16/04/2026)

### 1. **Testes Unitários ≠ Integração com Banco Real**

**Problema**: 46 testes unitários passaram, mas o sistema falhou ao rodar contra o PostgreSQL real.

**Causa Raiz**:
- Testes usavam mocks (`jest.fn()`) do TypeORM Repository
- Entidades TypeORM não foram validadas contra schema real do Flyway
- Nenhum teste de integração executado antes de marcar fases como "concluídas"

**Erros Encontrados**:
```
1. Data type "Object" in "User.refreshTokenHash" is not supported by "postgres" database
   → CAUSA: Faltou declarar `type: 'text'` em colunas nullable
   
2. Data type "Object" in "Paciente.telefone" is not supported by "postgres" database
   → CAUSA: Faltou declarar `type: 'varchar'` em colunas com `length`
   
3. column User.password_hash does not exist
   → CAUSA: Migration criou `senha_hash`, entidade TypeORM usava `password_hash`
```

**Impacto**:
- Backend não subia na primeira tentativa
- 8 entidades precisaram de correção manual após "conclusão" das fases 3-8
- Perda de confiança no processo de validação por fase

---

## ✅ Melhorias Obrigatórias no Processo

### **FASE 2 — Migrações Flyway**

**ADICIONAR ao final da fase**:
```bash
# Após aplicar migrations, extrair schema real do PostgreSQL
docker exec estetica_postgres pg_dump -U estetica_user -d estetica_ns --schema-only > /tmp/schema_real.sql

# Validar que todas as tabelas esperadas existem
docker exec estetica_postgres psql -U estetica_user -d estetica_ns -c "\dt" | grep -E "users|pacientes|agendamentos|prontuarios|contas_financeiras|produtos|movimentacoes_estoque"
```

**CHECKLIST obrigatório**:
- [ ] Todas as 22 tabelas criadas
- [ ] Seeds aplicados (verificar contagem de registros)
- [ ] Schema exportado para `/tmp/schema_real.sql` para validação futura

---

### **FASES 3-8 — Desenvolvimento Backend**

**ADICIONAR testes de integração ANTES de marcar como concluída**:

#### **Passo 1: Validar Entidades TypeORM contra Schema Real**

```bash
# Após criar entidades, validar sincronização
cd estetica-backend
npm run start:dev

# Verificar logs de inicialização:
# ✓ TypeOrmModule dependencies initialized
# ✓ [NestApplication] Nest application successfully started

# Se houver erro "Data type Object", corrigir IMEDIATAMENTE:
# - Adicionar `type: 'uuid'` para colunas de ID (clinicaId, pacienteId, etc.)
# - Adicionar `type: 'text'` para colunas TEXT nullable
# - Adicionar `type: 'varchar'` para colunas com `length`
# - Adicionar `type: 'timestamp'` para colunas Date nullable
```

#### **Passo 2: Teste de Smoke (API Health Check)**

```bash
# Criar teste de smoke básico
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Teste",
    "email": "teste@example.com",
    "password": "Test123!",
    "role": "ADMIN"
  }'

# Espera: HTTP 201 ou 409 (se já existe)
# NÃO ESPERA: HTTP 500 Internal Server Error
```

#### **Passo 3: Testes de Integração por Módulo**

Criar arquivo `test/integration/<modulo>.integration.spec.ts`:

```typescript
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';

describe('<Módulo> Integration Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'estetica_user',
          password: 'estetica_pass',
          database: 'estetica_ns_test', // ⚠️ DB separado para testes
          synchronize: false, // ⚠️ NUNCA true em produção
          entities: ['src/domain/entities/*.entity.ts'],
        }),
        <ModuloModule>,
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('deve criar um registro no banco real', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/<rota>')
      .send({ /* dados */ });

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });
});
```

**EXECUTAR testes de integração**:
```bash
npm run test:integration
```

---

## 🎯 Checklist de Validação por Fase

### **Fase 3 — Autenticação**
- [ ] Testes unitários passando (10 tests)
- [ ] Backend inicia sem erros TypeORM
- [ ] `POST /auth/register` retorna 201 (smoke test)
- [ ] `POST /auth/login` retorna 200 com tokens
- [ ] Tokens JWT são válidos e não expiram imediatamente

### **Fase 4 — Pacientes**
- [ ] Testes unitários passando (18 tests)
- [ ] Entity `Paciente` sincroniza com tabela `pacientes`
- [ ] `GET /pacientes` retorna 200 (mesmo vazio)
- [ ] `POST /pacientes` cria registro no banco real
- [ ] CPF é criptografado corretamente (AES-256-GCM)

### **Fase 5 — Agenda**
- [ ] Testes unitários passando (26 tests)
- [ ] `POST /agenda` detecta conflitos de horário
- [ ] `PATCH /agenda/:id/status` atualiza timestamps (`confirmadoEm`, `canceladoEm`)

### **Fase 6 — Prontuário**
- [ ] Testes unitários passando (33 tests)
- [ ] Campos sensíveis são criptografados (histórico médico, alergias, medicamentos)
- [ ] Fichas FECHADAS não podem ser editadas (ForbiddenException)

### **Fase 7 — Financeiro**
- [ ] Dashboard retorna saldo correto (receitas - despesas)
- [ ] `PATCH /financeiro/contas/:id/pagar` marca como PAGO

### **Fase 8 — Estoque**
- [ ] Movimentação SAIDA valida estoque negativo
- [ ] Alertas retornam produtos abaixo do estoque mínimo

### **Fase 9 — Relatórios**
- [ ] Relatórios retornam dados agregados válidos
- [ ] Query de agregação não causa timeout

---

## 📋 Template de Entidade TypeORM Validado

**USAR SEMPRE tipos explícitos**:

```typescript
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('nome_tabela')
export class MinhaEntidade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ✅ UUID columns
  @Column({ type: 'uuid', name: 'clinica_id', nullable: true })
  clinicaId: string | null;

  // ✅ VARCHAR columns
  @Column({ type: 'varchar', length: 200 })
  nome: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string | null;

  // ✅ TEXT columns
  @Column({ type: 'text', nullable: true })
  observacoes: string | null;

  // ✅ TIMESTAMP columns
  @Column({ type: 'timestamp', name: 'ultimo_login', nullable: true })
  ultimoLogin: Date | null;

  // ✅ DECIMAL columns
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  valor: number;

  // ✅ ENUM columns
  @Column({ type: 'enum', enum: MeuEnum, default: MeuEnum.VALOR_PADRAO })
  status: MeuEnum;

  // ✅ DATE columns
  @Column({ type: 'date', nullable: true })
  dataNascimento: Date | null;
}
```

**❌ NUNCA FAZER**:
```typescript
@Column({ name: 'clinica_id', nullable: true }) // ❌ Sem type
clinicaId: string;

@Column({ length: 100, nullable: true }) // ❌ Sem type
nome: string;

@Column({ nullable: true }) // ❌ Sem type
observacoes: string;
```

---

## 🔧 Script de Validação Pós-Fase

**Criar**: `estetica-backend/scripts/validate-phase.sh`

```bash
#!/bin/bash
set -e

echo "🔍 Validando Fase..."

# 1. Verificar se backend compila
echo "1️⃣ Compilando TypeScript..."
npm run build

# 2. Verificar se banco está acessível
echo "2️⃣ Testando conexão com PostgreSQL..."
docker exec estetica_postgres pg_isready -U estetica_user -d estetica_ns

# 3. Tentar iniciar backend
echo "3️⃣ Iniciando backend (timeout 20s)..."
timeout 20s npm run start:dev || {
  echo "❌ Backend falhou ao iniciar!"
  exit 1
}

# 4. Smoke test
echo "4️⃣ Testando rota de saúde..."
curl -f http://localhost:3000/api/docs > /dev/null || {
  echo "❌ Swagger não está acessível!"
  exit 1
}

# 5. Executar testes unitários
echo "5️⃣ Executando testes unitários..."
npm test

echo "✅ Validação concluída com sucesso!"
```

**Executar ao final de cada fase**:
```bash
cd estetica-backend
chmod +x scripts/validate-phase.sh
./scripts/validate-phase.sh
```

---

## 🎓 Lições para Próximos Projetos

1. **Testes unitários são necessários, mas não suficientes**
   - Sempre adicionar testes de integração com banco real
   - Usar banco de testes separado (`estetica_ns_test`)

2. **TypeORM exige tipos explícitos em todas as colunas**
   - Criar template de entidade validado
   - Executar `npm run start:dev` após criar/alterar entidades

3. **Migrations ≠ Entidades**
   - Nomes de colunas devem ser EXATAMENTE iguais (ex: `senha_hash` vs `password_hash`)
   - Validar mapeamento `@Column({ name: 'nome_real_coluna' })`

4. **Validação incremental é essencial**
   - Não marcar fase como "concluída" até backend subir SEM ERROS
   - Um erro TypeORM na fase 3 se propaga para fases 4-11

5. **Script de validação automatizado**
   - Compilar → Conectar DB → Iniciar → Smoke test → Testes unitários
   - Salva tempo e evita retrabalho

---

## 📊 Métricas de Qualidade

### ❌ Antes das Melhorias
- Testes unitários: 46/46 ✅
- Backend inicia: ❌ (8 erros TypeORM)
- Smoke test: ❌ (HTTP 500)
- Tempo de correção: ~30min

### ✅ Depois das Melhorias (meta)
- Testes unitários: 46/46 ✅
- Testes de integração: 15/15 ✅
- Backend inicia: ✅ (0 erros)
- Smoke test: ✅ (HTTP 201)
- Tempo de correção: 0min

---

**Data**: 16/04/2026  
**Status**: Documentado após identificação de problemas nas Fases 3-9  
**Autor**: Agente de Desenvolvimento
