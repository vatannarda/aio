import axios, { AxiosInstance, AxiosError } from 'axios';
import { AgentConfig, ChatResponse } from '../types';

const getBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
  if (!envUrl) {
    console.error("VITE_N8N_WEBHOOK_URL is not defined in environment variables.");
    return '';
  }
  return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
};

const api: AxiosInstance = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    let message = 'An unexpected error occurred.';
    if (error.message === 'Network Error') {
      message = 'Connection failed. Please check your internet or server status.';
    } else if (error.response) {
      message = `Server Error: ${error.response.statusText} (${error.response.status})`;
    } else if (error.code === 'ECONNABORTED') {
      message = 'Request timed out.';
    }
    
    console.error('API Error:', error);
    return Promise.reject(new Error(message));
  }
);

export const agentService = {
  updateAgent: async (config: AgentConfig) => {
    const response = await api.post('/update-agent', config);
    return response.data;
  },
};

export const chatService = {
  sendMessage: async (message: string): Promise<string> => {
    const response = await api.post<ChatResponse>('/chat', { message });
    // Handle case where response might be just text or different structure
    if (typeof response.data === 'string') return response.data;
    return response.data.reply || "No response content";
  },
};

export default api;
