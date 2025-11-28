import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Download } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useTenant } from '@/context/TenantContext';
import { getBillingDashboardData, BillingDashboardData } from '@/services/billing';
import BillingSummaryCard from '@/components/billing/BillingSummaryCard';
import BillingInsightAlert from '@/components/billing/BillingInsightAlert';
import BillingChart from '@/components/billing/BillingChart';
import BillingTopServices from '@/components/billing/BillingTopServices';
import BillingTopProjects from '@/components/billing/BillingTopProjects';
import BillingInsightsCard from '@/components/billing/BillingInsightsCard';
import BillingBudgetCard from '@/components/billing/BillingBudgetCard';

const Billing: React.FC = () => {
  const navigate = useNavigate();
  const { tenant } = useTenant();
  const [data, setData] = useState<BillingDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardData = await getBillingDashboardData();
        setData(dashboardData);
      } catch (error) {
        console.error('Failed to fetch billing data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-white/5 rounded" />
        <div className="h-48 w-full bg-white/5 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <div className="h-64 bg-white/5 rounded-xl" />
           <div className="h-64 bg-white/5 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const infoInsight = data.insights.find(i => i.type === 'info');
  const suggestionInsights = data.insights.filter(i => i.type !== 'info');

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          {tenant?.name ? `${tenant.name} Billing` : 'Billing Overview'}
        </h1>
        <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => {}}>
                <Download size={16} className="mr-2" />
                Export
            </Button>
            <Button size="sm" onClick={() => navigate('/admin/plans')}>
                <CreditCard size={16} className="mr-2" />
                Manage Plan
            </Button>
        </div>
      </div>

      <BillingSummaryCard 
        totalCost={data.totalCost}
        forecastCost={data.forecastCost}
        trendPercentage={data.trendPercentage}
      />

      {infoInsight && (
        <BillingInsightAlert 
            message={infoInsight.message}
            onLearnMore={() => {}}
            onCreateAlert={() => {}}
        />
      )}

      {/* Main Cost Chart Section */}
      <div className="rounded-xl border border-white/10 bg-[#1e293b]/50 p-6 shadow-sm">
         <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Daily Cost Trend</h3>
            <div className="flex items-center gap-2 text-sm text-slate-400">
                <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-sm" />
                    Total Cost
                </span>
            </div>
         </div>
         <BillingChart data={data.dailyCosts} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BillingTopProjects projects={data.topProjects} />
          <BillingTopServices services={data.topServices} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BillingInsightsCard insights={suggestionInsights} />
          <BillingBudgetCard 
            currentCost={data.totalCost}
            forecastCost={data.forecastCost}
            budgetAlert={data.budgetAlert}
          />
      </div>
    </div>
  );
};

export default Billing;
