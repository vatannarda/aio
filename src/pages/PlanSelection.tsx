import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useTenant } from '@/context/TenantContext';
import { billingService } from '@/services/api';
import toast from 'react-hot-toast';
import { PlanProduct, PlanTier } from '@/types';

const PLAN_OPTIONS: PlanProduct[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 49,
    currency: 'USD',
    interval: 'monthly',
    description: 'Yeni başlayan küçük işletmeler için temel limitler.',
    features: ['3 ajan', '3.000 mesaj', 'Email desteği'],
    limitSummary: '3 ajan · 3K mesaj',
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 249,
    currency: 'USD',
    interval: 'monthly',
    description: 'Büyüyen ekipler için gelişmiş limitler ve destek.',
    features: ['10 ajan', '50.000 mesaj', 'Telefon + email destek', 'Audit logları'],
    highlight: true,
    limitSummary: '10 ajan · 50K mesaj',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 1999,
    currency: 'USD',
    interval: 'monthly',
    description: 'Çok lokasyonlu kurumlar için sınırsız ölçek.',
    features: ['Sınırsız ajan', '1M mesaj', 'Özel müşteri başarı yöneticisi', 'On-prem opsiyonları'],
    limitSummary: 'Sınırsız ajan · 1M mesaj',
  },
];

const PlanSelection: React.FC = () => {
  const { tenant, tenantProfile } = useTenant();
  const [processingPlan, setProcessingPlan] = useState<PlanTier | null>(null);

  const currentPlan = tenantProfile?.plan.id;

  const handleCheckout = async (plan: PlanTier) => {
    if (!tenant) {
      toast.error('Aktif tenant bulunamadı');
      return;
    }

    if (plan === currentPlan) {
      toast.success('Bu plan zaten aktif ✅');
      return;
    }

    setProcessingPlan(plan);
    try {
      const { checkoutUrl } = await billingService.startCheckout({
        tenantId: tenant.id,
        plan,
      });
      toast.success('Ödeme sayfasına yönlendiriliyorsunuz');
      window.open(checkoutUrl, '_blank');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Ödeme bağlantısı oluşturulamadı';
      toast.error(message);
    } finally {
      setProcessingPlan(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-sm uppercase tracking-wider text-slate-500">PLAN YÖNETİMİ</p>
          <h1 className="text-3xl font-bold text-white tracking-tight">İşletmeniz için en uygun planı seçin</h1>
          <p className="text-slate-400">
            {tenant?.name || 'Workspace'} için plan ve limitleri buradan yönetebilirsiniz.
          </p>
        </div>
        {tenantProfile && (
          <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm text-slate-200">
            <p className="text-xs uppercase tracking-wide text-slate-500">Aktif Plan</p>
            <p className="text-lg font-semibold text-white">{tenantProfile.plan.name}</p>
            <p className="text-xs text-slate-500">{tenantProfile.plan.limitSummary}</p>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {PLAN_OPTIONS.map((plan) => {
          const isCurrent = plan.id === currentPlan;
          return (
            <div
              key={plan.id}
              className={`glass-panel rounded-2xl p-6 border ${
                plan.highlight ? 'border-electric-blue/40 bg-electric-blue/5' : 'border-white/5'
              } flex flex-col h-full`}
            >
              {plan.highlight && (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full mb-3 w-max">
                  <Sparkles size={12} /> Popüler seçim
                </span>
              )}
              <h3 className="text-2xl font-semibold text-white">{plan.name}</h3>
              <p className="text-sm text-slate-400 mb-4">{plan.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-white">${plan.price}</span>
                <span className="text-slate-500 text-sm">/{plan.interval === 'monthly' ? 'ay' : 'yıl'}</span>
              </div>

              <ul className="space-y-3 text-sm text-slate-300 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check size={16} className="text-emerald-400" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                className="mt-8 w-full"
                variant={plan.highlight ? 'primary' : 'secondary'}
                isLoading={processingPlan === plan.id}
                disabled={isCurrent}
                onClick={() => handleCheckout(plan.id)}
              >
                {isCurrent ? 'Aktif Plan' : 'Planı Seç'}
              </Button>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default PlanSelection;
