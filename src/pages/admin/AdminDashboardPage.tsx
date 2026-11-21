import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCommerceStore } from '../../store/useCommerceStore';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  Package, 
  Boxes, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight, 
  ArrowRight,
  Clock,
  CheckCircle2,
  Filter
} from 'lucide-react';

const REVENUE_DATA_7D = [
  { date: 'Feb 24', revenue: 4200, orders: 14, aov: 300 },
  { date: 'Feb 25', revenue: 5800, orders: 19, aov: 305 },
  { date: 'Feb 26', revenue: 6400, orders: 21, aov: 304 },
  { date: 'Feb 27', revenue: 7100, orders: 23, aov: 308 },
  { date: 'Feb 28', revenue: 8900, orders: 28, aov: 317 },
  { date: 'Mar 01', revenue: 7600, orders: 24, aov: 316 },
  { date: 'Mar 02', revenue: 9400, orders: 30, aov: 313 },
];

const REVENUE_DATA_30D = [
  { date: 'Week 1', revenue: 32400, orders: 104, aov: 311 },
  { date: 'Week 2', revenue: 38200, orders: 122, aov: 313 },
  { date: 'Week 3', revenue: 41900, orders: 135, aov: 310 },
  { date: 'Week 4', revenue: 49800, orders: 161, aov: 309 },
];

const CATEGORY_SHARE = [
  { name: 'Electronics & Audio', value: 42, color: '#52634F' },
  { name: 'Home & Living', value: 26, color: '#8F947E' },
  { name: 'Apparel & Leather', value: 16, color: '#B49A72' },
  { name: 'Beauty & Skincare', value: 8, color: '#CEC4B4' },
  { name: 'Active & Outdoors', value: 5, color: '#3F423E' },
  { name: 'Objects & Carry', value: 3, color: '#A06E49' },
];

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { orders, products, inventory, customers } = useCommerceStore();
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');

  // Compute live KPI figures
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0) + 142000;
  const totalOrdersCount = orders.length + 420;
  const averageOrderValue = totalRevenue / totalOrdersCount;
  const lowStockItems = inventory.filter((i) => i.status === 'low_stock' || i.status === 'out_of_stock');
  const recentOrders = orders.slice(0, 5);

  const chartData = timeRange === '7d' ? REVENUE_DATA_7D : REVENUE_DATA_30D;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-forest font-semibold">
            Single-Vendor Commercial Engine
          </span>
          <h1 className="font-serif text-3xl text-charcoal font-normal mt-0.5">
            Operations & Revenue Overview
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/products"
            className="px-4 py-2 bg-white border border-delicate hover:bg-stone text-charcoal rounded-button text-xs font-medium transition-colors shadow-xs"
          >
            Manage Catalog
          </Link>
          <Link
            to="/admin/orders"
            className="px-4 py-2 bg-forest hover:bg-forest-dark text-white rounded-button text-xs font-semibold transition-colors shadow-subtle"
          >
            Fulfill Orders
          </Link>
        </div>
      </div>

      {/* ================= 6 KPI CARDS ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Revenue */}
        <div className="p-4 bg-white border border-delicate rounded-card shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-muted">
            <span className="text-[11px] font-mono uppercase tracking-wider">Gross Revenue</span>
            <DollarSign className="w-4 h-4 text-forest" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-charcoal">
            ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-forest font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.2%</span>
            <span className="text-muted font-normal ml-0.5">vs last mo.</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-4 bg-white border border-delicate rounded-card shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-muted">
            <span className="text-[11px] font-mono uppercase tracking-wider">Total Orders</span>
            <ShoppingCart className="w-4 h-4 text-forest" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-charcoal">
            {totalOrdersCount}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-forest font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+8.7%</span>
            <span className="text-muted font-normal ml-0.5">vs last mo.</span>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="p-4 bg-white border border-delicate rounded-card shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-muted">
            <span className="text-[11px] font-mono uppercase tracking-wider">Avg Order Value</span>
            <TrendingUp className="w-4 h-4 text-forest" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-charcoal">
            ${averageOrderValue.toFixed(2)}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-forest font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+5.1%</span>
            <span className="text-muted font-normal ml-0.5">vs last mo.</span>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="p-4 bg-white border border-delicate rounded-card shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-muted">
            <span className="text-[11px] font-mono uppercase tracking-wider">Conversion</span>
            <CheckCircle2 className="w-4 h-4 text-forest" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-charcoal">
            3.42%
          </div>
          <div className="flex items-center gap-1 text-[11px] text-forest font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+0.4%</span>
            <span className="text-muted font-normal ml-0.5">industry top 5%</span>
          </div>
        </div>

        {/* Customers */}
        <div className="p-4 bg-white border border-delicate rounded-card shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-muted">
            <span className="text-[11px] font-mono uppercase tracking-wider">Patrons / Clients</span>
            <Users className="w-4 h-4 text-forest" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-charcoal">
            {customers.length + 1220}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-forest font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+19.3%</span>
            <span className="text-muted font-normal ml-0.5">repeat buyers</span>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="p-4 bg-white border border-delicate rounded-card shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-muted">
            <span className="text-[11px] font-mono uppercase tracking-wider">Low Stock SKUs</span>
            <Boxes className="w-4 h-4 text-warning" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-charcoal">
            {lowStockItems.length}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-warning font-medium">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Reorder advised</span>
          </div>
        </div>
      </div>

      {/* ================= REVENUE & ORDERS CHART ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Revenue Trend Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-delicate rounded-card shadow-subtle p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-delicate">
            <div>
              <h2 className="font-serif text-lg font-bold text-charcoal">
                Revenue Trajectory & Sales Volume
              </h2>
              <p className="text-xs text-muted">Direct fulfillment billing across multi-regional currencies</p>
            </div>

            <div className="flex items-center gap-1 bg-stone/50 p-1 rounded-button text-xs font-mono">
              <button
                onClick={() => setTimeRange('7d')}
                className={`px-3 py-1 rounded transition-colors ${
                  timeRange === '7d' ? 'bg-white shadow-xs font-bold text-charcoal' : 'text-muted hover:text-charcoal'
                }`}
              >
                Last 7 Days
              </button>
              <button
                onClick={() => setTimeRange('30d')}
                className={`px-3 py-1 rounded transition-colors ${
                  timeRange === '30d' ? 'bg-white shadow-xs font-bold text-charcoal' : 'text-muted hover:text-charcoal'
                }`}
              >
                Last 30 Days
              </button>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#52634F" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#52634F" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E6DF" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#777970' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#777970' }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E8E6DF',
                    borderRadius: '8px',
                    fontSize: '12px',
                    boxShadow: '0 8px 30px rgba(36,40,32,0.08)',
                  }}
                  formatter={(val: any) => [`$${val.toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#52634F" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share Donut (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-delicate rounded-card shadow-subtle p-6 space-y-6">
          <div className="pb-4 border-b border-delicate">
            <h2 className="font-serif text-lg font-bold text-charcoal">
              Category Distribution
            </h2>
            <p className="text-xs text-muted">Contribution to gross merchandise volume</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_SHARE}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {CATEGORY_SHARE.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs">
            {CATEGORY_SHARE.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-muted">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="text-charcoal font-medium">{c.name}</span>
                </div>
                <span className="font-mono">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ================= RECENT ORDERS & LOW STOCK WIDGETS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Recent Orders Table (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-delicate rounded-card shadow-subtle p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-delicate">
            <div>
              <h2 className="font-serif text-lg font-bold text-charcoal">
                Recent Order Queue
              </h2>
              <p className="text-xs text-muted">Awaiting fulfillment or carrier handover</p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-semibold text-forest hover:underline flex items-center gap-1"
            >
              <span>View All ({orders.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-delicate text-muted font-mono uppercase text-[10px]">
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Client</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Items</th>
                  <th className="py-2.5 px-3">Total</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="border-b border-delicate/40 hover:bg-stone/20 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-charcoal">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-charcoal">{ord.customerName}</p>
                      <p className="text-[10px] text-muted truncate max-w-[140px]">{ord.customerEmail}</p>
                    </td>
                    <td className="py-3 px-3 text-muted font-mono">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 font-mono">
                      {ord.items.length} item(s)
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-charcoal">
                      ${ord.total.toFixed(2)}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        ord.status === 'delivered'
                          ? 'bg-forest/15 text-forest'
                          : ord.status === 'shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-champagne/20 text-champagne-dark'
                      }`}>
                        {ord.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        to={`/admin/orders/${ord.id}`}
                        className="text-xs font-semibold text-forest hover:underline"
                      >
                        Manage →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-delicate rounded-card shadow-subtle p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-delicate">
            <div>
              <h2 className="font-serif text-lg font-bold text-charcoal">
                Low Stock Thresholds
              </h2>
              <p className="text-xs text-muted">Stocked below safe reorder safety buffer</p>
            </div>
            <Link
              to="/admin/inventory"
              className="text-xs font-semibold text-forest hover:underline"
            >
              Reconcile
            </Link>
          </div>

          <div className="space-y-3">
            {lowStockItems.length === 0 ? (
              <p className="text-xs text-muted text-center py-6">All catalog SKUs adequately stocked.</p>
            ) : (
              lowStockItems.map((inv) => (
                <div key={inv.productId} className="p-3 bg-stone/30 border border-delicate rounded-md flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-charcoal truncate max-w-[160px]">{inv.productName}</p>
                    <p className="text-[10px] text-muted font-mono">SKU: {inv.sku}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-warning text-sm">
                      {inv.totalAvailable} left
                    </span>
                    <span className="block text-[10px] text-muted">Threshold: {inv.reorderThreshold}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
