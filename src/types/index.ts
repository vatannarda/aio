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

export type PlanTier = 'starter' | 'pro' | 'enterprise';

export interface TenantInfo {
  id: string;
  name: string;
  slug: string;
  plan_type: PlanTier;
  status: 'active' | 'trialing' | 'suspended';
  created_at?: string;
  updated_at?: string;
}

export interface PlanProduct {
  id: PlanTier;
  name: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  description: string;
  features: string[];
  highlight?: boolean;
  limitSummary: string;
}

export interface TenantProfile {
  tenant: TenantInfo;
  plan: PlanProduct;
  quotas: {
    monthlyMessages: number;
    members: number;
    storageGb: number;
  };
  branding?: {
    accentColor?: string;
    logoUrl?: string;
  };
}

export interface TenantUsage {
  messageCount: number;
  messageLimit: number;
  agents: number;
  agentLimit: number;
  storageUsedGb: number;
  storageLimitGb: number;
  billingCycle: string;
  renewsAt: string;
  creditsRemaining: number;
  lastSyncAt?: string;
}

export interface SignupPayload {
  businessName: string;
  contactName: string;
  email: string;
  phone?: string;
  plan: PlanTier;
  subdomain: string;
}

export interface SignupResponse {
  success: boolean;
  tenantSlug: string;
  message?: string;
}

export interface CheckoutPayload {
  tenantId: string;
  plan: PlanTier;
  billingCycle?: 'monthly' | 'yearly';
}

export interface CheckoutResponse {
  checkoutUrl: string;
}
