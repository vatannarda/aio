import { useState } from 'react'
import toast from 'react-hot-toast'
import { Layout } from '@/components/layout/Layout'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import type { WidgetConfig as WidgetConfigType } from '@/types'
import { api } from '@/services/api'

const initialWidgetConfig: WidgetConfigType = {
  botName: 'AIO Asistan',
  primaryColor: '#3b82f6',
  welcomeMessage: 'Merhaba, size nasıl yardımcı olabilirim?',
  logoUrl: 'https://images.unsplash.com/photo-1522199670076-2852f80289c7?auto=format&fit=crop&w=200&q=80',
}

export function WidgetConfig() {
  const [config, setConfig] = useState<WidgetConfigType>(initialWidgetConfig)
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    try {
      setLoading(true)
      await api.updateWidgetConfig(config)
      toast.success('Widget ayarları kaydedildi!')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ayarlar kaydedilemedi'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout
      title="Web Chatbot Konfigüratörü"
      description="Sitenizdeki sohbet widget'ını markanıza göre kişiselleştirin"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Konfigürasyon" description="Ayarları düzenleyin ve kaydedin">
          <div className="space-y-5">
            <Input
              label="Bot Adı"
              id="botName"
              value={config.botName}
              onChange={(e) => setConfig({ ...config, botName: e.target.value })}
            />

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-300" htmlFor="primaryColor">
                Ana Renk
              </label>
              <input
                type="color"
                id="primaryColor"
                value={config.primaryColor}
                onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                className="w-20 h-12 rounded-lg border border-white/10 cursor-pointer"
              />
            </div>

            <Textarea
              label="Karşılama Mesajı"
              id="welcomeMessage"
              value={config.welcomeMessage}
              rows={4}
              onChange={(e) => setConfig({ ...config, welcomeMessage: e.target.value })}
            />

            <Input
              label="Logo URL"
              id="logoUrl"
              value={config.logoUrl}
              onChange={(e) => setConfig({ ...config, logoUrl: e.target.value })}
            />

            <div className="flex gap-3">
              <Button size="lg" onClick={() => void handleSubmit()} loading={loading}>
                Kaydet
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => setConfig(initialWidgetConfig)}
              >
                Varsayılana Döndür
              </Button>
            </div>
          </div>
        </Card>

        <Card title="Canlı Önizleme" description="Yaptığınız değişiklikler anında yansır">
          <div className="relative h-[520px] rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 p-6 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.2),_transparent_60%)]" />
            <div className="relative flex flex-col h-full">
              <div className="glass-card flex items-center gap-3 p-4 mb-6">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-semibold"
                  style={{ background: config.primaryColor }}
                >
                  {config.botName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm text-slate-400">{config.botName}</p>
                  <p className="text-xs text-green-400 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> Çevrimiçi
                  </p>
                </div>
              </div>

              <div className="mt-auto">
                <div className="bg-white/10 border border-white/10 rounded-3xl shadow-2xl shadow-electric-blue/10 p-4 space-y-3">
                  <div className="flex gap-3">
                    <img
                      src={config.logoUrl}
                      alt="Logo"
                      className="w-10 h-10 rounded-2xl object-cover border border-white/10"
                    />
                    <div>
                      <p className="text-slate-400 text-xs">{config.botName}</p>
                      <p className="text-white text-sm leading-relaxed">{config.welcomeMessage}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold" style={{ background: `${config.primaryColor}1a`, color: config.primaryColor }}>
                      Sohbeti Başlat →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  )
}
