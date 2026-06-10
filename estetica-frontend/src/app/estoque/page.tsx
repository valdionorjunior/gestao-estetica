'use client';

import { useEffect, useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { estoqueService, Produto, CreateProdutoDto } from '../../services/estoque.service';

export default function EstoquePage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [alertas, setAlertas] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [movModal, setMovModal] = useState<Produto | null>(null);
  const limit = 15;

  function load(p: number, s: string) {
    setLoading(true);
    estoqueService
      .listProdutos({ search: s || undefined, page: p, limit })
      .then((res) => { setProdutos(res.data); setTotal(res.total); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    let cancelado = false;
    async function init() {
      setLoading(true);
      const [alertasRes, produtosRes] = await Promise.allSettled([
        estoqueService.alertas(),
        estoqueService.listProdutos({ limit }),
      ]);
      if (cancelado) return;
      if (alertasRes.status === 'fulfilled') setAlertas(alertasRes.value);
      if (produtosRes.status === 'fulfilled') { setProdutos(produtosRes.value.data); setTotal(produtosRes.value.total); }
      setLoading(false);
    }
    init();
    return () => { cancelado = true; };
  }, [limit]);

  function handleSearch(s: string) {
    setSearch(s);
    setPage(1);
    load(1, s);
  }

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-[#1A1A1A]">Estoque</h1>
        <div className="w-10 h-0.5 bg-[#D4AF37] mt-2" />
      </div>

      {/* Alertas */}
      {alertas.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
          <p className="text-sm font-semibold text-orange-700 mb-2">⚠️ {alertas.length} produto(s) abaixo do estoque mínimo</p>
          <div className="flex flex-wrap gap-2">
            {alertas.map((a) => (
              <span key={a.id} className="text-xs bg-white border border-orange-200 text-orange-700 px-3 py-1 rounded-full">
                {a.nome}: {a.estoqueAtual} {a.unidade} (mín. {a.estoqueMinimo})
              </span>
            ))}
          </div>
        </div>
      )}

      <Card>
        <CardHeader
          title="Produtos"
          subtitle={`${total} produto(s) cadastrado(s)`}
          action={<Button size="sm" onClick={() => setShowModal(true)}>+ Novo Produto</Button>}
        />

        <div className="mb-4">
          <Input
            placeholder="Buscar produto..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <span className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : produtos.length === 0 ? (
          <div className="text-center py-12 text-[#6B6560]">
            <p className="text-4xl mb-3">📦</p>
            <p>Nenhum produto encontrado</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E8E4DD]">
                    {['Produto', 'Unidade', 'Estoque Atual', 'Estoque Mínimo', 'Status', 'Ações'].map((h) => (
                      <th key={h} className="text-left py-3 px-2 text-xs font-medium text-[#6B6560] uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E4DD]">
                  {produtos.map((p) => {
                    const abaixo = p.estoqueAtual < p.estoqueMinimo;
                    return (
                      <tr key={p.id} className="hover:bg-[#F8F7F4]">
                        <td className="py-3 px-2 font-medium text-[#1A1A1A]">{p.nome}</td>
                        <td className="py-3 px-2 text-[#6B6560]">{p.unidade}</td>
                        <td className={`py-3 px-2 font-semibold ${abaixo ? 'text-orange-600' : 'text-[#1A1A1A]'}`}>
                          {p.estoqueAtual}
                        </td>
                        <td className="py-3 px-2 text-[#6B6560]">{p.estoqueMinimo}</td>
                        <td className="py-3 px-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${abaixo ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                            {abaixo ? 'Abaixo' : 'OK'}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <Button size="sm" variant="secondary" onClick={() => setMovModal(p)}>
                            Movimentar
                          </Button>
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
                  <Button size="sm" variant="secondary" disabled={page === 1} onClick={() => { setPage(page - 1); load(page - 1, search); }}>←</Button>
                  <Button size="sm" variant="secondary" disabled={page * limit >= total} onClick={() => { setPage(page + 1); load(page + 1, search); }}>→</Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {showModal && (
        <NovoProdutoModal
          onClose={() => setShowModal(false)}
          onCreated={() => { setShowModal(false); load(1, search); }}
        />
      )}
      {movModal && (
        <MovimentacaoModal
          produto={movModal}
          onClose={() => setMovModal(null)}
          onDone={() => { setMovModal(null); load(page, search); estoqueService.alertas().then(setAlertas); }}
        />
      )}
    </AppLayout>
  );
}

function NovoProdutoModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState<CreateProdutoDto>({ nome: '', unidade: 'un', estoqueMinimo: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await estoqueService.create(form);
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
          <h2 className="text-lg font-semibold text-[#1A1A1A] tracking-tight">Novo Produto</h2>
          <button onClick={onClose} className="text-[#6B6560] hover:text-[#1A1A1A] text-xl">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Nome do produto" required value={form.nome} onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))} />
          <Input label="Unidade (ex: un, ml, kg)" required value={form.unidade} onChange={(e) => setForm((f) => ({ ...f, unidade: e.target.value }))} />
          <Input label="Estoque mínimo" type="number" min="0" step="0.001" required value={form.estoqueMinimo} onChange={(e) => setForm((f) => ({ ...f, estoqueMinimo: parseFloat(e.target.value) }))} />
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

function MovimentacaoModal({ produto, onClose, onDone }: { produto: Produto; onClose: () => void; onDone: () => void }) {
  const [tipo, setTipo] = useState<'ENTRADA' | 'SAIDA' | 'AJUSTE'>('ENTRADA');
  const [quantidade, setQuantidade] = useState(0);
  const [obs, setObs] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await estoqueService.movimentar(produto.id, tipo, quantidade, obs || undefined);
      onDone();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-[#1A1A1A] tracking-tight">Movimentar Estoque</h2>
          <button onClick={onClose} className="text-[#6B6560] hover:text-[#1A1A1A] text-xl">✕</button>
        </div>
        <p className="text-sm text-[#6B6560] mb-6">{produto.nome} — atual: {produto.estoqueAtual} {produto.unidade}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#1A1A1A]">Tipo</label>
            <select
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8E4DD] text-sm text-[#1A1A1A] bg-white focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none"
              value={tipo}
              onChange={(e) => setTipo(e.target.value as typeof tipo)}
            >
              <option value="ENTRADA">Entrada</option>
              <option value="SAIDA">Saída</option>
              <option value="AJUSTE">Ajuste (definir valor absoluto)</option>
            </select>
          </div>
          <Input label="Quantidade" type="number" step="0.001" min="0" required value={quantidade} onChange={(e) => setQuantidade(parseFloat(e.target.value))} />
          <Input label="Observações (opcional)" value={obs} onChange={(e) => setObs(e.target.value)} />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={onClose} type="button">Cancelar</Button>
            <Button variant="primary" className="flex-1" loading={loading} type="submit">Confirmar</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
