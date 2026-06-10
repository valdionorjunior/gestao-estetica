'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import {
  videosService,
  VideoCategoria,
  VideoClinico,
  VideoTipo,
} from '../../services/videos.service';
import { useAuthStore } from '../../stores/auth.store';

// ─── Mapeamentos de label ────────────────────────────────────────────────────

const CATEGORIA_LABEL: Record<VideoCategoria, string> = {
  TOXINA_BOTULINICA: 'Toxina Botulínica',
  PREENCHIMENTO: 'Preenchimento',
  BIOESTIMULADORES: 'Bioestimuladores',
  LASER: 'Laser / HIFU',
  PEELING: 'Peeling',
  FIOS: 'Fios de PDO',
  CORPORAL: 'Corporal',
  SKINCARE: 'Skincare',
  OUTROS: 'Outros',
};

const TIPO_LABEL: Record<VideoTipo, string> = {
  DEMO: 'Demo',
  EDUCATIVO: 'Educativo',
  RESULTADO: 'Resultado',
  TECNICA: 'Técnica',
};

const TIPO_COR: Record<VideoTipo, string> = {
  DEMO: 'bg-blue-500/20 text-blue-300',
  EDUCATIVO: 'bg-green-500/20 text-green-300',
  RESULTADO: 'bg-purple-500/20 text-purple-300',
  TECNICA: 'bg-orange-500/20 text-orange-300',
};

const CATEGORIAS = Object.keys(CATEGORIA_LABEL) as VideoCategoria[];
const TIPOS = Object.keys(TIPO_LABEL) as VideoTipo[];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function extrairEmbedUrl(url: string): string {
  // Converte URL do YouTube watch para embed se necessário
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return url; // já é embed ou outro formato
}

// ─── Modal Player ─────────────────────────────────────────────────────────────

function ModalPlayer({ video, onClose }: { video: VideoClinico; onClose: () => void }) {
  const embedUrl = extrairEmbedUrl(video.videoUrl);

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#1A1A1A] border border-white/10 rounded-2xl w-full max-w-4xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Player */}
        <div className="relative w-full aspect-video bg-black">
          <iframe
            src={embedUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={video.titulo}
          />
        </div>

        {/* Info */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TIPO_COR[video.tipo]}`}>
                  {TIPO_LABEL[video.tipo]}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#D4AF37]/20 text-[#D4AF37]">
                  {CATEGORIA_LABEL[video.categoria]}
                </span>
                {video.duracaoFormatada && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-white/10 text-white/60">
                    ⏱ {video.duracaoFormatada}
                  </span>
                )}
              </div>
              <h2 className="text-white font-semibold text-base leading-tight tracking-tight">{video.titulo}</h2>
              {video.procedimentoNome && (
                <p className="text-[#D4AF37]/70 text-sm mt-1">{video.procedimentoNome}</p>
              )}
              {video.descricao && (
                <p className="text-white/60 text-sm mt-3 leading-relaxed">{video.descricao}</p>
              )}
              {video.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {video.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-white/5 text-white/40 text-xs rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white text-2xl leading-none flex-shrink-0"
            >
              ×
            </button>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
            <p className="text-white/30 text-xs">{video.totalVisualizacoes} visualizações</p>
            <a
              href={video.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D4AF37]/60 hover:text-[#D4AF37] text-xs"
            >
              Abrir em nova aba ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Modal Criar/Editar vídeo (ADMIN) ────────────────────────────────────────

function ModalForm({
  video,
  onClose,
  onSuccess,
}: {
  video?: VideoClinico;
  onClose: () => void;
  onSuccess: (v: VideoClinico) => void;
}) {
  const [titulo, setTitulo] = useState(video?.titulo ?? '');
  const [descricao, setDescricao] = useState(video?.descricao ?? '');
  const [videoUrl, setVideoUrl] = useState(video?.videoUrl ?? '');
  const [categoria, setCategoria] = useState<VideoCategoria>(video?.categoria ?? 'OUTROS');
  const [tipo, setTipo] = useState<VideoTipo>(video?.tipo ?? 'DEMO');
  const [procedimentoNome, setProcedimentoNome] = useState(video?.procedimentoNome ?? '');
  const [duracaoSegundos, setDuracaoSegundos] = useState<string>(
    video?.duracaoSegundos ? String(video.duracaoSegundos) : '',
  );
  const [tags, setTags] = useState(video?.tags.join(', ') ?? '');
  const [visivelPaciente, setVisivelPaciente] = useState(video?.visivelPaciente ?? false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !videoUrl.trim()) { setErro('Título e URL do vídeo são obrigatórios'); return; }
    setLoading(true);
    setErro('');
    try {
      const payload = {
        titulo: titulo.trim(),
        descricao: descricao.trim() || undefined,
        videoUrl: videoUrl.trim(),
        categoria,
        tipo,
        procedimentoNome: procedimentoNome.trim() || undefined,
        duracaoSegundos: duracaoSegundos ? Number(duracaoSegundos) : undefined,
        tags: tags.trim() || undefined,
        visivelPaciente,
      };
      // O backend aceita tags como string CSV; VideoClinico.tags é string[] (resposta)
      const resultado = video
        ? await videosService.atualizar(video.id, payload as Partial<VideoClinico>)
        : await videosService.criar(payload as Partial<VideoClinico>);
      onSuccess(resultado);
    } catch (err) {
      setErro((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#1A1A1A]">
          <h2 className="text-white font-semibold text-base tracking-tight">
            {video ? 'Editar Vídeo' : 'Adicionar Vídeo'}
          </h2>
          <button onClick={onClose} className="text-white/40 hover:text-white text-xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-white/70 text-sm block mb-1">Título *</label>
            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              maxLength={200}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/30"
              placeholder="Ex: Toxina Botulínica — Técnica Frontal"
            />
          </div>

          <div>
            <label className="text-white/70 text-sm block mb-1">URL do Vídeo *</label>
            <input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/30"
              placeholder="https://www.youtube.com/watch?v=... ou embed"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-white/70 text-sm block mb-1">Categoria</label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value as VideoCategoria)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
              >
                {CATEGORIAS.map((c) => <option key={c} value={c}>{CATEGORIA_LABEL[c]}</option>)}
              </select>
            </div>
            <div>
              <label className="text-white/70 text-sm block mb-1">Tipo</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as VideoTipo)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
              >
                {TIPOS.map((t) => <option key={t} value={t}>{TIPO_LABEL[t]}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-white/70 text-sm block mb-1">Procedimento</label>
              <input
                value={procedimentoNome}
                onChange={(e) => setProcedimentoNome(e.target.value)}
                maxLength={150}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/30"
                placeholder="Ex: Toxina Botulínica"
              />
            </div>
            <div>
              <label className="text-white/70 text-sm block mb-1">Duração (segundos)</label>
              <input
                type="number"
                value={duracaoSegundos}
                onChange={(e) => setDuracaoSegundos(e.target.value)}
                min={1}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                placeholder="480"
              />
            </div>
          </div>

          <div>
            <label className="text-white/70 text-sm block mb-1">Descrição</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/30 resize-none"
              placeholder="Descreva o conteúdo do vídeo…"
            />
          </div>

          <div>
            <label className="text-white/70 text-sm block mb-1">Tags (separadas por vírgula)</label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/30"
              placeholder="botox, testa, rugas, glabela"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={visivelPaciente}
              onChange={(e) => setVisivelPaciente(e.target.checked)}
              className="w-4 h-4 accent-[#D4AF37]"
            />
            <span className="text-white/70 text-sm">Visível para pacientes no portal</span>
          </label>

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
              {loading ? 'Salvando…' : video ? 'Atualizar' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Card de vídeo ───────────────────────────────────────────────────────────

function VideoCard({
  video,
  onPlay,
  onEditar,
  onRemover,
  isAdmin,
}: {
  video: VideoClinico;
  onPlay: () => void;
  onEditar: () => void;
  onRemover: () => void;
  isAdmin: boolean;
}) {
  const embedUrl = extrairEmbedUrl(video.videoUrl);
  // Extrair thumbnail do YouTube se não tiver uma definida
  const ytMatch = video.videoUrl.match(/(?:embed\/|watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  const thumbnail = video.thumbnailUrl ?? (ytMatch ? `https://img.youtube.com/vi/${ytMatch[1]}/mqdefault.jpg` : null);

  return (
    <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl overflow-hidden group hover:border-[#D4AF37]/30 transition-all duration-200">
      {/* Thumbnail / Preview */}
      <div
        className="relative aspect-video bg-black cursor-pointer overflow-hidden"
        onClick={onPlay}
      >
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={video.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black/40">
            <div className="text-4xl opacity-40">🎬</div>
          </div>
        )}

        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/40">
          <div className="w-14 h-14 rounded-full bg-[#D4AF37] flex items-center justify-center shadow-xl">
            <svg className="w-6 h-6 text-[#1A1A1A] ml-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TIPO_COR[video.tipo]}`}>
            {TIPO_LABEL[video.tipo]}
          </span>
        </div>
        {video.duracaoFormatada && (
          <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 text-white/80 text-xs rounded font-mono">
            {video.duracaoFormatada}
          </span>
        )}
        {video.visivelPaciente && (
          <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
            👤
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-[#D4AF37]/70 text-xs font-medium uppercase tracking-wider mb-1.5">
          {CATEGORIA_LABEL[video.categoria]}
        </p>
        <h3
          className="text-white text-sm font-semibold leading-tight line-clamp-2 cursor-pointer hover:text-[#D4AF37] transition-colors"
          onClick={onPlay}
        >
          {video.titulo}
        </h3>
        {video.procedimentoNome && (
          <p className="text-white/40 text-xs mt-1">{video.procedimentoNome}</p>
        )}

        {video.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {video.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-1.5 py-0.5 bg-white/5 text-white/30 text-xs rounded">
                #{tag}
              </span>
            ))}
            {video.tags.length > 3 && (
              <span className="text-white/20 text-xs">+{video.tags.length - 3}</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
          <span className="text-white/30 text-xs">{video.totalVisualizacoes} view{video.totalVisualizacoes !== 1 ? 's' : ''}</span>
          {isAdmin && (
            <div className="flex gap-2">
              <button
                onClick={onEditar}
                className="text-white/40 hover:text-[#D4AF37] text-xs px-2 py-1 rounded hover:bg-[#D4AF37]/10 transition-colors"
              >
                ✏️
              </button>
              <button
                onClick={onRemover}
                className="text-white/40 hover:text-red-400 text-xs px-2 py-1 rounded hover:bg-red-500/10 transition-colors"
              >
                🗑️
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Página principal ────────────────────────────────────────────────────────

export default function VideosInterativosPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';

  const [videos, setVideos] = useState<VideoClinico[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [busca, setBusca] = useState('');
  const [buscaInput, setBuscaInput] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState<VideoCategoria | ''>('');
  const [tipoFiltro, setTipoFiltro] = useState<VideoTipo | ''>('');

  const [videoPlayer, setVideoPlayer] = useState<VideoClinico | null>(null);
  const [videoEditando, setVideoEditando] = useState<VideoClinico | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);

  const LIMIT = 12;
  const totalPages = Math.ceil(total / LIMIT);

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      const res = await videosService.listar({
        page,
        limit: LIMIT,
        busca: busca || undefined,
        categoria: categoriaFiltro || undefined,
        tipo: tipoFiltro || undefined,
      });
      setVideos(res.data);
      setTotal(res.total);
    } catch {
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }, [page, busca, categoriaFiltro, tipoFiltro]);

  useEffect(() => { carregar(); }, [carregar]);

  const handleBusca = (e: React.FormEvent) => {
    e.preventDefault();
    setBusca(buscaInput);
    setPage(1);
  };

  const handleFiltroChange = (campo: 'categoria' | 'tipo', valor: string) => {
    if (campo === 'categoria') setCategoriaFiltro(valor as VideoCategoria | '');
    else setTipoFiltro(valor as VideoTipo | '');
    setPage(1);
  };

  const handleRemover = async (id: string) => {
    if (!confirm('Desativar este vídeo?')) return;
    await videosService.remover(id);
    carregar();
  };

  const handleSucessoForm = (v: VideoClinico) => {
    setShowForm(false);
    setVideoEditando(undefined);
    carregar();
  };

  return (
    <AppLayout>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Vídeos Interativos</h1>
          <p className="text-white/50 text-sm mt-1">
            Biblioteca de procedimentos estéticos — demos, tutoriais e resultados
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => { setVideoEditando(undefined); setShowForm(true); }}
            className="px-4 py-2 rounded-xl bg-[#D4AF37] text-[#1A1A1A] text-sm font-semibold hover:bg-[#C9A96E] transition-colors"
          >
            + Adicionar Vídeo
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-4 flex flex-wrap gap-4 items-end">
        {/* Busca */}
        <form onSubmit={handleBusca} className="flex-1 min-w-48 flex gap-2">
          <input
            value={buscaInput}
            onChange={(e) => setBuscaInput(e.target.value)}
            placeholder="Buscar por título, procedimento ou tag…"
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/30"
          />
          <button
            type="submit"
            className="px-3 py-2 rounded-lg bg-[#D4AF37]/20 text-[#D4AF37] text-sm hover:bg-[#D4AF37]/30"
          >
            🔍
          </button>
        </form>

        <div>
          <label className="text-white/60 text-xs font-medium uppercase tracking-wider block mb-1.5">Categoria</label>
          <select
            value={categoriaFiltro}
            onChange={(e) => handleFiltroChange('categoria', e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
          >
            <option value="">Todas</option>
            {CATEGORIAS.map((c) => <option key={c} value={c}>{CATEGORIA_LABEL[c]}</option>)}
          </select>
        </div>

        <div>
          <label className="text-white/60 text-xs font-medium uppercase tracking-wider block mb-1.5">Tipo</label>
          <select
            value={tipoFiltro}
            onChange={(e) => handleFiltroChange('tipo', e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
          >
            <option value="">Todos</option>
            {TIPOS.map((t) => <option key={t} value={t}>{TIPO_LABEL[t]}</option>)}
          </select>
        </div>

        {total > 0 && (
          <p className="text-white/40 text-sm ml-auto self-center">
            {total} vídeo{total !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Categorias rápidas (chips) */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => { setCategoriaFiltro(''); setPage(1); }}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            !categoriaFiltro ? 'bg-[#D4AF37] text-[#1A1A1A]' : 'bg-white/5 text-white/50 hover:bg-white/10'
          }`}
        >
          Todos
        </button>
        {CATEGORIAS.map((c) => (
          <button
            key={c}
            onClick={() => { setCategoriaFiltro(c); setPage(1); }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              categoriaFiltro === c ? 'bg-[#D4AF37] text-[#1A1A1A]' : 'bg-white/5 text-white/50 hover:bg-white/10'
            }`}
          >
            {CATEGORIA_LABEL[c]}
          </button>
        ))}
      </div>

      {/* Grid de vídeos */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : videos.length === 0 ? (
        <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-12 text-center">
          <div className="text-5xl mb-4">🎬</div>
          <p className="text-white/60">Nenhum vídeo encontrado para os filtros selecionados.</p>
          {busca && (
            <button
              onClick={() => { setBusca(''); setBuscaInput(''); setPage(1); }}
              className="mt-3 text-[#D4AF37] text-sm hover:underline"
            >
              Limpar busca
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onPlay={() => setVideoPlayer(video)}
              onEditar={() => { setVideoEditando(video); setShowForm(true); }}
              onRemover={() => handleRemover(video.id)}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-2 rounded-lg border border-white/10 text-white/60 text-sm hover:bg-white/5 disabled:opacity-30"
          >
            ← Anterior
          </button>
          <span className="text-white/40 text-sm">
            Página {page} de {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-2 rounded-lg border border-white/10 text-white/60 text-sm hover:bg-white/5 disabled:opacity-30"
          >
            Próxima →
          </button>
        </div>
      )}

      {/* Modais */}
      {videoPlayer && (
        <ModalPlayer video={videoPlayer} onClose={() => setVideoPlayer(null)} />
      )}
      {showForm && (
        <ModalForm
          video={videoEditando}
          onClose={() => { setShowForm(false); setVideoEditando(undefined); }}
          onSuccess={handleSucessoForm}
        />
      )}
    </div>
    </AppLayout>
  );
}
