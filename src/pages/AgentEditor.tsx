import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Bot, Sparkles, Cpu } from 'lucide-react';
import toast from 'react-hot-toast';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Slider from '@/components/ui/Slider';
import Button from '@/components/ui/Button';
import { agentService } from '@/services/api';
import { AgentConfig } from '@/types';
import { useTenant } from '@/context/TenantContext';

const AgentEditor: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<AgentConfig>({
    name: '',
    role_type: 'general',
    model: 'gemini-pro',
    system_prompt: '',
    temperature: 0.7,
  });
  const { tenant: activeTenant, tenantProfile, isLoading: tenantLoading } = useTenant();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await agentService.updateAgent(formData, {
        tenantId: activeTenant?.id,
        tenantSlug: activeTenant?.slug,
      });
      toast.success('Ajan yapılandırması başarıyla kaydedildi!', {
        icon: '🚀',
        style: {
          background: '#1e293b',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)',
        },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Yapılandırma kaydedilemedi';
      toast.error(message, {
        style: {
          background: '#1e293b',
          color: '#ef4444',
          border: '1px solid rgba(239,68,68,0.2)',
        },
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof AgentConfig, value: AgentConfig[keyof AgentConfig]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2 flex items-center gap-3">
          <Bot className="text-electric-blue" size={32} />
          Ajan Yapılandırması
        </h1>
        <p className="text-slate-400 text-lg">
          Yapay zeka ajanınızın kişiliğini ve davranış parametrelerini özelleştirin.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs md:text-sm text-slate-300">
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
            Aktif müşteri: {activeTenant?.name || 'Yükleniyor...'}
          </span>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
            Plan: {tenantProfile?.plan.name || 'Belirleniyor...'}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-6">
            <div className="flex items-center gap-2 text-electric-blue mb-4">
              <Sparkles size={20} />
              <h3 className="font-semibold text-lg">Kimlik ve Davranış</h3>
            </div>
            
            <Input
              label="Ajan Adı"
              placeholder="örn. Asistan Selin"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Rol Tipi"
                value={formData.role_type}
                onChange={(e) => handleChange('role_type', e.target.value)}
                options={[
                  { value: 'sales', label: 'Satış Temsilcisi' },
                  { value: 'support', label: 'Müşteri Desteği' },
                  { value: 'general', label: 'Genel Asistan' },
                ]}
              />

              <Select
                label="Model"
                value={formData.model}
                onChange={(e) => handleChange('model', e.target.value)}
                options={[
                  { value: 'gemini-pro', label: 'Gemini Pro' },
                  { value: 'gemini-flash', label: 'Gemini Flash' },
                ]}
              />
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl flex flex-col h-[500px]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-neon-purple">
                <Cpu size={20} />
                <h3 className="font-semibold text-lg">Sistem İstemi</h3>
              </div>
              <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Sistem Talimatları</span>
            </div>
            
            <div className="relative flex-1 group">
              <div className="absolute inset-0 bg-black/50 rounded-xl pointer-events-none border border-white/10" />
              <Textarea
                value={formData.system_prompt}
                onChange={(e) => handleChange('system_prompt', e.target.value)}
                placeholder="// Ajanın temel talimatlarını, kısıtlamalarını ve kişiliğini buraya tanımlayın..."
                className="h-full resize-none font-mono text-sm leading-relaxed bg-black/80 text-green-400 border-none focus:ring-0 p-4"
                spellCheck={false}
                required
              />
            </div>
          </div>
        </div>

        {/* Right Column - Parameters & Save */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="font-semibold text-white mb-6">Parametreler</h3>
            
            <div className="space-y-4">
              <Slider
                label="Sıcaklık (Yaratıcılık)"
                value={formData.temperature}
                min={0}
                max={1}
                step={0.1}
                onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Hassas</span>
                <span>Yaratıcı</span>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isSaving || tenantLoading}
            disabled={!activeTenant}
          >
            <Save size={20} className="mr-2" />
            Yapılandırmayı Kaydet
          </Button>

          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-200 text-xs leading-relaxed">
            <p className="font-semibold mb-1">İpucu:</p>
            Gemini modelleriyle en iyi sonuçları almak için, sistem isteminde Markdown formatı kullanarak net ve yapılandırılmış talimatlar verin.
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default AgentEditor;
