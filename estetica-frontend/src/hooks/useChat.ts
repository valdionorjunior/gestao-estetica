'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export interface MensagemChat {
  id: string;
  remetenteId: string;
  remetenteNome: string;
  remetenteRole: string;
  canal: string;
  conteudo: string;
  tipo: 'TEXTO' | 'IMAGEM' | 'ARQUIVO' | 'SISTEMA';
  respostaParaId: string | null;
  editada: boolean;
  createdAt: string;
}

interface UsuarioOnline {
  userId: string;
  nome: string;
  role: string;
}

interface UseChatOptions {
  token: string | null;
  canalInicial?: string;
}

export function useChat({ token, canalInicial = 'geral' }: UseChatOptions) {
  const socketRef = useRef<Socket | null>(null);
  const [conectado, setConectado] = useState(false);
  const [canal, setCanal] = useState(canalInicial);
  const [mensagens, setMensagens] = useState<MensagemChat[]>([]);
  const [usuariosOnline, setUsuariosOnline] = useState<UsuarioOnline[]>([]);
  const [digitando, setDigitando] = useState<{ userId: string; nome: string } | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const digitandoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Conectar ao WebSocket
  useEffect(() => {
    if (!token) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';
    const socket = io(`${apiUrl}/chat`, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setConectado(true);
      setErro(null);
      socket.emit('entrar_canal', { canal: canalInicial });
      socket.emit('usuarios_online');
    });

    socket.on('disconnect', () => setConectado(false));

    socket.on('connect_error', (err) => {
      setErro('Erro de conexão com o chat');
      setConectado(false);
    });

    socket.on('erro', (data: { message: string }) => {
      setErro(data.message);
    });

    socket.on('historico', (data: { canal: string; mensagens: MensagemChat[] }) => {
      setMensagens(data.mensagens);
    });

    socket.on('historico_paginado', (data: { canal: string; mensagens: MensagemChat[] }) => {
      setMensagens((prev) => [...data.mensagens, ...prev]);
    });

    socket.on('nova_mensagem', (msg: MensagemChat) => {
      setMensagens((prev) => [...prev, msg]);
    });

    socket.on('lista_usuarios_online', (usuarios: UsuarioOnline[]) => {
      setUsuariosOnline(usuarios);
    });

    socket.on('usuario_online', (u: UsuarioOnline) => {
      setUsuariosOnline((prev) => {
        if (prev.find((x) => x.userId === u.userId)) return prev;
        return [...prev, u];
      });
    });

    socket.on('usuario_offline', (data: { userId: string }) => {
      setUsuariosOnline((prev) => prev.filter((u) => u.userId !== data.userId));
    });

    socket.on('usuario_digitando', (data: { userId: string; nome: string; digitando: boolean }) => {
      if (data.digitando) {
        setDigitando({ userId: data.userId, nome: data.nome });
        if (digitandoTimeoutRef.current) clearTimeout(digitandoTimeoutRef.current);
        digitandoTimeoutRef.current = setTimeout(() => setDigitando(null), 3000);
      } else {
        setDigitando(null);
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Trocar de canal
  const trocarCanal = useCallback(
    (novoCanal: string) => {
      if (!socketRef.current || novoCanal === canal) return;
      socketRef.current.emit('sair_canal', { canal });
      socketRef.current.emit('entrar_canal', { canal: novoCanal });
      setCanal(novoCanal);
      setMensagens([]);
    },
    [canal],
  );

  // Enviar mensagem
  const enviar = useCallback(
    (conteudo: string, respostaParaId?: string) => {
      if (!socketRef.current || !conteudo.trim()) return;
      socketRef.current.emit('mensagem', {
        canal,
        conteudo: conteudo.trim(),
        tipo: 'TEXTO',
        respostaParaId: respostaParaId ?? null,
      });
      // Parar indicador de digitação
      socketRef.current.emit('digitando', { canal, digitando: false });
    },
    [canal],
  );

  // Indicador de digitação com debounce
  const notificarDigitando = useCallback(() => {
    if (!socketRef.current) return;
    socketRef.current.emit('digitando', { canal, digitando: true });
  }, [canal]);

  // Carregar histórico anterior
  const carregarMaisAntigos = useCallback(() => {
    if (!socketRef.current || mensagens.length === 0) return;
    const primeiraMsg = mensagens[0];
    socketRef.current.emit('carregar_historico', {
      canal,
      antes: primeiraMsg.createdAt,
    });
  }, [canal, mensagens]);

  return {
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
  };
}
