import { useState, useEffect, useCallback } from 'react';
import { chatService } from '@/services/api';
import { useTenant } from '@/context/TenantContext';
import { ChatMessage } from '@/types';
import toast from 'react-hot-toast';

const getStoredMessages = (key: string): ChatMessage[] => {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : [];
};

export function useChat(storageKey: string = 'aio-chat-history') {
  const { tenant } = useTenant();
  const tenantSlug = tenant?.slug || 'default';
  const resolvedStorageKey = `${storageKey}-${tenantSlug}`;

  const [messages, setMessages] = useState<ChatMessage[]>(() => getStoredMessages(resolvedStorageKey));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMessages(getStoredMessages(resolvedStorageKey));
  }, [resolvedStorageKey]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(resolvedStorageKey, JSON.stringify(messages));
  }, [messages, resolvedStorageKey]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const reply = await chatService.sendMessage(content, {
        tenantId: tenant?.id,
        tenantSlug: tenant?.slug,
      });
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to send message';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [tenant?.id, tenant?.slug]);

  const clearHistory = useCallback(() => {
    setMessages([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(resolvedStorageKey);
    }
  }, [resolvedStorageKey]);

  return { messages, isLoading, sendMessage, clearHistory };
}
