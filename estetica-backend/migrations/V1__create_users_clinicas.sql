-- V1: Usuários e Clínica
-- Criação das tabelas base: users e clinicas

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Enum de roles
CREATE TYPE user_role AS ENUM ('ADMIN', 'MEDICO', 'RECEPCIONISTA', 'PACIENTE');

-- Tabela de clínicas (preparada para multi-clínica)
CREATE TABLE clinicas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(200) NOT NULL,
    cnpj VARCHAR(18),
    telefone VARCHAR(20),
    email VARCHAR(200),
    endereco TEXT,
    cidade VARCHAR(100),
    estado VARCHAR(2),
    cep VARCHAR(9),
    ativo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de usuários
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinica_id UUID REFERENCES clinicas(id) ON DELETE SET NULL,
    nome VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'PACIENTE',
    ativo BOOLEAN NOT NULL DEFAULT true,
    email_verificado BOOLEAN NOT NULL DEFAULT false,
    primeiro_acesso BOOLEAN NOT NULL DEFAULT true,
    ultimo_login TIMESTAMPTZ,
    refresh_token_hash VARCHAR(255),
    reset_password_token VARCHAR(255),
    reset_password_expires TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_users_email UNIQUE (email)
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_clinica ON users(clinica_id);
CREATE INDEX idx_users_role ON users(role);
