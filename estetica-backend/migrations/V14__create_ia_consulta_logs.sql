-- V14: IA no Prontuário — logs de transcrição, resumo e hipótese diagnóstica

DO $$ BEGIN
  CREATE TYPE ia_operacao AS ENUM (
    'TRANSCRICAO_AUDIO', 'RESUMO_CONSULTA', 'HIPOTESE_DIAGNOSTICA'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE ia_status AS ENUM ('SUCESSO', 'FALHOU', 'SIMULADO');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS ia_consulta_logs (
    id               UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    operacao         ia_operacao     NOT NULL,
    status           ia_status       NOT NULL,
    paciente_id      UUID            NULL,
    prontuario_id    UUID            NULL,
    profissional_id  UUID            NULL,
    entrada          TEXT            NULL,
    resultado        TEXT            NULL,
    tokens_utilizados INT            NULL DEFAULT 0,
    modelo_ia        VARCHAR(100)    NULL,
    created_at       TIMESTAMP       NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ia_logs_paciente    ON ia_consulta_logs (paciente_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ia_logs_operacao    ON ia_consulta_logs (operacao);
CREATE INDEX IF NOT EXISTS idx_ia_logs_profissional ON ia_consulta_logs (profissional_id);

COMMENT ON TABLE ia_consulta_logs IS 'Logs de operações de IA no prontuário (Whisper + GPT)';
