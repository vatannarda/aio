import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, Bot, User, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { useChat } from '@/hooks/useChat';
import TypingIndicator from '@/components/features/TypingIndicator';
import { useTenant } from '@/context/TenantContext';

const LIMIT_NOTICE_FALLBACK = 'Your message limit has been reached. Please upgrade your plan from the admin dashboard.';

const CustomerChat: React.FC = () => {
  const [input, setInput] = useState('');
  const { messages, isLoading, sendMessage, isLimitReached, limitMessage } = useChat('aio-customer-chat'); // Same key as landing
  const { tenant, tenantProfile } = useTenant();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading || isLimitReached) return;

    const msg = input;
    setInput('');
    await sendMessage(msg);
  };

  const limitNotice = limitMessage || LIMIT_NOTICE_FALLBACK;

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col glass-panel border border-white/5 rounded-2xl overflow-hidden mt-4 mb-8">
      {/* Chat Header */}
      <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-electric-blue to-neon-purple p-0.5">
          <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
            <Bot size={20} className="text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-white font-semibold">{tenant?.name || 'AIO Support Assistant'}</h2>
          <p className="text-xs text-slate-400">
            {tenantProfile?.plan.name ? `${tenantProfile?.plan.name} Planı` : 'Always here to help'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-50">
            <Bot size={48} className="mb-4" />
            <p>Start a conversation with us.</p>
          </div>
        )}

        {messages.map((msg) => {
          const timeLabel = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          if (msg.role === 'system') {
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center"
              >
                <div className="max-w-xl w-full text-center px-4 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-100 text-sm leading-relaxed shadow-xl shadow-amber-500/10">
                  {msg.content}
                  <div className="mt-2 text-xs text-amber-200/70">{timeLabel}</div>
                </div>
              </motion.div>
            );
          }

          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'flex gap-4 max-w-[80%]',
                msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
              )}
            >
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1',
                  msg.role === 'user' ? 'bg-electric-blue/20 text-electric-blue' : 'bg-neon-purple/20 text-neon-purple'
                )}
              >
                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div>
                <div
                  className={cn(
                    'p-4 rounded-2xl text-sm leading-relaxed shadow-lg',
                    msg.role === 'user'
                      ? 'bg-electric-blue text-white rounded-tr-none'
                      : 'bg-white/[0.05] text-slate-200 border border-white/[0.05] rounded-tl-none'
                  )}
                >
                  {msg.content}
                </div>
                <div className={cn('mt-2 text-xs text-slate-500', msg.role === 'user' ? 'text-right' : 'text-left')}>
                  {timeLabel}
                </div>
              </div>
            </motion.div>
          );
        })}

        {isLoading && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-neon-purple/20 text-neon-purple flex items-center justify-center flex-shrink-0">
              <Bot size={18} />
            </div>
            <TypingIndicator />
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white/[0.02] border-t border-white/5">
        {isLimitReached && (
          <div className="max-w-4xl mx-auto mb-3 flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-100">
            <AlertTriangle size={16} className="flex-shrink-0" />
            <span>{limitNotice}</span>
          </div>
        )}
        <form onSubmit={handleSend} className="relative flex items-center gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isLimitReached
                ? 'Message limit reached. Upgrade your plan to continue the conversation.'
                : 'Type your message here...'
            }
            disabled={isLimitReached}
            className="flex-1 bg-black/20 border border-white/[0.1] rounded-xl px-6 py-4 text-white placeholder:text-slate-500 focus:border-electric-blue/50 focus:ring-1 focus:ring-electric-blue/50 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            autoFocus
          />
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="absolute right-2 h-11 w-11 p-0 rounded-lg"
            disabled={!input.trim() || isLoading || isLimitReached}
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CustomerChat;
