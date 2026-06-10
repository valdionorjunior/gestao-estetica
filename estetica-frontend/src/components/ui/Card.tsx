import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

const paddings = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({ children, className = '', padding = 'md' }: CardProps) {
  return (
    <div
      className={`bg-white border border-[#E8E4DD] rounded-xl shadow-sm ${paddings[padding]} ${className}`}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function CardHeader({ title, subtitle, action }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h2 className="text-base font-semibold text-[#1A1A1A] tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-[#6B6560] mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// KPI card for dashboard
interface KpiCardProps {
  label: string;
  value: string | number;
  change?: string;
  positive?: boolean;
  icon?: string;
}

export function KpiCard({ label, value, change, positive, icon }: KpiCardProps) {
  return (
    <div className="bg-white border border-[#E8E4DD] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-[#6B6560] uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-[#1A1A1A] mt-1 tabular-nums">{value}</p>
          {change && (
            <p className={`text-xs mt-1 ${positive ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
              {positive ? '▲' : '▼'} {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-lg">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
