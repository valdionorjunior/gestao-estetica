'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../../stores/auth.store';

interface NavItem {
  href: string;
  label: string;
  icon: string;
  roles?: string[];
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: '⬛' },
  { href: '/agenda', label: 'Agenda', icon: '📅' },
  { href: '/pacientes', label: 'Pacientes', icon: '👥' },
  { href: '/financeiro', label: 'Financeiro', icon: '💰', roles: ['ADMIN'] },
  { href: '/estoque', label: 'Estoque', icon: '📦', roles: ['ADMIN'] },
  { href: '/relatorios', label: 'Relatórios', icon: '📊', roles: ['ADMIN'] },
  { href: '/marketing', label: 'Marketing', icon: '📣', roles: ['ADMIN', 'RECEPCIONISTA'] },
  { href: '/consulta-interativa', label: 'Consulta Interativa', icon: '📸', roles: ['ADMIN', 'MEDICO', 'RECEPCIONISTA'] },
  { href: '/videos-interativos', label: 'Vídeos Interativos', icon: '🎬', roles: ['ADMIN', 'MEDICO', 'RECEPCIONISTA'] },
  { href: '/chat', label: 'Chat Interno', icon: '💬', roles: ['ADMIN', 'MEDICO', 'RECEPCIONISTA'] },
  { href: '/integracoes', label: 'Integrações', icon: '🔗', roles: ['ADMIN'] },
  { href: '/ia-prontuario', label: 'IA no Prontuário', icon: '🤖', roles: ['ADMIN', 'MEDICO'] },
  { href: '/telemedicina', label: 'Telemedicina', icon: '📹', roles: ['ADMIN', 'MEDICO', 'RECEPCIONISTA'] },
  { href: '/usuarios', label: 'Usuários', icon: '🔑', roles: ['ADMIN'] },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, clearAuth } = useAuthStore();

  const visibleItems = navItems.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role)),
  );

  return (
    <aside className="w-64 min-h-screen bg-[#1A1A1A] flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center">
            <span className="font-serif text-sm font-bold text-[#1A1A1A]">NS</span>
          </div>
          <div>
            <p className="text-white font-serif text-sm font-semibold leading-tight">Estética</p>
            <p className="text-[#D4AF37] font-serif text-sm font-semibold leading-tight">Natalia Salvador</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {visibleItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30'
                  : 'text-white/60 hover:bg-white/5 hover:text-white/90'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
            <span className="text-[#D4AF37] text-xs font-bold">
              {user?.nome?.charAt(0) ?? 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{user?.nome ?? 'Usuário'}</p>
            <p className="text-white/40 text-xs truncate">{user?.role}</p>
          </div>
          <button
            onClick={clearAuth}
            className="text-white/30 hover:text-white/70 text-xs transition-colors"
            title="Sair"
          >
            ✕
          </button>
        </div>
      </div>
    </aside>
  );
}
