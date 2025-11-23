import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Users, Zap, Activity } from 'lucide-react';
import StatCard from '@/components/features/StatCard';
import ChatTable from '@/components/features/ChatTable';
import { ChatLog } from '@/types';

const AdminDashboard: React.FC = () => {
  // Mock Data
  const stats = [
    { title: 'Total Conversations', value: '1,250', icon: MessageSquare, trend: '12%', trendUp: true, color: 'text-electric-blue' },
    { title: 'Active Users', value: '340', icon: Users, trend: '5%', trendUp: true, color: 'text-neon-purple' },
    { title: 'Avg Response Time', value: '2.3s', icon: Zap, trend: '0.4s', trendUp: false, color: 'text-emerald-400' },
  ];

  const logs: ChatLog[] = [
    { id: '1', platform: 'Web Widget', userId: 'usr_8293', messagePreview: 'How do I reset my password?', responsePreview: 'You can reset it by...', timestamp: '2 min ago' },
    { id: '2', platform: 'Mobile App', userId: 'usr_1120', messagePreview: 'Pricing plans inquiry', responsePreview: 'We have three tiers...', timestamp: '15 min ago' },
    { id: '3', platform: 'Web Widget', userId: 'usr_3321', messagePreview: 'Integration with Slack?', responsePreview: 'Yes, we support Slack...', timestamp: '1 hour ago' },
    { id: '4', platform: 'API', userId: 'sys_9982', messagePreview: 'System health check', responsePreview: 'All systems operational', timestamp: '2 hours ago' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Dashboard Overview</h1>
            <p className="text-slate-400">Welcome back, here's what's happening with your agents today.</p>
         </div>
         <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/5">
            <Activity size={16} className="text-emerald-400" />
            <span className="text-sm text-slate-300">Real-time Data</span>
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
