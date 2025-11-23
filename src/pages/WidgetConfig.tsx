import React from 'react';
import { motion } from 'framer-motion';
import { Settings, MessageSquare } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const WidgetConfig: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2 flex items-center gap-3">
          <Settings className="text-electric-blue" size={32} />
          Widget Configuration
        </h1>
        <p className="text-slate-400 text-lg">
          Customize the appearance and behavior of your chat widget.
        </p>
      </div>

      <div className="glass-panel p-8 rounded-2xl space-y-6">
          <div className="flex items-center justify-center p-12 border border-dashed border-white/10 rounded-xl bg-white/[0.02]">
             <div className="text-center">
                <MessageSquare className="w-12 h-12 text-slate-500 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-slate-300">Coming Soon</h3>
                <p className="text-slate-500 max-w-md mt-2">
                   Advanced widget customization settings (color, position, welcome message) will be available here in the next update.
                </p>
             </div>
          </div>
          
          <div className="flex justify-end">
             <Button disabled>Save Changes</Button>
          </div>
      </div>
    </motion.div>
  );
};

export default WidgetConfig;
