import { useState } from 'react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

interface LayoutProps {
  children: ReactNode
  title: string
  description?: string
}

export function Layout({ children, title, description }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex bg-[#0B0F19]">
      <aside className="hidden lg:block w-64 h-screen sticky top-0">
        <Sidebar />
      </aside>

      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSidebarOpen(false)}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      <div
        className={`fixed inset-y-0 left-0 w-72 max-w-[85%] z-50 lg:hidden transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="relative h-full">
          <Sidebar />
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Menüyü kapat"
            className="absolute top-4 right-4 p-2 rounded-lg glass-card hover-glow text-slate-200"
            type="button"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-screen">
        <Header
          title={title}
          description={description}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
