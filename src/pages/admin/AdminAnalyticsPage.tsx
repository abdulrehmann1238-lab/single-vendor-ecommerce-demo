import React, { useState } from 'react';
import { useCommerceStore } from '../../store/useCommerceStore';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  ArrowUpRight, 
  Download, 
  CheckCircle2, 
  Filter 
} from 'lucide-react';

const FUNNEL_DATA = [
  { stage: '1. Product Views', count: 48200, rate: '100%' },
  { stage: '2. Add to Shopping Bag', count: 9640, rate: '20.0%' },
  { stage: '3. Checkout Initiated', count: 3370, rate: '7.0%' },
  { stage: '4. Orders Placed', count: 1648, rate: '3.42%' },
];

const REPEAT_DATA = [
  { month: 'Sep', newClients: 120, repeatClients: 80 },
  { month: 'Oct', newClients: 145, repeatClients: 110 },
  { month: 'Nov', newClients: 190, repeatClients: 155 },
  { month: 'Dec', newClients: 240, repeatClients: 210 },
  { month: 'Jan', newClients: 210, repeatClients: 240 },
  { month: 'Feb', newClients: 260, repeatClients: 290 },
];

export const AdminAnalyticsPage: React.FC = () => {
  const { orders, addToast } = useCommerceStore();
  const [period, setPeriod] = useState('30d');

  const handleExport = () => {
    addToast({
      type: 'success',
      title: 'Commercial Report Exported',
      description: 'Analytics summary downloaded as CSV.',
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-forest font-semibold">
            Enterprise Performance Intelligence
          </span>
          <h1 className="font-serif text-3xl text-charcoal font-normal mt-0.5">
            Commercial Analytics & Conversion
          </h1>
          <p className="text-xs text-muted">
            Conversion funnel analysis, client lifetime cohorts, and category performance breakdown.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-delicate hover:bg-stone text-charcoal rounded-button text-xs font-medium transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-muted" />
          <span>Export Analytics CSV</span>
        </button>
      </div>

      {/* ================= CONVERSION FUNNEL ================= */}
      <div className="bg-white border border-delicate rounded-card shadow-subtle p-6 space-y-6">
        <div>
          <h2 className="font-serif text-lg font-bold text-charcoal">
            E-Commerce Conversion Funnel
          </h2>
          <p className="text-xs text-muted">
            Visitor journey progression from catalog discovery to finalized order placement.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {FUNNEL_DATA.map((step, idx) => (
            <div key={idx} className="p-4 bg-stone/30 border border-delicate rounded-card space-y-1 relative">
              <span className="text-[10px] font-mono uppercase text-muted block">{step.stage}</span>
              <div className="text-2xl font-bold font-mono text-charcoal">
                {step.count.toLocaleString()}
              </div>
              <div className="text-xs font-semibold text-forest font-mono">
                {step.rate} conversion
              </div>
              <div className="w-full h-1.5 bg-delicate rounded-full overflow-hidden mt-2">
                <div 
                  className="h-full bg-forest" 
                  style={{ width: idx === 0 ? '100%' : idx === 1 ? '50%' : idx === 2 ? '25%' : '12%' }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= COHORTS / REPEAT PATRONS ================= */}
      <div className="bg-white border border-delicate rounded-card shadow-subtle p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-delicate">
          <div>
            <h2 className="font-serif text-lg font-bold text-charcoal">
              New vs. Returning Patron Cohort Growth
            </h2>
            <p className="text-xs text-muted">Repeat purchase rate is currently 42.8% over a 90-day window</p>
          </div>
          <span className="text-xs text-forest font-mono font-bold">+18.4% YoY</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={REPEAT_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E6DF" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#777970' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#777970' }} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="newClients" name="New Patrons" fill="#A8AA91" radius={[4, 4, 0, 0]} />
              <Bar dataKey="repeatClients" name="Returning Patrons" fill="#52634F" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
