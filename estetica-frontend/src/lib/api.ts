export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, ...rest } = options;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(rest.headers as Record<string, string>),
  };

  const res = await fetch(`${API_URL}${path}`, { ...rest, headers });

  if (!res.ok) {
    let message = `Erro ${res.status}`;
    try {
      const body = await res.json();
      message = body.message ?? message;
    } catch {}
    throw new Error(Array.isArray(message) ? message.join('; ') : message);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}
