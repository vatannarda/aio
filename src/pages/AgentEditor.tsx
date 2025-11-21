import { useState } from 'react'
import toast from 'react-hot-toast'
import { Layout } from '@/components/layout/Layout'
import { Card } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Slider } from '@/components/ui/Slider'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { AgentConfig } from '@/types'
import { api } from '@/services/api'

const modelOptions = [
  { value: 'gemini-pro', label: 'Gemini Pro' },
  { value: 'gemini-flash', label: 'Gemini Flash' },
  { value: 'gpt-4o', label: 'GPT-4o' },
]

const roleOptions = [
  { value: 'sales', label: 'Satış Temsilcisi' },
  { value: 'support', label: 'Teknik Destek' },
  { value: 'general', label: 'Genel Asistan' },
]

const defaultSystemPrompt = `Sen AIO adında gelişmiş bir yapay zeka asistanısın.
Görevin kullanıcılara profesyonel, dostça ve faydalı yanıtlar vermek.
Her zaman saygılı, bilgili ve çözüm odaklı yaklaş.

Özellikler:
- Net ve anlaşılır Türkçe konuş
- Teknik konularda detaylı açıklamalar yap
- Gerektiğinde örnekler ver
- Kullanıcıyı doğru yönlendir`

export function AgentEditor() {
  const [config, setConfig] = useState<AgentConfig>({
    name: 'AIO Asistan',
    roleType: 'general',
    model: 'gemini-pro',
    systemPrompt: defaultSystemPrompt,
    temperature: 0.7,
  })
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    const sanitizedName = config.name.trim() || 'AIO Asistan'

    try {
      setLoading(true)
      await api.updateAgentConfig({
        ...config,
        name: sanitizedName,
      })
      setConfig((prev) => ({ ...prev, name: sanitizedName }))
      toast.success('Ajan Beyni Güncellendi')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Güncelleme başarısız'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout
      title="Ajan Beyni & Prompt Editörü"
      description="AI modelinizin kişiliğini ve davranışını özelleştirin"
    >
      <div className="max-w-4xl">
        <Card title="Yapay Zeka Konfigürasyonu">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Ajan İsmi"
                id="name"
                value={config.name}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
                placeholder="Örn: AIO Asistan"
              />

              <Select
                label="Ajan Rolü"
                id="roleType"
                options={roleOptions}
                value={config.roleType}
                onChange={(e) => setConfig({ ...config, roleType: e.target.value as AgentConfig['roleType'] })}
              />
            </div>

            <Select
              label="AI Modeli"
              id="model"
              options={modelOptions}
              value={config.model}
              onChange={(e) => setConfig({ ...config, model: e.target.value as AgentConfig['model'] })}
            />

            <Textarea
              label="Sistem Promptu"
              id="systemPrompt"
              value={config.systemPrompt}
              onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
              rows={16}
              className="min-h-[400px]"
              helperText="Bu prompt AI'ın temel davranışını ve kişiliğini belirler. Detaylı ve net olun."
            />

            <div className="glass-card bg-white/[0.02] p-6">
              <Slider
                label="Sıcaklık (Temperature)"
                valueLabel={config.temperature.toFixed(2)}
                min={0}
                max={1}
                step={0.01}
                value={config.temperature}
                onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
              />
              <p className="text-xs text-slate-500 mt-3">
                Düşük değerler (0.1-0.3) daha tutarlı ve öngörülebilir yanıtlar üretir.
                Yüksek değerler (0.7-1.0) daha yaratıcı ve çeşitli yanıtlar sağlar.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={() => void handleSubmit()} loading={loading} size="lg">
                Kaydet
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => setConfig({
                  name: 'AIO Asistan',
                  roleType: 'general',
                  model: 'gemini-pro',
                  systemPrompt: defaultSystemPrompt,
                  temperature: 0.7,
                })}
              >
                Varsayılana Sıfırla
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  )
}
