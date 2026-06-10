-- V2: Profissionais, Pacientes e Procedimentos

-- Especialidades dos profissionais
CREATE TYPE especialidade_tipo AS ENUM (
    'ESTETICISTA', 'DERMATO', 'NUTRICIONISTA', 'FISIOTERAPEUTA', 'ENFERMEIRO', 'OUTRO'
);

-- Tabela de profissionais
CREATE TABLE profissionais (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    clinica_id UUID REFERENCES clinicas(id) ON DELETE SET NULL,
    conselho_numero VARCHAR(50),
    especialidade especialidade_tipo NOT NULL DEFAULT 'ESTETICISTA',
    bio TEXT,
    foto_url VARCHAR(500),
    ativo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profissionais_user ON profissionais(user_id);
CREATE INDEX idx_profissionais_clinica ON profissionais(clinica_id);

-- Tabela de pacientes
CREATE TABLE pacientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    clinica_id UUID REFERENCES clinicas(id) ON DELETE SET NULL,
    nome VARCHAR(200) NOT NULL,
    -- CPF armazenado criptografado (AES-256 via aplicação)
    cpf_encrypted TEXT,
    data_nascimento DATE,
    sexo VARCHAR(20),
    telefone VARCHAR(20),
    telefone_secundario VARCHAR(20),
    email VARCHAR(200),
    endereco TEXT,
    cidade VARCHAR(100),
    estado VARCHAR(2),
    cep VARCHAR(9),
    foto_url VARCHAR(500),
    observacoes TEXT,
    ativo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pacientes_clinica ON pacientes(clinica_id);
CREATE INDEX idx_pacientes_nome ON pacientes(nome);
CREATE INDEX idx_pacientes_email ON pacientes(email);

-- Categorias de procedimentos
CREATE TABLE categorias_procedimento (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinica_id UUID REFERENCES clinicas(id) ON DELETE SET NULL,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    ativo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de procedimentos
CREATE TABLE procedimentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinica_id UUID REFERENCES clinicas(id) ON DELETE SET NULL,
    categoria_id UUID REFERENCES categorias_procedimento(id) ON DELETE SET NULL,
    nome VARCHAR(200) NOT NULL,
    descricao TEXT,
    duracao_minutos INTEGER NOT NULL DEFAULT 60,
    preco DECIMAL(12,2) NOT NULL DEFAULT 0,
    ativo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_procedimentos_clinica ON procedimentos(clinica_id);
CREATE INDEX idx_procedimentos_categoria ON procedimentos(categoria_id);
