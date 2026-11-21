import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCommerceStore } from '../../store/useCommerceStore';
import { Order, OrderStatus } from '../../types';
import { 
  Package, 
  MapPin, 
  RotateCcw, 
  User, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  Truck, 
  Printer, 
  FileText, 
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  LayoutDashboard
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const { id: orderIdParam } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { 
    currentCustomer, 
    orders, 
    wishlist, 
    products, 
    addToast 
  } = useCommerceStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'addresses' | 'returns' | 'profile'>(
    orderIdParam ? 'orders' : 'overview'
  );
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(orderIdParam || null);
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [returnItemName, setReturnItemName] = useState('');
  const [returnReason, setReturnReason] = useState('Size/fit not as expected');
  const [returnNotes, setReturnNotes] = useState('');

  // Selected Order for detail view
  const activeOrder = orders.find((o) => o.id === selectedOrderId || o.orderNumber === selectedOrderId);

  // Filter orders
  const customerOrders = orders.filter((o) => {
    if (orderFilter === 'all') return true;
    return o.status === orderFilter;
  });

  const handlePrintInvoice = () => {
    window.print();
  };

  const handleCreateReturn = (e: React.FormEvent) => {
    e.preventDefault();
    setReturnModalOpen(false);
    addToast({
      type: 'success',
      title: 'Return Request Logged',
      description: `Return for ${returnItemName} submitted for authorization. Prepaid return label prepared.`,
    });
    setReturnNotes('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      
      {/* Top Customer Welcome Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-delicate gap-4 no-print">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-forest text-white font-serif text-2xl flex items-center justify-center font-bold shadow-subtle shrink-0">
            {currentCustomer.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl text-charcoal font-normal">
                {currentCustomer.name}
              </h1>
              {currentCustomer.status === 'vip' && (
                <span className="text-[10px] font-mono uppercase tracking-wider text-champagne bg-champagne/15 px-2 py-0.5 rounded">
                  VIP Patron
                </span>
              )}
            </div>
            <p className="text-xs text-muted mt-0.5 font-mono">
              Client Account #{currentCustomer.id} • {currentCustomer.email}
            </p>
          </div>
        </div>

        {/* Quick Admin Navigation Link */}
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 px-4 py-2 bg-stone hover:bg-delicate text-charcoal rounded-button text-xs font-medium transition-colors"
        >
          <LayoutDashboard className="w-3.5 h-3.5 text-forest" />
          <span>Switch to Staff View</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Account Sidebar Navigation */}
        <aside className="lg:col-span-3 space-y-1.5 no-print">
          {[
            { id: 'overview', label: 'Account Overview', icon: User },
            { id: 'orders', label: 'My Orders & Tracking', icon: Package, count: orders.length },
            { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
            { id: 'returns', label: 'Returns & Exchanges', icon: RotateCcw },
            { id: 'profile', label: 'Profile Preferences', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  if (tab.id !== 'orders') setSelectedOrderId(null);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-button text-xs font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-forest text-white shadow-xs font-semibold'
                    : 'text-charcoal hover:bg-stone/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
                {tab.count !== undefined && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-stone text-muted'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 border-t border-delicate">
            <Link
              to="/wishlist"
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-button text-xs font-medium text-charcoal hover:bg-stone/60"
            >
              <span>Saved Wishlist</span>
              <span className="text-[10px] font-mono text-muted">{wishlist.length}</span>
            </Link>
          </div>
        </aside>

        {/* Content Pane */}
        <main className="lg:col-span-9 bg-white border border-delicate rounded-card shadow-subtle p-6 sm:p-8 min-h-[500px]">
          
          {/* ================= 1. OVERVIEW ================= */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h2 className="font-serif text-2xl font-normal text-charcoal mb-1">
                  Welcome back, {currentCustomer.name.split(' ')[0]}
                </h2>
                <p className="text-xs text-muted">
                  Here is a synopsis of your recent atelier activity, active deliveries, and private catalog preferences.
                </p>
              </div>

              {/* KPI metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-stone/40 border border-delicate rounded-card">
                  <span className="text-[10px] font-mono uppercase text-muted">Lifetime Orders</span>
                  <div className="text-xl font-bold font-mono text-charcoal mt-1">
                    {orders.length}
                  </div>
                </div>

                <div className="p-4 bg-stone/40 border border-delicate rounded-card">
                  <span className="text-[10px] font-mono uppercase text-muted">Total Invested</span>
                  <div className="text-xl font-bold font-mono text-charcoal mt-1">
                    ${orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}
                  </div>
                </div>

                <div className="p-4 bg-stone/40 border border-delicate rounded-card">
                  <span className="text-[10px] font-mono uppercase text-muted">Saved in Wishlist</span>
                  <div className="text-xl font-bold font-mono text-charcoal mt-1">
                    {wishlist.length} items
                  </div>
                </div>

                <div className="p-4 bg-stone/40 border border-delicate rounded-card">
                  <span className="text-[10px] font-mono uppercase text-muted">Account Standing</span>
                  <div className="text-xl font-bold font-mono text-forest mt-1">
                    Active VIP
                  </div>
                </div>
              </div>

              {/* Most Recent Order Spotlight */}
              {orders.length > 0 && (
                <div className="p-5 bg-stone/20 border border-delicate rounded-card space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-delicate/60">
                    <span className="text-xs font-mono uppercase tracking-wider text-forest font-semibold">
                      Latest Order Activity
                    </span>
                    <button
                      onClick={() => {
                        setSelectedOrderId(orders[0].id);
                        setActiveTab('orders');
                      }}
                      className="text-xs text-forest hover:underline font-semibold"
                    >
                      View Tracking & Details →
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div>
                      <p className="font-bold text-charcoal text-sm">{orders[0].orderNumber}</p>
                      <p className="text-muted mt-0.5">
                        Placed {new Date(orders[0].createdAt).toLocaleDateString()} • {orders[0].items.length} items • ${orders[0].total.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold uppercase ${
                        orders[0].status === 'delivered'
                          ? 'bg-forest/15 text-forest'
                          : 'bg-champagne/20 text-champagne-dark'
                      }`}>
                        {orders[0].status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= 2. ORDERS & DETAIL ================= */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fade-in">
              {/* If single order is selected, show rich detail view */}
              {activeOrder ? (
                <div className="space-y-8">
                  {/* Back to all orders button */}
                  <div className="flex items-center justify-between pb-4 border-b border-delicate no-print">
                    <button
                      onClick={() => setSelectedOrderId(null)}
                      className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-charcoal transition-colors font-medium"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to All Orders</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handlePrintInvoice}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone hover:bg-delicate text-charcoal rounded text-xs font-medium transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Invoice</span>
                      </button>

                      <button
                        onClick={() => {
                          setReturnItemName(activeOrder.items[0]?.productName || 'Order Item');
                          setReturnModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-delicate hover:bg-stone text-charcoal rounded text-xs font-medium transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Request Return</span>
                      </button>
                    </div>
                  </div>

                  {/* Printable Invoice Header */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-muted uppercase tracking-wider">
                        Order #{activeOrder.orderNumber}
                      </span>
                      <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold uppercase ${
                        activeOrder.status === 'delivered' ? 'bg-forest/15 text-forest' : 'bg-champagne/20 text-champagne-dark'
                      }`}>
                        Status: {activeOrder.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <h2 className="font-serif text-2xl font-bold text-charcoal">
                      Fulfillment & Tracking Timeline
                    </h2>
                    <p className="text-xs text-muted">
                      Placed on {new Date(activeOrder.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' })} • Paid via {activeOrder.paymentMethod}
                    </p>
                  </div>

                  {/* Tracking Number Bar */}
                  {activeOrder.trackingNumber && (
                    <div className="p-4 bg-stone/40 border border-delicate rounded-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="font-mono uppercase text-muted text-[10px] block">Carrier Tracking</span>
                        <span className="font-mono font-bold text-charcoal text-sm">{activeOrder.trackingNumber}</span>
                        <span className="text-muted ml-2">({activeOrder.carrier || 'DHL Express'})</span>
                      </div>
                      <span className="text-forest font-semibold">
                        Estimated Arrival: {activeOrder.estimatedDelivery}
                      </span>
                    </div>
                  )}

                  {/* 6-Stage Tracking Timeline */}
                  <div className="py-4 space-y-4">
                    <h3 className="font-mono text-xs uppercase tracking-wider text-muted font-bold">
                      Progress Milestones
                    </h3>
                    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-delicate">
                      {activeOrder.timeline.map((evt, idx) => (
                        <div key={idx} className="relative flex items-start gap-4">
                          <div className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] ${
                            evt.completed ? 'bg-forest' : 'bg-stone text-muted'
                          }`}>
                            {evt.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                          </div>

                          <div className="space-y-0.5 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-charcoal">{evt.title}</span>
                              <span className="text-[11px] text-muted font-mono">{evt.timestamp}</span>
                            </div>
                            <p className="text-muted">{evt.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Items List */}
                  <div className="space-y-3 pt-6 border-t border-delicate">
                    <h3 className="font-mono text-xs uppercase tracking-wider text-muted font-bold">
                      Order Items ({activeOrder.items.length})
                    </h3>
                    <div className="space-y-2">
                      {activeOrder.items.map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3.5 bg-stone/20 rounded-md border border-delicate text-xs">
                          <div className="flex items-center gap-3">
                            <img src={it.image} alt="" className="w-12 h-12 object-cover rounded bg-stone" />
                            <div>
                              <p className="font-semibold text-charcoal">{it.productName}</p>
                              <p className="text-muted font-mono text-[11px]">SKU: {it.sku} • Qty {it.quantity}</p>
                            </div>
                          </div>
                          <div className="font-mono font-bold text-charcoal">
                            ${(it.price * it.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Address & Pricing Breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-delicate text-xs">
                    <div>
                      <span className="font-mono uppercase text-muted font-bold block mb-1">
                        Shipping Address
                      </span>
                      <p className="font-semibold text-charcoal">{activeOrder.shippingAddress.fullName}</p>
                      <p className="text-muted">{activeOrder.shippingAddress.addressLine1}</p>
                      <p className="text-muted">{activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.state} {activeOrder.shippingAddress.postalCode}</p>
                    </div>

                    <div className="space-y-1.5 font-mono">
                      <div className="flex justify-between text-muted">
                        <span>Subtotal</span>
                        <span>${activeOrder.subtotal.toFixed(2)}</span>
                      </div>
                      {activeOrder.discount > 0 && (
                        <div className="flex justify-between text-forest">
                          <span>Discount</span>
                          <span>-${activeOrder.discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-muted">
                        <span>Shipping ({activeOrder.shippingMethod})</span>
                        <span>${activeOrder.shippingCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-muted">
                        <span>Tax</span>
                        <span>${activeOrder.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-charcoal pt-2 border-t border-delicate">
                        <span>Total</span>
                        <span>${activeOrder.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Orders Table List */
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-delicate">
                    <div>
                      <h2 className="font-serif text-2xl font-normal text-charcoal">
                        My Orders ({orders.length})
                      </h2>
                      <p className="text-xs text-muted">Track past and current shipments.</p>
                    </div>

                    {/* Filter buttons */}
                    <div className="flex gap-1 overflow-x-auto text-xs">
                      {['all', 'processing', 'packed', 'shipped', 'delivered'].map((f) => (
                        <button
                          key={f}
                          onClick={() => setOrderFilter(f)}
                          className={`px-3 py-1.5 rounded-button capitalize transition-colors ${
                            orderFilter === f
                              ? 'bg-forest text-white font-semibold'
                              : 'bg-stone/50 hover:bg-stone text-charcoal'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  {customerOrders.length === 0 ? (
                    <p className="text-xs text-muted text-center py-10">No orders match filter.</p>
                  ) : (
                    <div className="space-y-3">
                      {customerOrders.map((ord) => (
                        <div
                          key={ord.id}
                          className="p-4 bg-stone/20 border border-delicate rounded-card hover:border-forest/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-charcoal font-mono">{ord.orderNumber}</span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                                ord.status === 'delivered' ? 'bg-forest/15 text-forest' : 'bg-champagne/20 text-champagne-dark'
                              }`}>
                                {ord.status.replace(/_/g, ' ')}
                              </span>
                            </div>
                            <p className="text-muted">
                              Placed {new Date(ord.createdAt).toLocaleDateString()} • {ord.items.length} item(s) • Total ${ord.total.toFixed(2)}
                            </p>
                          </div>

                          <button
                            onClick={() => setSelectedOrderId(ord.id)}
                            className="px-4 py-2 bg-white border border-delicate hover:bg-stone text-charcoal rounded-button text-xs font-semibold transition-colors self-start sm:self-auto shadow-xs"
                          >
                            View Order & Tracking →
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ================= 3. SAVED ADDRESSES ================= */}
          {activeTab === 'addresses' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="font-serif text-2xl font-normal text-charcoal mb-1">
                  Saved Shipping Addresses
                </h2>
                <p className="text-xs text-muted">Manage destination coordinates for express dispatch.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentCustomer.addresses.map((addr, idx) => (
                  <div key={idx} className="p-5 bg-stone/30 border border-delicate rounded-card space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-charcoal">{addr.fullName}</span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-mono text-forest bg-forest/10 px-2 py-0.5 rounded">
                          Default Shipping
                        </span>
                      )}
                    </div>
                    <p className="text-muted">{addr.addressLine1} {addr.addressLine2}</p>
                    <p className="text-muted">{addr.city}, {addr.state} {addr.postalCode}</p>
                    <p className="text-muted">{addr.country}</p>
                    <p className="text-muted font-mono pt-1">{addr.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 4. RETURNS & REFUNDS ================= */}
          {activeTab === 'returns' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="font-serif text-2xl font-normal text-charcoal mb-1">
                  Returns & Exchanges
                </h2>
                <p className="text-xs text-muted">
                  Every order includes 30 days of risk-free trial. Return any item in original condition for a full refund.
                </p>
              </div>

              <div className="p-5 bg-stone/20 border border-delicate rounded-card space-y-3 text-xs">
                <h3 className="font-bold text-charcoal">Atelier Return Guarantee</h3>
                <p className="text-muted leading-relaxed">
                  To initiate an exchange or refund, navigate to your order details and select "Request Return". Our automated logistics system generates a prepaid carbon-neutral courier label instantly.
                </p>
              </div>
            </div>
          )}

          {/* ================= 5. PROFILE PREFERENCES ================= */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-fade-in max-w-lg">
              <div>
                <h2 className="font-serif text-2xl font-normal text-charcoal mb-1">
                  Profile Settings
                </h2>
                <p className="text-xs text-muted">Simulated client preferences and login details.</p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium mb-1">Client Name</label>
                  <input
                    type="text"
                    defaultValue={currentCustomer.name}
                    className="w-full p-2.5 bg-stone/30 border border-delicate rounded text-xs"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    defaultValue={currentCustomer.email}
                    className="w-full p-2.5 bg-stone/30 border border-delicate rounded text-xs"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Primary Phone</label>
                  <input
                    type="tel"
                    defaultValue={currentCustomer.phone}
                    className="w-full p-2.5 bg-stone/30 border border-delicate rounded text-xs"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => addToast({ type: 'success', title: 'Preferences Saved' })}
                  className="px-5 py-2.5 bg-forest text-white rounded-button text-xs font-semibold"
                >
                  Save Profile Changes
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Return Request Modal */}
      {returnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-xs animate-fade-in">
          <div className="max-w-md w-full bg-white border border-delicate rounded-card shadow-elevated p-6 text-charcoal relative">
            <h3 className="font-serif text-xl font-bold mb-1">Request Return Authorization</h3>
            <p className="text-xs text-muted mb-4">Item: <strong className="text-charcoal">{returnItemName}</strong></p>

            <form onSubmit={handleCreateReturn} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium mb-1">Reason for Return</label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full p-2 bg-stone/40 border border-delicate rounded text-xs"
                >
                  <option value="Size/fit not as expected">Size / fit not as expected</option>
                  <option value="Color or finish differed from display">Color or finish differed from display</option>
                  <option value="Ordered by mistake">Ordered by mistake</option>
                  <option value="Found alternative item">Found alternative item</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Comments for Concierge</label>
                <textarea
                  rows={3}
                  value={returnNotes}
                  onChange={(e) => setReturnNotes(e.target.value)}
                  placeholder="Additional context (optional)..."
                  className="w-full p-2 bg-stone/40 border border-delicate rounded text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReturnModalOpen(false)}
                  className="px-4 py-2 border border-delicate rounded-button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-forest text-white rounded-button font-semibold"
                >
                  Submit Return Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
