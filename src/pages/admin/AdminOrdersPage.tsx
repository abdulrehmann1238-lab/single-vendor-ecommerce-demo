import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCommerceStore } from '../../store/useCommerceStore';
import { Order, OrderStatus } from '../../types';
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Package, 
  Truck, 
  CheckCircle2, 
  X, 
  Clock, 
  Printer, 
  FileText, 
  MessageSquare, 
  Send,
  Eye,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

export const AdminOrdersPage: React.FC = () => {
  const { id: routeOrderId } = useParams<{ id?: string }>();
  const { 
    orders, 
    updateOrderStatus, 
    addOrderNote, 
    cancelOrder, 
    addToast 
  } = useCommerceStore();

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(routeOrderId || null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [noteContent, setNoteContent] = useState('');
  
  // Simulated Shipping Label Modal
  const [labelModalOpen, setLabelModalOpen] = useState(false);

  const activeOrder = orders.find((o) => o.id === selectedOrderId || o.orderNumber === selectedOrderId);

  // Filter orders
  const filteredOrders = orders.filter((ord) => {
    if (statusFilter !== 'all' && ord.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        ord.orderNumber.toLowerCase().includes(q) ||
        ord.customerName.toLowerCase().includes(q) ||
        ord.customerEmail.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleAdvanceStatus = (newStatus: OrderStatus) => {
    if (!activeOrder) return;
    const tracking = newStatus === 'shipped' ? `1Z99999999${Math.floor(10000000 + Math.random() * 90000000)}` : undefined;
    updateOrderStatus(activeOrder.id, newStatus, tracking, 'DHL Express');
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder || !noteContent.trim()) return;
    addOrderNote(activeOrder.id, noteContent);
    setNoteContent('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-forest font-semibold">
            Fulfillment & Order Operations
          </span>
          <h1 className="font-serif text-3xl text-charcoal font-normal mt-0.5">
            Customer Orders Queue
          </h1>
          <p className="text-xs text-muted">
            Manage dispatch status, assign tracking labels, inspect items, and append internal team notes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-stone rounded-button text-xs font-mono text-charcoal">
            {orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length} Active Shipments
          </span>
        </div>
      </div>

      {activeOrder ? (
        /* ================= SINGLE ORDER DETAIL MANAGEMENT VIEW ================= */
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-delicate">
            <button
              onClick={() => setSelectedOrderId(null)}
              className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-charcoal transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Orders Queue</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setLabelModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-delicate hover:bg-stone text-charcoal rounded text-xs font-medium"
              >
                <Printer className="w-3.5 h-3.5 text-muted" />
                <span>Simulate Shipping Label</span>
              </button>

              <Link
                to={`/account/orders/${activeOrder.id}`}
                target="_blank"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-forest/10 hover:bg-forest/20 text-forest rounded text-xs font-semibold"
              >
                <span>View Customer View</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 8 cols: Order info, items, timeline */}
            <div className="lg:col-span-8 bg-white border border-delicate rounded-card shadow-subtle p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-delicate">
                <div>
                  <span className="font-mono text-xs text-muted uppercase">
                    Order Ref: #{activeOrder.orderNumber}
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-charcoal">
                    {activeOrder.customerName}
                  </h2>
                  <p className="text-xs text-muted font-mono">{activeOrder.customerEmail} • {activeOrder.customerPhone || 'N/A'}</p>
                </div>

                <div className="text-right">
                  <span className={`px-3 py-1 rounded text-xs font-mono font-bold uppercase ${
                    activeOrder.status === 'delivered' ? 'bg-forest/15 text-forest' : 'bg-champagne/20 text-champagne-dark'
                  }`}>
                    {activeOrder.status.replace(/_/g, ' ')}
                  </span>
                  <span className="block text-[11px] text-muted font-mono mt-1">
                    Placed {new Date(activeOrder.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Status Advancement Button Bar */}
              <div className="p-4 bg-stone/40 border border-delicate rounded-card space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-charcoal font-bold block">
                  Advance Fulfillment Pipeline
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleAdvanceStatus('processing')}
                    disabled={activeOrder.status === 'processing'}
                    className="px-3 py-1.5 bg-white border border-delicate hover:bg-stone text-charcoal rounded text-xs font-semibold disabled:opacity-40"
                  >
                    Mark Processing
                  </button>
                  <button
                    onClick={() => handleAdvanceStatus('packed')}
                    disabled={activeOrder.status === 'packed'}
                    className="px-3 py-1.5 bg-white border border-delicate hover:bg-stone text-charcoal rounded text-xs font-semibold disabled:opacity-40"
                  >
                    Mark Packed & Weighed
                  </button>
                  <button
                    onClick={() => handleAdvanceStatus('shipped')}
                    disabled={activeOrder.status === 'shipped'}
                    className="px-3 py-1.5 bg-forest hover:bg-forest-dark text-white rounded text-xs font-semibold shadow-xs disabled:opacity-40"
                  >
                    Mark Shipped (DHL Express)
                  </button>
                  <button
                    onClick={() => handleAdvanceStatus('delivered')}
                    disabled={activeOrder.status === 'delivered'}
                    className="px-3 py-1.5 bg-dark hover:bg-black text-white rounded text-xs font-semibold disabled:opacity-40"
                  >
                    Mark Delivered
                  </button>
                  <button
                    onClick={() => cancelOrder(activeOrder.id, 'Administrator cancellation')}
                    disabled={activeOrder.status === 'cancelled'}
                    className="px-3 py-1.5 bg-white border border-error/30 text-error hover:bg-error/5 rounded text-xs font-semibold ml-auto disabled:opacity-40"
                  >
                    Cancel & Refund
                  </button>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-3">
                <h3 className="font-mono text-xs uppercase tracking-wider text-muted font-bold">
                  Order Items ({activeOrder.items.length})
                </h3>
                <div className="space-y-2">
                  {activeOrder.items.map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-stone/20 rounded border border-delicate text-xs">
                      <div className="flex items-center gap-3">
                        <img src={it.image} alt="" className="w-12 h-12 object-cover rounded bg-stone" />
                        <div>
                          <p className="font-bold text-charcoal">{it.productName}</p>
                          <p className="text-[11px] text-muted font-mono">SKU: {it.sku} • {it.variantName || 'Standard'}</p>
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <span className="font-bold text-charcoal">${(it.price * it.quantity).toFixed(2)}</span>
                        <span className="text-[10px] text-muted block">Qty {it.quantity} × ${it.price.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Destination Address */}
              <div className="p-4 bg-stone/20 rounded-card border border-delicate text-xs space-y-1">
                <span className="font-mono uppercase text-[10px] text-muted font-bold">Shipping Destination</span>
                <p className="font-bold text-charcoal">{activeOrder.shippingAddress.fullName}</p>
                <p className="text-muted">{activeOrder.shippingAddress.addressLine1} {activeOrder.shippingAddress.addressLine2}</p>
                <p className="text-muted">{activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.state} {activeOrder.shippingAddress.postalCode}</p>
                <p className="text-muted">{activeOrder.shippingAddress.country}</p>
                {activeOrder.shippingAddress.deliveryInstructions && (
                  <p className="text-forest font-mono text-[11px] pt-1">Notes: {activeOrder.shippingAddress.deliveryInstructions}</p>
                )}
              </div>
            </div>

            {/* Right 4 cols: Internal Notes & Timeline */}
            <div className="lg:col-span-4 space-y-6">
              {/* Internal Notes Panel */}
              <div className="bg-white border border-delicate rounded-card shadow-subtle p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-delicate">
                  <h3 className="font-serif text-base font-bold text-charcoal">
                    Internal Operations Notes
                  </h3>
                  <MessageSquare className="w-4 h-4 text-muted" />
                </div>

                <form onSubmit={handleAddNote} className="space-y-2">
                  <textarea
                    rows={3}
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Log packaging inspection, courier updates, or special requests..."
                    className="w-full p-2.5 bg-stone/30 border border-delicate rounded text-xs outline-none focus:border-forest"
                  />
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-1.5 py-2 bg-charcoal hover:bg-dark text-white rounded text-xs font-semibold"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Append Internal Note</span>
                  </button>
                </form>

                <div className="space-y-2 max-h-60 overflow-y-auto pt-2">
                  {activeOrder.notes.map((note) => (
                    <div key={note.id} className="p-3 bg-stone/20 rounded text-xs border border-delicate/60 space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-muted font-mono">
                        <span className="font-semibold text-charcoal">{note.author}</span>
                        <span>{new Date(note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-charcoal leading-relaxed">{note.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Carrier Tracking Box */}
              <div className="bg-white border border-delicate rounded-card shadow-subtle p-6 space-y-3 text-xs">
                <span className="font-mono uppercase text-muted text-[10px] font-bold block">Logistics Partner</span>
                <p className="font-semibold text-charcoal">Carrier: {activeOrder.carrier || 'DHL Express'}</p>
                <p className="text-muted font-mono">Tracking: {activeOrder.trackingNumber || 'Pending pickup scan'}</p>
                <p className="text-forest font-medium">Estimated Arrival: {activeOrder.estimatedDelivery}</p>
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* ================= ORDERS DATA TABLE LIST ================= */
        <div className="space-y-4">
          <div className="p-4 bg-white border border-delicate rounded-card shadow-subtle flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search order ID, client name, email..."
                  className="w-full pl-9 pr-3 py-2 bg-stone/40 border border-delicate rounded-button text-xs outline-none focus:border-forest"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-2 bg-stone/40 border border-delicate rounded-button text-xs text-charcoal outline-none cursor-pointer"
              >
                <option value="all">All Fulfillment Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="packed">Packed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="text-xs text-muted font-mono">
              Showing {filteredOrders.length} orders
            </div>
          </div>

          <div className="bg-white border border-delicate rounded-card shadow-subtle overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-stone/40 border-b border-delicate text-muted font-mono uppercase text-[10px]">
                    <th className="py-3 px-4">Order Ref</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Order Date</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Fulfillment Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} className="border-b border-delicate/40 hover:bg-stone/20 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-charcoal">
                        {ord.orderNumber}
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-bold text-charcoal">{ord.customerName}</p>
                        <p className="text-[10px] text-muted truncate max-w-[150px]">{ord.customerEmail}</p>
                      </td>

                      <td className="py-3.5 px-4 text-muted font-mono">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-3.5 px-4 font-mono">
                        {ord.items.length} item(s)
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-charcoal">
                        ${ord.total.toFixed(2)}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-mono text-forest bg-forest/10 px-2 py-0.5 rounded font-medium">
                          {ord.paymentStatus.toUpperCase()}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          ord.status === 'delivered'
                            ? 'bg-forest/15 text-forest'
                            : ord.status === 'shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : ord.status === 'cancelled'
                            ? 'bg-error/15 text-error'
                            : 'bg-champagne/20 text-champagne-dark'
                        }`}>
                          {ord.status.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedOrderId(ord.id)}
                          className="px-3 py-1 bg-stone hover:bg-delicate text-charcoal rounded text-xs font-semibold transition-colors"
                        >
                          Fulfill →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= SHIPPING LABEL MODAL ================= */}
      {labelModalOpen && activeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-xs animate-fade-in">
          <div className="max-w-md w-full bg-white border border-delicate rounded-card shadow-dropdown p-6 text-charcoal relative space-y-4">
            <button onClick={() => setLabelModalOpen(false)} className="absolute top-4 right-4 text-muted hover:text-charcoal">
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-serif text-lg font-bold">Simulated Courier Air Waybill</h2>
            
            {/* Label Canvas */}
            <div className="p-4 bg-white border-2 border-charcoal rounded font-mono text-xs space-y-3">
              <div className="flex justify-between border-b-2 border-charcoal pb-2">
                <div>
                  <span className="font-bold text-lg">DHL EXPRESS</span>
                  <span className="block text-[10px]">DOMESTIC PRIORITY AIR</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-sm">CHICAGO HUB</span>
                  <span className="block text-[10px]">ROUTE: ORD-SFO-09</span>
                </div>
              </div>

              <div className="border-b border-charcoal pb-2 text-[11px]">
                <span className="text-muted block text-[9px]">SHIP TO:</span>
                <p className="font-bold">{activeOrder.shippingAddress.fullName}</p>
                <p>{activeOrder.shippingAddress.addressLine1} {activeOrder.shippingAddress.addressLine2}</p>
                <p>{activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.state} {activeOrder.shippingAddress.postalCode}</p>
              </div>

              {/* Barcode representation */}
              <div className="py-2 text-center">
                <div className="h-12 bg-charcoal/90 w-full mb-1 flex items-center justify-center text-white text-[9px] tracking-widest">
                  ||| | ||||| || |||| ||| |||| | |||||| || |||
                </div>
                <span className="text-[11px] font-bold">TRACKING: {activeOrder.trackingNumber || '1Z9999999912048921'}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setLabelModalOpen(false)}
                className="px-4 py-2 border border-delicate rounded text-xs"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                  setLabelModalOpen(false);
                }}
                className="px-4 py-2 bg-forest text-white rounded text-xs font-semibold"
              >
                Print Shipping Label
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
