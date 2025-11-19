import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
}

export function StatCard({ title, value, icon: Icon, description }: StatCardProps) {
  return (
    <article className="glass-card p-6 hover-glow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-300 mb-1 tracking-wide uppercase">{title}</p>
          <h3 className="text-3xl font-bold text-white">{value}</h3>
          {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
        </div>
        <div className="gradient-primary p-3 rounded-lg shadow-lg shadow-electric-blue/30">
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </article>
  )
}
