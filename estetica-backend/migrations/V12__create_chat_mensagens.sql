-- V12: Chat interno entre profissionais da clínica

DO $$ BEGIN
  CREATE TYPE mensagem_tipo AS ENUM ('TEXTO', 'IMAGEM', 'ARQUIVO', 'SISTEMA');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS chat_mensagens (
    id                UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    remetente_id      UUID            NOT NULL,
    remetente_nome    VARCHAR(100)    NOT NULL,
    remetente_role    VARCHAR(30)     NOT NULL,
    canal             VARCHAR(100)    NOT NULL DEFAULT 'geral',
    conteudo          TEXT            NOT NULL,
    tipo              mensagem_tipo   NOT NULL DEFAULT 'TEXTO',
    resposta_para_id  UUID            NULL REFERENCES chat_mensagens(id) ON DELETE SET NULL,
    lida_por_json     TEXT            NULL,
    editada           BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at        TIMESTAMP       NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_mensagens_canal      ON chat_mensagens (canal, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_mensagens_remetente  ON chat_mensagens (remetente_id);
CREATE INDEX IF NOT EXISTS idx_chat_mensagens_data       ON chat_mensagens (created_at DESC);

COMMENT ON TABLE chat_mensagens IS 'Mensagens do chat interno entre profissionais';
COMMENT ON COLUMN chat_mensagens.canal IS 'Canal: geral, agenda, financeiro, estoque ou priv_{id1}_{id2}';

-- Canais padrão — mensagem de sistema inicial
INSERT INTO chat_mensagens (remetente_id, remetente_nome, remetente_role, canal, conteudo, tipo)
VALUES
  (gen_random_uuid(), 'Sistema', 'SISTEMA', 'geral',    '👋 Bem-vindos ao canal Geral da Estética Natalia Salvador!', 'SISTEMA'),
  (gen_random_uuid(), 'Sistema', 'SISTEMA', 'agenda',   '📅 Canal exclusivo para coordenação da agenda.', 'SISTEMA'),
  (gen_random_uuid(), 'Sistema', 'SISTEMA', 'financeiro','💰 Canal para assuntos financeiros da clínica.', 'SISTEMA'),
  (gen_random_uuid(), 'Sistema', 'SISTEMA', 'estoque',  '📦 Canal para controle e reposição de estoque.', 'SISTEMA')
ON CONFLICT DO NOTHING;
