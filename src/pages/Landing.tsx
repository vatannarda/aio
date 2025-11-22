import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Zap, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import ChatWidget from '@/components/features/ChatWidget';

const Landing: React.FC = () => {
  const features = [
    { icon: ShieldCheck, title: 'Enterprise Security', desc: 'Bank-grade encryption and role-based access control.' },
    { icon: Zap, title: 'Lightning Fast', desc: 'Optimized performance with edge caching and global CDN.' },
    { icon: BarChart3, title: 'Real-time Analytics', desc: 'Deep insights into your AI agent interactions.' },
  ];

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative py-20 lg:py-32 overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-electric-blue/10 border border-electric-blue/20 text-electric-blue text-sm font-semibold mb-6">
              AIO V2.0 Now Available
            </span>
            <h1 className="text-5xl lg:text-7xl font-bold text-white tracking-tight mb-6 leading-tight">
              The Future of <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-electric-blue via-purple-500 to-neon-purple">AI Management</span>
            </h1>
            <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Experience the next generation of AI agent orchestration. Zero config, infinite possibilities. Designed for the modern enterprise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/agent-editor">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Documentation
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
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
