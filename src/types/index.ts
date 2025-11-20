export interface ChatLog {
  id: string;
  platform: 'web' | 'whatsapp';
  userId: string;
  lastMessage: string;
  aiResponse: string;
  timestamp: string;
}

export interface AgentConfig {
  name: string;
  roleType: 'sales' | 'support' | 'general';
  model: 'gemini-pro' | 'gemini-flash' | 'gpt-4o';
  systemPrompt: string;
  temperature: number;
}

export interface WidgetConfig {
  botName: string;
  primaryColor: string;
  welcomeMessage: string;
  logoUrl: string;
}

export interface Stats {
  totalConversations: number;
  activeUsers: number;
  tokenConsumption: number;
}
