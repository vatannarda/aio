import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Diamond, Gift, RefreshCcw } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useTenant } from '@/context/TenantContext';
import { createCheckoutSession, getBillingPlans } from '@/services/billing';
import type { BillingPlan } from '@/types';
import { cn } from '@/lib/utils';

const BillingPage: React.FC = () => {
  const { tenant } = useTenant();
  const [plans, setPlans] = useState<BillingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getBillingPlans();
      setPlans(response);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Planlar yüklenemedi. Lütfen daha sonra tekrar deneyin.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const categorized = useMemo(() => {
    return {
      subscriptions: plans.filter((plan) => plan.type === 'plan'),
      creditPacks: plans.filter((plan) => plan.type === 'credit_pack'),
    };
  }, [plans]);

  const formatCurrency = (amount: number, currency: string) => {
    try {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: currency || 'USD',
      }).format(amount);
    } catch {
      return `${amount} ${currency}`;
    }
  };

  const getQuotaLabel = (plan: BillingPlan) => {
    if (plan.messageLimit) {
      return `${plan.messageLimit.toLocaleString('tr-TR')} mesaj limiti`;
    }
    if (plan.creditAmount) {
      return `${plan.creditAmount.toLocaleString('tr-TR')} mesaj kredisi`;
    }
    return null;
  };

  const handleCheckout = async (plan: BillingPlan) => {
    setCheckoutError(null);
    setProcessingId(plan.id);

    try {
      const payload = plan.type === 'plan' ? { planId: plan.id } : { creditPackId: plan.id };
      const { checkoutUrl } = await createCheckoutSession(payload);
      window.location.href = checkoutUrl;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ödeme bağlantısı oluşturulamadı.';
      setCheckoutError(message);
    } finally {
      setProcessingId(null);
    }
  };

  const renderPlanCard = (plan: BillingPlan) => {
    const quotaLabel = getQuotaLabel(plan);
    const intervalLabel = plan.interval && plan.interval !== 'one_time' ? (plan.interval === 'monthly' ? 'ay' : 'yıl') : null;

    return (
      <motion.div
        key={plan.id}
        whileHover={{ y: -4 }}
        className={cn(
          'glass-panel rounded-2xl border p-6 flex flex-col gap-4',
          plan.highlight ? 'border-electric-blue/40 bg-electric-blue/5 shadow-[0_0_35px_rgba(59,130,246,0.15)]' : 'border-white/5'
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500">{plan.type === 'plan' ? 'Abonelik Planı' : 'Kredi Paketi'}</p>
            <h3 className="text-2xl font-semibold text-white mt-1">{plan.name}</h3>
          </div>
          {plan.highlight && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-electric-blue/10 text-electric-blue border border-electric-blue/30">
              En popüler
            </span>
          )}
        </div>

        {plan.description && <p className="text-sm text-slate-400">{plan.description}</p>}

        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{formatCurrency(plan.price, plan.currency)}</span>
            {intervalLabel && <span className="text-sm text-slate-500">/ {intervalLabel}</span>}
          </div>
          {quotaLabel && <p className="text-sm text-slate-400 mt-1">{quotaLabel}</p>}
        </div>

        {plan.features && plan.features.length > 0 && (
          <ul className="space-y-2 text-sm text-slate-300">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-electric-blue" />
                {feature}
              </li>
            ))}
          </ul>
        )}

        <Button
          size="lg"
          className="w-full mt-auto"
          onClick={() => handleCheckout(plan)}
          isLoading={processingId === plan.id}
        >
          <CreditCard size={18} className="mr-2" />
          {plan.type === 'plan' ? 'Planı Seç / Yükselt' : 'Kredi Satın Al'}
        </Button>
      </motion.div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-sm uppercase tracking-widest text-slate-500">Faturalama Merkezi</p>
          <h1 className="text-3xl font-bold text-white tracking-tight">{tenant?.name || 'Workspace'} aboneliğini yönetin</h1>
          <p className="text-slate-400 max-w-2xl">
            Plan limitlerinizi artırın veya yoğun dönemler için ek kredi paketleri satın alın. Ödeme adımı güvenli sağlayıcı
            üzerinde gerçekleşir ve tamamlandıktan sonra buraya yönlendirilirsiniz.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-slate-400">
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
            <Diamond size={14} className="text-electric-blue" />
            Abonelik planı seçin
          </span>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
            <Gift size={14} className="text-emerald-400" />
            Kredi paketleri ile anlık esneklik
          </span>
        </div>
      </div>

      {checkoutError && (
        <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200">
          {checkoutError}
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-2xl border border-white/5 bg-white/5 p-6 animate-pulse space-y-4">
              <div className="h-4 w-1/3 bg-white/10 rounded" />
              <div className="h-8 w-1/2 bg-white/10 rounded" />
              <div className="h-20 w-full bg-white/10 rounded" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 p-6 flex flex-col gap-4">
          <p className="text-amber-100 text-sm">{error}</p>
          <Button variant="outline" className="w-full sm:w-auto" onClick={fetchPlans}>
            <RefreshCcw size={16} className="mr-2" />
            Tekrar dene
          </Button>
        </div>
      ) : (
        <div className="space-y-10">
          {categorized.subscriptions.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <h2 className="text-2xl font-semibold text-white">Planlar</h2>
                  <p className="text-sm text-slate-400">İşletmenize en uygun abonelik modelini seçin.</p>
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {categorized.subscriptions.map((plan) => renderPlanCard(plan))}
              </div>
            </section>
          )}

          {categorized.creditPacks.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <h2 className="text-2xl font-semibold text-white">Kredi Paketleri</h2>
                  <p className="text-sm text-slate-400">Trafik yoğun dönemlerinde ek kredi satın alarak limitinizi esnetin.</p>
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {categorized.creditPacks.map((plan) => renderPlanCard(plan))}
              </div>
            </section>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default BillingPage;
