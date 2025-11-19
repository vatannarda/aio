import type { AgentConfig, ChatLog, Stats, WidgetConfig } from '@/types'

const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL
const CHAT_WEBHOOK_URL = 'https://n8n.aio.web.tr/webhook/chat'

function ensureWebhookBase() {
  if (!WEBHOOK_URL) {
    throw new Error('VITE_N8N_WEBHOOK_URL tanımlı değil. Lütfen .env dosyasını kontrol edin.')
  }
  return WEBHOOK_URL
}

async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') ?? ''
  const isJson = contentType.includes('application/json')
  const payload = isJson ? await response.json() : await response.text()

  if (!response.ok) {
    const errorMessage = typeof payload === 'string' ? payload : payload?.message ?? 'Unknown error'
    throw new Error(errorMessage)
  }

  return payload as T
}

async function request<T>(url: string, options?: RequestInit) {
  const response = await fetch(url, options)
  return handleResponse<T>(response)
}

export const api = {
  async getChatLogs(): Promise<ChatLog[]> {
    const baseUrl = ensureWebhookBase()
    return request<ChatLog[]>(`${baseUrl}/get-logs`)
  },

  async getDashboardStats(): Promise<Stats> {
    const baseUrl = ensureWebhookBase()
    return request<Stats>(`${baseUrl}/stats`)
  },

  async updateAgentConfig(payload: AgentConfig): Promise<{ success: boolean }> {
    const baseUrl = ensureWebhookBase()
    return request<{ success: boolean }>(`${baseUrl}/update-prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  },

  async updateWidgetConfig(payload: WidgetConfig): Promise<{ success: boolean }> {
    const baseUrl = ensureWebhookBase()
    return request<{ success: boolean }>(`${baseUrl}/update-widget`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  },

  async sendChatMessage(message: string): Promise<{ reply: string }> {
    return request<{ reply: string }>(CHAT_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    })
  },
}
