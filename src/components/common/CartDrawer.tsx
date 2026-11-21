import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCommerceStore } from '../../store/useCommerceStore';
import { 
  X, 
  Trash2, 
  ArrowRight, 
  ShoppingBag, 
  Sparkles, 
  Plus, 
  Minus,
  Bookmark,
  Check
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const { 
    cart, 
    isCartDrawerOpen, 
    setCartDrawerOpen, 
    updateCartQuantity, 
    removeFromCart, 
    saveItemForLater,
    appliedPromo,
    applyPromoCode,
    removePromoCode
  } = useCommerceStore();

  const [promoInput, setPromoInput] = useState('');

  if (!isCartDrawerOpen) return null;

  // Totals calculation
  const subtotal = cart.reduce((sum, item) => sum + item.priceAtAdd * item.quantity, 0);
  const FREE_SHIPPING_THRESHOLD = 150;
  const awayFromFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountType === 'percentage') {
      discountAmount = (subtotal * appliedPromo.discountValue) / 100;
    } else if (appliedPromo.discountType === 'fixed_amount') {
      discountAmount = Math.min(subtotal, appliedPromo.discountValue);
    }
  }

  const estimatedTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    if (res.success) setPromoInput('');
  };

  const handleCheckoutNavigation = () => {
    setCartDrawerOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-charcoal/50 backdrop-blur-xs transition-opacity"
        onClick={() => setCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-elevated flex flex-col z-10 text-charcoal">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-delicate bg-ivory/50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-forest" />
            <h2 className="font-serif text-lg font-bold">Shopping Bag</h2>
            <span className="text-xs text-muted font-mono">
              ({cart.reduce((s, i) => s + i.quantity, 0)})
            </span>
          </div>
          <button
            onClick={() => setCartDrawerOpen(false)}
            className="p-1 text-muted hover:text-charcoal rounded-full hover:bg-stone transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Complimentary Shipping Progress Strip */}
        <div className="p-4 bg-stone/40 border-b border-delicate">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-medium text-charcoal">
              {awayFromFreeShipping === 0 ? (
                <span className="text-forest font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Qualified for Complimentary Delivery!
                </span>
              ) : (
                <span>
                  Add <strong className="font-bold text-forest">${awayFromFreeShipping.toFixed(2)}</strong> more for free courier delivery
                </span>
              )}
            </span>
            <span className="font-mono text-[11px] text-muted">
              {Math.round(freeShippingProgress)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-delicate rounded-full overflow-hidden">
            <div 
              className="h-full bg-forest transition-all duration-300 rounded-full"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone flex items-center justify-center text-muted">
                <ShoppingBag className="w-8 h-8 stroke-1" />
              </div>
              <div>
                <h3 className="font-serif text-lg text-charcoal mb-1">Your bag is empty</h3>
                <p className="text-xs text-muted max-w-xs">
                  Discover our considered collection of precision audio, ceramics, and timeless leather carry.
                </p>
              </div>
              <button
                onClick={() => {
                  setCartDrawerOpen(false);
                  navigate('/shop');
                }}
                className="px-5 py-2.5 bg-forest text-white text-xs font-semibold rounded-button hover:bg-forest-dark transition-colors shadow-subtle"
              >
                Explore Catalog
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div 
                key={item.id}
                className="flex gap-4 p-3 bg-white border border-delicate/80 rounded-card hover:border-delicate transition-all"
              >
                <img
                  src={item.variant?.image || item.product.images[0]}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-md bg-stone shrink-0"
                />

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-semibold text-charcoal leading-snug truncate">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-muted hover:text-error p-0.5 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {(item.selectedColor || item.selectedSize || item.variant?.name) && (
                      <p className="text-[11px] text-muted mt-0.5">
                        {item.variant?.name || `${item.selectedColor || ''} ${item.selectedSize || ''}`}
                      </p>
                    )}

                    <div className="text-xs font-bold text-charcoal mt-1">
                      ${item.priceAtAdd.toFixed(2)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-delicate rounded-xs overflow-hidden bg-ivory">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-stone text-charcoal"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-medium font-mono">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-stone text-charcoal"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => saveItemForLater(item.id)}
                      className="text-[11px] text-muted hover:text-forest flex items-center gap-1 transition-colors"
                    >
                      <Bookmark className="w-3 h-3" />
                      <span>Save for later</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary / Checkout Action */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-delicate bg-ivory/40 space-y-4">
            {/* Promo Code Input */}
            <div>
              {appliedPromo ? (
                <div className="flex items-center justify-between p-2.5 bg-forest/10 border border-forest/20 rounded-md text-xs">
                  <div>
                    <span className="font-bold text-forest">{appliedPromo.code}</span>
                    <span className="text-muted ml-1.5">({appliedPromo.title})</span>
                  </div>
                  <button
                    onClick={removePromoCode}
                    className="text-muted hover:text-error text-[11px] underline"
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
                    placeholder="Promo code (e.g. WELCOME10)"
                    className="flex-1 bg-white border border-delicate rounded-button px-3 py-1.5 text-xs text-charcoal placeholder:text-muted/60 uppercase outline-none focus:border-forest"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-stone hover:bg-delicate text-charcoal text-xs font-semibold rounded-button transition-colors shrink-0"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Price Line Items */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span>
                <span className="text-charcoal font-medium">${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-forest font-medium">
                  <span>Promotion Discount</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted">
                <span>Shipping</span>
                <span className="text-charcoal font-medium">
                  {awayFromFreeShipping === 0 ? 'Complimentary' : '$15.00'}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-charcoal pt-2 border-t border-delicate">
                <span>Estimated Total</span>
                <span>${(estimatedTotal + (awayFromFreeShipping === 0 ? 0 : 15)).toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={handleCheckoutNavigation}
                className="w-full flex items-center justify-center gap-2 py-3 bg-forest hover:bg-forest-dark text-white rounded-button text-xs font-semibold shadow-subtle transition-all tracking-wide"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                to="/cart"
                onClick={() => setCartDrawerOpen(false)}
                className="w-full block text-center py-2 text-xs text-muted hover:text-charcoal transition-colors font-medium"
              >
                View Full Shopping Bag
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
