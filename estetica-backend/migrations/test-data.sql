-- Dados de teste para relatórios

-- 1. Profissional
INSERT INTO profissionais (id, user_id, especialidade)
VALUES ('99999999-9999-9999-9999-999999999999', '21f6a5b6-10fb-4ffb-a91e-4f41a0fa3a43', 'DERMATO')
ON CONFLICT (id) DO NOTHING;

-- 2. Pacientes
INSERT INTO pacientes (id, nome, ativo) 
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'João Silva', true),
  ('22222222-2222-2222-2222-222222222222', 'Maria Santos', true),
  ('33333333-3333-3333-3333-333333333333', 'Pedro Costa', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Agendamentos
INSERT INTO agendamentos (id, paciente_id, profissional_id, data_hora_inicio, data_hora_fim, status) 
VALUES 
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', '99999999-9999-9999-9999-999999999999', CURRENT_DATE - 10, CURRENT_DATE - 10 + INTERVAL '1 hour', 'CONCLUIDO'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', '99999999-9999-9999-9999-999999999999', CURRENT_DATE - 8, CURRENT_DATE - 8 + INTERVAL '1 hour', 'CONCLUIDO'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', '99999999-9999-9999-9999-999999999999', CURRENT_DATE - 5, CURRENT_DATE - 5 + INTERVAL '1 hour', 'AGENDADO'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', '99999999-9999-9999-9999-999999999999', CURRENT_DATE - 3, CURRENT_DATE - 3 + INTERVAL '1 hour', 'CANCELADO')
ON CONFLICT (id) DO NOTHING;

-- 4. Contas
INSERT INTO contas_financeiras (id, descricao, tipo, valor, status, data_vencimento) 
VALUES 
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Pagamento 1', 'RECEITA', 500.00, 'PAGO', CURRENT_DATE - 10),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Pagamento 2', 'RECEITA', 750.00, 'PAGO', CURRENT_DATE - 8),
  ('12121212-1212-1212-1212-121212121212', 'Material', 'DESPESA', 200.00, 'PAGO', CURRENT_DATE - 7)
ON CONFLICT (id) DO NOTHING;
