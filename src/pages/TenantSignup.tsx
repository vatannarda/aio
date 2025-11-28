import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import SignupForm from '@/components/features/SignupForm';
import { getPlanById, publicPlans } from '@/lib/plans';

const TenantSignup: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const planIdFromQuery = searchParams.get('planId') ?? undefined;
  const activePlan = useMemo(() => getPlanById(planIdFromQuery), [planIdFromQuery]);

  const planOptions = useMemo(
    () => publicPlans.map((plan) => ({ value: plan.id, label: `${plan.name} · $${plan.priceMonthly}/ay` })),
    []
  );

  const messageLimitLabel = useMemo(
    () => new Intl.NumberFormat('tr-TR').format(activePlan.messageLimit),
    [activePlan.messageLimit]
  );

  const handlePlanChange = (nextPlanId: string) => {
    navigate(`/signup?planId=${nextPlanId}`, { replace: true });
  };

  return (
    <div className="min-h-screen bg-deep-space text-white px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto space-y-10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <Button
            variant="ghost"
            className="text-slate-300"
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={18} className="mr-2" /> Ana sayfaya dön
          </Button>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-sm text-slate-300">
            <Sparkles size={16} className="text-electric-blue" />
            14 gün ücretsiz deneme tüm planlarda aktif
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr,1.4fr]">
          <aside className="glass-panel border border-white/10 rounded-3xl p-8 space-y-6">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Seçilen plan</p>
              <h1 className="text-3xl font-semibold text-white">{activePlan.name}</h1>
              <p className="text-slate-400">{activePlan.description}</p>
            </div>

            <div>
              <p className="text-4xl font-bold text-white">
                ${activePlan.priceMonthly}
                <span className="text-base text-slate-500 font-normal">/ay</span>
              </p>
              <p className="text-sm text-slate-400">{messageLimitLabel}+ mesaj limiti / ay</p>
            </div>

            <Select
              label="Farklı plan seç"
              value={activePlan.id}
              onChange={(event) => handlePlanChange(event.target.value)}
              options={planOptions}
            />

            <div>
              <p className="text-sm font-semibold text-white mb-3">Öne çıkanlar</p>
              <ul className="space-y-3 text-slate-300 text-sm">
                {(activePlan.features ?? ['Limitler şeffaf şekilde yönetilir.']).map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check size={16} className="text-emerald-400" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <section className="glass-panel border border-white/10 rounded-3xl p-8 space-y-6">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.4em] text-slate-500">Başvuru formu</p>
              <h2 className="text-3xl font-semibold text-white">Plan kaydı</h2>
              <p className="text-slate-400">
                {activePlan.name} planı için işletme bilgilerinizi paylaşın; birkaç dakika içinde aktivasyon ekibimiz sizinle iletişime geçsin.
              </p>
            </div>
            <SignupForm plan={activePlan} />
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default TenantSignup;
