import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105';
    
    const variants = {
      primary: 'gradient-primary text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/50 focus:ring-emerald-500',
      secondary: 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg shadow-gray-500/30 hover:shadow-xl hover:shadow-gray-500/50 focus:ring-gray-500',
      outline: 'border-2 border-gray-300 dark:border-gray-600 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg focus:ring-gray-500',
      ghost: 'bg-transparent hover:bg-white/60 dark:hover:bg-gray-800/60 hover:backdrop-blur-sm hover:shadow-md focus:ring-gray-500',
      danger: 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/50 focus:ring-red-500',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
