'use client';

import { AppLayout } from '../../components/layout/AppLayout';
import { KpiCard } from '../../components/ui/Card';
import { useAuthStore } from '../../stores/auth.store';

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm text-[#6B6560]">Bom dia,</p>
        <h1 className="font-serif text-3xl font-semibold text-[#1A1A1A] mt-0.5">
          {user?.nome ?? 'Bem-vindo'}
        </h1>
        <div className="w-12 h-0.5 bg-[#D4AF37] mt-2" />
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <KpiCard
          label="Agendamentos Hoje"
          value="8"
          change="2 a confirmar"
          icon="📅"
        />
        <KpiCard
          label="Pacientes Ativos"
          value="142"
          change="+3 este mês"
          positive
          icon="👥"
        />
        <KpiCard
          label="Receita do Mês"
          value="R$ 18.400"
          change="+12% vs. mês anterior"
          positive
          icon="💰"
        />
        <KpiCard
          label="Alertas de Estoque"
          value="2"
          icon="📦"
        />
      </div>

      {/* Quick access */}
      <div className="bg-white border border-[#E8E4DD] rounded-xl p-6">
        <h2 className="text-sm font-semibold text-[#1A1A1A] mb-4 uppercase tracking-wider">Acesso Rápido</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: '/agenda', label: 'Nova Consulta', icon: '📅' },
            { href: '/pacientes', label: 'Novo Paciente', icon: '👤' },
            { href: '/financeiro', label: 'Lançamento', icon: '💳' },
            { href: '/relatorios', label: 'Relatórios', icon: '📊' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-[#E8E4DD] hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all text-center group"
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs font-medium text-[#6B6560] group-hover:text-[#1A1A1A] transition-colors">
                {item.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
