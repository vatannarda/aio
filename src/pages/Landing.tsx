import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Zap, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import ChatWidget from '@/components/features/ChatWidget';

const Landing: React.FC = () => {
  const features = [
    { icon: ShieldCheck, title: 'Kurumsal Güvenlik', desc: 'Banka düzeyinde şifreleme ve rol tabanlı erişim kontrolü.' },
    { icon: Zap, title: 'Işık Hızında', desc: 'Edge önbellekleme ve global CDN ile optimize edilmiş performans.' },
    { icon: BarChart3, title: 'Gerçek Zamanlı Analitik', desc: 'Yapay zeka etkileşimlerinize dair derinlemesine içgörüler.' },
  ];

  return (
    <div className="min-h-screen bg-deep-space text-slate-400 font-sans selection:bg-neon-purple/30 selection:text-white relative overflow-x-hidden flex flex-col">
       <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neon-purple/20 via-deep-space to-deep-space pointer-events-none"></div>
       <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none z-0 mix-blend-overlay"></div>

      {/* Hero Section */}
      <div className="relative py-20 lg:py-32 overflow-hidden flex-1 flex flex-col justify-center">
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-electric-blue/10 border border-electric-blue/20 text-electric-blue text-sm font-semibold mb-6">
              AIO V2.0 Yayında
            </span>
            <h1 className="text-5xl lg:text-7xl font-bold text-white tracking-tight mb-6 leading-tight">
              AIO: <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-electric-blue via-purple-500 to-neon-purple">Akıllı İşletme Asistanı</span>
            </h1>
            <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Müşterilerinizle 7/24 konuşan, satış yapan ve destek veren yapay zeka personeliniz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/admin">
                <Button size="lg" className="w-full sm:w-auto">
                  Yönetim Paneline Git
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Dökümantasyon
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-panel p-8 rounded-2xl hover:bg-white/[0.04] transition-colors group"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-electric-blue/20 to-neon-purple/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="text-electric-blue" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <ChatWidget />
    </div>
  );
};

export default Landing;
