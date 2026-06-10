-- V6: Estoque

CREATE TYPE movimentacao_tipo AS ENUM ('ENTRADA', 'SAIDA', 'AJUSTE');

-- Categorias de produtos
CREATE TABLE categorias_produto (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinica_id UUID REFERENCES clinicas(id) ON DELETE SET NULL,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    ativo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Produtos
CREATE TABLE produtos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinica_id UUID REFERENCES clinicas(id) ON DELETE SET NULL,
    categoria_id UUID REFERENCES categorias_produto(id) ON DELETE SET NULL,
    nome VARCHAR(200) NOT NULL,
    descricao TEXT,
    unidade VARCHAR(20) NOT NULL DEFAULT 'UN',
    estoque_atual DECIMAL(12,3) NOT NULL DEFAULT 0,
    estoque_minimo DECIMAL(12,3) NOT NULL DEFAULT 0,
    preco_custo DECIMAL(12,2),
    ativo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_estoque_nao_negativo CHECK (estoque_atual >= 0)
);

CREATE INDEX idx_produtos_clinica ON produtos(clinica_id);

-- Movimentações de estoque
CREATE TABLE movimentacoes_estoque (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinica_id UUID REFERENCES clinicas(id) ON DELETE SET NULL,
    produto_id UUID NOT NULL REFERENCES produtos(id) ON DELETE RESTRICT,
    tipo movimentacao_tipo NOT NULL,
    quantidade DECIMAL(12,3) NOT NULL,
    estoque_anterior DECIMAL(12,3) NOT NULL,
    estoque_posterior DECIMAL(12,3) NOT NULL,
    motivo VARCHAR(300),
    usuario_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_movimentacoes_produto ON movimentacoes_estoque(produto_id);
CREATE INDEX idx_movimentacoes_data ON movimentacoes_estoque(created_at);
