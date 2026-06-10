'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../../services/auth.service';
import { useAuthStore } from '../../stores/auth.store';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authService.login(form);
      setAuth(res.user, res.accessToken, res.refreshToken);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message ?? 'Erro ao realizar login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1A1A1A] mb-4">
            <span className="font-serif text-xl font-bold text-[#D4AF37]">NS</span>
          </div>
          <h1 className="font-serif text-2xl font-semibold text-[#1A1A1A]">Estética Natalia Salvador</h1>
          <p className="text-sm text-[#6B6560] mt-1">Acesse o sistema de gestão</p>
        </div>

        {/* Form */}
        <div className="bg-white border border-[#E8E4DD] rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
              autoFocus
            />
            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              required
            />

            {error && (
              <div className="bg-[#EF4444]/5 border border-[#EF4444]/20 rounded-lg px-4 py-3">
                <p className="text-sm text-[#EF4444]">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
            >
              Entrar
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-[#6B6560] mt-6">
          Sistema de gestão exclusivo para colaboradores
        </p>
      </div>
    </div>
  );
}
