-- V15: Telemedicina — sessões de videoconferência

DO $$ BEGIN
  CREATE TYPE sessao_status AS ENUM ('AGENDADA', 'EM_ANDAMENTO', 'ENCERRADA', 'CANCELADA');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE plataforma_video AS ENUM ('JITSI', 'DAILY_CO');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS sessoes_telemedicina (
    id                  UUID                 PRIMARY KEY DEFAULT gen_random_uuid(),
    paciente_id         UUID                 NOT NULL,
    paciente_nome       VARCHAR(200)         NOT NULL,
    paciente_email      VARCHAR(200)         NULL,
    paciente_telefone   VARCHAR(30)          NULL,
    profissional_id     UUID                 NULL,
    profissional_nome   VARCHAR(200)         NOT NULL,
    agendamento_id      UUID                 NULL,
    status              sessao_status        NOT NULL DEFAULT 'AGENDADA',
    plataforma          plataforma_video     NOT NULL DEFAULT 'JITSI',
    room_name           VARCHAR(300)         NOT NULL,
    room_url            VARCHAR(500)         NOT NULL,
    token_paciente      VARCHAR(1000)        NULL,
    token_profissional  VARCHAR(1000)        NULL,
    agendado_para       TIMESTAMP            NULL,
    iniciado_em         TIMESTAMP            NULL,
    encerrado_em        TIMESTAMP            NULL,
    observacoes         TEXT                 NULL,
    arquivos_json       TEXT                 NOT NULL DEFAULT '[]',
    created_at          TIMESTAMP            NOT NULL DEFAULT now(),
    updated_at          TIMESTAMP            NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sessoes_telemed_paciente  ON sessoes_telemedicina (paciente_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessoes_telemed_profiss   ON sessoes_telemedicina (profissional_id, status);
CREATE INDEX IF NOT EXISTS idx_sessoes_telemed_status    ON sessoes_telemedicina (status);
CREATE INDEX IF NOT EXISTS idx_sessoes_telemed_agendado  ON sessoes_telemedicina (agendado_para);

COMMENT ON TABLE sessoes_telemedicina IS 'Sessões de telemedicina com Jitsi Meet ou Daily.co';
