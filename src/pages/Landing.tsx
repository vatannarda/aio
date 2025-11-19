import { Link } from 'react-router-dom'
import { Bot, Sparkles, Zap, Shield, MessageCircle } from 'lucide-react'
import { Chatbot } from '@/components/Chatbot'

export function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/5 via-transparent to-neon-purple/5 pointer-events-none" />
      
      <div className="relative z-10">
        <header className="glass-header px-8 py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="gradient-primary p-3 rounded-xl">
                <Bot className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-white text-2xl font-bold">AIO</h1>
                <p className="text-slate-400 text-sm">Akıllı İletişim Ortağınız</p>
              </div>
            </div>
            
            <Link 
              to="/admin" 
              className="glass-card px-6 py-3 text-slate-200 hover-glow font-medium rounded-lg transition-all"
            >
              Yönetim Paneli
            </Link>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-8 py-20">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
              <Sparkles className="text-electric-blue" size={16} />
              <span className="text-sm text-slate-300">Gemini AI Destekli</span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Müşteri İletişiminizi
              <br />
              <span className="gradient-primary bg-clip-text text-transparent">
                Yapay Zeka ile Güçlendirin
              </span>
            </h2>
            
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-12">
              AIO, müşterilerinizle 7/24 anlık iletişim kuran, akıllı yanıtlar üreten ve işlerinizi otomatikleştiren yapay zeka destekli chatbot platformudur.
            </p>

            <div className="flex items-center justify-center gap-4">
              <div className="glass-card px-6 py-4 flex items-center gap-3">
                <MessageCircle className="text-electric-blue" size={24} />
                <div className="text-left">
                  <p className="text-2xl font-bold text-white">Sağ Altta</p>
                  <p className="text-sm text-slate-400">Chatbot'u Test Edin</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 hover-glow">
              <div className="bg-electric-blue/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <Zap className="text-electric-blue" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Anlık Yanıtlar</h3>
              <p className="text-slate-300">
                Gemini AI gücüyle müşterilerinize saniyeler içinde akıllı, bağlama uygun yanıtlar verin.
              </p>
            </div>

            <div className="glass-card p-8 hover-glow">
              <div className="bg-neon-purple/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <Bot className="text-neon-purple" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Özelleştirilebilir</h3>
              <p className="text-slate-300">
                Chatbot'unuzun kişiliğini, tonunu ve davranışını tamamen kendi markanıza göre şekillendirin.
              </p>
            </div>

            <div className="glass-card p-8 hover-glow">
              <div className="bg-green-500/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <Shield className="text-green-500" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Güvenli & Hızlı</h3>
              <p className="text-slate-300">
                Verileriniz şifrelenmiş altyapımızda güvende. N8N workflow entegrasyonuyla esnek ve ölçeklenebilir.
              </p>
            </div>
          </div>
        </main>
      </div>

      <Chatbot />
    </div>
  )
}
