import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Users, Zap, Activity, AlertTriangle, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatCard from '@/components/features/StatCard';
import ChatTable from '@/components/features/ChatTable';
import Button from '@/components/ui/Button';
import type { BillingSummary, ChatLog } from '@/types';
import { useTenant } from '@/context/TenantContext';
import { getBillingSummary } from '@/services/api';
import { cn } from '@/lib/utils';

const AdminDashboard: React.FC = () => {
  const { tenant, usage, tenantProfile } = useTenant();
  const navigate = useNavigate();
  const [billingSummary, setBillingSummary] = useState<BillingSummary | null>(null);
  const [isBillingLoading, setIsBillingLoading] = useState(true);
  const [billingError, setBillingError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchSummary = async () => {
      setIsBillingLoading(true);
      try {
        const summary = await getBillingSummary();
        if (!isMounted) return;
        setBillingSummary(summary);
        setBillingError(null);
      } catch (error) {
        if (!isMounted) return;
        const message = error instanceof Error ? error.message : 'Unable to load billing info';
        setBillingError(message);
        setBillingSummary(null);
      } finally {
        if (isMounted) {
          setIsBillingLoading(false);
        }
      }
    };

    fetchSummary();

    return () => {
      isMounted = false;
    };
  }, [tenant?.slug]);

  const getPercent = (used?: number, limit?: number) => {
    if (!used || !limit || limit === 0) return '0%';
    return `${Math.min(100, Math.round((used / limit) * 100))}%`;
  };

  const stats = [
    {
      title: 'Aylık Mesaj',
      value: usage ? `${usage.messageCount.toLocaleString('tr-TR')} / ${usage.messageLimit.toLocaleString('tr-TR')}` : '—',
      icon: MessageSquare,
      trend: getPercent(usage?.messageCount, usage?.messageLimit),
      trendUp: true,
      color: 'text-electric-blue',
    },
    {
      title: 'Aktif Ajan',
      value: usage ? `${usage.agents}/${usage.agentLimit}` : '—',
      icon: Users,
      trend: tenant?.status === 'active' ? 'Aktif' : 'Pasif',
      trendUp: tenant?.status !== 'suspended',
      color: 'text-neon-purple',
    },
    {
      title: 'Depolama Kullanımı',
      value: usage ? `${usage.storageUsedGb} GB / ${usage.storageLimitGb} GB` : '—',
      icon: Zap,
      trend: getPercent(usage?.storageUsedGb, usage?.storageLimitGb),
      trendUp: false,
      color: 'text-emerald-400',
    },
  ];

  const logs: ChatLog[] = [
    { id: '1', platform: 'Web Widget', userId: 'usr_8293', messagePreview: 'Şifremi nasıl sıfırlarım?', responsePreview: 'Şunu yaparak sıfırlayabilirsiniz...', timestamp: '2 dk önce' },
    { id: '2', platform: 'Mobil Uygulama', userId: 'usr_1120', messagePreview: 'Fiyatlandırma planı sorgusu', responsePreview: 'Üç aşamamız var...', timestamp: '15 dk önce' },
    { id: '3', platform: 'Web Widget', userId: 'usr_3321', messagePreview: 'Slack entegrasyonu?', responsePreview: 'Evet, Slack\'i destekliyoruz...', timestamp: '1 saat önce' },
    { id: '4', platform: 'API', userId: 'sys_9982', messagePreview: 'Sistem sağlık kontrolü', responsePreview: 'Tüm sistemler çalışıyor', timestamp: '2 saat önce' },
  ];

  const summaryLimitReached = billingSummary?.limitReached;
  const remainingMessagesLabel = billingSummary ? billingSummary.remainingMessages.toLocaleString('tr-TR') : '—';
  const limitNotice = billingSummary?.message ?? 'Mesaj limitiniz doldu. Lütfen planınızı yükseltin veya ek kredi satın alın.';
  const billingCardClass = cn(
    'glass-panel rounded-2xl border p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between',
    summaryLimitReached ? 'border-amber-500/40 bg-amber-500/5' : 'border-white/5'
  );

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
             <div className="flex flex-wrap gap-3 mt-3 text-xs text-slate-300">
               <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">Tenant: {tenant?.name || 'Belirleniyor'}</span>
               <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">Plan: {tenantProfile?.plan.name || '—'}</span>
             </div>
         </div>

          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
             <Activity size={16} className="text-emerald-400" />
             <span className="text-sm text-slate-300">Gerçek Zamanlı Veri</span>
          </div>
         </div>

      <div className={billingCardClass}>
        <div>
          <p className="text-sm uppercase tracking-widest text-slate-500">Faturalama Özeti</p>
          {billingError ? (
            <p className="mt-2 text-sm text-red-300">Faturalama bilgisi yüklenemedi.</p>
          ) : isBillingLoading || !billingSummary ? (
            <div className="mt-4 space-y-2">
              <div className="h-3 w-32 rounded bg-white/10 animate-pulse" />
              <div className="h-3 w-48 rounded bg-white/10 animate-pulse" />
            </div>
          ) : (
            <>
              <h3 className="text-2xl font-semibold text-white mt-2">Mevcut Plan: {billingSummary.planName}</h3>
              <p className="text-slate-300 text-sm mt-1">
                Kalan mesaj kredisi: <span className="font-semibold text-white">{remainingMessagesLabel}</span>
              </p>
            </>
          )}
          {summaryLimitReached && !billingError && (
            <div className="mt-3 flex items-center gap-2 text-amber-200 text-sm">
              <AlertTriangle size={16} />
              <span>{limitNotice}</span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-auto md:items-end">
          <Button
            variant="primary"
            size="lg"
            className="md:min-w-[220px]"
            onClick={() => navigate('/billing')}
          >
            <CreditCard size={18} className="mr-2" />
            Planı Yükselt / Kredi Al
          </Button>
          <p className="text-xs text-slate-500 text-center md:text-right max-w-sm">
            Daha fazla mesaj kredisi ve gelişmiş özellikler için faturalama sayfasına gidin.
          </p>
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
