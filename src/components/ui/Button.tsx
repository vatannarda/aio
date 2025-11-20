import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', size = 'md', loading = false, className = '', disabled, ...props }, ref) => {
    const baseClasses = 'font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-electric-blue/60 focus:ring-offset-2 focus:ring-offset-[#05060C] focus:shadow-[0_0_30px_rgba(59,130,246,0.35)]'
    
    const variantClasses = {
      primary: 'gradient-primary text-white hover:shadow-[0_8px_40px_rgba(59,130,246,0.5)] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed',
      secondary: 'glass-card hover-glow text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed',
      ghost: 'text-slate-300 hover:bg-white/5 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed',
    }
    
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    }
    
    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`

    return (
      <button ref={ref} className={classes} disabled={disabled || loading} {...props}>
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
            Yükleniyor...
          </span>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
