# Testes de Integração — Backend

## 📋 Visão Geral

Testes de integração validam o sistema **end-to-end** com banco de dados real, garantindo que:

- ✅ Entidades TypeORM sincronizam corretamente com PostgreSQL
- ✅ Endpoints funcionam com dados reais
- ✅ Migrations Flyway são compatíveis com entidades
- ✅ Validações e regras de negócio persistem no banco

**Diferença dos testes unitários**:
- Testes unitários: usam mocks (`jest.fn()`), não tocam no banco
- Testes de integração: usam banco PostgreSQL real, validam persistência

---

## 🚀 Como Executar

### Pré-requisitos

1. **Criar banco de testes**:
```bash
docker exec -it estetica_postgres psql -U estetica_user -c "CREATE DATABASE estetica_ns_test;"
```

2. **Aplicar migrations no banco de testes**:
```bash
cd estetica-backend

# Configurar Flyway para banco de testes
export FLYWAY_URL=jdbc:postgresql://localhost:5432/estetica_ns_test
export FLYWAY_USER=estetica_user
export FLYWAY_PASSWORD=estetica_pass

# Aplicar migrations
npx flyway migrate
```

3. **Copiar .env de testes**:
```bash
cp .env.test.example .env.test
```

### Executar Testes

```bash
# Todos os testes de integração
npm run test:integration

# Teste específico
npm run test:integration -- auth.integration.spec.ts

# Com cobertura
npm run test:integration -- --coverage
```

---

## 📂 Estrutura

```
test/
├── integration/
│   ├── auth.integration.spec.ts       # ✅ Criado
│   ├── pacientes.integration.spec.ts  # TODO
│   ├── agenda.integration.spec.ts     # TODO
│   ├── prontuario.integration.spec.ts # TODO
│   └── financeiro.integration.spec.ts # TODO
├── jest-integration.json
└── README.md (este arquivo)
```

---

## ✍️ Como Escrever um Teste de Integração

### Template Básico

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { <Modulo>Module } from '../../src/<modulo>.module';
import { <Entity> } from '../../src/domain/entities/<entity>.entity';

describe('<Modulo> Integration Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'estetica_user',
          password: 'estetica_pass',
          database: 'estetica_ns_test', // ⚠️ Banco de testes
          synchronize: false,
          entities: [<Entity>],
          logging: false,
        }),
        <Modulo>Module,
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('deve criar um registro no banco real', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/<rota>')
      .send({ /* dados */ })
      .expect(201);

    expect(response.body.id).toBeDefined();
  });
});
```

---

## ⚠️ Boas Práticas

### DO ✅

1. **Usar banco de testes separado** (`estetica_ns_test`)
   ```typescript
   database: 'estetica_ns_test'
   ```

2. **Desabilitar sincronização automática**
   ```typescript
   synchronize: false // NUNCA true em produção
   ```

3. **Usar dados únicos por teste**
   ```typescript
   email: `teste-${Date.now()}@example.com`
   ```

4. **Limpar dados de teste após execução**
   ```typescript
   afterAll(async () => {
     await repository.delete({ email: /teste-/ });
   });
   ```

5. **Validar erros esperados**
   ```typescript
   await request(app.getHttpServer())
     .post('/rota')
     .send({ dados: 'invalidos' })
     .expect(400); // Validar que retorna erro
   ```

### DON'T ❌

1. ❌ **NUNCA usar banco de produção** (`estetica_ns`)
2. ❌ **NUNCA usar `synchronize: true`** (pode destruir dados)
3. ❌ **NUNCA usar `dropSchema: true`** (apaga todas as tabelas)
4. ❌ **NUNCA commitar `.env.test`** com dados sensíveis
5. ❌ **NUNCA depender de ordem de execução** entre testes

---

## 🧪 Checklist por Módulo

### Auth (✅ Implementado)
- [x] Registro de usuário
- [x] Login com credenciais válidas
- [x] Rejeitar senha incorreta
- [x] Rejeitar email duplicado
- [x] Proteção de rotas com JWT

### Pacientes (TODO)
- [ ] Criar paciente com CPF criptografado
- [ ] Buscar paciente por ID
- [ ] Listar pacientes com paginação
- [ ] CPF mascarado em respostas
- [ ] Soft delete preserva dados

### Agenda (TODO)
- [ ] Criar agendamento
- [ ] Detectar conflitos de horário
- [ ] Atualizar status (CONFIRMADO, CANCELADO)
- [ ] Timestamps de confirmação/cancelamento

### Prontuário (TODO)
- [ ] Criar prontuário vinculado a paciente
- [ ] Campos sensíveis criptografados
- [ ] Fichas FECHADAS não editáveis
- [ ] Histórico médico persistido

### Financeiro (TODO)
- [ ] Criar conta (RECEITA/DESPESA)
- [ ] Marcar como PAGO
- [ ] Dashboard com saldo correto
- [ ] Agregações por tipo/status

---

## 🐛 Troubleshooting

### Erro: "database estetica_ns_test does not exist"

```bash
docker exec -it estetica_postgres psql -U estetica_user -c "CREATE DATABASE estetica_ns_test;"
```

### Erro: "relation users does not exist"

Aplicar migrations no banco de testes:
```bash
export FLYWAY_URL=jdbc:postgresql://localhost:5432/estetica_ns_test
npx flyway migrate
```

### Erro: "Data type Object in ..."

Entidade TypeORM sem tipo explícito. Adicionar:
```typescript
@Column({ type: 'uuid', name: 'clinica_id', nullable: true })
clinicaId: string | null;
```

### Testes muito lentos

- Usar `--runInBand` (evita paralelização conflitante)
- Aumentar `testTimeout` em `jest-integration.json`
- Verificar índices no banco de testes

---

## 📊 Meta de Cobertura

| Módulo       | Testes Unitários | Testes Integração | Status |
|--------------|------------------|-------------------|--------|
| Auth         | 10/10 ✅         | 8/8 ✅            | OK     |
| Pacientes    | 8/8 ✅           | 0/6 ❌            | TODO   |
| Agenda       | 8/8 ✅           | 0/5 ❌            | TODO   |
| Prontuário   | 7/7 ✅           | 0/6 ❌            | TODO   |
| Financeiro   | 5/5 ✅           | 0/4 ❌            | TODO   |
| Estoque      | 6/6 ✅           | 0/4 ❌            | TODO   |

**Meta**: 100% dos módulos com testes de integração

---

**Última atualização**: 16/04/2026  
**Autor**: Agente de Desenvolvimento
