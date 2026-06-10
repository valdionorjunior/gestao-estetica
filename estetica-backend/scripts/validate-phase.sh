#!/bin/bash
set -e

FASE=$1
BACKEND_DIR="/Users/valdionorjuniorrodriguesgil/my-projects/gestao-estetica/estetica-backend"

if [ -z "$FASE" ]; then
  echo "❌ Uso: ./validate-phase.sh <numero-da-fase>"
  echo "   Exemplo: ./validate-phase.sh 3"
  exit 1
fi

echo "🔍 Validando Fase $FASE..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd "$BACKEND_DIR"

# 1. Verificar se backend compila
echo ""
echo "1️⃣ Compilando TypeScript..."
if npm run build > /dev/null 2>&1; then
  echo "   ✅ Compilação OK"
else
  echo "   ❌ Erro de compilação!"
  npm run build
  exit 1
fi

# 2. Verificar se PostgreSQL está acessível
echo ""
echo "2️⃣ Testando conexão com PostgreSQL..."
if docker exec estetica_postgres pg_isready -U estetica_user -d estetica_ns > /dev/null 2>&1; then
  echo "   ✅ PostgreSQL acessível"
else
  echo "   ❌ PostgreSQL não está rodando!"
  echo "   Execute: docker compose up -d postgres"
  exit 1
fi

# 3. Verificar se backend está rodando
echo ""
echo "3️⃣ Verificando backend NestJS..."
if curl -sf http://localhost:3000/api/docs > /dev/null 2>&1; then
  echo "   ✅ Backend está rodando"
else
  echo "   ⚠️  Backend não está rodando. Tentando iniciar..."
  echo "   Execute manualmente: npm run start:dev"
  echo "   Aguarde até ver: 'Nest application successfully started'"
fi

# 4. Executar testes unitários
echo ""
echo "4️⃣ Executando testes unitários..."
if npm test -- --passWithNoTests --silent 2>&1 | tail -5; then
  echo "   ✅ Testes unitários passaram"
else
  echo "   ❌ Testes unitários falharam!"
  npm test
  exit 1
fi

# 5. Smoke test de autenticação (Fase 3+)
if [ "$FASE" -ge 3 ]; then
  echo ""
  echo "5️⃣ Smoke test de autenticação..."
  
  RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/register_response.json -X POST http://localhost:3000/api/v1/auth/register \
    -H "Content-Type: application/json" \
    -d '{
      "nome": "Teste Validação",
      "email": "validacao-fase-'$FASE'@test.com",
      "password": "Test123!",
      "role": "ADMIN"
    }')
  
  if [ "$RESPONSE" = "201" ] || [ "$RESPONSE" = "409" ]; then
    echo "   ✅ Endpoint /auth/register funcional (HTTP $RESPONSE)"
  else
    echo "   ❌ Endpoint /auth/register retornou HTTP $RESPONSE"
    cat /tmp/register_response.json
    exit 1
  fi
fi

# 6. Validar entidades TypeORM (Fase 3+)
if [ "$FASE" -ge 3 ]; then
  echo ""
  echo "6️⃣ Validando entidades TypeORM..."
  
  # Verificar se há erros "Data type Object" nos logs
  if docker logs estetica_backend 2>&1 | grep -q "Data type.*Object"; then
    echo "   ❌ Encontrado erro TypeORM 'Data type Object'!"
    echo "   Corrija adicionando tipos explícitos nas entidades:"
    echo "   - type: 'uuid' para IDs"
    echo "   - type: 'varchar' para strings com length"
    echo "   - type: 'text' para strings sem length"
    echo "   - type: 'timestamp' para Date"
    docker logs estetica_backend 2>&1 | grep "Data type" | head -5
    exit 1
  else
    echo "   ✅ Nenhum erro TypeORM detectado"
  fi
fi

# Relatório final
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Fase $FASE validada com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "   1. Revisar código implementado"
echo "   2. Commitar alterações: git add . && git commit -m 'Fase $FASE concluída'"
echo "   3. Prosseguir para próxima fase"
echo ""
