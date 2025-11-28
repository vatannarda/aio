import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, ChevronRight } from 'lucide-react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { publicService } from '@/services/api';
import toast from 'react-hot-toast';
import { SignupPayload } from '@/types';
import { useNavigate } from 'react-router-dom';

const TenantSignup: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<SignupPayload>({
    businessName: '',
    contactName: '',
    email: '',
    plan: 'starter',
    subdomain: '',
    phone: '',
  });

  const handleChange = (field: keyof SignupPayload, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await publicService.signup(formData);
      toast.success(response.message || 'Kayıt talebiniz alındı!');
      navigate(`/admin?tenant=${response.tenantSlug}`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Kayıt tamamlanamadı';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const planOptions = [
    { value: 'starter', label: 'Starter · $49/ay' },
    { value: 'pro', label: 'Professional · $249/ay' },
    { value: 'enterprise', label: 'Enterprise · özel fiyat' },
  ];

  return (
    <div className="min-h-screen bg-deep-space text-white flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl glass-panel border border-white/10 rounded-3xl p-10 space-y-10"
      >
        <div className="space-y-3 text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-electric-blue to-neon-purple flex items-center justify-center">
            <Building2 size={28} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Yeni Workspace Oluştur</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            İşletmenizi AIO üzerinde saniyeler içinde başlatın. Çoklu şube yönetimi, gelişmiş faturalama ve yapay zeka ajanlarını tek panelden yönetin.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
          <Input
            label="İşletme Adı"
            placeholder="Örn. Kebapçı Ahmet"
            value={formData.businessName}
            onChange={(e) => handleChange('businessName', e.target.value)}
            required
          />
          <Input
            label="Sorumlu Kişi"
            placeholder="Ad Soyad"
            value={formData.contactName}
            onChange={(e) => handleChange('contactName', e.target.value)}
            required
          />
          <Input
            label="İş Emaili"
            type="email"
            placeholder="ornek@firma.com"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
          />
          <Input
            label="Telefon"
            placeholder="+90 5XX XXX XX XX"
            value={formData.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
          <div className="space-y-1">
            <Input
              label="Subdomain"
              placeholder="ornek"
              value={formData.subdomain}
              onChange={(e) => handleChange('subdomain', e.target.value.replace(/\s+/g, '-').toLowerCase())}
              required
            />
            <p className="text-xs text-slate-500 ml-1">Tam adres: https://{formData.subdomain || 'isletme'}.aio.app</p>
          </div>
          <Select
            label="Plan"
            value={formData.plan}
            onChange={(e) => handleChange('plan', e.target.value)}
            options={planOptions}
          />

          <div className="md:col-span-2 rounded-2xl bg-white/5 border border-white/10 p-5 text-sm text-slate-300">
            <p className="font-semibold text-white mb-2">Çoklu tenant mimarisi hazır ✨</p>
            <p>
              Her işletme ayrı <span className="text-electric-blue font-semibold">tenant_id</span> ile izole edilir. API anahtarları ve kullanım kotaları backend tarafında bu ID üzerinden yönetilir.
            </p>
          </div>

          <Button type="submit" size="lg" className="md:col-span-2" isLoading={isSubmitting}>
            Workspace Oluştur <ChevronRight size={18} className="ml-2" />
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default TenantSignup;
