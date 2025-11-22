import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from '@/layouts/MainLayout';
import Landing from '@/pages/Landing';
import AgentEditor from '@/pages/AgentEditor';

const Placeholder = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500">
    <h2 className="text-2xl font-bold text-slate-300 mb-2">{title}</h2>
    <p>This module is currently under development.</p>
  </div>
);

const App: React.FC = () => {
  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#0B0F19',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Landing />} />
          <Route path="agent-editor" element={<AgentEditor />} />
          <Route path="inbox" element={<Placeholder title="Inbox" />} />
          <Route path="settings" element={<Placeholder title="Settings" />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
