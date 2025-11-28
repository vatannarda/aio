import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Wallet2, Clock, Download } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useTenant } from '@/context/TenantContext';
import { billingService } from '@/services/api';
import toast from 'react-hot-toast';

const BillingPortal: React.FC = () => {
  const { tenant, tenantProfile, usage } = useTenant();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddCredits = async () => {
    if (!tenant) {
      toast.error('Önce bir tenant seçmelisiniz');
      return;
    }

    setIsProcessing(true);
    try {
      const { checkoutUrl } = await billingService.startCheckout({
        tenantId: tenant.id,
        plan: tenantProfile?.plan.id || 'starter',
      });
      toast.success('Ödeme bağlantısı açılıyor');
      window.open(checkoutUrl, '_blank');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'İşlem başlatılamadı';
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const invoices = [
    { id: 'INV-9821', amount: '$249', period: 'Şubat 2025', status: 'Ödendi' },
    { id: 'INV-9710', amount: '$249', period: 'Ocak 2025', status: 'Ödendi' },
    { id: 'INV-9602', amount: '$249', period: 'Aralık 2024', status: 'Ödendi' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-sm uppercase tracking-wider text-slate-500">Faturalama ve Kredi</p>
          <h1 className="text-3xl font-bold text-white tracking-tight">Ödemeleri ve kredi kullanımını yönetin</h1>
          <p className="text-slate-400">
            {tenant?.name || 'Workspace'} için ödeme yöntemleri ve kredi bakiyeleriniz burada listelenir.
          </p>
        </div>
        <Button size="lg" variant="primary" onClick={handleAddCredits} isLoading={isProcessing}>
          <CreditCard size={18} className="mr-2" />
          Kredi / Plan Satın Al
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="glass-panel rounded-2xl border border-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Kalan Kredi</h3>
            <Wallet2 size={18} className="text-electric-blue" />
          </div>
          <p className="text-4xl font-bold text-white">{usage?.creditsRemaining?.toLocaleString('tr-TR') || '0'}</p>
          <p className="text-xs text-slate-500 mt-1">Tekil mesaj kredisi bazında hesaplanır.</p>
        </div>

        <div className="glass-panel rounded-2xl border border-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Fatura Döngüsü</h3>
            <Clock size={18} className="text-neon-purple" />
          </div>
          <p className="text-3xl font-bold text-white">{usage?.billingCycle || 'Belirleniyor'}</p>
          <p className="text-xs text-slate-500 mt-1">Yenilenme: {usage?.renewsAt ? new Date(usage.renewsAt).toLocaleDateString('tr-TR') : '-'}</p>
        </div>

        <div className="glass-panel rounded-2xl border border-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Aktif Plan</h3>
            <CreditCard size={18} className="text-emerald-400" />
          </div>
          <p className="text-3xl font-bold text-white">{tenantProfile?.plan.name || 'Tanımsız'}</p>
          <p className="text-xs text-slate-500 mt-1">{tenantProfile?.plan.limitSummary}</p>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-white/5 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-white">Ödeme Yöntemi</h3>
            <p className="text-slate-400 text-sm">Backend hazır olduğunda kart detayları burada görüntülenecek.</p>
          </div>
          <Button size="sm" variant="secondary" disabled>
            Kredi Kartı Ekle (Yakında)
          </Button>
        </div>
        <div className="rounded-xl border border-dashed border-white/10 p-6 text-center text-slate-500 text-sm">
          Gerçek kart bilgileri güvenli kasada tutulacak. Şimdilik placeholder olarak kullanıyoruz.
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-white/5 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Fatura Geçmişi</h3>
          <Button variant="outline" size="sm">
            <Download size={16} className="mr-2" />
            Tümünü indir
          </Button>
        </div>
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-sm text-slate-300">
              <div>
                <p className="text-white font-semibold">{invoice.amount}</p>
                <p className="text-xs text-slate-500">{invoice.period}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 uppercase tracking-widest">{invoice.status}</p>
                <p className="text-xs text-slate-600">{invoice.id}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default BillingPortal;
