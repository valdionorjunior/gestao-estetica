'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { useAuthStore } from '../../stores/auth.store';
import {
  telemedService,
  SessaoTelemedicina,
  SessaoStatus,
  TelemedEstatisticas,
  TelemedStatusConfig,
} from '../../services/telemedicina.service';

const GOLD = '#D4AF37';
const CREAM = '#F8F7F4';

// ─── Utilitários ──────────────────────────────────────────────────────────────

function formatDate(iso: string | null) {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso));
}

function formatTamanho(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Status badge ─────────────────────────────────────────────────────────────

const statusCfg: Record<SessaoStatus, { label: string; cls: string }> = {
  AGENDADA: { label: 'Agendada', cls: 'bg-blue-100 text-blue-700' },
  EM_ANDAMENTO: { label: 'Em Andamento', cls: 'bg-emerald-100 text-emerald-700 animate-pulse' },
  ENCERRADA: { label: 'Encerrada', cls: 'bg-gray-100 text-gray-600' },
  CANCELADA: { label: 'Cancelada', cls: 'bg-red-100 text-red-600' },
};

function StatusBadge({ status }: { status: SessaoStatus }) {
  const cfg = statusCfg[status] ?? { label: status, cls: 'bg-gray-100 text-gray-600' };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${cfg.cls}`}>{cfg.label}</span>
  );
}

// ─── Card de estatística ──────────────────────────────────────────────────────

function StatCard({ label, value, cor }: { label: string; value: number; cor: string }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 text-center shadow-sm">
      <div className="text-2xl font-bold" style={{ color: cor }}>{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
}

// ─── Modal: Criar sessão ──────────────────────────────────────────────────────

function ModalCriar({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (sessao: SessaoTelemedicina) => void;
}) {
  const { user } = useAuthStore();
  const [form, setForm] = useState({
    pacienteId: '',
    pacienteNome: '',
    pacienteEmail: '',
    pacienteTelefone: '',
    profissionalNome: user?.nome ?? '',
    agendadoPara: '',
    observacoes: '',
  });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const criar = async () => {
    if (!form.pacienteId.trim()) { setErro('ID do paciente é obrigatório'); return; }
    if (!form.pacienteNome.trim()) { setErro('Nome do paciente é obrigatório'); return; }
    if (!form.profissionalNome.trim()) { setErro('Nome do profissional é obrigatório'); return; }
    setErro('');
    setLoading(true);
    try {
      const sessao = await telemedService.criar({
        pacienteId: form.pacienteId,
        pacienteNome: form.pacienteNome,
        pacienteEmail: form.pacienteEmail || undefined,
        pacienteTelefone: form.pacienteTelefone || undefined,
        profissionalId: user?.id,
        profissionalNome: form.profissionalNome,
        agendadoPara: form.agendadoPara || undefined,
        observacoes: form.observacoes || undefined,
      });
      onSuccess(sessao);
    } catch (e) {
      setErro((e as Error).message || 'Erro ao criar sessão');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold" style={{ color: '#1A1A1A' }}>Nova Sessão de Telemedicina</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        <div className="space-y-3">
          {[
            { label: 'ID do Paciente (UUID) *', key: 'pacienteId', placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' },
            { label: 'Nome do Paciente *', key: 'pacienteNome', placeholder: 'Nome completo' },
            { label: 'E-mail do Paciente', key: 'pacienteEmail', placeholder: 'email@exemplo.com' },
            { label: 'Telefone do Paciente', key: 'pacienteTelefone', placeholder: '(11) 99999-9999' },
            { label: 'Profissional Responsável *', key: 'profissionalNome', placeholder: 'Nome do médico' },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="text-xs font-semibold text-gray-600">{label}</label>
              <input
                value={(form as Record<string, string>)[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1"
                style={{ '--tw-ring-color': GOLD } as React.CSSProperties}
              />
            </div>
          ))}

          <div>
            <label className="text-xs font-semibold text-gray-600">Data/Hora Agendada</label>
            <input
              type="datetime-local"
              value={form.agendadoPara}
              onChange={(e) => setForm({ ...form, agendadoPara: e.target.value })}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600">Observações</label>
            <textarea
              value={form.observacoes}
              onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
              placeholder="Motivo da consulta, observações..."
              rows={2}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none resize-none"
            />
          </div>

          {erro && <p className="text-xs text-red-600">{erro}</p>}

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border text-sm text-gray-600 hover:bg-gray-50">
              Cancelar
            </button>
            <button
              onClick={criar}
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-40"
              style={{ background: GOLD }}
            >
              {loading ? 'Criando...' : 'Criar Sessão'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Modal: Sala de videoconferência ─────────────────────────────────────────

function ModalSala({
  sessao,
  onEncerrar,
  onClose,
}: {
  sessao: SessaoTelemedicina;
  onEncerrar: () => void;
  onClose: () => void;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [encerrandoSala, setEncerrandoSala] = useState(false);

  const encerrar = async () => {
    setEncerrandoSala(true);
    try {
      await telemedService.encerrar(sessao.id);
      onEncerrar();
    } catch {
      setEncerrandoSala(false);
    }
  };

  const abrirNovaAba = () => {
    window.open(sessao.urlEntradaProfissional, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Barra superior */}
      <div className="flex items-center justify-between px-4 py-2" style={{ background: '#1A1A1A' }}>
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white text-sm font-semibold">
            Teleconsulta · {sessao.pacienteNome}
          </span>
          <span className="text-gray-400 text-xs">
            {sessao.plataforma === 'JITSI' ? 'Jitsi Meet' : 'Daily.co'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={abrirNovaAba}
            className="px-3 py-1.5 rounded-lg text-xs text-white border border-gray-600 hover:bg-gray-700"
          >
            ↗ Abrir em nova aba
          </button>
          <button
            onClick={encerrar}
            disabled={encerrandoSala}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600 text-white hover:bg-red-700 disabled:opacity-40"
          >
            {encerrandoSala ? 'Encerrando...' : '■ Encerrar'}
          </button>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl px-2">
            &times;
          </button>
        </div>
      </div>

      {/* iframe da videochamada */}
      <div className="flex-1 relative">
        <iframe
          ref={iframeRef}
          src={sessao.urlEntradaProfissional}
          allow="camera; microphone; fullscreen; display-capture; autoplay"
          className="w-full h-full border-0"
          title={`Teleconsulta com ${sessao.pacienteNome}`}
        />
      </div>
    </div>
  );
}

// ─── Card de sessão ───────────────────────────────────────────────────────────

function SessaoCard({
  sessao,
  onIniciar,
  onCancelar,
  onEntrar,
}: {
  sessao: SessaoTelemedicina;
  onIniciar: (s: SessaoTelemedicina) => void;
  onCancelar: (s: SessaoTelemedicina) => void;
  onEntrar: (s: SessaoTelemedicina) => void;
}) {
  const copyLink = () => {
    navigator.clipboard.writeText(sessao.urlEntradaPaciente).catch(() => {});
    // Feedback visual simples
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <StatusBadge status={sessao.status} />
            <span className="text-xs text-gray-400">
              {sessao.plataforma === 'DAILY_CO' ? '🎥 Daily.co' : '🎙 Jitsi Meet'}
            </span>
          </div>
          <h3 className="text-base font-bold text-gray-800">{sessao.pacienteNome}</h3>
          <p className="text-sm text-gray-500">Dr(a). {sessao.profissionalNome}</p>

          {sessao.agendadoPara && (
            <p className="text-xs text-gray-400 mt-1">
              📅 {formatDate(sessao.agendadoPara)}
            </p>
          )}
          {sessao.observacoes && (
            <p className="text-xs text-gray-500 mt-1 italic line-clamp-2">{sessao.observacoes}</p>
          )}
          {sessao.duracaoMinutos !== null && (
            <p className="text-xs text-emerald-600 mt-1 font-semibold">
              ⏱ Duração: {sessao.duracaoMinutos} minutos
            </p>
          )}

          {sessao.arquivos.length > 0 && (
            <p className="text-xs text-gray-400 mt-1">
              📎 {sessao.arquivos.length} arquivo(s) compartilhado(s)
            </p>
          )}
        </div>

        {/* Ações */}
        <div className="flex flex-wrap gap-2 items-start">
          {sessao.status === 'AGENDADA' && (
            <>
              <button
                onClick={() => onIniciar(sessao)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                style={{ background: GOLD }}
              >
                ▶ Iniciar
              </button>
              <button
                onClick={() => onCancelar(sessao)}
                className="px-3 py-1.5 rounded-lg text-xs text-red-600 border border-red-200 hover:bg-red-50"
              >
                Cancelar
              </button>
            </>
          )}
          {sessao.status === 'EM_ANDAMENTO' && (
            <button
              onClick={() => onEntrar(sessao)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700"
            >
              📹 Entrar na Sala
            </button>
          )}
          <button
            onClick={copyLink}
            className="px-3 py-1.5 rounded-lg text-xs text-gray-600 border border-gray-200 hover:bg-gray-50"
            title="Copiar link do paciente"
          >
            🔗 Copiar Link
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function TelemediicinaPage() {
  const { user } = useAuthStore();
  const [sessoes, setSessoes] = useState<SessaoTelemedicina[]>([]);
  const [stats, setStats] = useState<TelemedEstatisticas | null>(null);
  const [config, setConfig] = useState<TelemedStatusConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState<SessaoStatus | ''>('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [modalCriar, setModalCriar] = useState(false);
  const [sessaoSala, setSessaoSala] = useState<SessaoTelemedicina | null>(null);
  const [erro, setErro] = useState('');

  const carregarDados = useCallback(async () => {
    setLoading(true);
    setErro('');
    try {
      const [cfg, st, l] = await Promise.all([
        telemedService.statusConfig(),
        telemedService.estatisticas(),
        telemedService.listar({ status: filtroStatus || undefined, page }),
      ]);
      setConfig(cfg);
      setStats(st);
      setSessoes(l.data);
      setTotal(l.total);
    } catch {
      setErro('Erro ao carregar sessões de telemedicina.');
    } finally {
      setLoading(false);
    }
  }, [filtroStatus, page]);

  useEffect(() => { carregarDados(); }, [carregarDados]);

  const handleIniciar = async (sessao: SessaoTelemedicina) => {
    try {
      const atualizada = await telemedService.iniciar(sessao.id);
      setSessaoSala(atualizada);
      carregarDados();
    } catch (e) {
      setErro((e as Error).message);
    }
  };

  const handleCancelar = async (sessao: SessaoTelemedicina) => {
    if (!confirm(`Cancelar a sessão com ${sessao.pacienteNome}?`)) return;
    try {
      await telemedService.cancelar(sessao.id);
      carregarDados();
    } catch (e) {
      setErro((e as Error).message);
    }
  };

  const handleEncerrarSala = () => {
    setSessaoSala(null);
    carregarDados();
  };

  const totalPages = Math.ceil(total / 20);

  const statusFiltros: { value: SessaoStatus | ''; label: string }[] = [
    { value: '', label: 'Todas' },
    { value: 'AGENDADA', label: 'Agendadas' },
    { value: 'EM_ANDAMENTO', label: 'Em Andamento' },
    { value: 'ENCERRADA', label: 'Encerradas' },
    { value: 'CANCELADA', label: 'Canceladas' },
  ];

  return (
    <AppLayout>
    <>
      {/* Modal de sala (fullscreen) */}
      {sessaoSala && (
        <ModalSala
          sessao={sessaoSala}
          onEncerrar={handleEncerrarSala}
          onClose={() => setSessaoSala(null)}
        />
      )}

      <div className="p-6 space-y-5" style={{ background: CREAM, minHeight: '100vh' }}>
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1
              className="text-2xl font-bold"
              style={{ color: '#1A1A1A', fontFamily: 'Cormorant Garamond, Georgia, serif' }}
            >
              Telemedicina
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Consultas por videochamada · Ilimitadas
            </p>
          </div>
          <button
            onClick={() => setModalCriar(true)}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm hover:opacity-90"
            style={{ background: GOLD }}
          >
            + Nova Sessão
          </button>
        </div>

        {/* Status da plataforma */}
        {config && (
          <div className="bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm flex items-center gap-3">
            <span className="text-lg">{config.plataforma === 'DAILY_CO' ? '🎥' : '🎙'}</span>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {config.plataforma === 'DAILY_CO' ? 'Daily.co (Premium)' : 'Jitsi Meet (Gratuito)'}
              </p>
              <p className="text-xs text-gray-500">
                {config.plataforma === 'JITSI'
                  ? 'Consultas ilimitadas sem custo adicional. Configure DAILY_CO_API_KEY para usar Daily.co.'
                  : 'Plataforma premium com controles de host e gravação habilitados.'}
              </p>
            </div>
          </div>
        )}

        {erro && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
            {erro}
          </div>
        )}

        {/* Estatísticas */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <StatCard label="Agendadas" value={stats.agendadas} cor="#3B82F6" />
            <StatCard label="Em Andamento" value={stats.emAndamento} cor="#10B981" />
            <StatCard label="Encerradas" value={stats.encerradas} cor="#6B7280" />
            <StatCard label="Canceladas" value={stats.canceladas} cor="#EF4444" />
            <StatCard label="Hoje" value={stats.totalHoje} cor={GOLD} />
          </div>
        )}

        {/* Filtros */}
        <div className="flex gap-2 flex-wrap">
          {statusFiltros.map((f) => (
            <button
              key={f.value}
              onClick={() => { setFiltroStatus(f.value); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                filtroStatus === f.value ? 'text-white border-transparent' : 'border-gray-200 text-gray-600 bg-white hover:bg-gray-50'
              }`}
              style={filtroStatus === f.value ? { background: GOLD } : {}}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Lista de sessões */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse h-28" />
            ))}
          </div>
        ) : sessoes.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center text-gray-400 border border-gray-100 shadow-sm">
            <p className="text-4xl mb-3">📹</p>
            <p className="text-base font-semibold text-gray-600">Nenhuma sessão encontrada</p>
            <p className="text-sm mt-1">Crie uma nova sessão para começar.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessoes.map((s) => (
              <SessaoCard
                key={s.id}
                sessao={s}
                onIniciar={handleIniciar}
                onCancelar={handleCancelar}
                onEntrar={setSessaoSala}
              />
            ))}
          </div>
        )}

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1.5 rounded-lg border text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40"
            >
              ← Anterior
            </button>
            <span className="text-xs text-gray-500">
              Página {page} de {totalPages} · {total} sessões
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 rounded-lg border text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40"
            >
              Próxima →
            </button>
          </div>
        )}
      </div>

      {/* Modal criar */}
      {modalCriar && (
        <ModalCriar
          onClose={() => setModalCriar(false)}
          onSuccess={(sessao) => {
            setModalCriar(false);
            setSessaoSala(sessao); // Abrir sala imediatamente após criar
            carregarDados();
          }}
        />
      )}
    </>
    </AppLayout>
  );
}
