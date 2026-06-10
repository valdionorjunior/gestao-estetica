-- V5: Módulo Financeiro

CREATE TYPE conta_tipo AS ENUM ('RECEITA', 'DESPESA');
CREATE TYPE conta_status AS ENUM ('PENDENTE', 'PAGO', 'CANCELADO');
CREATE TYPE orcamento_status AS ENUM ('RASCUNHO', 'ENVIADO', 'APROVADO', 'RECUSADO', 'EXPIRADO');
CREATE TYPE contrato_status AS ENUM ('ATIVO', 'CONCLUIDO', 'CANCELADO');
CREATE TYPE forma_pagamento AS ENUM ('DINHEIRO', 'CARTAO_DEBITO', 'CARTAO_CREDITO', 'PIX', 'TRANSFERENCIA', 'BOLETO');

-- Fluxo de caixa
CREATE TABLE contas_financeiras (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinica_id UUID REFERENCES clinicas(id) ON DELETE SET NULL,
    tipo conta_tipo NOT NULL,
    descricao VARCHAR(300) NOT NULL,
    valor DECIMAL(12,2) NOT NULL,
    data_vencimento DATE NOT NULL,
    data_pagamento DATE,
    status conta_status NOT NULL DEFAULT 'PENDENTE',
    forma_pagamento forma_pagamento,
    categoria VARCHAR(100),
    paciente_id UUID REFERENCES pacientes(id) ON DELETE SET NULL,
    agendamento_id UUID REFERENCES agendamentos(id) ON DELETE SET NULL,
    observacoes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contas_clinica ON contas_financeiras(clinica_id);
CREATE INDEX idx_contas_tipo ON contas_financeiras(tipo);
CREATE INDEX idx_contas_status ON contas_financeiras(status);
CREATE INDEX idx_contas_data ON contas_financeiras(data_vencimento);

-- Orçamentos
CREATE TABLE orcamentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinica_id UUID REFERENCES clinicas(id) ON DELETE SET NULL,
    paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE RESTRICT,
    profissional_id UUID REFERENCES profissionais(id) ON DELETE SET NULL,
    status orcamento_status NOT NULL DEFAULT 'RASCUNHO',
    validade DATE,
    subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
    desconto_percentual DECIMAL(5,2) NOT NULL DEFAULT 0,
    desconto_valor DECIMAL(12,2) NOT NULL DEFAULT 0,
    total DECIMAL(12,2) NOT NULL DEFAULT 0,
    observacoes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Itens dos orçamentos
CREATE TABLE orcamento_itens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    orcamento_id UUID NOT NULL REFERENCES orcamentos(id) ON DELETE CASCADE,
    procedimento_id UUID REFERENCES procedimentos(id) ON DELETE SET NULL,
    descricao VARCHAR(300) NOT NULL,
    quantidade INTEGER NOT NULL DEFAULT 1,
    valor_unitario DECIMAL(12,2) NOT NULL,
    valor_total DECIMAL(12,2) NOT NULL
);

-- Pacotes de sessões
CREATE TABLE pacotes_sessao (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinica_id UUID REFERENCES clinicas(id) ON DELETE SET NULL,
    paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE RESTRICT,
    procedimento_id UUID REFERENCES procedimentos(id) ON DELETE SET NULL,
    nome VARCHAR(200) NOT NULL,
    total_sessoes INTEGER NOT NULL,
    sessoes_utilizadas INTEGER NOT NULL DEFAULT 0,
    valor_total DECIMAL(12,2) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_sessoes CHECK (sessoes_utilizadas <= total_sessoes)
);

-- Contratos
CREATE TABLE contratos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinica_id UUID REFERENCES clinicas(id) ON DELETE SET NULL,
    paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE RESTRICT,
    orcamento_id UUID REFERENCES orcamentos(id) ON DELETE SET NULL,
    pacote_id UUID REFERENCES pacotes_sessao(id) ON DELETE SET NULL,
    status contrato_status NOT NULL DEFAULT 'ATIVO',
    data_inicio DATE NOT NULL,
    data_fim DATE,
    valor_total DECIMAL(12,2) NOT NULL,
    observacoes TEXT,
    assinatura_digital TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contratos_paciente ON contratos(paciente_id);
