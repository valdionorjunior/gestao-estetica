import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
}

const variants = {
  primary: 'bg-[#D4AF37] text-[#1A1A1A] hover:bg-[#B8962E] font-semibold shadow-sm',
  secondary: 'bg-white text-[#1A1A1A] border border-[#E8E4DD] hover:bg-[#F8F7F4] font-medium',
  ghost: 'bg-transparent text-[#6B6560] hover:bg-[#E8E4DD] hover:text-[#1A1A1A] font-medium',
  danger: 'bg-[#EF4444] text-white hover:bg-red-600 font-semibold shadow-sm',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-md',
  md: 'px-4 py-2.5 text-sm rounded-lg',
  lg: 'px-6 py-3 text-base rounded-xl',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 transition-all
        ${variants[variant]}
        ${sizes[size]}
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}`}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
