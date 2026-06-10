'use client';

import { useEffect, useRef, useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { useAuthStore } from '../../stores/auth.store';
import {
  iaService,
  ResultadoTranscricao,
  ResultadoResumo,
  ResultadoHipotese,
  IaStatusConfig,
  HipoteseItem,
} from '../../services/ia.service';

const GOLD = '#D4AF37';
const GOLD_LIGHT = '#F5EAB7';

// ─── Badge simulado ───────────────────────────────────────────────────────────
function SimuladoBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-700">
      ⚡ Modo Simulado
    </span>
  );
}

// ─── Probabilidade badge ─────────────────────────────────────────────────────
function ProbBadge({ prob }: { prob: HipoteseItem['probabilidade'] }) {
  const map = {
    ALTA: 'bg-red-100 text-red-700',
    MEDIA: 'bg-amber-100 text-amber-700',
    BAIXA: 'bg-emerald-100 text-emerald-700',
  };
  const labels = { ALTA: 'Alta', MEDIA: 'Média', BAIXA: 'Baixa' };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-bold ${map[prob]}`}>
      {labels[prob]}
    </span>
  );
}

// ─── Gravador de áudio ────────────────────────────────────────────────────────
function GravadorAudio({
  onAudioPronto,
  disabled,
}: {
  onAudioPronto: (file: File) => void;
  disabled?: boolean;
}) {
  const [gravando, setGravando] = useState(false);
  const [segundos, setSegundos] = useState(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const iniciarGravacao = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      chunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const file = new File([blob], `gravacao-${Date.now()}.webm`, { type: 'audio/webm' });
        onAudioPronto(file);
        stream.getTracks().forEach((t) => t.stop());
      };
      recorder.start(100);
      recorderRef.current = recorder;
      setGravando(true);
      setSegundos(0);
      timerRef.current = setInterval(() => setSegundos((s) => s + 1), 1000);
    } catch {
      alert('Não foi possível acessar o microfone. Verifique as permissões do navegador.');
    }
  };

  const pararGravacao = () => {
    if (recorderRef.current?.state === 'recording') {
      recorderRef.current.stop();
    }
    if (timerRef.current) clearInterval(timerRef.current);
    setGravando(false);
  };

  const formatarTempo = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="flex items-center gap-3">
      {gravando ? (
        <>
          <span className="flex items-center gap-2 text-red-600 text-sm font-semibold animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
            Gravando {formatarTempo(segundos)}
          </span>
          <button
            onClick={pararGravacao}
            className="px-4 py-2 rounded-lg bg-red-100 text-red-700 text-sm font-semibold hover:bg-red-200"
          >
            ■ Parar
          </button>
        </>
      ) : (
        <button
          onClick={iniciarGravacao}
          disabled={disabled}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-40"
          style={{ background: GOLD }}
        >
          🎙 Gravar Áudio
        </button>
      )}
    </div>
  );
}

// ─── Aba: Transcrição ─────────────────────────────────────────────────────────
function AbaTranscricao({ pacienteId }: { pacienteId: string }) {
  const [resultado, setResultado] = useState<ResultadoTranscricao | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const processar = async (file: File) => {
    setCarregando(true);
    setErro('');
    setResultado(null);
    try {
      const r = await iaService.transcreverAudio({ audioFile: file, pacienteId: pacienteId || undefined });
      setResultado(r);
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <h3 className="text-sm font-bold text-gray-700 mb-3">Transcrição de Áudio</h3>
        <p className="text-xs text-gray-500 mb-4">
          Grave ou envie um arquivo de áudio da consulta. A IA transcreve automaticamente em português.
          Formatos: mp3, wav, m4a, webm (máx 25MB).
        </p>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <GravadorAudio onAudioPronto={processar} disabled={carregando} />
          <span className="text-xs text-gray-400">ou</span>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={carregando}
            className="px-4 py-2 rounded-lg border text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40"
          >
            📂 Enviar arquivo
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".mp3,.wav,.m4a,.webm,.ogg,.mpeg,.mpga"
            className="hidden"
            onChange={(e) => { if (e.target.files?.[0]) processar(e.target.files[0]); }}
          />
        </div>

        {carregando && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            Transcrevendo com Whisper AI...
          </div>
        )}
        {erro && <p className="text-sm text-red-600">{erro}</p>}
      </div>

      {resultado && (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-bold text-gray-700">Transcrição</span>
            {resultado.simulado && <SimuladoBadge />}
          </div>
          <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-4">
            {resultado.transcricao}
          </p>
          <p className="text-xs text-gray-400 mt-2">Log ID: {resultado.logId}</p>
        </div>
      )}
    </div>
  );
}

// ─── Aba: Resumo ──────────────────────────────────────────────────────────────
function AbaResumo({ pacienteId }: { pacienteId: string }) {
  const [texto, setTexto] = useState('');
  const [resultado, setResultado] = useState<ResultadoResumo | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const gerar = async () => {
    if (texto.trim().length < 10) { setErro('Digite pelo menos 10 caracteres'); return; }
    setCarregando(true);
    setErro('');
    setResultado(null);
    try {
      const r = await iaService.resumir({ texto, pacienteId: pacienteId || undefined });
      setResultado(r);
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <h3 className="text-sm font-bold text-gray-700 mb-2">Resumo Inteligente da Consulta</h3>
        <p className="text-xs text-gray-500 mb-4">
          Cole as notas da consulta abaixo. A IA gera um resumo estruturado com tópicos e próximas ações.
        </p>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Cole aqui as notas da consulta, transcrição de áudio ou observações clínicas..."
          rows={6}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 resize-none"
          style={{ '--tw-ring-color': GOLD } as React.CSSProperties}
        />
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-400">{texto.length}/8000 chars</span>
          <button
            onClick={gerar}
            disabled={carregando}
            className="px-5 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-40"
            style={{ background: GOLD }}
          >
            {carregando ? 'Gerando resumo...' : '✨ Gerar Resumo'}
          </button>
        </div>
        {erro && <p className="text-sm text-red-600 mt-2">{erro}</p>}
      </div>

      {resultado && (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-700">Resumo</span>
            {resultado.simulado && <SimuladoBadge />}
          </div>

          <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
            <p className="text-sm text-gray-700 leading-relaxed">{resultado.resumo}</p>
          </div>

          {resultado.topicos.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Tópicos abordados</p>
              <ul className="space-y-1">
                {resultado.topicos.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span style={{ color: GOLD }}>▸</span> {t}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {resultado.proximasAcoes.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Próximas ações</p>
              <ul className="space-y-1">
                {resultado.proximasAcoes.map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-emerald-500 font-bold">✓</span> {a}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="text-xs text-gray-400">Log ID: {resultado.logId}</p>
        </div>
      )}
    </div>
  );
}

// ─── Aba: Hipótese diagnóstica ────────────────────────────────────────────────
function AbaHipotese({ pacienteId }: { pacienteId: string }) {
  const [form, setForm] = useState({ queixas: '', historico: '' });
  const [resultado, setResultado] = useState<ResultadoHipotese | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const gerar = async () => {
    if (form.queixas.trim().length < 10) { setErro('Descreva as queixas com pelo menos 10 caracteres'); return; }
    setCarregando(true);
    setErro('');
    setResultado(null);
    try {
      const r = await iaService.hipotese({
        queixas: form.queixas,
        historicoRelevante: form.historico || undefined,
        pacienteId: pacienteId || undefined,
      });
      setResultado(r);
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <h3 className="text-sm font-bold text-gray-700 mb-1">Sugestão de Hipótese Diagnóstica</h3>
        <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2 mb-4">
          ⚠️ Esta ferramenta é um <strong>apoio clínico</strong> e não substitui o julgamento do profissional.
          As sugestões devem ser avaliadas pelo médico responsável.
        </p>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-600">Queixas e sintomas *</label>
            <textarea
              value={form.queixas}
              onChange={(e) => setForm({ ...form, queixas: e.target.value })}
              placeholder="Descreva as queixas do paciente, sintomas, localização, duração..."
              rows={4}
              className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none resize-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600">Histórico relevante (opcional)</label>
            <textarea
              value={form.historico}
              onChange={(e) => setForm({ ...form, historico: e.target.value })}
              placeholder="Alergias, medicamentos em uso, procedimentos anteriores relevantes..."
              rows={3}
              className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none resize-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-gray-400">{form.queixas.length}/4000 chars</span>
          <button
            onClick={gerar}
            disabled={carregando}
            className="px-5 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-40"
            style={{ background: GOLD }}
          >
            {carregando ? 'Analisando...' : '🔬 Gerar Hipóteses'}
          </button>
        </div>
        {erro && <p className="text-sm text-red-600 mt-2">{erro}</p>}
      </div>

      {resultado && (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-700">Hipóteses Diagnósticas</span>
            {resultado.simulado && <SimuladoBadge />}
          </div>

          {/* Hipóteses */}
          <div className="space-y-3">
            {resultado.hipoteses.map((h, i) => (
              <div key={i} className="rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-gray-800">{h.condicao}</span>
                  <ProbBadge prob={h.probabilidade} />
                </div>
                <p className="text-xs text-gray-600">{h.descricao}</p>
              </div>
            ))}
          </div>

          {/* Procedimentos sugeridos */}
          {resultado.procedimentosSugeridos.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">
                Procedimentos sugeridos
              </p>
              <div className="flex flex-wrap gap-2">
                {resultado.procedimentosSugeridos.map((p, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1 rounded-full border font-medium"
                    style={{ borderColor: GOLD, color: '#8B6914', background: GOLD_LIGHT }}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Observações clínicas */}
          {resultado.observacoesClinicas && (
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <p className="text-xs font-bold text-blue-700 mb-1">Observações Clínicas</p>
              <p className="text-xs text-blue-800">{resultado.observacoesClinicas}</p>
            </div>
          )}

          <p className="text-xs text-gray-400">Log ID: {resultado.logId}</p>
        </div>
      )}
    </div>
  );
}

// ─── Página principal ──────────────────────────────────────────────────────────
type Aba = 'transcricao' | 'resumo' | 'hipotese';

export default function IaProntuarioPage() {
  const { user } = useAuthStore();
  const [abaSelecionada, setAbaSelecionada] = useState<Aba>('transcricao');
  const [statusConfig, setStatusConfig] = useState<IaStatusConfig | null>(null);
  const [pacienteId, setPacienteId] = useState('');

  useEffect(() => {
    iaService.statusConfig().then(setStatusConfig).catch(() => {});
  }, []);

  const abas: { id: Aba; label: string; icone: string; roles: string[] }[] = [
    { id: 'transcricao', label: 'Transcrição de Áudio', icone: '🎙', roles: ['ADMIN', 'MEDICO', 'RECEPCIONISTA'] },
    { id: 'resumo', label: 'Resumo da Consulta', icone: '✨', roles: ['ADMIN', 'MEDICO', 'RECEPCIONISTA'] },
    { id: 'hipotese', label: 'Hipótese Diagnóstica', icone: '🔬', roles: ['ADMIN', 'MEDICO'] },
  ];

  const abasVisiveis = abas.filter((a) => a.roles.includes(user?.role ?? ''));

  return (
    <AppLayout>
    <div className="space-y-5">
      {/* Cabeçalho */}
      <div>
        <h1
          className="text-2xl font-bold"
          style={{ color: '#1A1A1A', fontFamily: 'Cormorant Garamond, Georgia, serif' }}
        >
          IA no Prontuário
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Transcrição de áudio · Resumo clínico · Hipótese diagnóstica
        </p>
      </div>

      {/* Status IA */}
      {statusConfig && (
        <div
          className="rounded-xl px-4 py-3 text-sm flex items-center gap-3"
          style={{
            background: statusConfig.openAiConfigurado ? '#F0FDF4' : '#FFFBEB',
            border: `1px solid ${statusConfig.openAiConfigurado ? '#BBF7D0' : '#FDE68A'}`,
          }}
        >
          <span className="text-lg">{statusConfig.openAiConfigurado ? '🟢' : '🟡'}</span>
          <div>
            <span className="font-semibold" style={{ color: statusConfig.openAiConfigurado ? '#166534' : '#92400E' }}>
              {statusConfig.openAiConfigurado
                ? `OpenAI conectada — modelo ${statusConfig.modelo}`
                : 'OpenAI não configurada — operando em modo simulado'}
            </span>
            {!statusConfig.openAiConfigurado && (
              <p className="text-xs text-amber-700 mt-0.5">
                Configure <code>OPENAI_API_KEY</code> no <code>.env</code> para usar a IA real.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ID do Paciente (opcional) */}
      <div className="flex items-center gap-3">
        <label className="text-xs font-semibold text-gray-600 whitespace-nowrap">
          ID do Paciente (opcional):
        </label>
        <input
          value={pacienteId}
          onChange={(e) => setPacienteId(e.target.value)}
          placeholder="UUID do paciente para vincular ao log"
          className="flex-1 max-w-sm border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 bg-white"
          style={{ '--tw-ring-color': GOLD } as React.CSSProperties}
        />
      </div>

      {/* Abas */}
      <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-gray-100 w-fit flex-wrap">
        {abasVisiveis.map((a) => (
          <button
            key={a.id}
            onClick={() => setAbaSelecionada(a.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              abaSelecionada === a.id ? 'text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
            style={abaSelecionada === a.id ? { background: GOLD } : {}}
          >
            <span>{a.icone}</span>
            <span className="hidden sm:inline">{a.label}</span>
          </button>
        ))}
      </div>

      {/* Conteúdo das abas */}
      {abaSelecionada === 'transcricao' && <AbaTranscricao pacienteId={pacienteId} />}
      {abaSelecionada === 'resumo' && <AbaResumo pacienteId={pacienteId} />}
      {abaSelecionada === 'hipotese' && <AbaHipotese pacienteId={pacienteId} />}
    </div>
    </AppLayout>
  );
}
