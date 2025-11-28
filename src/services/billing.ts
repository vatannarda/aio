import appApi from '@/services/api';
import { publicPlans } from '@/lib/plans';
import { BillingCheckoutPayload, BillingCheckoutResponse, BillingPlan } from '@/types';

const fallbackPlans: BillingPlan[] = [
  ...publicPlans.map((plan) => ({
    id: plan.id,
    name: plan.name,
    description: plan.description,
    price: plan.priceMonthly,
    currency: 'USD',
    interval: 'monthly',
    type: 'plan' as const,
    messageLimit: plan.messageLimit,
    features: plan.features,
    highlight: plan.highlight,
  })),
  {
    id: 'credit_pack_5k',
    name: '5.000 Mesaj Kredisi',
    description: 'Ani kampanyalar veya sezonluk yoğunluk için ideal ek paket.',
    price: 79,
    currency: 'USD',
    interval: 'one_time',
    type: 'credit_pack',
    creditAmount: 5000,
  },
  {
    id: 'credit_pack_25k',
    name: '25.000 Mesaj Kredisi',
    description: 'Büyüyen ekipler için indirimli toplu kredi.',
    price: 299,
    currency: 'USD',
    interval: 'one_time',
    type: 'credit_pack',
    creditAmount: 25000,
  },
];

export async function getBillingPlans(): Promise<BillingPlan[]> {
  if (!appApi.defaults.baseURL) {
    return fallbackPlans;
  }

  const response = await appApi.get<BillingPlan[]>('/api/billing/plans');
  return response.data;
}

export async function createCheckoutSession(
  payload: BillingCheckoutPayload
): Promise<BillingCheckoutResponse> {
  if (!payload.planId && !payload.creditPackId) {
    throw new Error('Plan veya kredi paketi seçimi yapılmalıdır.');
  }

  if (!appApi.defaults.baseURL) {
    const params = new URLSearchParams();
    if (payload.planId) params.set('planId', payload.planId);
    if (payload.creditPackId) params.set('creditPackId', payload.creditPackId);
    return {
      checkoutUrl: `/billing/checkout?${params.toString()}`,
    };
  }

  const response = await appApi.post<BillingCheckoutResponse>('/api/billing/checkout', payload);
  return response.data;
}
