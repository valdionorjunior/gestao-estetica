'use client';

import { useEffect, useState, useCallback } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import {
  marketingService,
  ComunicacaoLog,
  MarketingEstatisticas,
  CanalTipo,
} from '../../services/marketing.service';
import { pacientesService, Paciente } from '../../services/pacientes.service';

const CANAL_LABELS: Record<CanalTipo, { label: string; icon: string; color: string }> = {
  EMAIL: { label: 'E-mail', icon: '✉️', color: 'text-blue-400' },
  SMS: { label: 'SMS', icon: '💬', color: 'text-yellow-400' },
  WHATSAPP: { label: 'WhatsApp', icon: '📲', color: 'text-green-400' },
};

const STATUS_STYLE: Record<string, string> = {
  ENVIADO: 'bg-green-500/15 text-green-400 border border-green-500/30',
  SIMULADO: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
  FALHOU: 'bg-red-500/15 text-red-400 border border-red-500/30',
  PENDENTE: 'bg-gray-500/15 text-gray-400 border border-gray-500/30',
};

const STATUS_LABELS: Record<string, string> = {
  ENVIADO: 'Enviado',
  SIMULADO: 'Simulado',
  FALHOU: 'Falhou',
  PENDENTE: 'Pendente',
};

const MOTIVO_LABELS: Record<string, string> = {
  LEMBRETE_AGENDAMENTO: 'Lembrete',
  CONFIRMACAO_AGENDAMENTO: 'Confirmação',
  CANCELAMENTO_AGENDAMENTO: 'Cancelamento',
  CAMPANHA_MARKETING: 'Campanha',
  ANIVERSARIO: 'Aniversário',
  POS_ATENDIMENTO: 'Pós-atendimento',
  MANUAL: 'Manual',
};

function KpiCard({ label, value, sub, color }: { label: string; value: number; sub?: string; color: string }) {
  return (
    <div className="bg-[#1A1A1A] border border-white/10 rounded-xl p-5">
      <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value.toLocaleString('pt-BR')}</p>
      {sub && <p className="text-white/30 text-xs mt-1">{sub}</p>}
    </div>
  );
}

function ModalEnviar({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [form, setForm] = useState({
    pacienteId: '',
    tipo: 'WHATSAPP' as CanalTipo,
    motivo: 'MANUAL' as const,
    assunto: 'Mensagem da Estética Natalia Salvador',
    mensagem: '',
  });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    pacientesService.list({ limit: 100 }).then((r) => setPacientes(r.data)).catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro('');
    try {
      await marketingService.enviar(form);
      onSuccess();
    } catch (err: any) {
      setErro(err?.message ?? 'Erro ao enviar mensagem');
    } finally {
      setLoading(false);
    }
  }

  const variaveis = '{nome}, {primeiro_nome}, {email}, {telefone}';

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A1A1A] border border-white/10 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-[#1A1A1A]">
          <h2 className="text-white font-semibold text-lg">Enviar Mensagem</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white/80 text-xl leading-none">×</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {erro && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
              {erro}
            </div>
          )}
          <div>
            <label className="block text-white/60 text-sm mb-1.5">Paciente</label>
            <select
              required
              value={form.pacienteId}
              onChange={(e) => setForm((f) => ({ ...f, pacienteId: e.target.value }))}
              className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
            >
              <option value="">Selecionar paciente...</option>
              {pacientes.map((p) => (
                <option key={p.id} value={p.id}>{p.nome} {p.email ? `(${p.email})` : ''}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-1.5">Canal</label>
            <div className="flex gap-2">
              {(['WHATSAPP', 'EMAIL', 'SMS'] as CanalTipo[]).map((canal) => (
                <button
                  key={canal}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, tipo: canal }))}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    form.tipo === canal
                      ? 'bg-[#D4AF37]/15 border-[#D4AF37]/40 text-[#D4AF37]'
                      : 'border-white/10 text-white/50 hover:bg-white/5'
                  }`}
                >
                  {CANAL_LABELS[canal].icon} {CANAL_LABELS[canal].label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-1.5">Assunto (e-mail)</label>
            <input
              type="text"
              value={form.assunto}
              onChange={(e) => setForm((f) => ({ ...f, assunto: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50"
            />
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-1.5">Mensagem</label>
            <textarea
              required
              rows={5}
              value={form.mensagem}
              onChange={(e) => setForm((f) => ({ ...f, mensagem: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50 resize-none"
              placeholder="Olá {nome}, temos uma novidade para você..."
            />
            <p className="text-white/30 text-xs mt-1">Variáveis: <code className="text-[#D4AF37]/60">{variaveis}</code></p>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg border border-white/10 text-white/60 text-sm hover:bg-white/5 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="flex-1 py-2 rounded-lg bg-[#D4AF37] text-[#1A1A1A] font-semibold text-sm hover:bg-[#C9A96E] transition-colors disabled:opacity-50">
              {loading ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MarketingPage() {
  const [stats, setStats] = useState<MarketingEstatisticas | null>(null);
  const [historico, setHistorico] = useState<ComunicacaoLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filtroTipo, setFiltroTipo] = useState<CanalTipo | ''>('');
  const [showEnviar, setShowEnviar] = useState(false);
  const [loading, setLoading] = useState(true);

  const LIMIT = 20;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, histRes] = await Promise.all([
        marketingService.estatisticas(),
        marketingService.historico({
          page,
          limit: LIMIT,
          tipo: filtroTipo || undefined,
        }),
      ]);
      setStats(statsRes);
      setHistorico(histRes.data);
      setTotal(histRes.total);
    } catch {
      setHistorico([]);
    } finally {
      setLoading(false);
    }
  }, [page, filtroTipo]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.ceil(total / LIMIT);
  const totalComunicacoes = stats
    ? stats.totalEnviados + stats.totalSimulados + stats.totalFalhas
    : 0;

  return (
    <AppLayout>
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Marketing</h1>
          <p className="text-white/40 text-sm mt-0.5">Comunicações via E-mail, SMS e WhatsApp</p>
        </div>
        <button
          onClick={() => setShowEnviar(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-[#1A1A1A] font-semibold text-sm rounded-lg hover:bg-[#C9A96E] transition-colors"
        >
          + Enviar Mensagem
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard
          label="Total enviados"
          value={stats?.totalEnviados ?? 0}
          color="text-green-400"
        />
        <KpiCard
          label="Simulados (dev)"
          value={stats?.totalSimulados ?? 0}
          sub="Sem credenciais configuradas"
          color="text-yellow-400"
        />
        <KpiCard label="Falhas" value={stats?.totalFalhas ?? 0} color="text-red-400" />
        <KpiCard label="Total geral" value={totalComunicacoes} color="text-[#D4AF37]" />
      </div>

      {/* Distribuição por canal */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {(['EMAIL', 'SMS', 'WHATSAPP'] as CanalTipo[]).map((canal) => (
            <div key={canal} className="bg-[#1A1A1A] border border-white/10 rounded-xl p-4 flex items-center gap-4">
              <span className="text-2xl">{CANAL_LABELS[canal].icon}</span>
              <div>
                <p className="text-white/40 text-xs">{CANAL_LABELS[canal].label}</p>
                <p className={`text-xl font-bold ${CANAL_LABELS[canal].color}`}>
                  {(stats.porTipo[canal] ?? 0).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filtros + Tabela */}
      <div className="bg-[#1A1A1A] border border-white/10 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <p className="text-white/60 text-sm font-medium">Histórico de comunicações</p>
          <div className="flex gap-2">
            {(['', 'WHATSAPP', 'EMAIL', 'SMS'] as (CanalTipo | '')[]).map((t) => (
              <button
                key={t || 'todos'}
                onClick={() => { setFiltroTipo(t); setPage(1); }}
                className={`px-3 py-1 text-xs rounded-lg border transition-colors ${
                  filtroTipo === t
                    ? 'bg-[#D4AF37]/15 border-[#D4AF37]/40 text-[#D4AF37]'
                    : 'border-white/10 text-white/40 hover:bg-white/5'
                }`}
              >
                {t ? CANAL_LABELS[t as CanalTipo].label : 'Todos'}
              </button>
            ))}
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left px-4 py-3 text-white/40 text-xs font-medium uppercase tracking-wider">Canal</th>
              <th className="text-left px-4 py-3 text-white/40 text-xs font-medium uppercase tracking-wider">Destinatário</th>
              <th className="text-left px-4 py-3 text-white/40 text-xs font-medium uppercase tracking-wider">Motivo</th>
              <th className="text-left px-4 py-3 text-white/40 text-xs font-medium uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-white/40 text-xs font-medium uppercase tracking-wider">Data</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-white/5">
                  <td className="px-4 py-3" colSpan={5}>
                    <div className="h-4 bg-white/5 rounded animate-pulse" />
                  </td>
                </tr>
              ))
            ) : historico.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-white/30 text-sm">
                  Nenhuma comunicação registrada
                </td>
              </tr>
            ) : (
              historico.map((log) => (
                <tr key={log.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <span className={`flex items-center gap-1.5 text-sm ${CANAL_LABELS[log.tipo]?.color ?? 'text-white/60'}`}>
                      {CANAL_LABELS[log.tipo]?.icon} {CANAL_LABELS[log.tipo]?.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white/70 text-sm">{log.destinatario || '—'}</td>
                  <td className="px-4 py-3 text-white/50 text-sm">{MOTIVO_LABELS[log.motivo] ?? log.motivo}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${STATUS_STYLE[log.status] ?? ''}`}>
                      {STATUS_LABELS[log.status] ?? log.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white/40 text-sm">
                    {new Date(log.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
            <p className="text-white/40 text-xs">Página {page} de {totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 text-xs text-white/60 border border-white/10 rounded hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                ‹ Anterior
              </button>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 text-xs text-white/60 border border-white/10 rounded hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                Próxima ›
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Info sobre integrações */}
      <div className="mt-4 bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-xl p-4">
        <p className="text-[#D4AF37] text-sm font-medium mb-2">⚙️ Configuração de canais</p>
        <p className="text-white/40 text-xs leading-relaxed">
          Defina as credenciais no arquivo <code className="text-white/60">.env</code> para ativar os envios reais:&nbsp;
          <strong className="text-white/60">E-mail</strong> (SMTP_HOST + SMTP_USER + SMTP_PASS),&nbsp;
          <strong className="text-white/60">SMS</strong> (TWILIO_ACCOUNT_SID + TWILIO_AUTH_TOKEN),&nbsp;
          <strong className="text-white/60">WhatsApp</strong> (EVOLUTION_API_URL + EVOLUTION_API_KEY).
          Sem credenciais, os envios são registrados como <em>Simulado</em>.
        </p>
      </div>

      {showEnviar && (
        <ModalEnviar
          onClose={() => setShowEnviar(false)}
          onSuccess={() => { setShowEnviar(false); load(); }}
        />
      )}
    </div>
    </AppLayout>
  );
}
