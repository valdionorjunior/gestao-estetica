-- V4: Prontuário Eletrônico

CREATE TYPE ficha_status AS ENUM ('ABERTA', 'FECHADA');
CREATE TYPE documento_tipo AS ENUM ('FOTO', 'VIDEO', 'PDF', 'OUTRO');

-- Prontuário principal do paciente
CREATE TABLE prontuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinica_id UUID REFERENCES clinicas(id) ON DELETE SET NULL,
    paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE RESTRICT,
    -- Dados sensíveis criptografados via aplicação (AES-256)
    historico_medico_encrypted TEXT,
    alergias_encrypted TEXT,
    medicamentos_uso_encrypted TEXT,
    observacoes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_prontuario_paciente UNIQUE (paciente_id)
);

CREATE INDEX idx_prontuarios_paciente ON prontuarios(paciente_id);

-- Fichas de atendimento
CREATE TABLE fichas_atendimento (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prontuario_id UUID NOT NULL REFERENCES prontuarios(id) ON DELETE CASCADE,
    agendamento_id UUID REFERENCES agendamentos(id) ON DELETE SET NULL,
    profissional_id UUID NOT NULL REFERENCES profissionais(id) ON DELETE RESTRICT,
    titulo VARCHAR(200) NOT NULL,
    conteudo_encrypted TEXT,
    status ficha_status NOT NULL DEFAULT 'ABERTA',
    fechada_em TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_fichas_prontuario ON fichas_atendimento(prontuario_id);
CREATE INDEX idx_fichas_profissional ON fichas_atendimento(profissional_id);

-- Prescrições
CREATE TABLE prescricoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ficha_id UUID NOT NULL REFERENCES fichas_atendimento(id) ON DELETE CASCADE,
    profissional_id UUID NOT NULL REFERENCES profissionais(id) ON DELETE RESTRICT,
    conteudo_encrypted TEXT NOT NULL,
    validade DATE,
    assinatura_digital TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Documentos e mídia
CREATE TABLE documentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prontuario_id UUID REFERENCES prontuarios(id) ON DELETE CASCADE,
    ficha_id UUID REFERENCES fichas_atendimento(id) ON DELETE CASCADE,
    nome VARCHAR(200) NOT NULL,
    tipo documento_tipo NOT NULL DEFAULT 'FOTO',
    url VARCHAR(500) NOT NULL,
    tamanho_bytes BIGINT,
    mime_type VARCHAR(100),
    descricao TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_documentos_prontuario ON documentos(prontuario_id);
