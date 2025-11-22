import axios, { AxiosInstance, AxiosError } from 'axios';
import toast from 'react-hot-toast';

const getBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
  if (!envUrl) {
    console.error("VITE_N8N_WEBHOOK_URL is not defined in environment variables.");
    return '';
  }
  // Remove trailing slash if present
  return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
};

const api: AxiosInstance = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    let message = 'An unexpected error occurred.';
    if (error.message === 'Network Error') {
      message = 'Network Error: Please check your internet connection or server status.';
    } else if (error.response) {
      message = `Server Error: ${error.response.statusText} (${error.response.status})`;
    } else if (error.request) {
      message = 'No response received from the server.';
    }
    
    // We don't toast here to allow custom handling, but we could. 
    // For now, we just return the rejected promise with a clean error message.
    console.error('API Error:', error);
    return Promise.reject(new Error(message));
  }
);

export interface AgentConfig {
  name: string;
  role_type: 'sales' | 'support' | 'general';
  model: string;
  system_prompt: string;
  temperature?: number;
}

export interface ChatMessage {
  message: string;
}

export interface ChatResponse {
  reply: string;
}

export const agentService = {
  updateAgent: async (config: AgentConfig) => {
    try {
      const response = await api.post('/update-agent', config);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
};

export const chatService = {
  sendMessage: async (message: string): Promise<string> => {
    try {
      // The prompt implies the chat webhook might be different or relative.
      // "API: POST https://n8n.aio.web.tr/webhook/chat"
      // If base is https://n8n.aio.web.tr/webhook, then /chat is correct.
      const response = await api.post<ChatResponse>('/chat', { message });
      return response.data.reply;
    } catch (error: any) {
      throw error;
    }
  },
};

export default api;
