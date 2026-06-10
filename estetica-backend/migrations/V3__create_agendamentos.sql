-- V3: Agendamentos

CREATE TYPE agendamento_status AS ENUM (
    'AGENDADO', 'CONFIRMADO', 'EM_ATENDIMENTO', 'CONCLUIDO', 'CANCELADO', 'FALTA'
);

CREATE TABLE agendamentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinica_id UUID REFERENCES clinicas(id) ON DELETE SET NULL,
    paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE RESTRICT,
    profissional_id UUID NOT NULL REFERENCES profissionais(id) ON DELETE RESTRICT,
    procedimento_id UUID REFERENCES procedimentos(id) ON DELETE SET NULL,
    data_hora_inicio TIMESTAMPTZ NOT NULL,
    data_hora_fim TIMESTAMPTZ NOT NULL,
    status agendamento_status NOT NULL DEFAULT 'AGENDADO',
    observacoes TEXT,
    valor DECIMAL(12,2),
    lembrete_enviado BOOLEAN NOT NULL DEFAULT false,
    confirmado_em TIMESTAMPTZ,
    cancelado_em TIMESTAMPTZ,
    motivo_cancelamento TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_datas CHECK (data_hora_fim > data_hora_inicio)
);

CREATE INDEX idx_agendamentos_clinica ON agendamentos(clinica_id);
CREATE INDEX idx_agendamentos_paciente ON agendamentos(paciente_id);
CREATE INDEX idx_agendamentos_profissional ON agendamentos(profissional_id);
CREATE INDEX idx_agendamentos_data ON agendamentos(data_hora_inicio);
CREATE INDEX idx_agendamentos_status ON agendamentos(status);
