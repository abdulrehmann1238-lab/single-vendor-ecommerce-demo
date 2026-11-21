import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useCommerceStore } from '../../store/useCommerceStore';
import { 
  LayoutDashboard, 
  Package, 
  Boxes, 
  ShoppingCart, 
  Tag, 
  Users, 
  BarChart3, 
  FileText, 
  ShieldCheck, 
  Settings, 
  Store, 
  Bell, 
  Search, 
  Check, 
  RotateCcw,
  Sparkles,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    staff, 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead,
    resetAllDemoData,
    products,
    orders,
    inventory
  } = useCommerceStore();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState('Last 30 Days');

  const adminNotifications = notifications.filter(
    (n) => !n.read && (n.targetAudience === 'admin' || n.targetAudience === 'both')
  );

  const lowStockCount = inventory.filter((i) => i.status === 'low_stock' || i.status === 'out_of_stock').length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending' || o.status === 'processing').length;

  const navItems = [
    { path: '/admin', label: 'Executive Overview', icon: LayoutDashboard },
    { path: '/admin/products', label: 'Catalog & Products', icon: Package, badge: products.length },
    { path: '/admin/inventory', label: 'Inventory & Warehouses', icon: Boxes, badge: lowStockCount > 0 ? `${lowStockCount} alerts` : undefined, badgeColor: 'bg-warning/20 text-warning' },
    { path: '/admin/orders', label: 'Order Fulfillment', icon: ShoppingCart, badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} open` : undefined, badgeColor: 'bg-forest/20 text-forest' },
    { path: '/admin/promotions', label: 'Pricing & Promotions', icon: Tag },
    { path: '/admin/customers', label: 'Client Accounts', icon: Users },
    { path: '/admin/analytics', label: 'Commercial Analytics', icon: BarChart3 },
    { path: '/admin/reports', label: 'Operational Reports', icon: FileText },
    { path: '/admin/team', label: 'Staff & Permissions', icon: ShieldCheck },
    { path: '/admin/settings', label: 'Store Infrastructure', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F4F3EE] flex text-charcoal font-sans antialiased">
      
      {/* Desktop Admin Left Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-delicate shrink-0 sticky top-0 h-screen justify-between z-20">
        <div>
          {/* Admin Wordmark & Storefront Jump */}
          <div className="p-5 border-b border-delicate flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-charcoal text-white rounded font-serif text-sm font-bold flex items-center justify-center">
                A
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-base font-bold text-charcoal leading-tight">
                  ATELIER OPS
                </span>
                <span className="text-[9px] font-mono uppercase tracking-widest text-muted">
                  Single-Vendor OS
                </span>
              </div>
            </Link>

            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System Operational" />
          </div>

          {/* Quick link to live customer storefront */}
          <div className="p-3 bg-stone/40 border-b border-delicate">
            <Link
              to="/"
              className="flex items-center justify-between p-2 rounded-button bg-white border border-delicate text-xs font-medium text-forest hover:bg-forest hover:text-white transition-colors shadow-xs"
            >
              <div className="flex items-center gap-2">
                <Store className="w-3.5 h-3.5" />
                <span>Visit Customer Store</span>
              </div>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </Link>
          </div>

          {/* Nav List */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = 
                item.path === '/admin'
                  ? location.pathname === '/admin'
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3 py-2 rounded-button text-xs transition-all ${
                    isActive
                      ? 'bg-forest text-white font-semibold shadow-xs'
                      : 'text-charcoal hover:bg-stone/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0 ${
                      item.badgeColor || (isActive ? 'bg-white/20 text-white' : 'bg-stone text-muted')
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Staff Profile in Footer */}
        <div className="p-4 border-t border-delicate bg-ivory/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-charcoal text-white font-bold text-xs flex items-center justify-center shrink-0">
              ET
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-charcoal truncate">Elias Thorne</p>
              <p className="text-[10px] font-mono text-muted truncate">Administrator (HQ)</p>
            </div>
          </div>

          <button
            onClick={() => {
              if (window.confirm('Reset all catalog, inventory, and order states?')) {
                resetAllDemoData();
              }
            }}
            className="p-1.5 text-muted hover:text-charcoal rounded hover:bg-stone transition-colors"
            title="Reset All Demo Data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Admin Header Top Bar */}
        <header className="bg-white border-b border-delicate sticky top-0 z-30 px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-charcoal hover:bg-stone rounded"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Admin Global Search */}
            <div className="relative hidden sm:block w-72">
              <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search orders, SKU, stock, customers..."
                className="w-full pl-8 pr-3 py-1.5 bg-stone/40 border border-delicate rounded-button text-xs outline-none focus:border-forest transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Date range filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-stone/50 border border-delicate rounded-button text-xs text-charcoal px-2.5 py-1.5 outline-none cursor-pointer"
            >
              <option>Today</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Year to Date</option>
            </select>

            {/* Admin Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 text-charcoal hover:bg-stone rounded-full transition-colors"
                title="Operational Notifications"
              >
                <Bell className="w-4 h-4" />
                {adminNotifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-forest animate-pulse" />
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-delicate rounded-card shadow-dropdown p-4 z-50 animate-fade-in text-charcoal">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-delicate">
                    <span className="text-xs font-mono uppercase tracking-wider text-muted font-bold">
                      System Notifications
                    </span>
                    {adminNotifications.length > 0 && (
                      <button
                        onClick={() => markAllNotificationsRead('admin')}
                        className="text-[11px] text-forest hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {adminNotifications.length === 0 ? (
                      <p className="text-xs text-muted text-center py-4">
                        All operational alerts acknowledged.
                      </p>
                    ) : (
                      adminNotifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id);
                            if (n.actionUrl) navigate(n.actionUrl);
                            setNotifOpen(false);
                          }}
                          className="p-2.5 rounded-md hover:bg-stone/50 cursor-pointer transition-colors border-l-2 border-forest"
                        >
                          <p className="text-xs font-bold text-charcoal">{n.title}</p>
                          <p className="text-[11px] text-muted mt-0.5">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Return to Customer Storefront Pill */}
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-forest/10 hover:bg-forest/20 text-forest rounded-button text-xs font-semibold transition-colors"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Customer Storefront</span>
            </Link>
          </div>
        </header>

        {/* Child Admin Route Content */}
        <main className="p-4 sm:p-8 flex-1 max-w-7xl w-full mx-auto space-y-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Admin Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-charcoal/50 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-elevated p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-delicate">
                <span className="font-serif text-lg font-bold">Admin Navigation</span>
                <button onClick={() => setMobileSidebarOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileSidebarOpen(false)}
                    className="flex items-center justify-between p-2 rounded-button text-xs font-medium text-charcoal hover:bg-stone"
                  >
                    <span>{item.label}</span>
                    {item.badge && <span className="text-[10px] font-mono text-muted">{item.badge}</span>}
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-delicate">
              <Link
                to="/"
                onClick={() => setMobileSidebarOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2 bg-forest text-white rounded text-xs font-semibold"
              >
                <Store className="w-4 h-4" />
                <span>Return to Storefront</span>
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
