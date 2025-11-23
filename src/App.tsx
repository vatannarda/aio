import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AdminLayout from '@/components/layout/AdminLayout';
import AdminDashboard from '@/pages/AdminDashboard';
import AgentEditor from '@/pages/AgentEditor';
import WidgetConfig from '@/pages/WidgetConfig';
import Landing from '@/pages/Landing';

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
        {/* Public Landing */}
        <Route path="/" element={<Landing />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="agent-editor" element={<AgentEditor />} />
          <Route path="widget-config" element={<WidgetConfig />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
