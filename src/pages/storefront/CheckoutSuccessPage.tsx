import React, { useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useCommerceStore } from '../../store/useCommerceStore';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  ArrowRight, 
  LayoutDashboard, 
  ExternalLink,
  Printer
} from 'lucide-react';

export const CheckoutSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('orderId') || 'ORD-2026-8946';
  const { orders } = useCommerceStore();

  const order = orders.find((o) => o.id === orderId || o.orderNumber === orderId) || orders[0];

  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#52634F', '#A8AA91', '#B49A72', '#242820'],
      });
    } catch (e) {
      // Ignore if confetti not supported
    }
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-8 animate-fade-up">
      
      {/* Top Banner Card */}
      <div className="p-8 sm:p-10 bg-white border border-delicate rounded-card shadow-elevated text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-forest/10 text-forest flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-mono uppercase tracking-widest text-forest font-semibold">
            Simulated Order Placed Successfully
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
            Thank you for your order.
          </h1>
          <p className="text-xs sm:text-sm text-muted max-w-md mx-auto">
            Order confirmation receipt has been dispatched to <strong className="text-charcoal">{order?.customerEmail}</strong>.
          </p>
        </div>

        {/* Order Identifier Callout */}
        <div className="inline-flex items-center gap-3 p-3 bg-stone/50 border border-delicate rounded-md text-xs font-mono text-charcoal">
          <span>Order Reference:</span>
          <strong className="text-forest font-bold text-sm">{order?.orderNumber || orderId}</strong>
        </div>
      </div>

      {/* Order Snapshot & Timeline */}
      <div className="bg-white border border-delicate rounded-card shadow-subtle p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-delicate">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-forest" />
            <h2 className="font-serif text-lg font-bold text-charcoal">
              Order Details
            </h2>
          </div>
          <span className="text-xs font-mono text-muted">
            Estimated Delivery: {order?.estimatedDelivery}
          </span>
        </div>

        {/* Items Summary */}
        <div className="space-y-3">
          {order?.items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs py-2 border-b border-delicate/40 last:border-none">
              <div className="flex items-center gap-3">
                <img src={item.image} alt="" className="w-12 h-12 object-cover rounded bg-stone" />
                <div>
                  <p className="font-semibold text-charcoal">{item.productName}</p>
                  <p className="text-muted">{item.variantName || ''} • Qty {item.quantity}</p>
                </div>
              </div>
              <div className="font-mono font-bold text-charcoal">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="pt-4 border-t border-delicate space-y-1.5 text-xs">
          <div className="flex justify-between text-muted">
            <span>Subtotal</span>
            <span className="font-mono text-charcoal">${order?.subtotal.toFixed(2)}</span>
          </div>
          {order?.discount && order.discount > 0 ? (
            <div className="flex justify-between text-forest">
              <span>Promotion Discount</span>
              <span className="font-mono">-${order.discount.toFixed(2)}</span>
            </div>
          ) : null}
          <div className="flex justify-between text-muted">
            <span>Shipping</span>
            <span className="font-mono text-charcoal">
              {order?.shippingCost === 0 ? 'Complimentary' : `$${order?.shippingCost.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between text-muted">
            <span>Tax</span>
            <span className="font-mono text-charcoal">${order?.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-charcoal pt-2 border-t border-delicate">
            <span>Total Paid</span>
            <span className="font-mono">${order?.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Cross Navigation Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <Link
          to={`/account/orders/${order?.orderNumber || orderId}`}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-forest text-white text-xs font-semibold rounded-button shadow-subtle hover:bg-forest-dark transition-colors"
        >
          <span>Track Order in Customer Account</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          to={`/admin/orders/${order?.orderNumber || orderId}`}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-stone hover:bg-delicate text-charcoal text-xs font-semibold rounded-button transition-colors"
        >
          <LayoutDashboard className="w-4 h-4 text-forest" />
          <span>Inspect Order in Admin Dashboard</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
};
