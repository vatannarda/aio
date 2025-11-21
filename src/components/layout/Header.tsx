import { Bell, CheckCircle, Menu } from 'lucide-react'

interface HeaderProps {
  title: string
  description?: string
  onMenuClick?: () => void
}

export function Header({ title, description, onMenuClick }: HeaderProps) {
  return (
    <header className="glass-header px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            aria-label="Menüyü aç"
            type="button"
            className="lg:hidden p-2 rounded-lg glass-card hover-glow text-slate-200"
          >
            <Menu size={20} />
          </button>
        )}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">{title}</h2>
          {description && <p className="text-xs sm:text-sm text-slate-300 mt-1 hidden sm:block">{description}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="hidden sm:flex items-center gap-2 glass-card px-3 sm:px-4 py-2">
          <div className="relative">
            <CheckCircle className="text-green-400" size={16} />
            <span className="absolute top-0 right-0 h-1.5 w-1.5 bg-green-400 rounded-full animate-pulse" />
          </div>
          <span className="text-xs sm:text-sm text-slate-200 hidden md:inline">
            Sistem: <strong className="text-green-400">Çevrimiçi</strong>
          </span>
        </div>

        <button className="glass-card p-2 sm:p-3 rounded-lg hover-glow relative" type="button" aria-label="Bildirimler">
          <Bell size={16} className="text-slate-200" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-neon-purple rounded-full animate-pulse" />
        </button>

        <div className="glass-card px-2 sm:px-4 py-2 flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-electric-blue to-neon-purple text-white font-semibold flex items-center justify-center text-sm">
            MT
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-white leading-tight">Mehmet Tutar</p>
            <p className="text-xs text-slate-300">Admin</p>
          </div>
        </div>
      </div>
    </header>
  )
}
