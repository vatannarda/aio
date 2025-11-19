import type { ReactNode } from 'react'

interface CardProps {
  title?: string
  description?: string
  children: ReactNode
  actions?: ReactNode
  className?: string
}

export function Card({ title, description, children, actions, className = '' }: CardProps) {
  return (
    <section className={`glass-card p-6 shadow-lg shadow-black/20 ${className}`}>
      {(title || description || actions) && (
        <header className="flex items-start justify-between mb-4">
          <div>
            {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
            {description && <p className="text-sm text-slate-300">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>
      )}
      {children}
    </section>
  )
}
