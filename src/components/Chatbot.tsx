import { useEffect, useRef, useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '@/services/api'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

const CHAT_STORAGE_KEY = 'aio_chat_history'

function createId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2)
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === 'undefined') return []

    const stored = window.localStorage.getItem(CHAT_STORAGE_KEY)
    if (!stored) return []

    try {
      return JSON.parse(stored) as Message[]
    } catch {
      window.localStorage.removeItem(CHAT_STORAGE_KEY)
      return []
    }
  })
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  async function sendMessage() {
    const content = inputValue.trim()
    if (!content || isTyping) return

    const userMessage: Message = {
      id: createId(),
      role: 'user',
      content,
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    try {
      const { reply } = await api.sendChatMessage(content)
      const assistantMessage: Message = {
        id: createId(),
        role: 'assistant',
        content: reply ?? 'Yanıt oluşturulamadı, lütfen tekrar deneyin.',
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      const assistantMessage: Message = {
        id: createId(),
        role: 'assistant',
        content: 'Şu anda bağlanamıyorum. Lütfen birkaç dakika sonra tekrar deneyin.',
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      const message = error instanceof Error ? error.message : 'Chatbot şu anda yanıt veremiyor.'
      toast.error(message)
    } finally {
      setIsTyping(false)
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void sendMessage()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void sendMessage()
    }
  }

  function clearChat() {
    setMessages([])
    window.localStorage.removeItem(CHAT_STORAGE_KEY)
    toast.success('Sohbet geçmişi temizlendi')
  }

  return (
    <div className={`fixed z-[60] transition-all duration-300 ${isOpen ? 'inset-0 sm:inset-auto sm:bottom-6 sm:right-6' : 'bottom-6 right-6'}`}>
      {isOpen ? (
        <div className="glass-card flex flex-col animate-in w-full h-[100dvh] sm:w-96 sm:h-[600px] rounded-none sm:rounded-2xl border-0 sm:border border-white/10 shadow-2xl bg-[#0B0F19]/95 sm:bg-white/5 backdrop-blur-xl">
          <div className="gradient-primary px-6 pb-4 pt-[calc(env(safe-area-inset-top)+16px)] sm:pt-4 rounded-t-none sm:rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Bot className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-white font-semibold">AIO Chatbot</h3>
                <p className="text-white/80 text-xs">Gemini AI ile desteklenir</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <Bot className="mx-auto text-slate-600 mb-4" size={48} />
                <p className="text-slate-400 text-sm">
                  Merhaba! Size nasıl yardımcı olabilirim?
                </p>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    msg.role === 'user'
                      ? 'bg-electric-blue/20 text-electric-blue'
                      : 'bg-neon-purple/20 text-neon-purple'
                  }`}
                >
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-electric-blue/20 text-slate-100'
                      : 'bg-white/5 text-slate-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-neon-purple/20 text-neon-purple">
                  <Bot size={16} />
                </div>
                <div className="bg-white/5 px-4 py-3 rounded-2xl flex items-center gap-3">
                  <span className="text-xs text-slate-300 font-medium">Yazıyor...</span>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-white/10">
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="text-xs text-slate-400 hover:text-slate-300 mb-2 transition-colors"
              >
                Sohbeti Temizle
              </button>
            )}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Mesajınızı yazın..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-electric-blue/50 transition-all"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="bg-electric-blue hover:bg-electric-blue/80 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all hover:shadow-xl hover:shadow-electric-blue/40"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="gradient-primary p-4 rounded-full shadow-2xl hover:shadow-electric-blue/40 transition-all duration-300 hover:scale-110 animate-in"
        >
          <MessageCircle className="text-white" size={28} />
        </button>
      )}
    </div>
  )
}
