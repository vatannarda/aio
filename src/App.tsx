import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AdminLayout from '@/components/layout/AdminLayout';
import CustomerLayout from '@/components/layout/CustomerLayout';
import AdminDashboard from '@/pages/AdminDashboard';
import AgentEditor from '@/pages/AgentEditor';
import WidgetConfig from '@/pages/WidgetConfig';
import CustomerLanding from '@/pages/CustomerLanding';
import CustomerChat from '@/pages/CustomerChat';

function App() {
  return (
    <Router>
      <Toaster position="top-right" toastOptions={{
         style: {
            background: '#1e293b',
            color: '#e2e8f0',
            border: '1px solid rgba(255,255,255,0.1)',
         }
      }} />
      <Routes>
        {/* Admin Routes */}
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="agent-editor" element={<AgentEditor />} />
          <Route path="widget-config" element={<WidgetConfig />} />
        </Route>

        {/* Customer Routes */}
        <Route path="/musteri" element={<CustomerLayout />}>
           <Route index element={<CustomerLanding />} />
           <Route path="chat" element={<CustomerChat />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
