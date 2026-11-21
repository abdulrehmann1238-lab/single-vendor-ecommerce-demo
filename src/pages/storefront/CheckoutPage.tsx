import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCommerceStore } from '../../store/useCommerceStore';
import { ShippingAddress } from '../../types';
import { 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Lock, 
  Sparkles,
  Building,
  User,
  MapPin
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, currentCustomer, appliedPromo, createOrder, addToast } = useCommerceStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State: Step 1 Contact & Delivery
  const [address, setAddress] = useState<ShippingAddress>(
    currentCustomer.addresses[0] || {
      fullName: currentCustomer.name,
      email: currentCustomer.email,
      phone: currentCustomer.phone,
      addressLine1: '482 Montgomery Street',
      addressLine2: 'Suite 900',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94104',
      country: 'United States',
      deliveryInstructions: 'Leave with concierge or ring suite bell.',
    }
  );

  // Form State: Step 2 Shipping & Payment
  const [shippingMethod, setShippingMethod] = useState<'Standard Delivery' | 'Express Courier' | 'Complimentary White Glove'>(
    'Standard Delivery'
  );
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'klarna' | 'apple_pay'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('891');

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.priceAtAdd * item.quantity, 0);
  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountType === 'percentage') {
      discount = (subtotal * appliedPromo.discountValue) / 100;
    } else if (appliedPromo.discountType === 'fixed_amount') {
      discount = Math.min(subtotal, appliedPromo.discountValue);
    }
  }

  const baseShipping = (appliedPromo?.discountType === 'free_shipping' || subtotal >= 150) ? 0 : 15;
  const shippingFee = shippingMethod === 'Express Courier' ? baseShipping + 10 : baseShipping;
  const tax = Number(((subtotal - discount) * 0.0825).toFixed(2));
  const grandTotal = Math.max(0, subtotal - discount + shippingFee + tax);

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl text-charcoal">Your Shopping Bag is Empty</h2>
        <p className="text-xs text-muted">Please add products to your bag prior to proceeding with checkout.</p>
        <button
          onClick={() => navigate('/shop')}
          className="px-5 py-2.5 bg-forest text-white text-xs font-semibold rounded-button"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  // Handle Order Placement
  const handlePlaceOrder = () => {
    const paymentLabel = 
      paymentMethod === 'card' 
        ? `Visa ending in ${cardNumber.slice(-4) || '4242'}`
        : paymentMethod === 'paypal'
        ? 'PayPal Account (simulated)'
        : paymentMethod === 'klarna'
        ? 'Klarna Pay-in-4'
        : 'Apple Pay';

    const newOrder = createOrder({
      customerName: address.fullName,
      customerEmail: address.email,
      customerPhone: address.phone,
      shippingAddress: address,
      shippingMethod,
      paymentMethod: paymentLabel,
    });

    addToast({
      type: 'success',
      title: 'Order Confirmed',
      description: `Order ${newOrder.orderNumber} successfully processed.`,
    });

    navigate(`/checkout/success?orderId=${newOrder.orderNumber}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      
      {/* Checkout Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-delicate gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-forest">
            Direct Atelier Fulfillment
          </span>
          <h1 className="font-serif text-3xl text-charcoal font-normal">
            Checkout
          </h1>
        </div>

        {/* 3 Step Progress Indicator */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
            step === 1 ? 'bg-forest text-white font-bold' : 'bg-stone text-charcoal'
          }`}>
            <span>1</span>
            <span className="hidden sm:inline">Delivery</span>
          </div>
          <span className="text-delicate">——</span>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
            step === 2 ? 'bg-forest text-white font-bold' : 'bg-stone text-charcoal'
          }`}>
            <span>2</span>
            <span className="hidden sm:inline">Payment</span>
          </div>
          <span className="text-delicate">——</span>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
            step === 3 ? 'bg-forest text-white font-bold' : 'bg-stone text-charcoal'
          }`}>
            <span>3</span>
            <span className="hidden sm:inline">Review</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 8 Cols: Active Step Form */}
        <div className="lg:col-span-8 bg-white border border-delicate rounded-card shadow-subtle p-6 sm:p-8 space-y-6">
          
          {/* ================= STEP 1: CONTACT & DELIVERY ================= */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-delicate">
                <h2 className="font-serif text-xl font-bold text-charcoal">
                  1. Contact & Shipping Address
                </h2>
                <span className="text-xs text-muted font-mono">Step 1 of 3</span>
              </div>

              {/* Saved Address Quick Select */}
              {currentCustomer.addresses.length > 0 && (
                <div className="p-3 bg-stone/40 border border-delicate rounded-card space-y-2">
                  <span className="text-[11px] font-mono uppercase text-muted tracking-wider block">
                    Saved Customer Address
                  </span>
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-charcoal">{currentCustomer.addresses[0].fullName}</p>
                      <p className="text-muted">{currentCustomer.addresses[0].addressLine1}, {currentCustomer.addresses[0].city}, {currentCustomer.addresses[0].state} {currentCustomer.addresses[0].postalCode}</p>
                    </div>
                    <span className="text-[10px] text-forest font-bold px-2 py-0.5 bg-forest/10 rounded">
                      Selected
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full p-2.5 bg-stone/30 border border-delicate rounded text-xs outline-none focus:border-forest"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Email for Delivery Updates</label>
                  <input
                    type="email"
                    value={address.email}
                    onChange={(e) => setAddress({ ...address, email: e.target.value })}
                    className="w-full p-2.5 bg-stone/30 border border-delicate rounded text-xs outline-none focus:border-forest"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Phone Number (Carrier SMS)</label>
                  <input
                    type="tel"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full p-2.5 bg-stone/30 border border-delicate rounded text-xs outline-none focus:border-forest"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Country</label>
                  <select
                    value={address.country}
                    onChange={(e) => setAddress({ ...address, country: e.target.value })}
                    className="w-full p-2.5 bg-stone/30 border border-delicate rounded text-xs outline-none focus:border-forest"
                  >
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="France">France</option>
                    <option value="Sweden">Sweden</option>
                    <option value="Germany">Germany</option>
                    <option value="Japan">Japan</option>
                    <option value="Canada">Canada</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-medium mb-1">Street Address</label>
                  <input
                    type="text"
                    value={address.addressLine1}
                    onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                    placeholder="House number and street name"
                    className="w-full p-2.5 bg-stone/30 border border-delicate rounded text-xs outline-none focus:border-forest"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Apartment, Suite, Unit</label>
                  <input
                    type="text"
                    value={address.addressLine2 || ''}
                    onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
                    placeholder="Suite, Apt, Floor (optional)"
                    className="w-full p-2.5 bg-stone/30 border border-delicate rounded text-xs outline-none focus:border-forest"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">City</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full p-2.5 bg-stone/30 border border-delicate rounded text-xs outline-none focus:border-forest"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">State / Province</label>
                  <input
                    type="text"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full p-2.5 bg-stone/30 border border-delicate rounded text-xs outline-none focus:border-forest"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={address.postalCode}
                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    className="w-full p-2.5 bg-stone/30 border border-delicate rounded text-xs outline-none focus:border-forest"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-medium mb-1">Delivery Instructions (Optional)</label>
                  <input
                    type="text"
                    value={address.deliveryInstructions || ''}
                    onChange={(e) => setAddress({ ...address, deliveryInstructions: e.target.value })}
                    placeholder="e.g. Leave with concierge or behind courtyard gate"
                    className="w-full p-2.5 bg-stone/30 border border-delicate rounded text-xs outline-none focus:border-forest"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-delicate flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 px-6 py-3 bg-forest hover:bg-forest-dark text-white rounded-button text-xs font-semibold shadow-subtle transition-all"
                >
                  <span>Continue to Shipping & Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 2: SHIPPING & PAYMENT ================= */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-delicate">
                <h2 className="font-serif text-xl font-bold text-charcoal">
                  2. Shipping & Payment Method
                </h2>
                <span className="text-xs text-muted font-mono">Step 2 of 3</span>
              </div>

              {/* Shipping Method Options */}
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-muted block">
                  Select Delivery Courier
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setShippingMethod('Standard Delivery')}
                    className={`p-4 rounded-card border cursor-pointer transition-all ${
                      shippingMethod === 'Standard Delivery'
                        ? 'border-forest bg-forest/5 ring-1 ring-forest'
                        : 'border-delicate hover:bg-stone/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1 text-xs font-bold text-charcoal">
                      <span>Standard Ground Courier</span>
                      <span>{baseShipping === 0 ? 'Complimentary' : '$15.00'}</span>
                    </div>
                    <p className="text-[11px] text-muted">Estimated 2–4 business days via DHL / FedEx Ground</p>
                  </div>

                  <div
                    onClick={() => setShippingMethod('Express Courier')}
                    className={`p-4 rounded-card border cursor-pointer transition-all ${
                      shippingMethod === 'Express Courier'
                        ? 'border-forest bg-forest/5 ring-1 ring-forest'
                        : 'border-delicate hover:bg-stone/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1 text-xs font-bold text-charcoal">
                      <span>Express Priority Air</span>
                      <span>${(baseShipping + 10).toFixed(2)}</span>
                    </div>
                    <p className="text-[11px] text-muted">Next business day air dispatch via DHL Express</p>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-4 pt-4 border-t border-delicate">
                <span className="text-xs font-mono uppercase tracking-wider text-muted block">
                  Select Payment Method (Simulation)
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'card', label: 'Credit Card', icon: CreditCard },
                    { id: 'paypal', label: 'PayPal', icon: ShieldCheck },
                    { id: 'klarna', label: 'Klarna Pay-4', icon: Sparkles },
                    { id: 'apple_pay', label: 'Apple Pay', icon: Lock },
                  ].map((pm) => {
                    const Icon = pm.icon;
                    return (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setPaymentMethod(pm.id as any)}
                        className={`p-3 rounded-button border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                          paymentMethod === pm.id
                            ? 'border-forest bg-forest text-white'
                            : 'border-delicate bg-white hover:bg-stone text-charcoal'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{pm.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Simulated Card Entry */}
                {paymentMethod === 'card' && (
                  <div className="p-4 bg-stone/30 border border-delicate rounded-card space-y-3 text-xs">
                    <div>
                      <label className="block font-medium mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full p-2.5 bg-white border border-delicate rounded font-mono text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-medium mb-1">Expiration (MM/YY)</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full p-2.5 bg-white border border-delicate rounded font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-medium mb-1">Security CVC</label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full p-2.5 bg-white border border-delicate rounded font-mono text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-3 bg-stone/40 border border-delicate rounded text-[11px] text-muted flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-forest shrink-0" />
                  <span>
                    Simulated secure payment environment. No actual charges are made to any real card or account.
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-delicate flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1 text-xs text-muted hover:text-charcoal"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Delivery</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex items-center gap-2 px-6 py-3 bg-forest hover:bg-forest-dark text-white rounded-button text-xs font-semibold shadow-subtle transition-all"
                >
                  <span>Review Order</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 3: REVIEW ORDER ================= */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-delicate">
                <h2 className="font-serif text-xl font-bold text-charcoal">
                  3. Final Order Review
                </h2>
                <span className="text-xs text-muted font-mono">Step 3 of 3</span>
              </div>

              {/* Delivery and Payment Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-stone/30 border border-delicate rounded-card space-y-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono uppercase text-muted font-bold text-[10px]">
                      Shipping Destination
                    </span>
                    <button onClick={() => setStep(1)} className="text-forest hover:underline text-[11px]">
                      Edit
                    </button>
                  </div>
                  <p className="font-semibold text-charcoal">{address.fullName}</p>
                  <p className="text-muted">{address.addressLine1} {address.addressLine2}</p>
                  <p className="text-muted">{address.city}, {address.state} {address.postalCode}, {address.country}</p>
                  <p className="text-muted font-mono pt-1">{address.email} • {address.phone}</p>
                </div>

                <div className="p-4 bg-stone/30 border border-delicate rounded-card space-y-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono uppercase text-muted font-bold text-[10px]">
                      Fulfillment & Billing
                    </span>
                    <button onClick={() => setStep(2)} className="text-forest hover:underline text-[11px]">
                      Edit
                    </button>
                  </div>
                  <p className="font-semibold text-charcoal">{shippingMethod}</p>
                  <p className="text-muted">Estimated dispatch in 24 hours</p>
                  <p className="text-charcoal font-medium pt-2">
                    Payment Method: {paymentMethod === 'card' ? `Visa ending in 4242` : paymentMethod.toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Items in order */}
              <div className="space-y-3 pt-4 border-t border-delicate">
                <span className="text-xs font-mono uppercase tracking-wider text-muted block">
                  Items to be Dispatched ({cart.length})
                </span>

                <div className="space-y-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-white border border-delicate rounded-md text-xs">
                      <div className="flex items-center gap-3">
                        <img src={item.variant?.image || item.product.images[0]} alt="" className="w-12 h-12 object-cover rounded bg-stone" />
                        <div>
                          <p className="font-semibold text-charcoal">{item.product.name}</p>
                          <p className="text-muted">{item.variant?.name || item.selectedColor || ''} • Qty {item.quantity}</p>
                        </div>
                      </div>
                      <div className="font-mono font-bold text-charcoal">
                        ${(item.priceAtAdd * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-delicate flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1 text-xs text-muted hover:text-charcoal"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Payment</span>
                </button>
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  className="flex items-center gap-2 px-8 py-3.5 bg-forest hover:bg-forest-dark text-white rounded-button text-xs font-semibold shadow-elevated transition-all tracking-wide"
                >
                  <Check className="w-4 h-4" />
                  <span>Place Simulated Order (${grandTotal.toFixed(2)})</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right 4 Cols: Order Summary Sticky Card */}
        <div className="lg:col-span-4 bg-white border border-delicate rounded-card shadow-subtle p-6 space-y-5 sticky top-24">
          <h2 className="font-serif text-lg font-bold text-charcoal pb-3 border-b border-delicate">
            Summary
          </h2>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between text-muted">
              <span>Items Subtotal</span>
              <span className="text-charcoal font-medium font-mono">${subtotal.toFixed(2)}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-forest font-medium">
                <span>Promotional Discount ({appliedPromo?.code})</span>
                <span className="font-mono">-${discount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-muted">
              <span>Shipping & Handling</span>
              <span className="text-charcoal font-medium font-mono">
                {shippingFee === 0 ? 'Complimentary' : `$${shippingFee.toFixed(2)}`}
              </span>
            </div>

            <div className="flex justify-between text-muted">
              <span>Estimated Tax (8.25%)</span>
              <span className="text-charcoal font-medium font-mono">${tax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-base font-bold text-charcoal pt-3 border-t border-delicate">
              <span>Grand Total</span>
              <span className="font-mono">${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="p-3 bg-stone/40 rounded-card border border-delicate text-[11px] text-muted space-y-1">
            <p className="font-semibold text-charcoal">30-Day Guaranteed Returns</p>
            <p>Every piece is backed by our direct craftsmanship pledge and complimentary return courier pickup.</p>
          </div>
        </div>

      </div>

    </div>
  );
};
