import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Shield, Zap } from 'lucide-react';
import ChatWidget from '@/components/features/ChatWidget';
import Button from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useTenant } from '@/context/TenantContext';

const CustomerLanding: React.FC = () => {
  const navigate = useNavigate();
  const { tenant } = useTenant();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12">
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.6 }}
         className="space-y-6 max-w-2xl"
      >
         <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
           How can we help {tenant?.name ? `${tenant?.name}` : 'you'} today?
         </h1>
         <p className="text-lg text-slate-400 leading-relaxed">
           Our AI-powered assistant is here to help you with your account, billing, and technical questions instantly.
         </p>
         
         <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" onClick={() => navigate('/musteri/chat')} className="rounded-full px-8">
               Start Chatting
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8">
               Browse FAQ
            </Button>
            <Button size="lg" variant="ghost" className="rounded-full px-8" onClick={() => navigate('/signup')}>
               Launch your workspace
            </Button>
         </div>
      </motion.div>

      <motion.div
         initial={{ opacity: 0, y: 40 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.6, delay: 0.2 }}
         className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl"
      >
         <div className="glass-panel p-6 rounded-2xl border border-white/5 text-left">
            <div className="w-10 h-10 rounded-lg bg-electric-blue/10 flex items-center justify-center text-electric-blue mb-4">
               <Zap size={20} />
            </div>
            <h3 className="text-white font-semibold mb-2">Instant Answers</h3>
            <p className="text-sm text-slate-400">Get immediate responses to common questions 24/7 without waiting.</p>
         </div>
         <div className="glass-panel p-6 rounded-2xl border border-white/5 text-left">
            <div className="w-10 h-10 rounded-lg bg-neon-purple/10 flex items-center justify-center text-neon-purple mb-4">
               <MessageCircle size={20} />
            </div>
            <h3 className="text-white font-semibold mb-2">Smart Assistant</h3>
            <p className="text-sm text-slate-400">Powered by advanced AI to understand your specific needs.</p>
         </div>
         <div className="glass-panel p-6 rounded-2xl border border-white/5 text-left">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4">
               <Shield size={20} />
            </div>
            <h3 className="text-white font-semibold mb-2">Secure & Private</h3>
            <p className="text-sm text-slate-400">Your conversations are encrypted and secure.</p>
         </div>
      </motion.div>

      <ChatWidget storageKey="aio-customer-chat" />
    </div>
  );
};

export default CustomerLanding;
