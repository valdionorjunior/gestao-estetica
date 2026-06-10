'use client';

import { useEffect, useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, CardHeader, KpiCard } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
  financeiroService,
  ContaFinanceira,
  CreateContaDto,
  DashboardFinanceiro,
} from '../../services/financeiro.service';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDENTE: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-700' },
  PAGO: { label: 'Pago', color: 'bg-green-100 text-green-700' },
  CANCELADO: { label: 'Cancelado', color: 'bg-red-100 text-red-600' },
};

function fmt(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function FinanceiroPage() {
  const [dashboard, setDashboard] = useState<DashboardFinanceiro | null>(null);
  const [contas, setContas] = useState<ContaFinanceira[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const limit = 15;

  function loadContas(p: number) {
    financeiroService
      .list({ page: p, limit })
      .then((res) => { setContas(res.data); setTotal(res.total); })
      .catch(console.error);
  }

  useEffect(() => {
    let cancelado = false;
    async function init() {
      const [dashRes, contasRes] = await Promise.allSettled([
        financeiroService.dashboard(),
        financeiroService.list({ page: 1, limit }),
      ]);
      if (cancelado) return;
      if (dashRes.status === 'fulfilled') setDashboard(dashRes.value);
      if (contasRes.status === 'fulfilled') { setContas(contasRes.value.data); setTotal(contasRes.value.total); }
      setLoading(false);
    }
    init();
    return () => { cancelado = true; };
  }, [limit]);

  async function pagar(id: string) {
    await financeiroService.markAsPaid(id);
    setContas((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'PAGO' as const } : c)));
    financeiroService.dashboard().then(setDashboard).catch(console.error);
  }

  async function cancelar(id: string) {
    await financeiroService.cancel(id);
    setContas((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'CANCELADO' as const } : c)));
  }

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-[#1A1A1A]">Financeiro</h1>
        <div className="w-10 h-0.5 bg-[#D4AF37] mt-2" />
      </div>

      {/* Dashboard KPIs */}
      {dashboard && (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <KpiCard label="Receitas" value={fmt(dashboard.totalReceitas)} icon="💵" positive />
          <KpiCard label="Despesas" value={fmt(dashboard.totalDespesas)} icon="💸" />
          <KpiCard label="Saldo" value={fmt(dashboard.saldo)} positive={dashboard.saldo >= 0} icon="⚖️" />
          <KpiCard label="Pendentes" value={dashboard.contasPendentes} icon="⏳" />
        </div>
      )}

      {/* Contas table */}
      <Card>
        <CardHeader
          title="Contas"
          subtitle={`${total} lançamento(s)`}
          action={<Button size="sm" onClick={() => setShowModal(true)}>+ Novo Lançamento</Button>}
        />

        {loading ? (
          <div className="flex justify-center py-12">
            <span className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : contas.length === 0 ? (
          <div className="text-center py-12 text-[#6B6560]">
            <p className="text-4xl mb-3">💰</p>
            <p>Nenhum lançamento encontrado</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E8E4DD]">
                    {['Descrição', 'Tipo', 'Valor', 'Vencimento', 'Status', 'Ações'].map((h) => (
                      <th key={h} className="text-left py-3 px-2 text-xs font-medium text-[#6B6560] uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E4DD]">
                  {contas.map((c) => {
                    const badge = STATUS_LABELS[c.status] ?? { label: c.status, color: 'bg-gray-100 text-gray-600' };
                    return (
                      <tr key={c.id} className="hover:bg-[#F8F7F4]">
                        <td className="py-3 px-2 font-medium text-[#1A1A1A]">{c.descricao}</td>
                        <td className="py-3 px-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.tipo === 'RECEITA' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                            {c.tipo}
                          </span>
                        </td>
                        <td className={`py-3 px-2 font-semibold ${c.tipo === 'RECEITA' ? 'text-green-700' : 'text-red-600'}`}>
                          {fmt(c.valor)}
                        </td>
                        <td className="py-3 px-2 text-[#6B6560]">
                          {new Date(c.dataVencimento).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="py-3 px-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.color}`}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex gap-2">
                            {c.status === 'PENDENTE' && (
                              <>
                                <Button size="sm" onClick={() => pagar(c.id)}>Pagar</Button>
                                <Button size="sm" variant="ghost" onClick={() => cancelar(c.id)}>Cancelar</Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {total > limit && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#E8E4DD]">
                <p className="text-xs text-[#6B6560]">
                  {(page - 1) * limit + 1}–{Math.min(page * limit, total)} de {total}
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" disabled={page === 1} onClick={() => { setPage(page - 1); loadContas(page - 1); }}>←</Button>
                  <Button size="sm" variant="secondary" disabled={page * limit >= total} onClick={() => { setPage(page + 1); loadContas(page + 1); }}>→</Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {showModal && (
        <NovoLancamentoModal
          onClose={() => setShowModal(false)}
          onCreated={() => { setShowModal(false); loadContas(1); financeiroService.dashboard().then(setDashboard); }}
        />
      )}
    </AppLayout>
  );
}

function NovoLancamentoModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState<CreateContaDto>({
    descricao: '',
    tipo: 'RECEITA',
    valor: 0,
    dataVencimento: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await financeiroService.create(form);
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
          <h2 className="text-lg font-semibold text-[#1A1A1A] tracking-tight">Novo Lançamento</h2>
          <button onClick={onClose} className="text-[#6B6560] hover:text-[#1A1A1A] text-xl leading-none">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Descrição" required value={form.descricao} onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))} />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#1A1A1A]">Tipo</label>
            <select
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8E4DD] text-sm text-[#1A1A1A] bg-white focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none"
              value={form.tipo}
              onChange={(e) => setForm((f) => ({ ...f, tipo: e.target.value as 'RECEITA' | 'DESPESA' }))}
            >
              <option value="RECEITA">Receita</option>
              <option value="DESPESA">Despesa</option>
            </select>
          </div>

          <Input
            label="Valor (R$)"
            type="number"
            step="0.01"
            min="0"
            required
            value={form.valor}
            onChange={(e) => setForm((f) => ({ ...f, valor: parseFloat(e.target.value) }))}
          />
          <Input
            label="Vencimento"
            type="date"
            required
            value={form.dataVencimento}
            onChange={(e) => setForm((f) => ({ ...f, dataVencimento: e.target.value }))}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={onClose} type="button">Cancelar</Button>
            <Button variant="primary" className="flex-1" loading={loading} type="submit">Lançar</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
