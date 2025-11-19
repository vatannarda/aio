import { Brain, Bot, MessageSquare } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navigation = [
  { name: 'Dashboard', to: '/inbox', icon: MessageSquare },
  { name: 'Ajan Beyni', to: '/agent-editor', icon: Brain },
  { name: 'Chatbot Ayarları', to: '/widget-config', icon: Bot },
]

export function Sidebar() {
  return (
    <aside className="glass-card h-full w-64 flex flex-col justify-between p-6">
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="gradient-primary p-3 rounded-xl">
            <Bot className="text-white" size={24} />
          </div>
          <div>
            <p className="text-slate-400 text-sm uppercase tracking-widest">AIO</p>
            <h1 className="text-white text-xl font-semibold">Yönetim Paneli</h1>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-sm font-medium
                ${isActive ? 'gradient-primary text-white shadow-lg shadow-electric-blue/30' : 'text-slate-300 hover:bg-white/5'}`
              }
            >
              <item.icon size={18} />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="glass-card bg-white/5 border border-white/10 p-4 flex items-center gap-3">
        <img
          src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80"
          alt="Kullanıcı"
          className="w-12 h-12 rounded-xl object-cover border border-white/20"
        />
        <div>
          <p className="text-sm text-slate-400">Super Admin</p>
          <p className="text-white font-semibold">Elara Systems</p>
        </div>
      </div>
    </aside>
  )
}
