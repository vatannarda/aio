import { Bell, CheckCircle } from 'lucide-react'

interface HeaderProps {
  title: string
  description?: string
}

export function Header({ title, description }: HeaderProps) {
  return (
    <header className="glass-header px-8 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        {description && <p className="text-sm text-slate-300 mt-1">{description}</p>}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 glass-card px-4 py-2">
          <div className="relative">
            <CheckCircle className="text-green-400" size={18} />
            <span className="absolute top-0 right-0 h-2 w-2 bg-green-400 rounded-full animate-pulse" />
          </div>
          <span className="text-sm text-slate-200">
            Sistem Durumu: <strong className="text-green-400">Çevrimiçi</strong>
          </span>
        </div>

        <button className="glass-card p-3 rounded-lg hover-glow relative">
          <Bell size={18} className="text-slate-200" />
          <span className="absolute top-2 right-2 h-2 w-2 bg-neon-purple rounded-full animate-pulse" />
        </button>

        <div className="glass-card px-4 py-2 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric-blue to-neon-purple text-white font-semibold flex items-center justify-center">
            MT
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-tight">Mehmet Tutar</p>
            <p className="text-xs text-slate-300">Admin</p>
          </div>
        </div>
      </div>
    </header>
  )
}
