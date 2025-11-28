import React from 'react';
import { motion } from 'framer-motion';
import { Activity, BarChart3, Users, Database, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTenant } from '@/context/TenantContext';
import Button from '@/components/ui/Button';

const TenantUsage: React.FC = () => {
  const { tenant, usage } = useTenant();
  const navigate = useNavigate();

  const metrics = [
    {
      label: 'Mesaj Kullanımı',
      icon: BarChart3,
      used: usage?.messageCount || 0,
      limit: usage?.messageLimit || 0,
      unit: 'mesaj',
    },
    {
      label: 'Ajan Sayısı',
      icon: Users,
      used: usage?.agents || 0,
      limit: usage?.agentLimit || 0,
      unit: 'ajan',
    },
    {
      label: 'Depolama',
      icon: Database,
      used: usage?.storageUsedGb || 0,
      limit: usage?.storageLimitGb || 0,
      unit: 'GB',
    },
  ];

  const getPercent = (used: number, limit: number) => {
    if (!limit) return 0;
    return Math.min(100, Math.round((used / limit) * 100));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-sm uppercase tracking-wider text-slate-500">KULLANIM ANALİZİ</p>
          <h1 className="text-3xl font-bold text-white tracking-tight">{tenant?.name || 'Workspace'} kaynak tüketimi</h1>
          <p className="text-slate-400">Gerçek zamanlı kota kullanımı ve yaklaşan eşikler.</p>
        </div>
        {usage?.lastSyncAt && (
          <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-slate-400">
            Son senkron: {new Date(usage.lastSyncAt).toLocaleString('tr-TR')}
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="glass-panel rounded-2xl border border-white/5 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500">{metric.label}</p>
                <p className="text-3xl font-bold text-white">
                  {metric.used.toLocaleString('tr-TR')} <span className="text-base text-slate-500">/ {metric.limit.toLocaleString('tr-TR')} {metric.unit}</span>
                </p>
              </div>
              <metric.icon size={24} className="text-electric-blue" />
            </div>
            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-electric-blue to-neon-purple"
                style={{ width: `${getPercent(metric.used, metric.limit)}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">{getPercent(metric.used, metric.limit)}% kullanıldı</p>
          </div>
        ))}
      </div>

      <div className="glass-panel rounded-2xl border border-white/5 p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Activity size={20} className="text-emerald-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">Tahmini Yeniden Yükleme Zamanı</h3>
            <p className="text-sm text-slate-400">Kotalarınız %80 üzerine çıktığında otomatik bildirim alırsınız.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3 text-sm text-slate-300">
          <div className="rounded-xl border border-white/5 p-4 bg-white/5">
            <p className="text-xs text-slate-500 uppercase tracking-widest">Mesaj</p>
            <p className="text-xl text-white font-semibold">{usage ? getPercent(usage.messageCount, usage.messageLimit) : 0}% dolu</p>
          </div>
          <div className="rounded-xl border border-white/5 p-4 bg-white/5">
            <p className="text-xs text-slate-500 uppercase tracking-widest">Ajan</p>
            <p className="text-xl text-white font-semibold">{usage ? getPercent(usage.agents, usage.agentLimit) : 0}% dolu</p>
          </div>
          <div className="rounded-xl border border-white/5 p-4 bg-white/5">
            <p className="text-xs text-slate-500 uppercase tracking-widest">Depolama</p>
            <p className="text-xl text-white font-semibold">{usage ? getPercent(usage.storageUsedGb, usage.storageLimitGb) : 0}% dolu</p>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-electric-blue/30 bg-electric-blue/10 p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-electric-blue">KOTA UYARISI</p>
          <h3 className="text-2xl font-semibold text-white mt-2">Planını yükselt veya ek kredi satın al</h3>
          <p className="text-slate-300 text-sm mt-2 max-w-2xl">
            Limitine yaklaştığında kesinti yaşamamak için faturalama sayfasından plan değişikliği yapabilir veya yoğun dönemler için kredi paketleri satın alabilirsin.
          </p>
        </div>
        <Button
          size="lg"
          className="w-full md:w-auto"
          onClick={() => navigate('/billing')}
        >
          <CreditCard size={18} className="mr-2" />
          Planı Yükselt / Kredi Al
        </Button>
      </div>
    </motion.div>
  );
};

export default TenantUsage;
