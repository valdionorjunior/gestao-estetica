'use client';

import { useEffect, useRef, useState, KeyboardEvent } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { useAuthStore } from '../../stores/auth.store';
import { useChat, MensagemChat } from '../../hooks/useChat';

// ─── Canais fixos ────────────────────────────────────────────────────────────

const CANAIS_FIXOS = [
  { id: 'geral', label: 'Geral', icon: '🏠' },
  { id: 'agenda', label: 'Agenda', icon: '📅' },
  { id: 'financeiro', label: 'Financeiro', icon: '💰' },
  { id: 'estoque', label: 'Estoque', icon: '📦' },
];

const ROLE_COR: Record<string, string> = {
  ADMIN: 'text-[#D4AF37]',
  MEDICO: 'text-blue-400',
  RECEPCIONISTA: 'text-green-400',
  PACIENTE: 'text-white/60',
  SISTEMA: 'text-white/40',
};

const ROLE_LABEL: Record<string, string> = {
  ADMIN: 'Admin',
  MEDICO: 'Médico',
  RECEPCIONISTA: 'Recep.',
  PACIENTE: 'Paciente',
  SISTEMA: 'Sistema',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatarHora(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function formatarData(dateStr: string) {
  const d = new Date(dateStr);
  const hoje = new Date();
  const ontem = new Date(hoje);
  ontem.setDate(ontem.getDate() - 1);
  if (d.toDateString() === hoje.toDateString()) return 'Hoje';
  if (d.toDateString() === ontem.toDateString()) return 'Ontem';
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
}

// ─── Bolha de mensagem ────────────────────────────────────────────────────────

function BolhaMensagem({
  msg,
  isOwn,
  mostrarNome,
}: {
  msg: MensagemChat;
  isOwn: boolean;
  mostrarNome: boolean;
}) {
  if (msg.tipo === 'SISTEMA') {
    return (
      <div className="flex justify-center my-2">
        <span className="px-3 py-1 rounded-full bg-white/5 text-white/40 text-xs">{msg.conteudo}</span>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-1`}>
      <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
        {!isOwn && mostrarNome && (
          <div className="flex items-center gap-2 mb-1 ml-1">
            <span className={`text-xs font-medium ${ROLE_COR[msg.remetenteRole] ?? 'text-white/60'}`}>
              {msg.remetenteNome}
            </span>
            <span className="text-white/30 text-xs">
              {ROLE_LABEL[msg.remetenteRole]}
            </span>
          </div>
        )}
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
            isOwn
              ? 'bg-[#D4AF37] text-[#1A1A1A] rounded-br-sm'
              : 'bg-white/10 text-white/90 rounded-bl-sm'
          }`}
        >
          {msg.conteudo}
          {msg.editada && <span className="text-xs opacity-50 ml-1">(editada)</span>}
        </div>
        <span className={`text-xs mt-0.5 ${isOwn ? 'text-white/30 mr-1' : 'text-white/30 ml-1'}`}>
          {formatarHora(msg.createdAt)}
        </span>
      </div>
    </div>
  );
}

// ─── Separador de data ────────────────────────────────────────────────────────

function SeparadorData({ data }: { data: string }) {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 border-t border-white/10" />
      <span className="text-white/30 text-xs">{data}</span>
      <div className="flex-1 border-t border-white/10" />
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function ChatPage() {
  const { user, accessToken } = useAuthStore();
  const {
    conectado,
    canal,
    mensagens,
    usuariosOnline,
    digitando,
    erro,
    trocarCanal,
    enviar,
    notificarDigitando,
    carregarMaisAntigos,
  } = useChat({ token: accessToken, canalInicial: 'geral' });

  const [texto, setTexto] = useState('');
  const [showOnline, setShowOnline] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [carregandoMais, setCarregandoMais] = useState(false);

  // Scroll para o final quando chegam novas mensagens
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  const handleEnviar = () => {
    if (!texto.trim()) return;
    enviar(texto);
    setTexto('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEnviar();
    }
  };

  const handleTextoChange = (v: string) => {
    setTexto(v);
    notificarDigitando();
  };

  const handleCarregarMais = async () => {
    setCarregandoMais(true);
    carregarMaisAntigos();
    setTimeout(() => setCarregandoMais(false), 1000);
  };

  // Agrupar mensagens por data e detectar mudança de remetente
  const mensagensAgrupadas = mensagens.reduce<
    { tipo: 'separador' | 'mensagem'; data?: string; msg?: MensagemChat; mostrarNome?: boolean }[]
  >((acc, msg, i) => {
    const dataAtual = formatarData(msg.createdAt);
    const anterior = mensagens[i - 1];
    const dataAnterior = anterior ? formatarData(anterior.createdAt) : null;

    if (dataAtual !== dataAnterior) {
      acc.push({ tipo: 'separador', data: dataAtual });
    }

    const mostrarNome =
      !anterior ||
      anterior.remetenteId !== msg.remetenteId ||
      dataAtual !== dataAnterior;

    acc.push({ tipo: 'mensagem', msg, mostrarNome });
    return acc;
  }, []);

  const canalAtual = CANAIS_FIXOS.find((c) => c.id === canal) ?? { label: canal, icon: '💬' };

  return (
    <AppLayout>
    <div className="flex h-[calc(100vh-128px)] bg-[#0F0F0F] rounded-xl overflow-hidden -m-8">
      {/* ── Sidebar de canais ── */}
      <aside className="w-56 bg-[#1A1A1A] border-r border-white/10 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <h2 className="text-white font-semibold text-sm tracking-tight">Chat Interno</h2>
          <div className="flex items-center gap-1.5 mt-1">
            <div
              className={`w-2 h-2 rounded-full ${
                conectado ? 'bg-green-400' : 'bg-white/20'
              }`}
            />
            <span className="text-white/40 text-xs">{conectado ? 'Conectado' : 'Desconectado'}</span>
          </div>
        </div>

        {/* Canais */}
        <div className="p-3 space-y-0.5 flex-1 overflow-y-auto">
          <p className="text-white/30 text-xs font-medium uppercase tracking-wider px-2 mb-2">Canais</p>
          {CANAIS_FIXOS.map((c) => (
            <button
              key={c.id}
              onClick={() => trocarCanal(c.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                canal === c.id
                  ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/20'
                  : 'text-white/50 hover:bg-white/5 hover:text-white/80'
              }`}
            >
              <span className="text-base">{c.icon}</span>
              <span>#{c.label}</span>
            </button>
          ))}
        </div>

        {/* Usuários online */}
        <div className="border-t border-white/10">
          <button
            className="w-full p-3 flex items-center justify-between text-white/50 hover:text-white/80 text-xs font-medium uppercase tracking-wider"
            onClick={() => setShowOnline((s) => !s)}
          >
            <span>Online ({usuariosOnline.length})</span>
            <span>{showOnline ? '▲' : '▼'}</span>
          </button>
          {showOnline && (
            <div className="px-3 pb-3 space-y-1.5 max-h-36 overflow-y-auto">
              {usuariosOnline.map((u) => (
                <div key={u.userId} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className={`text-xs truncate ${ROLE_COR[u.role] ?? 'text-white/60'}`}>
                      {u.nome}
                    </p>
                  </div>
                </div>
              ))}
              {usuariosOnline.length === 0 && (
                <p className="text-white/20 text-xs">Ninguém online</p>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* ── Área de mensagens ── */}
      <div className="flex-1 flex flex-col">
        {/* Header do canal */}
        <div className="h-14 px-5 border-b border-white/10 flex items-center justify-between bg-[#1A1A1A]">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">{canalAtual.icon}</span>
            <div>
              <h3 className="text-white text-sm font-semibold">#{canalAtual.label}</h3>
              <p className="text-white/30 text-xs">{usuariosOnline.length} online</p>
            </div>
          </div>
          {erro && (
            <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-lg">
              <span className="text-red-400 text-xs">{erro}</span>
            </div>
          )}
        </div>

        {/* Mensagens */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-0.5">
          {/* Carregar mais antigos */}
          {mensagens.length >= 50 && (
            <div className="flex justify-center mb-2">
              <button
                onClick={handleCarregarMais}
                disabled={carregandoMais}
                className="px-3 py-1.5 text-xs text-white/40 hover:text-white/70 bg-white/5 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-40"
              >
                {carregandoMais ? 'Carregando…' : '↑ Carregar mensagens anteriores'}
              </button>
            </div>
          )}

          {/* Renderizar mensagens agrupadas */}
          {mensagensAgrupadas.map((item, i) => {
            if (item.tipo === 'separador') {
              return <SeparadorData key={`sep-${i}`} data={item.data!} />;
            }
            const msg = item.msg!;
            return (
              <BolhaMensagem
                key={msg.id}
                msg={msg}
                isOwn={msg.remetenteId === user?.id}
                mostrarNome={item.mostrarNome!}
              />
            );
          })}

          {mensagens.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-5xl mb-4">💬</div>
              <p className="text-white/40 text-sm">Nenhuma mensagem neste canal ainda.</p>
              <p className="text-white/20 text-xs mt-1">Seja o primeiro a enviar uma mensagem!</p>
            </div>
          )}

          {/* Indicador de digitação */}
          {digitando && (
            <div className="flex items-center gap-2 mt-1 ml-1">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
              <span className="text-white/30 text-xs">{digitando.nome} está digitando…</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input de mensagem */}
        <div className="px-5 py-4 border-t border-white/10 bg-[#1A1A1A]">
          <div className="flex items-end gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus-within:border-[#D4AF37]/40 transition-colors">
            <textarea
              ref={inputRef}
              value={texto}
              onChange={(e) => handleTextoChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Mensagem em #${canalAtual.label}… (Enter para enviar, Shift+Enter para nova linha)`}
              rows={1}
              className="flex-1 bg-transparent text-white text-sm placeholder-white/30 resize-none outline-none leading-relaxed max-h-32"
              style={{ height: 'auto', minHeight: '24px' }}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = 'auto';
                el.style.height = Math.min(el.scrollHeight, 128) + 'px';
              }}
              disabled={!conectado}
            />
            <button
              onClick={handleEnviar}
              disabled={!conectado || !texto.trim()}
              className="w-9 h-9 rounded-xl bg-[#D4AF37] text-[#1A1A1A] flex items-center justify-center hover:bg-[#C9A96E] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0"
            >
              <svg className="w-4 h-4 rotate-90" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
          <p className="text-white/20 text-xs mt-1.5 text-center">
            Enter para enviar · Shift+Enter para nova linha
          </p>
        </div>
      </div>
    </div>
    </AppLayout>
  );
}
