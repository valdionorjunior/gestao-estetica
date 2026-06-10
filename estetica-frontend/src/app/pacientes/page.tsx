'use client';

import { useEffect, useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { pacientesService, Paciente, CreatePacienteDto } from '../../services/pacientes.service';

function useDebounce(value: string, ms = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return debounced;
}

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const debouncedSearch = useDebounce(search);
  const limit = 15;

  function load(p: number, s: string) {
    setLoading(true);
    pacientesService
      .list({ search: s || undefined, page: p, limit })
      .then((res) => { setPacientes(res.data); setTotal(res.total); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  useEffect(() => { setPage(1); load(1, debouncedSearch); }, [debouncedSearch]);

  function handlePageChange(next: number) {
    setPage(next);
    load(next, debouncedSearch);
  }

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-[#1A1A1A]">Pacientes</h1>
        <div className="w-10 h-0.5 bg-[#D4AF37] mt-2" />
      </div>

      <Card>
        <CardHeader
          title="Lista de Pacientes"
          subtitle={`${total} paciente(s) cadastrado(s)`}
          action={<Button size="sm" onClick={() => setShowModal(true)}>+ Novo Paciente</Button>}
        />

        {/* Search */}
        <div className="mb-4">
          <Input
            placeholder="Buscar por nome, e-mail ou telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-12">
            <span className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : pacientes.length === 0 ? (
          <div className="text-center py-12 text-[#6B6560]">
            <p className="text-4xl mb-3">👥</p>
            <p className="font-medium">Nenhum paciente encontrado</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E8E4DD]">
                    {['Nome', 'E-mail', 'Telefone', 'CPF', 'Status'].map((h) => (
                      <th key={h} className="text-left py-3 px-2 text-xs font-medium text-[#6B6560] uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E4DD]">
                  {pacientes.map((p) => (
                    <tr key={p.id} className="hover:bg-[#F8F7F4] transition-colors">
                      <td className="py-3 px-2 font-medium text-[#1A1A1A]">{p.nome}</td>
                      <td className="py-3 px-2 text-[#6B6560]">{p.email ?? '—'}</td>
                      <td className="py-3 px-2 text-[#6B6560]">{p.telefone ?? '—'}</td>
                      <td className="py-3 px-2 text-[#6B6560]">{p.cpfMasked ?? '—'}</td>
                      <td className="py-3 px-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.ativo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                          {p.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {total > limit && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#E8E4DD]">
                <p className="text-xs text-[#6B6560]">
                  {(page - 1) * limit + 1}–{Math.min(page * limit, total)} de {total}
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" disabled={page === 1} onClick={() => handlePageChange(page - 1)}>
                    ←
                  </Button>
                  <Button size="sm" variant="secondary" disabled={page * limit >= total} onClick={() => handlePageChange(page + 1)}>
                    →
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {showModal && <NovoPacienteModal onClose={() => setShowModal(false)} onCreated={() => { setShowModal(false); load(1, debouncedSearch); }} />}
    </AppLayout>
  );
}

function NovoPacienteModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState<CreatePacienteDto>({ nome: '', email: '', telefone: '', cpf: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await pacientesService.create(form);
      onCreated();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[#1A1A1A] tracking-tight">Novo Paciente</h2>
          <button onClick={onClose} className="text-[#6B6560] hover:text-[#1A1A1A] text-xl leading-none">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Nome completo" required value={form.nome} onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))} />
          <Input label="E-mail" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          <Input label="Telefone" value={form.telefone} onChange={(e) => setForm((f) => ({ ...f, telefone: e.target.value }))} placeholder="(00) 00000-0000" />
          <Input label="CPF" value={form.cpf} onChange={(e) => setForm((f) => ({ ...f, cpf: e.target.value }))} placeholder="000.000.000-00" />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={onClose} type="button">Cancelar</Button>
            <Button variant="primary" className="flex-1" loading={loading} type="submit">Cadastrar</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
