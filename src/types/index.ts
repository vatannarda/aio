export interface AgentConfig {
  name: string;
  role_type: 'sales' | 'support' | 'general';
  model: 'gemini-pro' | 'gemini-flash';
  system_prompt: string;
  temperature: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatPayload {
  message: string;
}

export interface ChatResponse {
  reply: string;
}

export interface ChatLog {
  id: string;
  platform: string;
  userId: string;
  messagePreview: string;
  responsePreview: string;
  timestamp: string;
}

export interface DashboardStats {
  totalConversations: number;
  activeUsers: number;
  avgResponseTime: number;
}
