'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { consultaService, Anotacao, ConsultaFoto, TipoFoto } from '../../services/consulta.service';
import { apiFetch } from '../../lib/api';

interface Paciente {
  id: string;
  nome: string;
}

// ─── Cores disponíveis para anotações ───────────────────────────────────────
const CORES = ['#D4AF37', '#EF4444', '#22C55E', '#3B82F6', '#A855F7', '#F97316'];
const FORMAS = ['circulo', 'seta', 'retangulo', 'ponto'] as const;
const TIPOS: TipoFoto[] = ['ANTES', 'DEPOIS', 'DURANTE', 'REFERENCIA'];

const TIPO_LABEL: Record<TipoFoto, string> = {
  ANTES: 'Antes',
  DEPOIS: 'Depois',
  DURANTE: 'Durante',
  REFERENCIA: 'Referência',
};

const TIPO_COR: Record<TipoFoto, string> = {
  ANTES: 'bg-blue-500/20 text-blue-300',
  DEPOIS: 'bg-green-500/20 text-green-300',
  DURANTE: 'bg-yellow-500/20 text-yellow-300',
  REFERENCIA: 'bg-purple-500/20 text-purple-300',
};

// ─── Componente de marcação na foto ─────────────────────────────────────────
function Marcacao({ anotacao, onRemover }: { anotacao: Anotacao; onRemover: () => void }) {
  const [tooltip, setTooltip] = useState(false);
  const cor = anotacao.cor ?? '#D4AF37';
  const forma = anotacao.forma ?? 'circulo';

  const formaClass =
    forma === 'circulo' ? 'rounded-full' :
    forma === 'retangulo' ? 'rounded-sm' :
    'rounded-full';

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
      style={{ left: `${anotacao.x}%`, top: `${anotacao.y}%` }}
      onMouseEnter={() => setTooltip(true)}
      onMouseLeave={() => setTooltip(false)}
    >
      <div
        className={`w-5 h-5 border-2 flex items-center justify-center ${formaClass}`}
        style={{ borderColor: cor, backgroundColor: `${cor}33` }}
      >
        {forma === 'ponto' && (
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cor }} />
        )}
        {forma === 'seta' && <span style={{ color: cor, fontSize: 12 }}>↓</span>}
      </div>

      {tooltip && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#1A1A1A] border border-white/20 rounded-lg p-2 min-w-36 z-20 shadow-xl">
          <p className="text-white text-xs leading-tight whitespace-nowrap max-w-48 break-words">{anotacao.texto}</p>
          <button
            onClick={(e) => { e.stopPropagation(); onRemover(); }}
            className="mt-1 text-red-400 text-xs hover:text-red-300"
          >
            Remover
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Modal de upload ────────────────────────────────────────────────────────
function ModalUpload({
  pacientes,
  onClose,
  onSuccess,
}: {
  pacientes: Paciente[];
  onClose: () => void;
  onSuccess: (foto: ConsultaFoto) => void;
}) {
  const [pacienteId, setPacienteId] = useState('');
  const [tipo, setTipo] = useState<TipoFoto>('ANTES');
  const [descricao, setDescricao] = useState('');
  const [dataConsulta, setDataConsulta] = useState('');
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) { setErro('Imagem deve ter no máximo 10 MB'); return; }
    setArquivo(f);
    setPreview(URL.createObjectURL(f));
    setErro('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!arquivo) { setErro('Selecione uma imagem'); return; }
    if (!pacienteId) { setErro('Selecione um paciente'); return; }

    setLoading(true);
    setErro('');
    try {
      const fd = new FormData();
      fd.append('foto', arquivo);
      fd.append('pacienteId', pacienteId);
      fd.append('tipo', tipo);
      if (descricao) fd.append('descricao', descricao);
      if (dataConsulta) fd.append('dataConsulta', dataConsulta);
      const foto = await consultaService.upload(fd);
      onSuccess(foto);
    } catch (err) {
      setErro((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl w-full max-w-lg">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-white font-semibold text-base tracking-tight">Upload de Foto de Consulta</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white text-xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Preview */}
          <div
            className="relative border-2 border-dashed border-white/20 rounded-xl overflow-hidden aspect-video flex items-center justify-center cursor-pointer hover:border-[#D4AF37]/50 transition-colors"
            onClick={() => document.getElementById('file-input')?.click()}
          >
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center text-white/40">
                <div className="text-4xl mb-2">📷</div>
                <p className="text-sm">Clique para selecionar imagem</p>
                <p className="text-xs mt-1">JPG, PNG ou WebP — máx 10 MB</p>
              </div>
            )}
            <input
              id="file-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFile}
            />
          </div>

          {/* Paciente */}
          <div>
            <label className="text-white/70 text-sm block mb-1">Paciente</label>
            <select
              value={pacienteId}
              onChange={(e) => setPacienteId(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
              required
            >
              <option value="">Selecionar paciente…</option>
              {pacientes.map((p) => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>
          </div>

          {/* Tipo + Data */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-white/70 text-sm block mb-1">Tipo</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as TipoFoto)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
              >
                {TIPOS.map((t) => <option key={t} value={t}>{TIPO_LABEL[t]}</option>)}
              </select>
            </div>
            <div>
              <label className="text-white/70 text-sm block mb-1">Data da Consulta</label>
              <input
                type="date"
                value={dataConsulta}
                onChange={(e) => setDataConsulta(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
              />
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="text-white/70 text-sm block mb-1">Descrição / contexto clínico</label>
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              maxLength={200}
              placeholder="Ex: Avaliação inicial — rugas nasogenianas"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/30"
            />
          </div>

          {erro && <p className="text-red-400 text-sm">{erro}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-white/20 text-white/70 text-sm hover:bg-white/5"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 rounded-lg bg-[#D4AF37] text-[#1A1A1A] text-sm font-semibold hover:bg-[#C9A96E] disabled:opacity-50"
            >
              {loading ? 'Enviando…' : 'Salvar Foto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Editor de anotações ─────────────────────────────────────────────────────
function EditorAnotacoes({
  foto,
  onClose,
  onSalvar,
}: {
  foto: ConsultaFoto;
  onClose: () => void;
  onSalvar: (foto: ConsultaFoto) => void;
}) {
  const [anotacoes, setAnotacoes] = useState<Anotacao[]>(foto.anotacoes ?? []);
  const [corSelecionada, setCorSelecionada] = useState(CORES[0]);
  const [formaSelecionada, setFormaSelecionada] = useState<typeof FORMAS[number]>('circulo');
  const [textoNovo, setTextoNovo] = useState('');
  const [adicionando, setAdicionando] = useState(false);
  const [saving, setSaving] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!adicionando || !textoNovo.trim()) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const nova: Anotacao = {
      id: crypto.randomUUID(),
      x: Math.round(x * 10) / 10,
      y: Math.round(y * 10) / 10,
      texto: textoNovo.trim(),
      cor: corSelecionada,
      forma: formaSelecionada,
    };
    setAnotacoes((prev) => [...prev, nova]);
    setTextoNovo('');
    setAdicionando(false);
  };

  const removerAnotacao = (id: string) => {
    setAnotacoes((prev) => prev.filter((a) => a.id !== id));
  };

  const salvar = async () => {
    setSaving(true);
    try {
      const atualizada = await consultaService.salvarAnotacoes(foto.id, anotacoes);
      onSalvar(atualizada);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl w-full max-w-5xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-white font-semibold text-base tracking-tight">Editor de Anotações</h2>
            <p className="text-white/50 text-xs mt-0.5">{foto.descricao ?? 'Sem descrição'} · {foto.dataConsulta ?? '—'}</p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white text-xl leading-none">×</button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Painel lateral esquerdo */}
          <div className="w-64 border-r border-white/10 p-4 space-y-5 overflow-y-auto">
            {/* Cor */}
            <div>
              <p className="text-white/60 text-xs font-medium uppercase tracking-wider mb-2">Cor da marcação</p>
              <div className="flex flex-wrap gap-2">
                {CORES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCorSelecionada(c)}
                    className={`w-7 h-7 rounded-full border-2 transition-all ${corSelecionada === c ? 'border-white scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {/* Forma */}
            <div>
              <p className="text-white/60 text-xs font-medium uppercase tracking-wider mb-2">Forma</p>
              <div className="grid grid-cols-2 gap-1.5">
                {FORMAS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFormaSelecionada(f)}
                    className={`px-2 py-1.5 rounded-lg text-xs capitalize border transition-all ${
                      formaSelecionada === f
                        ? 'bg-[#D4AF37]/20 border-[#D4AF37]/50 text-[#D4AF37]'
                        : 'border-white/10 text-white/50 hover:border-white/30'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Texto */}
            <div>
              <p className="text-white/60 text-xs font-medium uppercase tracking-wider mb-2">Texto da marcação</p>
              <input
                value={textoNovo}
                onChange={(e) => setTextoNovo(e.target.value)}
                placeholder="Descreva a marcação…"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/30"
                onKeyDown={(e) => { if (e.key === 'Enter' && textoNovo.trim()) setAdicionando(true); }}
              />
              <button
                onClick={() => { if (textoNovo.trim()) setAdicionando(true); }}
                disabled={!textoNovo.trim()}
                className={`mt-2 w-full px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  adicionando
                    ? 'bg-[#D4AF37] text-[#1A1A1A]'
                    : 'bg-white/10 text-white/60 hover:bg-white/20 disabled:opacity-40'
                }`}
              >
                {adicionando ? '✓ Clique na foto para marcar' : '+ Ativar marcação'}
              </button>
            </div>

            {/* Lista de anotações */}
            <div>
              <p className="text-white/60 text-xs font-medium uppercase tracking-wider mb-2">
                Marcações ({anotacoes.length})
              </p>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {anotacoes.length === 0 && (
                  <p className="text-white/30 text-xs">Nenhuma marcação ainda</p>
                )}
                {anotacoes.map((a) => (
                  <div key={a.id} className="flex items-start gap-2 bg-white/5 rounded-lg p-2">
                    <div className="w-3 h-3 rounded-full mt-0.5 flex-shrink-0" style={{ backgroundColor: a.cor ?? '#D4AF37' }} />
                    <p className="text-white/70 text-xs flex-1 break-words leading-tight">{a.texto}</p>
                    <button onClick={() => removerAnotacao(a.id)} className="text-white/30 hover:text-red-400 text-xs">×</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Área da imagem */}
          <div className="flex-1 overflow-auto flex items-center justify-center p-4 bg-black/20">
            <div
              className={`relative inline-block ${adicionando ? 'cursor-crosshair' : 'cursor-default'}`}
              onClick={handleImageClick}
            >
              <img
                ref={imgRef}
                src={foto.fotoUrl}
                alt="Foto de consulta"
                className="max-w-full max-h-[65vh] rounded-lg object-contain select-none"
                draggable={false}
              />
              {anotacoes.map((a) => (
                <Marcacao key={a.id} anotacao={a} onRemover={() => removerAnotacao(a.id)} />
              ))}
              {adicionando && (
                <div className="absolute inset-0 border-2 border-[#D4AF37] rounded-lg pointer-events-none animate-pulse" />
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between">
          <p className="text-white/40 text-xs">
            {anotacoes.length} marcação{anotacoes.length !== 1 ? 'ões' : ''} · Clique na marcação para ver o texto
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-white/20 text-white/70 text-sm hover:bg-white/5"
            >
              Cancelar
            </button>
            <button
              onClick={salvar}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-[#D4AF37] text-[#1A1A1A] text-sm font-semibold hover:bg-[#C9A96E] disabled:opacity-50"
            >
              {saving ? 'Salvando…' : 'Salvar Anotações'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Página principal ────────────────────────────────────────────────────────
export default function ConsultaInterativaPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [pacienteSelecionado, setPacienteSelecionado] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState<TipoFoto | ''>('');
  const [fotos, setFotos] = useState<ConsultaFoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [fotoEditando, setFotoEditando] = useState<ConsultaFoto | null>(null);
  const [fotoAmpliada, setFotoAmpliada] = useState<ConsultaFoto | null>(null);

  // Carregar pacientes
  useEffect(() => {
    apiFetch<{ data: Paciente[] }>('/pacientes?limit=200')
      .then((res) => setPacientes(res.data ?? []))
      .catch(() => setPacientes([]));
  }, []);

  // Buscar fotos ao selecionar paciente
  const buscarFotos = useCallback(async (pid: string, tipo?: TipoFoto) => {
    if (!pid) { setFotos([]); return; }
    setLoading(true);
    try {
      const lista = await consultaService.listarPorPaciente(pid, tipo || undefined);
      setFotos(lista);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    buscarFotos(pacienteSelecionado, tipoFiltro as TipoFoto | undefined);
  }, [pacienteSelecionado, tipoFiltro, buscarFotos]);

  const handleUploadSuccess = (foto: ConsultaFoto) => {
    setFotos((prev) => [foto, ...prev]);
    setShowUpload(false);
  };

  const handleSalvarAnotacoes = (atualizada: ConsultaFoto) => {
    setFotos((prev) => prev.map((f) => (f.id === atualizada.id ? atualizada : f)));
    setFotoEditando(null);
  };

  const handleRemover = async (id: string) => {
    if (!confirm('Remover esta foto permanentemente?')) return;
    await consultaService.remover(id);
    setFotos((prev) => prev.filter((f) => f.id !== id));
  };

  // Agrupar fotos em pares antes/depois para comparação
  const fotosAntes = fotos.filter((f) => f.tipo === 'ANTES');
  const fotosDepois = fotos.filter((f) => f.tipo === 'DEPOIS');

  return (
    <AppLayout>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Consulta Interativa</h1>
          <p className="text-white/50 text-sm mt-1">Fotos antes/depois com marcações e anotações clínicas</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="px-4 py-2 rounded-xl bg-[#D4AF37] text-[#1A1A1A] text-sm font-semibold hover:bg-[#C9A96E] transition-colors"
        >
          + Upload de Foto
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-4 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-48">
          <label className="text-white/60 text-xs font-medium uppercase tracking-wider block mb-1.5">Paciente</label>
          <select
            value={pacienteSelecionado}
            onChange={(e) => setPacienteSelecionado(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
          >
            <option value="">Selecionar paciente…</option>
            {pacientes.map((p) => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-white/60 text-xs font-medium uppercase tracking-wider block mb-1.5">Tipo</label>
          <select
            value={tipoFiltro}
            onChange={(e) => setTipoFiltro(e.target.value as TipoFoto | '')}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
          >
            <option value="">Todos</option>
            {TIPOS.map((t) => <option key={t} value={t}>{TIPO_LABEL[t]}</option>)}
          </select>
        </div>

        {fotos.length > 0 && (
          <p className="text-white/40 text-sm ml-auto self-center">
            {fotos.length} foto{fotos.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Comparador antes/depois */}
      {pacienteSelecionado && fotosAntes.length > 0 && fotosDepois.length > 0 && (
        <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-4">
          <h2 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Comparação Antes / Depois</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-blue-400 text-xs font-medium uppercase tracking-wider mb-2">Antes</p>
              <div className="relative rounded-xl overflow-hidden aspect-square bg-black/20">
                <img src={fotosAntes[0].fotoUrl} alt="Antes" className="w-full h-full object-cover" />
                {fotosAntes[0].anotacoes.map((a) => (
                  <div
                    key={a.id}
                    className="absolute w-4 h-4 rounded-full border-2 -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${a.x}%`, top: `${a.y}%`, borderColor: a.cor ?? '#D4AF37', backgroundColor: `${a.cor ?? '#D4AF37'}33` }}
                    title={a.texto}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="text-green-400 text-xs font-medium uppercase tracking-wider mb-2">Depois</p>
              <div className="relative rounded-xl overflow-hidden aspect-square bg-black/20">
                <img src={fotosDepois[0].fotoUrl} alt="Depois" className="w-full h-full object-cover" />
                {fotosDepois[0].anotacoes.map((a) => (
                  <div
                    key={a.id}
                    className="absolute w-4 h-4 rounded-full border-2 -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${a.x}%`, top: `${a.y}%`, borderColor: a.cor ?? '#D4AF37', backgroundColor: `${a.cor ?? '#D4AF37'}33` }}
                    title={a.texto}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid de fotos */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : fotos.length === 0 && pacienteSelecionado ? (
        <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-12 text-center">
          <div className="text-4xl mb-3">📷</div>
          <p className="text-white/60 text-sm">Nenhuma foto de consulta para este paciente.</p>
          <button
            onClick={() => setShowUpload(true)}
            className="mt-4 px-4 py-2 rounded-lg bg-[#D4AF37]/20 text-[#D4AF37] text-sm hover:bg-[#D4AF37]/30"
          >
            Fazer primeiro upload
          </button>
        </div>
      ) : fotos.length === 0 ? (
        <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-12 text-center">
          <div className="text-4xl mb-3">👩‍⚕️</div>
          <p className="text-white/60 text-sm">Selecione um paciente para ver suas fotos de consulta.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {fotos.map((foto) => (
            <div
              key={foto.id}
              className="bg-[#1A1A1A] border border-white/10 rounded-2xl overflow-hidden group hover:border-[#D4AF37]/30 transition-all"
            >
              {/* Imagem */}
              <div
                className="relative aspect-square bg-black/20 cursor-pointer overflow-hidden"
                onClick={() => setFotoAmpliada(foto)}
              >
                <img
                  src={foto.fotoUrl}
                  alt={foto.descricao ?? 'Foto de consulta'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Marcações */}
                {foto.anotacoes.length > 0 && (
                  <div className="absolute inset-0">
                    {foto.anotacoes.map((a) => (
                      <div
                        key={a.id}
                        className="absolute w-4 h-4 rounded-full border-2 -translate-x-1/2 -translate-y-1/2"
                        style={{ left: `${a.x}%`, top: `${a.y}%`, borderColor: a.cor ?? '#D4AF37', backgroundColor: `${a.cor ?? '#D4AF37'}40` }}
                        title={a.texto}
                      />
                    ))}
                  </div>
                )}
                {/* Badge tipo */}
                <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-medium ${TIPO_COR[foto.tipo]}`}>
                  {TIPO_LABEL[foto.tipo]}
                </span>
                {/* Badge anotações */}
                {foto.anotacoes.length > 0 && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium bg-[#D4AF37]/20 text-[#D4AF37]">
                    {foto.anotacoes.length} ✏️
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="text-white/80 text-sm leading-tight line-clamp-2">
                  {foto.descricao ?? <span className="text-white/30 italic">Sem descrição</span>}
                </p>
                {foto.dataConsulta && (
                  <p className="text-white/40 text-xs mt-1">
                    {new Date(foto.dataConsulta + 'T00:00:00').toLocaleDateString('pt-BR')}
                  </p>
                )}

                {/* Ações */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setFotoEditando(foto)}
                    className="flex-1 px-2 py-1.5 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] text-xs hover:bg-[#D4AF37]/20 transition-colors"
                  >
                    ✏️ Anotar
                  </button>
                  <button
                    onClick={() => handleRemover(foto.id)}
                    className="px-2 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modais */}
      {showUpload && (
        <ModalUpload
          pacientes={pacientes}
          onClose={() => setShowUpload(false)}
          onSuccess={handleUploadSuccess}
        />
      )}

      {fotoEditando && (
        <EditorAnotacoes
          foto={fotoEditando}
          onClose={() => setFotoEditando(null)}
          onSalvar={handleSalvarAnotacoes}
        />
      )}

      {/* Lightbox */}
      {fotoAmpliada && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-8"
          onClick={() => setFotoAmpliada(null)}
        >
          <div className="relative max-w-4xl w-full">
            <img
              src={fotoAmpliada.fotoUrl}
              alt={fotoAmpliada.descricao ?? 'Foto'}
              className="w-full rounded-2xl object-contain max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            />
            {fotoAmpliada.anotacoes.map((a) => (
              <div
                key={a.id}
                className="absolute w-6 h-6 rounded-full border-2 -translate-x-1/2 -translate-y-1/2 cursor-help"
                style={{ left: `${a.x}%`, top: `${a.y}%`, borderColor: a.cor ?? '#D4AF37', backgroundColor: `${a.cor ?? '#D4AF37'}40` }}
                title={a.texto}
              />
            ))}
            <button
              className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl bg-black/40 rounded-full w-10 h-10 flex items-center justify-center"
              onClick={() => setFotoAmpliada(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
    </AppLayout>
  );
}
