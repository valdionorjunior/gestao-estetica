-- V10: Consulta Interativa — fotos antes/depois com anotações

DO $$ BEGIN
  CREATE TYPE tipo_foto_consulta AS ENUM ('ANTES', 'DEPOIS', 'DURANTE', 'REFERENCIA');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS consulta_fotos (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paciente_id     UUID                    NOT NULL,
    prontuario_id   UUID                    NULL,
    profissional_id UUID                    NULL,
    tipo            tipo_foto_consulta      NOT NULL DEFAULT 'ANTES',
    foto_url        TEXT                    NOT NULL,
    descricao       VARCHAR(200)            NULL,
    anotacoes_json  TEXT                    NULL,  -- JSON array de marcações [{x,y,texto,cor,forma}]
    data_consulta   DATE                    NULL,
    created_at      TIMESTAMP               NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP               NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_consulta_fotos_paciente    ON consulta_fotos (paciente_id);
CREATE INDEX IF NOT EXISTS idx_consulta_fotos_tipo        ON consulta_fotos (tipo);
CREATE INDEX IF NOT EXISTS idx_consulta_fotos_data        ON consulta_fotos (data_consulta DESC);

COMMENT ON TABLE consulta_fotos IS 'Fotos de consulta interativa com anotações e marcações de procedimentos';
COMMENT ON COLUMN consulta_fotos.anotacoes_json IS 'JSON: [{id, x, y, texto, cor, forma}] — coordenadas relativas em %';
