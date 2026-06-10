import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helpText, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-[#1A1A1A]">
            {label}
            {props.required && <span className="text-[#EF4444] ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-[#1A1A1A] bg-white transition-all outline-none
            placeholder:text-[#6B6560]/60
            ${error
              ? 'border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/20'
              : 'border-[#E8E4DD] focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-[#EF4444]">{error}</p>}
        {helpText && !error && <p className="text-xs text-[#6B6560]">{helpText}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
