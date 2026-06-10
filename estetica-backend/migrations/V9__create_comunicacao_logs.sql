-- V9: Tabela de log de comunicações (marketing, lembretes, notificações)

DO $$ BEGIN
  CREATE TYPE comunicacao_tipo AS ENUM ('EMAIL', 'SMS', 'WHATSAPP');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE comunicacao_status AS ENUM ('PENDENTE', 'ENVIADO', 'FALHOU', 'SIMULADO');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE comunicacao_motivo AS ENUM (
    'LEMBRETE_AGENDAMENTO',
    'CONFIRMACAO_AGENDAMENTO',
    'CANCELAMENTO_AGENDAMENTO',
    'CAMPANHA_MARKETING',
    'ANIVERSARIO',
    'POS_ATENDIMENTO',
    'MANUAL'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS comunicacao_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paciente_id     UUID                NOT NULL,
    agendamento_id  UUID                NULL,
    tipo            comunicacao_tipo    NOT NULL DEFAULT 'EMAIL',
    motivo          comunicacao_motivo  NOT NULL DEFAULT 'MANUAL',
    status          comunicacao_status  NOT NULL DEFAULT 'PENDENTE',
    destinatario    VARCHAR(200)        NULL,
    assunto         VARCHAR(200)        NOT NULL,
    mensagem        TEXT                NOT NULL,
    erro_detalhe    TEXT                NULL,
    enviado_em      TIMESTAMPTZ         NULL,
    created_at      TIMESTAMP           NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_comunicacao_paciente   ON comunicacao_logs (paciente_id);
CREATE INDEX IF NOT EXISTS idx_comunicacao_status      ON comunicacao_logs (status);
CREATE INDEX IF NOT EXISTS idx_comunicacao_tipo        ON comunicacao_logs (tipo);
CREATE INDEX IF NOT EXISTS idx_comunicacao_created_at  ON comunicacao_logs (created_at DESC);

COMMENT ON TABLE comunicacao_logs IS 'Log de todas as comunicações enviadas — LGPD Art. 7.';
