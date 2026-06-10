'use client';

import { useEffect, useMemo, useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  relatoriosService,
  RelatorioAgendaItem,
  RelatorioFinanceiroItem,
  RelatorioPacientesNovos,
} from '../../services/relatorios.service';

function fmt(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function BarChart({ data, valueKey, labelKey, color = '#D4AF37' }: {
  data: Record<string, unknown>[];
  valueKey: string;
  labelKey: string;
  color?: string;
}) {
  if (!data.length) return <p className="text-center text-sm text-[#6B6560] py-6">Sem dados</p>;
  const max = Math.max(...data.map((d) => Number(d[valueKey]) || 0), 1);
  return (
    <div className="flex items-end gap-2 h-32 mt-4">
      {data.map((d, i) => {
        const h = Math.max((Number(d[valueKey]) / max) * 100, 2);
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-[10px] text-[#6B6560]">{Number(d[valueKey]).toFixed(0)}</span>
            <div
              className="w-full rounded-t-sm transition-all"
              style={{ height: `${h}%`, backgroundColor: color }}
            />
            <span className="text-[10px] text-[#6B6560] truncate max-w-full px-0.5 text-center">
              {String(d[labelKey] ?? '').slice(-5)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function RelatoriosPage() {
  const [agenda, setAgenda] = useState<RelatorioAgendaItem[]>([]);
  const [financeiro, setFinanceiro] = useState<RelatorioFinanceiroItem[]>([]);
  const [pacientes, setPacientes] = useState<RelatorioPacientesNovos[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Default: últimos 30 dias — calculado uma única vez com useMemo
  const { dataFim, dataInicio } = useMemo(() => {
    const hoje = new Date();
    const trintaDiasAtras = new Date(hoje.getTime() - 30 * 86400000);
    return {
      dataFim: hoje.toISOString().split('T')[0],
      dataInicio: trintaDiasAtras.toISOString().split('T')[0],
    };
  }, []);

  useEffect(() => {
    const params = { dataInicio, dataFim };
    Promise.all([
      relatoriosService.agenda(params),
      relatoriosService.financeiro(params),
      relatoriosService.pacientesNovos(params),
    ])
      .then(([a, f, p]) => {
        setAgenda(Array.isArray(a) ? a : []);
        setFinanceiro(Array.isArray(f) ? f : []);
        setPacientes(Array.isArray(p) ? p : []);
        setError('');
      })
      .catch((err) => {
        console.error('Erro ao carregar relatórios:', err);
        setError(err.message || 'Erro ao carregar relatórios. Verifique sua conexão.');
        // Manter arrays vazios em caso de erro
        setAgenda([]);
        setFinanceiro([]);
        setPacientes([]);
      })
      .finally(() => setLoading(false));
  }, [dataInicio, dataFim]);

  const totalConcluidos = agenda.reduce((s, a) => s + a.concluidos, 0);
  const totalAgendamentos = agenda.reduce((s, a) => s + a.total, 0);
  const totalReceitas = financeiro.reduce((s, f) => s + f.totalReceitas, 0);
  const totalDespesas = financeiro.reduce((s, f) => s + f.totalDespesas, 0);
  const saldo = totalReceitas - totalDespesas;
  const novoPacientes = pacientes.reduce((s, p) => s + p.total, 0);

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-[#1A1A1A]">Relatórios</h1>
        <p className="text-sm text-[#6B6560] mt-1">Período: últimos 30 dias</p>
        <div className="w-10 h-0.5 bg-[#D4AF37] mt-2" />
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <span className="w-10 h-10 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-4xl mb-3">⚠️</p>
          <p className="font-semibold text-red-700 mb-2">Erro ao carregar relatórios</p>
          <p className="text-sm text-red-600">{error}</p>
          <p className="text-xs text-red-500 mt-3">
            Verifique se você está autenticado e tente novamente.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              { label: 'Agendamentos', value: totalAgendamentos, icon: '📅' },
              { label: 'Concluídos', value: totalConcluidos, icon: '✅' },
              { label: 'Saldo do Período', value: fmt(saldo), icon: saldo >= 0 ? '📈' : '📉' },
              { label: 'Novos Pacientes', value: novoPacientes, icon: '👤' },
            ].map((card) => (
              <div key={card.label} className="bg-white border border-[#E8E4DD] rounded-xl p-5">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{card.icon}</span>
                  <div>
                    <p className="text-xs text-[#6B6560] uppercase tracking-wide">{card.label}</p>
                    <p className="text-xl font-bold text-[#1A1A1A] tabular-nums">{card.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader title="Agendamentos por Dia" subtitle="Total vs. Concluídos" />
              <BarChart
                data={agenda as unknown as Record<string, unknown>[]}
                valueKey="total"
                labelKey="data"
                color="#D4AF37"
              />
            </Card>

            <Card>
              <CardHeader title="Receitas vs. Despesas" subtitle="Por período" />
              <div className="flex flex-col gap-4 mt-4">
                {financeiro.map((f, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-[#6B6560] w-20">{f.mes}</span>
                    <div className="flex-1 mx-4 flex gap-2">
                      <div className="flex-1 bg-[#F8F7F4] rounded h-6 overflow-hidden">
                        <div
                          className="h-full bg-green-400 rounded"
                          style={{ width: `${Math.min((f.totalReceitas / Math.max(f.totalReceitas, f.totalDespesas, 1)) * 100, 100)}%` }}
                        />
                      </div>
                      <div className="flex-1 bg-[#F8F7F4] rounded h-6 overflow-hidden">
                        <div
                          className="h-full bg-red-400 rounded"
                          style={{ width: `${Math.min((f.totalDespesas / Math.max(f.totalReceitas, f.totalDespesas, 1)) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    <span className={`font-semibold text-xs ${f.saldo >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                      {fmt(f.saldo)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <CardHeader title="Novos Pacientes" subtitle="Por mês" />
              <BarChart
                data={pacientes as unknown as Record<string, unknown>[]}
                valueKey="total"
                labelKey="mes"
                color="#6B6560"
              />
            </Card>
          </div>

          {/* Export hint */}
          <div className="flex justify-end">
            <Button variant="secondary" size="sm">
              Exportar CSV
            </Button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
