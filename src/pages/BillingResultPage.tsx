import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, RotateCw, XCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

const BillingResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const statusParam = new URLSearchParams(location.search).get('status')?.toLowerCase() ?? 'unknown';

  const getStatusConfig = () => {
    switch (statusParam) {
      case 'success':
        return {
          icon: CheckCircle2,
          iconClass: 'text-emerald-400',
          title: 'Ödeme tamamlandı',
          message: 'Ödemeniz başarıyla alındı. Planınız veya kredi bakiyeniz birkaç dakika içinde güncellenecek.',
          badge: 'Başarılı',
        };
      case 'cancelled':
        return {
          icon: RotateCw,
          iconClass: 'text-amber-300',
          title: 'İşlem iptal edildi',
          message: 'Ödeme sürecini tamamlamadan çıktınız. Dilediğiniz zaman tekrar deneyebilirsiniz.',
          badge: 'İptal edildi',
        };
      case 'failure':
      default:
        return {
          icon: XCircle,
          iconClass: 'text-red-400',
          title: 'Ödeme tamamlanamadı',
          message: 'Ödeme sağlayıcısından olumsuz dönüş alındı. Detaylar için destek ekibimizle iletişime geçebilir veya tekrar deneyebilirsiniz.',
          badge: 'Hata',
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 text-xs uppercase tracking-widest text-slate-400">
          <AlertTriangle size={14} className="text-electric-blue" />
          Ödeme sonucu
        </div>
        <h1 className="text-3xl font-bold text-white">Faturalama sonucu</h1>
        <p className="text-slate-400">Ödeme sağlayıcısından aldığımız bilgiye göre aşağıdaki durumu tespit ettik.</p>
      </div>

      <div className="glass-panel rounded-3xl border border-white/5 p-10 text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <StatusIcon size={42} className={statusConfig.iconClass} />
          </div>
        </div>
        <span className="inline-flex items-center justify-center px-4 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-slate-300">
          {statusConfig.badge}
        </span>
        <h2 className="text-2xl font-semibold text-white">{statusConfig.title}</h2>
        <p className="text-slate-400 max-w-xl mx-auto">{statusConfig.message}</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button size="lg" className="w-full sm:w-auto" onClick={() => navigate('/admin')}>
            Panele dön
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => navigate('/billing')}
          >
            Faturalamaya geri dön
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default BillingResultPage;
