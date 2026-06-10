import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatDate,
  formatCPF,
  formatPhone,
  getInitials,
  isValidUUID,
  truncate,
} from '../utils/formatters';

describe('formatCurrency', () => {
  it('formata zero como R$ 0,00', () => {
    expect(formatCurrency(0)).toMatch(/R\$\s*0,00/);
  });

  it('formata valor positivo corretamente', () => {
    expect(formatCurrency(1500.5)).toMatch(/1\.500,50/);
  });

  it('formata valor negativo corretamente', () => {
    expect(formatCurrency(-200)).toMatch(/200/);
  });
});

describe('formatDate', () => {
  it('formata data ISO para dd/MM/yyyy', () => {
    expect(formatDate('2026-04-17')).toBe('17/04/2026');
  });

  it('aceita objeto Date', () => {
    const d = new Date('2026-01-01');
    expect(formatDate(d)).toBe('01/01/2026');
  });
});

describe('formatCPF', () => {
  it('formata CPF numérico de 11 dígitos', () => {
    expect(formatCPF('12345678900')).toBe('123.456.789-00');
  });

  it('mantém formatação se já formatado', () => {
    expect(formatCPF('123.456.789-00')).toBe('123.456.789-00');
  });
});

describe('formatPhone', () => {
  it('formata celular com 11 dígitos', () => {
    expect(formatPhone('11999999999')).toBe('(11) 99999-9999');
  });

  it('formata fixo com 10 dígitos', () => {
    expect(formatPhone('1133334444')).toBe('(11) 3333-4444');
  });
});

describe('getInitials', () => {
  it('retorna iniciais de nome completo', () => {
    expect(getInitials('Maria Silva')).toBe('MS');
  });

  it('retorna apenas 2 iniciais para nomes longos', () => {
    expect(getInitials('Ana Paula da Silva Santos')).toBe('AP');
  });

  it('retorna inicial de nome simples', () => {
    expect(getInitials('João')).toBe('J');
  });
});

describe('isValidUUID', () => {
  it('valida UUID v4 correto', () => {
    expect(isValidUUID('21f6a5b6-10fb-4ffb-a91e-4f41a0fa3a43')).toBe(true);
  });

  it('rejeita string inválida', () => {
    expect(isValidUUID('nao-e-uuid')).toBe(false);
    expect(isValidUUID('')).toBe(false);
  });

  it('rejeita UUID v3 (versão diferente)', () => {
    expect(isValidUUID('550e8400-e29b-31d4-a716-446655440000')).toBe(false);
  });
});

describe('truncate', () => {
  it('não trunca texto curto', () => {
    expect(truncate('texto curto', 20)).toBe('texto curto');
  });

  it('trunca texto longo com ...', () => {
    const result = truncate('texto muito longo para exibir', 10);
    expect(result).toHaveLength(10);
    expect(result.endsWith('...')).toBe(true);
  });

  it('não trunca texto com exatamente o tamanho máximo', () => {
    expect(truncate('abc', 3)).toBe('abc');
  });
});
