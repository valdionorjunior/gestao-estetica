'use client';

import { useEffect, useState, useCallback } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { useAuthStore } from '../../stores/auth.store';
import {
  integracoesService,
  IntegracaoLog,
  EstatisticasIntegracao,
  StatusConfig,
} from '../../services/integracoes.service';

// ─── Paleta NS ───────────────────────────────────────────────────────────────
const GOLD = '#D4AF37';
const CREAM = '#F8F7F4';

// ─── Ícone status ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    SUCESSO: 'bg-emerald-100 text-emerald-800',
    SIMULADO: 'bg-amber-100 text-amber-800',
    FALHOU: 'bg-red-100 text-red-800',
  };
  const labels: Record<string, string> = {
    SUCESSO: 'Sucesso',
    SIMULADO: 'Simulado',
    FALHOU: 'Falhou',
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${map[status] ?? 'bg-gray-100 text-gray-700'}`}
    >
      {labels[status] ?? status}
    </span>
  );
}

// ─── Ação label ───────────────────────────────────────────────────────────────
const acaoLabel: Record<string, string> = {
  SINCRONIZAR_CONTATO: 'Sincronizar Contato',
  REGISTRAR_EVENTO: 'Registrar Evento',
  WEBHOOK_RECEBIDO: 'Webhook Recebido',
  WEBHOOK_LEAD: 'Webhook Lead',
};

// ─── Data formatada ─────────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}

// ─── Card de integração ──────────────────────────────────────────────────────
function IntegracaoCard({
  nome,
  ativo,
  descricao,
  varEnvs,
  stats,
}: {
  nome: string;
  ativo: boolean;
  descricao: string;
  varEnvs: string[];
  stats?: EstatisticasIntegracao;
}) {
  return (
    <div
      className="rounded-2xl p-6 shadow-sm border"
      style={{
        background: '#fff',
        borderColor: ativo ? GOLD : '#e5e7eb',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-base font-bold" style={{ color: '#1A1A1A' }}>
          {nome}
        </span>
        <span
          className="text-xs font-semibold px-3 py-1 rounded-full"
          style={{
            background: ativo ? '#D4AF37' : '#f3f4f6',
            color: ativo ? '#fff' : '#6b7280',
          }}
        >
          {ativo ? 'Conectado' : 'Simulado'}
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-4">{descricao}</p>

      {stats && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 rounded-lg bg-emerald-50">
            <div className="text-xl font-bold text-emerald-700">{stats.sucesso}</div>
            <div className="text-xs text-emerald-600">Sucessos</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-amber-50">
            <div className="text-xl font-bold text-amber-700">{stats.simulado}</div>
            <div className="text-xs text-amber-600">Simulados</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-red-50">
            <div className="text-xl font-bold text-red-700">{stats.falha}</div>
            <div className="text-xs text-red-600">Falhas</div>
          </div>
        </div>
      )}

      {stats?.ultimaSincronizacao && (
        <p className="text-xs text-gray-400 mb-3">
          Última sincronização: {formatDate(stats.ultimaSincronizacao)}
        </p>
      )}

      <div className="mt-3 border-t pt-3">
        <p className="text-xs font-semibold text-gray-500 mb-1">Variáveis de ambiente:</p>
        <div className="flex flex-wrap gap-1">
          {varEnvs.map((v) => (
            <code key={v} className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-700">
              {v}
            </code>
          ))}
        </div>
        {!ativo && (
          <p className="text-xs text-amber-600 mt-2">
            ⚠️ Configure as variáveis acima no <code>.env</code> para ativar.
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Modal Sincronizar Contato ────────────────────────────────────────────────
function ModalSincronizar({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({ pacienteId: '', nome: '', email: '', telefone: '', plataforma: '' });
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<{ plataforma: string; status: string }[] | null>(null);
  const [erro, setErro] = useState('');

  const sincronizar = async () => {
    if (!form.nome.trim()) { setErro('Nome é obrigatório'); return; }
    if (!form.pacienteId.trim()) { setErro('ID do paciente é obrigatório'); return; }
    setErro('');
    setLoading(true);
    try {
      const res = await integracoesService.sincronizarContato({
        pacienteId: form.pacienteId,
        nome: form.nome,
        email: form.email || undefined,
        telefone: form.telefone || undefined,
        plataforma: form.plataforma || undefined,
      });
      setResultado(res.resultados);
      onSuccess();
    } catch {
      setErro('Erro ao sincronizar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold" style={{ color: '#1A1A1A' }}>
            Sincronizar Contato
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>

        {resultado ? (
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Resultado da sincronização:</p>
            {resultado.map((r) => (
              <div key={r.plataforma} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
                <span className="text-sm font-medium">{r.plataforma.replace('_', ' ')}</span>
                <StatusBadge status={r.status} />
              </div>
            ))}
            <button
              onClick={onClose}
              className="w-full mt-4 py-2 rounded-lg text-sm font-semibold text-white"
              style={{ background: GOLD }}
            >
              Fechar
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-600">ID do Paciente (UUID) *</label>
              <input
                value={form.pacienteId}
                onChange={(e) => setForm({ ...form, pacienteId: e.target.value })}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': GOLD } as React.CSSProperties}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600">Nome *</label>
              <input
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Nome do paciente"
                className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600">E-mail</label>
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@exemplo.com"
                type="email"
                className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600">Telefone</label>
              <input
                value={form.telefone}
                onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                placeholder="(11) 99999-9999"
                className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600">Plataforma (opcional)</label>
              <select
                value={form.plataforma}
                onChange={(e) => setForm({ ...form, plataforma: e.target.value })}
                className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none bg-white"
              >
                <option value="">Todas</option>
                <option value="RD_STATION">RD Station</option>
                <option value="LEADLOVERS">LeadLovers</option>
              </select>
            </div>

            {erro && <p className="text-xs text-red-600">{erro}</p>}

            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-2 rounded-lg border text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={sincronizar}
                disabled={loading}
                className="flex-1 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
                style={{ background: GOLD }}
              >
                {loading ? 'Sincronizando...' : 'Sincronizar'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function IntegracoesPage() {
  const { user } = useAuthStore();
  const [status, setStatus] = useState<StatusConfig | null>(null);
  const [stats, setStats] = useState<EstatisticasIntegracao[]>([]);
  const [logs, setLogs] = useState<IntegracaoLog[]>([]);
  const [totalLogs, setTotalLogs] = useState(0);
  const [page, setPage] = useState(1);
  const [filtroPlat, setFiltroPlat] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalSinc, setModalSinc] = useState(false);
  const [erro, setErro] = useState('');

  const carregarDados = useCallback(async () => {
    setLoading(true);
    setErro('');
    try {
      const [s, st, l] = await Promise.all([
        integracoesService.statusConfig(),
        integracoesService.estatisticas(),
        integracoesService.logs({ plataforma: filtroPlat || undefined, page }),
      ]);
      setStatus(s);
      setStats(st);
      setLogs(l.data);
      setTotalLogs(l.total);
    } catch {
      setErro('Erro ao carregar dados de integração.');
    } finally {
      setLoading(false);
    }
  }, [filtroPlat, page]);

  useEffect(() => { carregarDados(); }, [carregarDados]);

  const getStats = (plat: string) =>
    stats.find((s) => s.plataforma === plat);

  if (!user || user.role !== 'ADMIN') {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64 text-gray-500">
          Acesso restrito a administradores.
        </div>
      </AppLayout>
    );
  }

  const totalPages = Math.ceil(totalLogs / 20);

  return (
    <AppLayout>
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1A1A1A', fontFamily: 'Cormorant Garamond, Georgia, serif' }}>
            Integrações
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            RD Station · LeadLovers — automação de marketing
          </p>
        </div>
        <button
          onClick={() => setModalSinc(true)}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity"
          style={{ background: GOLD }}
        >
          + Sincronizar Contato
        </button>
      </div>

      {erro && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          {erro}
        </div>
      )}

      {/* Cards de integração */}
      {loading && !status ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-2xl p-6 bg-white border border-gray-100 animate-pulse h-48" />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          <IntegracaoCard
            nome="RD Station"
            ativo={status?.rdStation ?? false}
            descricao="CRM e automação de marketing. Sincronize pacientes como contatos e registre eventos de conversão."
            varEnvs={['RD_STATION_API_KEY']}
            stats={getStats('RD_STATION')}
          />
          <IntegracaoCard
            nome="LeadLovers"
            ativo={status?.leadlovers ?? false}
            descricao="Plataforma de email marketing. Insira pacientes em máquinas de automação e funis de vendas."
            varEnvs={['LEADLOVERS_API_KEY', 'LEADLOVERS_MAQUINA_ID']}
            stats={getStats('LEADLOVERS')}
          />
        </div>
      )}

      {/* Webhooks Info */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <h2 className="text-sm font-bold text-gray-700 mb-3">Endpoints de Webhook</h2>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">POST</span>
            <code className="text-xs text-gray-700">/api/v1/integracoes/webhook/rd-station</code>
            <span className="text-xs text-gray-400">— RD Station</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">POST</span>
            <code className="text-xs text-gray-700">/api/v1/integracoes/webhook/leadlovers</code>
            <span className="text-xs text-gray-400">— LeadLovers</span>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Configure estes endpoints no painel das respectivas plataformas para receber leads em tempo real.
        </p>
      </div>

      {/* Logs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 border-b border-gray-100">
          <h2 className="text-base font-bold" style={{ color: '#1A1A1A' }}>
            Histórico de Logs
            <span className="ml-2 text-sm font-normal text-gray-400">({totalLogs} registros)</span>
          </h2>
          <select
            value={filtroPlat}
            onChange={(e) => { setFiltroPlat(e.target.value); setPage(1); }}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none"
          >
            <option value="">Todas as plataformas</option>
            <option value="RD_STATION">RD Station</option>
            <option value="LEADLOVERS">LeadLovers</option>
          </select>
        </div>

        {loading ? (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-5 py-3 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-1" />
                <div className="h-3 bg-gray-50 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">
            Nenhum log de integração encontrado.
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {logs.map((log) => (
              <div key={log.id} className="px-5 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-gray-700">
                    {log.plataforma.replace('_', ' ')}
                  </span>
                  <span className="text-gray-300">·</span>
                  <span className="text-xs text-gray-500">
                    {acaoLabel[log.acao] ?? log.acao}
                  </span>
                  <StatusBadge status={log.status} />
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                  <span>{formatDate(log.createdAt)}</span>
                  {log.idExterno && (
                    <span className="font-mono">ID externo: {log.idExterno}</span>
                  )}
                  {log.resposta && log.status === 'FALHOU' && (
                    <span className="text-red-500 truncate max-w-xs">{log.resposta}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="text-sm px-3 py-1.5 rounded-lg border text-gray-600 hover:bg-gray-50 disabled:opacity-40"
            >
              ← Anterior
            </button>
            <span className="text-xs text-gray-500">
              Página {page} de {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="text-sm px-3 py-1.5 rounded-lg border text-gray-600 hover:bg-gray-50 disabled:opacity-40"
            >
              Próxima →
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalSinc && (
        <ModalSincronizar
          onClose={() => setModalSinc(false)}
          onSuccess={() => { carregarDados(); }}
        />
      )}
    </div>
    </AppLayout>
  );
}
