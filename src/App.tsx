import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AdminLayout from '@/components/layout/AdminLayout';
import CustomerLayout from '@/components/layout/CustomerLayout';
import AdminDashboard from '@/pages/AdminDashboard';
import AgentEditor from '@/pages/AgentEditor';
import WidgetConfig from '@/pages/WidgetConfig';
import Landing from '@/pages/Landing';
import CustomerLanding from '@/pages/CustomerLanding';
import CustomerChat from '@/pages/CustomerChat';
import PlanSelection from '@/pages/PlanSelection';
import TenantUsage from '@/pages/TenantUsage';
import TenantSignup from '@/pages/TenantSignup';
import Billing from '@/pages/Billing';
import BillingResultPage from '@/pages/BillingResultPage';
import { TenantProvider } from '@/context/TenantContext';

function App() {
  return (
    <Router>
      <TenantProvider>
        <Toaster position="top-right" toastOptions={{
           style: {
              background: '#1e293b',
              color: '#e2e8f0',
              border: '1px solid rgba(255,255,255,0.1)',
           }
        }} />
        <Routes>
          {/* Public Landing */}
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<TenantSignup />} />

          {/* Aliases for Vercel Deployment Test */}
          <Route path="/customer" element={<Navigate to="/musteri" replace />} />
          <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
          <Route path="/chat" element={<Navigate to="/musteri/chat" replace />} />
          <Route path="/widget" element={<Navigate to="/admin/widget-config" replace />} />

          {/* Customer Experience */}
          <Route path="/musteri" element={<CustomerLayout />}>
            <Route index element={<CustomerLanding />} />
            <Route path="chat" element={<CustomerChat />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="agent-editor" element={<AgentEditor />} />
            <Route path="widget-config" element={<WidgetConfig />} />
            <Route path="plans" element={<PlanSelection />} />
            <Route path="usage" element={<TenantUsage />} />
          </Route>

          <Route path="/billing" element={<AdminLayout />}>
            <Route index element={<Billing />} />
            <Route path="result" element={<BillingResultPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </TenantProvider>
    </Router>
  );
}

export default App;
