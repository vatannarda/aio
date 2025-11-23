import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Users, Zap, Activity } from 'lucide-react';
import StatCard from '@/components/features/StatCard';
import ChatTable from '@/components/features/ChatTable';
import { ChatLog } from '@/types';

const AdminDashboard: React.FC = () => {
  // Mock Data
  const stats = [
    { title: 'Toplam Konuşma', value: '1,250', icon: MessageSquare, trend: '12%', trendUp: true, color: 'text-electric-blue' },
    { title: 'Aktif Kullanıcı', value: '340', icon: Users, trend: '5%', trendUp: true, color: 'text-neon-purple' },
    { title: 'Ort. Yanıt Süresi', value: '2.3s', icon: Zap, trend: '0.4s', trendUp: false, color: 'text-emerald-400' },
  ];

  const logs: ChatLog[] = [
    { id: '1', platform: 'Web Widget', userId: 'usr_8293', messagePreview: 'Şifremi nasıl sıfırlarım?', responsePreview: 'Şunu yaparak sıfırlayabilirsiniz...', timestamp: '2 dk önce' },
    { id: '2', platform: 'Mobil Uygulama', userId: 'usr_1120', messagePreview: 'Fiyatlandırma planı sorgusu', responsePreview: 'Üç aşamamız var...', timestamp: '15 dk önce' },
    { id: '3', platform: 'Web Widget', userId: 'usr_3321', messagePreview: 'Slack entegrasyonu?', responsePreview: 'Evet, Slack\'i destekliyoruz...', timestamp: '1 saat önce' },
    { id: '4', platform: 'API', userId: 'sys_9982', messagePreview: 'Sistem sağlık kontrolü', responsePreview: 'Tüm sistemler çalışıyor', timestamp: '2 saat önce' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Panel Genel Bakış</h1>
            <p className="text-slate-400">Tekrar hoş geldiniz, ajanlarınızın bugünkü durumu burada.</p>
         </div>
         <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/5">
            <Activity size={16} className="text-emerald-400" />
            <span className="text-sm text-slate-300">Gerçek Zamanlı Veri</span>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-3">
            <ChatTable logs={logs} />
         </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
