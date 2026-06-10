'use client';

import { useEffect, useState, useCallback } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { usuariosService, Usuario, CreateUsuarioDto, UserRole } from '../../services/usuarios.service';

const ROLE_LABELS: Record<UserRole, { label: string; color: string }> = {
  ADMIN: { label: 'Admin', color: 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40' },
  MEDICO: { label: 'Médico', color: 'bg-blue-500/20 text-blue-400 border border-blue-500/40' },
  RECEPCIONISTA: { label: 'Recepcionista', color: 'bg-green-500/20 text-green-400 border border-green-500/40' },
  PACIENTE: { label: 'Paciente', color: 'bg-gray-500/20 text-gray-400 border border-gray-500/40' },
};

const ROLES: UserRole[] = ['ADMIN', 'MEDICO', 'RECEPCIONISTA', 'PACIENTE'];

function RoleBadge({ role }: { role: UserRole }) {
  const { label, color } = ROLE_LABELS[role] ?? ROLE_LABELS['PACIENTE'];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${color}`}>
      {label}
    </span>
  );
}

function ModalCriar({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState<CreateUsuarioDto>({
    email: '',
    password: '',
    nome: '',
    role: 'RECEPCIONISTA',
  });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro('');
    try {
      await usuariosService.create(form);
      onSuccess();
    } catch (err: any) {
      setErro(err?.message ?? 'Erro ao criar usuário');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A1A1A] border border-white/10 rounded-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-white font-semibold text-lg">Novo Usuário</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white/80 text-xl leading-none">×</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {erro && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
              {erro}
            </div>
          )}
          <div>
            <label className="block text-white/60 text-sm mb-1.5">Nome completo</label>
            <input
              type="text"
              required
              value={form.nome}
              onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50"
              placeholder="Dr. João Silva"
            />
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-1.5">E-mail</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50"
              placeholder="email@clinica.com"
            />
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-1.5">Senha temporária</label>
            <input
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50"
              placeholder="Mínimo 8 caracteres"
            />
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-1.5">Perfil de acesso</label>
            <select
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as UserRole }))}
              className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{ROLE_LABELS[r].label}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-white/10 text-white/60 text-sm hover:bg-white/5 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 rounded-lg bg-[#D4AF37] text-[#1A1A1A] font-semibold text-sm hover:bg-[#C9A96E] transition-colors disabled:opacity-50"
            >
              {loading ? 'Criando...' : 'Criar Usuário'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ModalEditar({
  usuario,
  onClose,
  onSuccess,
}: {
  usuario: Usuario;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [role, setRole] = useState<UserRole>(usuario.role);
  const [ativo, setAtivo] = useState(usuario.ativo);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await usuariosService.update(usuario.id, { role, ativo });
      onSuccess();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A1A1A] border border-white/10 rounded-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-white font-semibold text-lg">Editar Usuário</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white/80 text-xl leading-none">×</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <p className="text-white/40 text-xs mb-1">Usuário</p>
            <p className="text-white text-sm font-medium">{usuario.nome}</p>
            <p className="text-white/40 text-xs">{usuario.email}</p>
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-1.5">Perfil de acesso</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{ROLE_LABELS[r].label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setAtivo((a) => !a)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${ativo ? 'bg-[#D4AF37]' : 'bg-white/20'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${ativo ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </button>
            <span className="text-white/60 text-sm">{ativo ? 'Conta ativa' : 'Conta desativada'}</span>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg border border-white/10 text-white/60 text-sm hover:bg-white/5 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="flex-1 py-2 rounded-lg bg-[#D4AF37] text-[#1A1A1A] font-semibold text-sm hover:bg-[#C9A96E] transition-colors disabled:opacity-50">
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCriar, setShowCriar] = useState(false);
  const [editando, setEditando] = useState<Usuario | null>(null);

  const LIMIT = 20;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await usuariosService.list({ page, limit: LIMIT, busca: busca || undefined });
      setUsuarios(res.data);
      setTotal(res.total);
    } catch {
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  }, [page, busca]);

  useEffect(() => {
    load();
  }, [load]);

  function handleBusca(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPage(1);
    load();
  }

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <AppLayout>
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Usuários</h1>
          <p className="text-white/40 text-sm mt-0.5">{total} usuário{total !== 1 ? 's' : ''} cadastrado{total !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowCriar(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-[#1A1A1A] font-semibold text-sm rounded-lg hover:bg-[#C9A96E] transition-colors"
        >
          + Novo Usuário
        </button>
      </div>

      {/* Busca */}
      <form onSubmit={handleBusca} className="flex gap-3 mb-6">
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome ou e-mail..."
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50"
        />
        <button type="submit" className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-sm rounded-lg transition-colors">
          Buscar
        </button>
      </form>

      {/* Tabela */}
      <div className="bg-[#1A1A1A] border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left px-4 py-3 text-white/40 text-xs font-medium uppercase tracking-wider">Usuário</th>
              <th className="text-left px-4 py-3 text-white/40 text-xs font-medium uppercase tracking-wider">Perfil</th>
              <th className="text-left px-4 py-3 text-white/40 text-xs font-medium uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-white/40 text-xs font-medium uppercase tracking-wider">Último login</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-white/5">
                  <td className="px-4 py-3" colSpan={5}>
                    <div className="h-4 bg-white/5 rounded animate-pulse w-full" />
                  </td>
                </tr>
              ))
            ) : usuarios.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-white/30 text-sm">
                  Nenhum usuário encontrado
                </td>
              </tr>
            ) : (
              usuarios.map((u) => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-white text-sm font-medium">{u.nome || '—'}</p>
                      <p className="text-white/40 text-xs">{u.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <RoleBadge role={u.role} />
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 text-xs ${u.ativo ? 'text-green-400' : 'text-red-400'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${u.ativo ? 'bg-green-400' : 'bg-red-400'}`} />
                      {u.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white/40 text-sm">
                    {u.ultimoLogin
                      ? new Date(u.ultimoLogin).toLocaleDateString('pt-BR')
                      : 'Nunca'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setEditando(u)}
                      className="text-white/40 hover:text-[#D4AF37] text-xs transition-colors px-2 py-1 rounded hover:bg-[#D4AF37]/10"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
            <p className="text-white/40 text-xs">
              Página {page} de {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 text-xs text-white/60 border border-white/10 rounded hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ‹ Anterior
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 text-xs text-white/60 border border-white/10 rounded hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Próxima ›
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modais */}
      {showCriar && (
        <ModalCriar
          onClose={() => setShowCriar(false)}
          onSuccess={() => { setShowCriar(false); load(); }}
        />
      )}
      {editando && (
        <ModalEditar
          usuario={editando}
          onClose={() => setEditando(null)}
          onSuccess={() => { setEditando(null); load(); }}
        />
      )}
    </div>
    </AppLayout>
  );
}
