'use client';

import { useEffect, useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { agendaService, Agendamento } from '../../services/agenda.service';
import { NovoAgendamentoModal } from '../../components/agenda/NovoAgendamentoModal';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  AGENDADO: { label: 'Agendado', color: 'bg-blue-100 text-blue-700' },
  CONFIRMADO: { label: 'Confirmado', color: 'bg-[#D4AF37]/15 text-[#8B6F1C]' },
  EM_ATENDIMENTO: { label: 'Em atendimento', color: 'bg-purple-100 text-purple-700' },
  CONCLUIDO: { label: 'Concluído', color: 'bg-green-100 text-green-700' },
  CANCELADO: { label: 'Cancelado', color: 'bg-red-100 text-red-600' },
  FALTA: { label: 'Falta', color: 'bg-orange-100 text-orange-700' },
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR');
}

export default function AgendaPage() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  useEffect(() => {
    let cancelado = false;
    setLoading(true);
    setError('');
    agendaService
      .list({ dataInicio: todayStr, dataFim: todayStr, limit: 50 })
      .then((res) => { if (!cancelado) setAgendamentos(res.data); })
      .catch((e) => { if (!cancelado) setError(e.message); })
      .finally(() => { if (!cancelado) setLoading(false); });
    return () => { cancelado = true; };
  }, [todayStr, refresh]);

  async function confirmar(id: string) {
    await agendaService.updateStatus(id, 'CONFIRMADO');
    setAgendamentos((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'CONFIRMADO' } : a)),
    );
  }

  async function cancelar(id: string) {
    await agendaService.updateStatus(id, 'CANCELADO', 'Cancelado pelo painel');
    setAgendamentos((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'CANCELADO' } : a)),
    );
  }

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-[#1A1A1A]">Agenda</h1>
        <div className="w-10 h-0.5 bg-[#D4AF37] mt-2" />
      </div>

      <Card>
        <CardHeader
          title={`Agendamentos — ${formatDate(today.toISOString())}`}
          subtitle={`${agendamentos.length} agendamento(s) hoje`}
          action={
            <Button size="sm" onClick={() => setModalAberto(true)}>
              + Novo Agendamento
            </Button>
          }
        />
        {loading && (
          <div className="flex justify-center py-12">
            <span className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && agendamentos.length === 0 && (
          <div className="text-center py-12 text-[#6B6560]">
            <p className="text-4xl mb-3">📅</p>
            <p className="font-medium">Nenhum agendamento para hoje</p>
          </div>
        )}

        {!loading && agendamentos.length > 0 && (
          <div className="space-y-2">
            {agendamentos.map((a) => {
              const badge = STATUS_LABELS[a.status] ?? { label: a.status, color: 'bg-gray-100 text-gray-600' };
              return (
                <div
                  key={a.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-[#E8E4DD] hover:border-[#D4AF37]/40 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[52px]">
                      <p className="text-sm font-semibold text-[#1A1A1A]">{formatTime(a.dataHoraInicio)}</p>
                      <p className="text-xs text-[#6B6560]">{formatTime(a.dataHoraFim)}</p>
                    </div>
                    <div className="w-px h-8 bg-[#E8E4DD]" />
                    <div>
                      <p className="text-sm font-medium text-[#1A1A1A]">{a.paciente?.nome ?? '—'}</p>
                      {a.procedimento && (
                        <p className="text-xs text-[#6B6560]">{a.procedimento}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${badge.color}`}>
                      {badge.label}
                    </span>
                    {a.status === 'AGENDADO' && (
                      <Button size="sm" variant="secondary" onClick={() => confirmar(a.id)}>
                        Confirmar
                      </Button>
                    )}
                    {(a.status === 'AGENDADO' || a.status === 'CONFIRMADO') && (
                      <Button size="sm" variant="ghost" onClick={() => cancelar(a.id)}>
                        Cancelar
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <NovoAgendamentoModal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        onSuccess={() => setRefresh((r) => r + 1)}
      />
    </AppLayout>
  );
}
