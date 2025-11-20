import type { TextareaHTMLAttributes } from 'react'
import { forwardRef } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  helperText?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helperText, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-medium text-slate-300" htmlFor={props.id}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`glass-card px-4 py-3 text-slate-200 placeholder:text-slate-500 font-mono
            focus:outline-none focus:ring-2 focus:ring-electric-blue/60 focus:ring-offset-2 focus:ring-offset-[#05060C]
            focus:shadow-[0_0_30px_rgba(59,130,246,0.35)]
            transition-all duration-300
            ${className}`}
          {...props}
        />
        {helperText && <p className="text-xs text-slate-400">{helperText}</p>}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
