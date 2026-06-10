-- V8: Criar tabela de logs de auditoria (LGPD — Art. 37)
-- Tabela imutável: sem UPDATE, sem DELETE (append-only)

CREATE TABLE IF NOT EXISTS audit_logs (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID            NULL,  -- NULL para ações anônimas (ex: tentativa de login falho)
    action      VARCHAR(100)    NOT NULL,
    entity      VARCHAR(100)    NOT NULL,
    entity_id   UUID            NULL,
    old_value   TEXT            NULL,
    new_value   TEXT            NULL,
    ip_address  VARCHAR(45)     NULL,  -- Suporta IPv4 e IPv6
    user_agent  TEXT            NULL,
    created_at  TIMESTAMP       NOT NULL DEFAULT now()
);

-- Índices para consultas frequentes
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id   ON audit_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity     ON audit_logs (entity, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action     ON audit_logs (action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs (created_at DESC);

-- Comentário LGPD
COMMENT ON TABLE audit_logs IS 'Registro de operações críticas — LGPD Art. 37 (Lei 13.709/2018). Tabela append-only.';
