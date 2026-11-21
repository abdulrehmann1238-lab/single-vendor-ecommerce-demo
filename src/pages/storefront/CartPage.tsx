import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCommerceStore } from '../../store/useCommerceStore';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag, 
  Check, 
  Bookmark,
  RotateCcw
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    saveItemForLater,
    savedForLater,
    moveToCartFromSaved,
    appliedPromo,
    applyPromoCode,
    removePromoCode
  } = useCommerceStore();

  const [promoInput, setPromoInput] = useState('');

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.priceAtAdd * item.quantity, 0);
  const FREE_SHIPPING_LIMIT = 150;
  const awayFromFree = Math.max(0, FREE_SHIPPING_LIMIT - subtotal);
  const freeProgress = Math.min(100, (subtotal / FREE_SHIPPING_LIMIT) * 100);

  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountType === 'percentage') {
      discount = (subtotal * appliedPromo.discountValue) / 100;
    } else if (appliedPromo.discountType === 'fixed_amount') {
      discount = Math.min(subtotal, appliedPromo.discountValue);
    }
  }

  const shippingCost = (appliedPromo?.discountType === 'free_shipping' || subtotal >= FREE_SHIPPING_LIMIT || subtotal === 0) ? 0 : 15;
  const estimatedTax = Number(((subtotal - discount) * 0.0825).toFixed(2));
  const finalTotal = Math.max(0, subtotal - discount + shippingCost + estimatedTax);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    if (res.success) setPromoInput('');
  };

  if (cart.length === 0 && savedForLater.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-stone flex items-center justify-center text-muted mx-auto">
          <ShoppingBag className="w-8 h-8 stroke-1" />
        </div>
        <h1 className="font-serif text-3xl text-charcoal">Your shopping bag is empty</h1>
        <p className="text-xs text-muted max-w-sm mx-auto">
          Explore our collection of precision audio, ceramics, and timeless leather goods.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-forest text-white text-xs font-semibold rounded-button shadow-subtle hover:bg-forest-dark transition-colors"
        >
          <span>Explore Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      
      {/* Title */}
      <div className="pb-4 border-b border-delicate">
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
          Your Shopping Bag
        </h1>
        <p className="text-xs text-muted mt-1">
          {cart.reduce((s, i) => s + i.quantity, 0)} items selected for checkout
        </p>
      </div>

      {/* Free Shipping Strip */}
      <div className="p-4 bg-stone/50 border border-delicate rounded-card">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-medium text-charcoal">
            {awayFromFree === 0 ? (
              <span className="text-forest font-semibold flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Qualified for Complimentary Global Courier Shipping!
              </span>
            ) : (
              <span>
                Add <strong className="text-forest font-bold">${awayFromFree.toFixed(2)}</strong> more to receive complimentary delivery.
              </span>
            )}
          </span>
          <span className="font-mono text-xs text-muted">{Math.round(freeProgress)}%</span>
        </div>
        <div className="w-full h-1.5 bg-delicate rounded-full overflow-hidden">
          <div 
            className="h-full bg-forest transition-all duration-300" 
            style={{ width: `${freeProgress}%` }}
          />
        </div>
      </div>

      {/* Cart Grid: Items vs Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Line Items */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row gap-4 p-4 sm:p-5 bg-white border border-delicate rounded-card shadow-subtle items-center"
            >
              <img
                src={item.variant?.image || item.product.images[0]}
                alt={item.product.name}
                className="w-24 h-24 object-cover rounded-md bg-stone shrink-0"
              />

              <div className="flex-1 min-w-0 space-y-1 text-center sm:text-left">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted">
                  {item.product.brand}
                </span>
                <Link to={`/product/${item.product.slug}`} className="hover:text-forest transition-colors">
                  <h3 className="font-serif text-base font-bold text-charcoal truncate">
                    {item.product.name}
                  </h3>
                </Link>

                {(item.variant?.name || item.selectedColor || item.selectedSize) && (
                  <p className="text-xs text-muted">
                    {item.variant?.name || `${item.selectedColor || ''} ${item.selectedSize || ''}`}
                  </p>
                )}

                <div className="text-xs font-mono font-bold text-charcoal sm:hidden pt-1">
                  ${item.priceAtAdd.toFixed(2)} each
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center border border-delicate rounded-button bg-ivory overflow-hidden">
                <button
                  onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                  className="p-1.5 hover:bg-stone text-charcoal"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-xs font-bold font-mono text-charcoal">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                  className="p-1.5 hover:bg-stone text-charcoal"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Line Price */}
              <div className="w-24 text-right hidden sm:block">
                <div className="font-mono text-sm font-bold text-charcoal">
                  ${(item.priceAtAdd * item.quantity).toFixed(2)}
                </div>
                <div className="text-[10px] text-muted font-mono">
                  ${item.priceAtAdd.toFixed(2)} each
                </div>
              </div>

              {/* Actions */}
              <div className="flex sm:flex-col gap-2 shrink-0">
                <button
                  onClick={() => saveItemForLater(item.id)}
                  className="text-xs text-muted hover:text-forest p-1 transition-colors"
                  title="Save for Later"
                >
                  <Bookmark className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-xs text-muted hover:text-error p-1 transition-colors"
                  title="Remove from bag"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Saved for Later Section */}
          {savedForLater.length > 0 && (
            <div className="pt-8 border-t border-delicate space-y-4">
              <h3 className="font-serif text-lg font-bold text-charcoal">
                Saved for Later ({savedForLater.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedForLater.map((item) => (
                  <div key={item.id} className="p-3 bg-stone/30 border border-delicate rounded-card flex gap-3 items-center">
                    <img src={item.product.images[0]} alt="" className="w-14 h-14 object-cover rounded bg-stone" />
                    <div className="flex-1 min-w-0 text-xs">
                      <p className="font-semibold text-charcoal truncate">{item.product.name}</p>
                      <p className="text-muted font-mono">${item.priceAtAdd.toFixed(2)}</p>
                      <button
                        onClick={() => moveToCartFromSaved(item.id)}
                        className="text-forest font-semibold hover:underline mt-1 block"
                      >
                        Move to Bag
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4 bg-white border border-delicate rounded-card shadow-subtle p-6 space-y-6 sticky top-24">
          <h2 className="font-serif text-lg font-bold text-charcoal pb-3 border-b border-delicate">
            Order Summary
          </h2>

          {/* Promo Code Input */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted block">
              Promotional Code
            </span>
            {appliedPromo ? (
              <div className="flex items-center justify-between p-2.5 bg-forest/10 border border-forest/20 rounded-button text-xs">
                <div>
                  <span className="font-bold text-forest">{appliedPromo.code}</span>
                  <span className="text-muted text-[11px] ml-1">({appliedPromo.title})</span>
                </div>
                <button
                  onClick={removePromoCode}
                  className="text-error hover:underline text-[11px]"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="e.g. AUTUMN20"
                  className="flex-1 p-2 bg-stone/40 border border-delicate rounded-button text-xs uppercase outline-none focus:border-forest"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone hover:bg-delicate text-charcoal text-xs font-semibold rounded-button transition-colors"
                >
                  Apply
                </button>
              </form>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2 text-xs border-t border-delicate pt-4">
            <div className="flex justify-between text-muted">
              <span>Subtotal</span>
              <span className="text-charcoal font-medium font-mono">${subtotal.toFixed(2)}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-forest font-medium">
                <span>Discount</span>
                <span className="font-mono">-${discount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-muted">
              <span>Estimated Shipping</span>
              <span className="text-charcoal font-medium font-mono">
                {shippingCost === 0 ? 'Complimentary' : `$${shippingCost.toFixed(2)}`}
              </span>
            </div>

            <div className="flex justify-between text-muted">
              <span>Estimated Tax (8.25%)</span>
              <span className="text-charcoal font-medium font-mono">${estimatedTax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-base font-bold text-charcoal pt-3 border-t border-delicate">
              <span>Total</span>
              <span className="font-mono">${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Checkout CTA */}
          <button
            onClick={() => navigate('/checkout')}
            disabled={cart.length === 0}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-forest hover:bg-forest-dark text-white rounded-button text-xs font-semibold shadow-subtle transition-all tracking-wide disabled:opacity-50"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-[11px] text-muted text-center font-light leading-relaxed">
            Taxes and regional duties calculated dynamically based on your simulated shipping jurisdiction.
          </p>
        </div>

      </div>

    </div>
  );
};
