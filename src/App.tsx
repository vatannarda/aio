import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Inbox } from './pages/Inbox'
import { AgentEditor } from './pages/AgentEditor'
import { WidgetConfig } from './pages/WidgetConfig'

function App() {
  return (
    <BrowserRouter basename="/admin">
      <Routes>
        <Route path="/" element={<Navigate to="/inbox" replace />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/agent-editor" element={<AgentEditor />} />
        <Route path="/widget-config" element={<WidgetConfig />} />
        <Route path="*" element={<Navigate to="/inbox" replace />} />
      </Routes>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#e2e8f0',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
            borderRadius: '12px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: 'white',
            },
          },
        }}
      />
    </BrowserRouter>
  )
}

export default App
