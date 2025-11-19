import type { AgentConfig, ChatLog, Stats, WidgetConfig } from '@/types'

const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL

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

export const api = {
  async getChatLogs(): Promise<ChatLog[]> {
    const baseUrl = ensureWebhookBase()
    const response = await fetch(`${baseUrl}/get-logs`)
    return handleResponse<ChatLog[]>(response)
  },

  async getDashboardStats(): Promise<Stats> {
    const baseUrl = ensureWebhookBase()
    const response = await fetch(`${baseUrl}/stats`)
    return handleResponse<Stats>(response)
  },

  async updateAgentConfig(payload: AgentConfig): Promise<{ success: boolean }> {
    const baseUrl = ensureWebhookBase()
    const response = await fetch(`${baseUrl}/update-prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    return handleResponse<{ success: boolean }>(response)
  },

  async updateWidgetConfig(payload: WidgetConfig): Promise<{ success: boolean }> {
    const baseUrl = ensureWebhookBase()
    const response = await fetch(`${baseUrl}/update-widget`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    return handleResponse<{ success: boolean }>(response)
  },
}
