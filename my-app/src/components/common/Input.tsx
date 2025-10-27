import { cn } from '@/utils/cn';
import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            {label}
            {props.required && <span className="text-[#e01e5a] ml-1">*</span>}
          </label>
        )}
        
        <input
          ref={ref}
          className={cn(
            'w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-offset-0 transition-colors',
            error
              ? 'border-[#e01e5a] focus:ring-[#e01e5a] focus:border-[#e01e5a]'
              : 'border-gray-300 focus:ring-[#1164a3] focus:border-[#1164a3]',
            props.disabled && 'bg-gray-100 cursor-not-allowed',
            className
          )}
          {...props}
        />
        
        {error && (
          <p className="mt-1 text-xs text-[#e01e5a]">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="mt-1 text-xs text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
