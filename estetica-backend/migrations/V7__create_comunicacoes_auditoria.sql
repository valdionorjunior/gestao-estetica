-- V7: Comunicações e Auditoria

CREATE TYPE comunicacao_tipo AS ENUM ('EMAIL', 'SMS', 'WHATSAPP');
CREATE TYPE comunicacao_status AS ENUM ('PENDENTE', 'ENVIADO', 'FALHOU');

-- Comunicações / lembretes
CREATE TABLE comunicacoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinica_id UUID REFERENCES clinicas(id) ON DELETE SET NULL,
    paciente_id UUID REFERENCES pacientes(id) ON DELETE SET NULL,
    agendamento_id UUID REFERENCES agendamentos(id) ON DELETE SET NULL,
    tipo comunicacao_tipo NOT NULL,
    assunto VARCHAR(200),
    mensagem TEXT NOT NULL,
    status comunicacao_status NOT NULL DEFAULT 'PENDENTE',
    enviado_em TIMESTAMPTZ,
    erro_mensagem TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_comunicacoes_clinica ON comunicacoes(clinica_id);

-- Log de auditoria
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinica_id UUID REFERENCES clinicas(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity VARCHAR(100) NOT NULL,
    entity_id UUID,
    old_value JSONB,
    new_value JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_clinica ON audit_logs(clinica_id);
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity, entity_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at);
