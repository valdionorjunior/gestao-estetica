-- R__seed_procedimentos_categorias.sql
-- Repeatable migration: seeds de categorias e procedimentos padrão

-- Limpeza segura para re-execução
DELETE FROM procedimentos WHERE clinica_id IS NULL;
DELETE FROM categorias_procedimento WHERE clinica_id IS NULL;

-- Categorias padrão
INSERT INTO categorias_procedimento (id, nome, descricao) VALUES
    ('a1000000-0000-0000-0000-000000000001', 'Limpeza e Hidratação', 'Procedimentos de limpeza e hidratação facial'),
    ('a1000000-0000-0000-0000-000000000002', 'Peeling e Esfoliação', 'Procedimentos de renovação celular'),
    ('a1000000-0000-0000-0000-000000000003', 'Tratamento Corporal', 'Massagens e tratamentos corporais'),
    ('a1000000-0000-0000-0000-000000000004', 'Laser e Tecnologia', 'Procedimentos com equipamentos de laser e luz'),
    ('a1000000-0000-0000-0000-000000000005', 'Injetáveis', 'Toxina botulínica e preenchimentos'),
    ('a1000000-0000-0000-0000-000000000006', 'Depilação', 'Depilação a laser e outros métodos')
ON CONFLICT DO NOTHING;

-- Procedimentos padrão
INSERT INTO procedimentos (categoria_id, nome, descricao, duracao_minutos, preco) VALUES
    ('a1000000-0000-0000-0000-000000000001', 'Limpeza de Pele Profunda', 'Limpeza de pele com extração e hidratação', 90, 180.00),
    ('a1000000-0000-0000-0000-000000000001', 'Hidratação Facial', 'Hidratação intensiva com ácido hialurônico', 60, 150.00),
    ('a1000000-0000-0000-0000-000000000002', 'Peeling Químico', 'Peeling com ácidos para renovação celular', 60, 250.00),
    ('a1000000-0000-0000-0000-000000000002', 'Microagulhamento', 'Indução de colágeno com microagulhas', 90, 350.00),
    ('a1000000-0000-0000-0000-000000000003', 'Massagem Relaxante', 'Massagem corporal relaxante 60min', 60, 120.00),
    ('a1000000-0000-0000-0000-000000000003', 'Drenagem Linfática', 'Drenagem linfática manual', 60, 130.00),
    ('a1000000-0000-0000-0000-000000000004', 'Laser Fracionado', 'Tratamento a laser para rejuvenescimento', 60, 800.00),
    ('a1000000-0000-0000-0000-000000000004', 'Fototerapia LED', 'Fototerapia com luz LED', 30, 120.00),
    ('a1000000-0000-0000-0000-000000000005', 'Toxina Botulínica', 'Aplicação de Botox', 30, 1200.00),
    ('a1000000-0000-0000-0000-000000000005', 'Preenchimento Facial', 'Preenchimento com ácido hialurônico', 45, 1500.00),
    ('a1000000-0000-0000-0000-000000000006', 'Depilação a Laser — Axilas', 'Depilação a laser nas axilas', 30, 200.00),
    ('a1000000-0000-0000-0000-000000000006', 'Depilação a Laser — Pernas Completas', 'Depilação a laser nas pernas', 90, 600.00)
ON CONFLICT DO NOTHING;
