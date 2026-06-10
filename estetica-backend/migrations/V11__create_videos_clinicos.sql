-- V11: Biblioteca de vídeos interativos de procedimentos estéticos

DO $$ BEGIN
  CREATE TYPE video_tipo AS ENUM ('DEMO', 'EDUCATIVO', 'RESULTADO', 'TECNICA');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE video_categoria AS ENUM (
    'TOXINA_BOTULINICA', 'PREENCHIMENTO', 'BIOESTIMULADORES',
    'LASER', 'PEELING', 'FIOS', 'CORPORAL', 'SKINCARE', 'OUTROS'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS videos_clinicos (
    id                    UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo                VARCHAR(200)    NOT NULL,
    descricao             TEXT            NULL,
    video_url             TEXT            NOT NULL,
    thumbnail_url         TEXT            NULL,
    categoria             video_categoria NOT NULL DEFAULT 'OUTROS',
    tipo                  video_tipo      NOT NULL DEFAULT 'DEMO',
    procedimento_nome     VARCHAR(150)    NULL,
    duracao_segundos      INT             NULL,
    tags                  TEXT            NULL,
    ativo                 BOOLEAN         NOT NULL DEFAULT TRUE,
    visivel_paciente      BOOLEAN         NOT NULL DEFAULT FALSE,
    total_visualizacoes   INT             NOT NULL DEFAULT 0,
    created_at            TIMESTAMP       NOT NULL DEFAULT now(),
    updated_at            TIMESTAMP       NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_videos_clinicos_categoria ON videos_clinicos (categoria);
CREATE INDEX IF NOT EXISTS idx_videos_clinicos_tipo      ON videos_clinicos (tipo);
CREATE INDEX IF NOT EXISTS idx_videos_clinicos_ativo     ON videos_clinicos (ativo);

COMMENT ON TABLE videos_clinicos IS 'Biblioteca de vídeos de procedimentos estéticos — demos, tutoriais e resultados';

-- Seed: 12 vídeos de demonstração usando embeds do YouTube
INSERT INTO videos_clinicos (titulo, descricao, video_url, thumbnail_url, categoria, tipo, procedimento_nome, duracao_segundos, tags, visivel_paciente)
VALUES
  ('Toxina Botulínica — Técnica de Aplicação',
   'Demonstração da técnica correta de aplicação de toxina botulínica na região frontal e glabela.',
   'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL,
   'TOXINA_BOTULINICA', 'TECNICA', 'Toxina Botulínica', 480, 'botox,toxina,fronte,glabela', FALSE),

  ('Botox — O que esperar do tratamento',
   'Guia completo para pacientes sobre o procedimento de toxina botulínica, resultados e cuidados pós.',
   'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL,
   'TOXINA_BOTULINICA', 'EDUCATIVO', 'Toxina Botulínica', 360, 'botox,paciente,resultados,cuidados', TRUE),

  ('Preenchimento Labial — Técnica com Ácido Hialurônico',
   'Técnica de preenchimento labial utilizando ácido hialurônico para volume e definição.',
   'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL,
   'PREENCHIMENTO', 'TECNICA', 'Preenchimento Labial', 540, 'labios,acido-hialuronico,volume,preenchimento', FALSE),

  ('Resultado: Preenchimento Labial — Antes e Depois',
   'Caso clínico real com resultado de preenchimento labial. Antes e depois do tratamento.',
   'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL,
   'PREENCHIMENTO', 'RESULTADO', 'Preenchimento Labial', 90, 'antes-depois,labios,resultado', TRUE),

  ('Bioestimuladores de Colágeno — Sculptra e Radiesse',
   'Como funcionam os bioestimuladores de colágeno e qual escolher para cada caso clínico.',
   'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL,
   'BIOESTIMULADORES', 'EDUCATIVO', 'Bioestimuladores', 420, 'sculptra,radiesse,colageno,bioestimulador', TRUE),

  ('Laser CO₂ Fracionado — Rejuvenescimento da Pele',
   'Demonstração do procedimento de laser CO₂ fracionado para renovação celular e rejuvenescimento.',
   'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL,
   'LASER', 'DEMO', 'Laser CO₂ Fracionado', 600, 'laser,co2,rejuvenescimento,skin-resurfacing', FALSE),

  ('Peeling Químico — Tipos e Indicações',
   'Guia educativo sobre os diferentes tipos de peeling químico e suas indicações clínicas.',
   'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL,
   'PEELING', 'EDUCATIVO', 'Peeling Químico', 300, 'peeling,quimico,aha,bha,tca', TRUE),

  ('Fios de PDO — Lifting Não Cirúrgico',
   'Técnica de aplicação de fios de PDO para lifting facial não cirúrgico.',
   'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL,
   'FIOS', 'TECNICA', 'Fios de PDO', 720, 'fios,pdo,lifting,facial,sem-cirurgia', FALSE),

  ('Harmonização Facial — Visão Geral dos Procedimentos',
   'Conheça todos os procedimentos disponíveis na harmonização facial e o que cada um trata.',
   'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL,
   'OUTROS', 'EDUCATIVO', 'Harmonização Facial', 480, 'harmonizacao,facial,procedimentos,visao-geral', TRUE),

  ('Lipo de Papada — Técnica de Enzimas e Laser',
   'Resultado de tratamento para eliminação de gordura localizada na região submentual.',
   'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL,
   'CORPORAL', 'RESULTADO', 'Lipo de Papada', 120, 'papada,gordura,corporal,enzimas', TRUE),

  ('Skincare Personalizado — Rotina para Clínica',
   'Como montar uma rotina de skincare personalizada baseada no diagnóstico de pele.',
   'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL,
   'SKINCARE', 'EDUCATIVO', 'Skincare', 360, 'skincare,rotina,cuidados,pele', TRUE),

  ('Ultrassom Microfocado (HIFU) — Como Funciona',
   'Tecnologia HIFU para lifting facial e corporal sem cirurgia — mecanismo de ação.',
   'https://www.youtube.com/embed/dQw4w9WgXcQ', NULL,
   'LASER', 'DEMO', 'HIFU', 420, 'hifu,ultrassom,lifting,corporal,facial', FALSE)
ON CONFLICT DO NOTHING;
