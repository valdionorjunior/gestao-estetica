/**
 * Utilitários globais do frontend Estética Natalia Salvador
 */

/** Formata valor monetário em BRL */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/** Formata data ISO para dd/MM/yyyy */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}

/** Formata data e hora ISO para dd/MM/yyyy HH:mm */
export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Formata CPF: 12345678900 → 123.456.789-00 */
export function formatCPF(cpf: string): string {
  return cpf
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/** Formata telefone: 11999999999 → (11) 99999-9999 */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11) {
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
}

/** Retorna as iniciais de um nome (máximo 2 letras) */
export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('');
}

/** Verifica se uma string é um UUID v4 válido */
export function isValidUUID(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

/** Trunca texto para um tamanho máximo */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}
