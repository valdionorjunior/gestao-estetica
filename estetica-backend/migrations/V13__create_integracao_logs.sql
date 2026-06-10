-- V13: Integrações com plataformas externas (RD Station, LeadLovers)

DO $$ BEGIN
  CREATE TYPE plataforma_integracao AS ENUM ('RD_STATION', 'LEADLOVERS');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE integracao_acao AS ENUM (
    'SINCRONIZAR_CONTATO', 'REGISTRAR_EVENTO', 'WEBHOOK_RECEBIDO', 'WEBHOOK_LEAD'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE integracao_status AS ENUM ('SUCESSO', 'FALHOU', 'SIMULADO');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS integracao_logs (
    id              UUID                    PRIMARY KEY DEFAULT gen_random_uuid(),
    plataforma      plataforma_integracao   NOT NULL,
    acao            integracao_acao         NOT NULL,
    status          integracao_status       NOT NULL,
    paciente_id     UUID                    NULL,
    id_externo      VARCHAR(200)            NULL,
    payload_json    TEXT                    NULL,
    resposta        TEXT                    NULL,
    created_at      TIMESTAMP               NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_integracao_logs_plataforma ON integracao_logs (plataforma, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_integracao_logs_paciente   ON integracao_logs (paciente_id);
CREATE INDEX IF NOT EXISTS idx_integracao_logs_status     ON integracao_logs (status);

COMMENT ON TABLE integracao_logs IS 'Logs de integração com RD Station e LeadLovers';
