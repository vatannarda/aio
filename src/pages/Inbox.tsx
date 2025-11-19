import { Globe, MessageCircle, MessageSquare, Users, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Layout } from '@/components/layout/Layout'
import { Card } from '@/components/ui/Card'
import { StatCard } from '@/components/ui/StatCard'
import type { ChatLog, Stats } from '@/types'
import { api } from '@/services/api'
import { formatDateTime } from '@/utils/format'

const fallbackStats: Stats = {
  totalConversations: 1284,
  activeUsers: 214,
  tokenConsumption: 92,
}

const fallbackLogs: ChatLog[] = [
  {
    id: '1',
    platform: 'web',
    userId: 'USR-90311',
    lastMessage: 'Yeni kampanyanız hakkında bilgi almak istiyorum.',
    aiResponse: 'Merhaba! Size kampanya detaylarını hemen paylaşayım...',
    timestamp: new Date().toISOString(),
  },
  {
    id: '2',
    platform: 'whatsapp',
    userId: 'WAPP-44821',
    lastMessage: 'Satış ekibinizle görüşebilir miyim?',
    aiResponse: 'Elbette, ilgili ekibe talebinizi iletiyorum.',
    timestamp: new Date(Date.now() - 3600_000).toISOString(),
  },
  {
    id: '3',
    platform: 'web',
    userId: 'USR-55218',
    lastMessage: 'AIO widgetını nasıl entegre ederim?',
    aiResponse: 'Adım adım entegrasyon rehberini paylaşayım.',
    timestamp: new Date(Date.now() - 2 * 3600_000).toISOString(),
  },
]

export function Inbox() {
  const [stats, setStats] = useState<Stats>(fallbackStats)
  const [chatLogs, setChatLogs] = useState<ChatLog[]>(fallbackLogs)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const [statsData, logsData] = await Promise.all([
          api.getDashboardStats(),
          api.getChatLogs(),
        ])
        setStats(statsData)
        setChatLogs(logsData)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Veriler yüklenemedi'
        toast.error(message)
        setStats(fallbackStats)
        setChatLogs(fallbackLogs)
      } finally {
        setLoading(false)
      }
    }

    void fetchData()
  }, [])

  return (
    <Layout title="Dashboard & Gelen Kutusu" description="Tüm konuşmaları ve metrikleri takip edin">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Toplam Konuşma" value={stats.totalConversations} icon={MessageSquare} />
          <StatCard title="Aktif Kullanıcılar" value={stats.activeUsers} icon={Users} />
          <StatCard title="Token Tüketimi" value={`${stats.tokenConsumption}K`} icon={Zap} />
        </div>

        <Card title="Canlı Sohbet Geçmişi">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-electric-blue border-t-transparent rounded-full" />
            </div>
          ) : chatLogs.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <MessageSquare className="mx-auto mb-3 opacity-50" size={48} />
              <p>Henüz kayıtlı konuşma bulunmuyor.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Platform</th>
                    <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Kullanıcı ID</th>
                    <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Son Mesaj</th>
                    <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">AI Cevabı</th>
                    <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Tarih</th>
                  </tr>
                </thead>
                <tbody>
                  {chatLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {log.platform === 'web' ? (
                            <Globe className="text-electric-blue" size={20} />
                          ) : (
                            <MessageCircle className="text-green-500" size={20} />
                          )}
                          <span className="text-sm text-slate-300 capitalize">{log.platform}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-200 font-mono text-sm">{log.userId}</td>
                      <td className="py-4 px-4 text-slate-300 text-sm max-w-xs truncate">{log.lastMessage}</td>
                      <td className="py-4 px-4 text-slate-300 text-sm max-w-xs truncate">{log.aiResponse}</td>
                      <td className="py-4 px-4 text-slate-400 text-sm">{formatDateTime(log.timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  )
}
