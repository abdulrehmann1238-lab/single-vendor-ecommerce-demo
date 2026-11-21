import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCommerceStore } from '../../store/useCommerceStore';
import { Check, ArrowRight, ShieldCheck, Truck, RefreshCw, Headphones } from 'lucide-react';

export const Footer: React.FC = () => {
  const { addToast } = useCommerceStore();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast({
        type: 'error',
        title: 'Invalid Email',
        description: 'Please enter a valid email address to subscribe.',
      });
      return;
    }

    setIsSubscribed(true);
    addToast({
      type: 'success',
      title: 'Subscribed to The Atelier Gazette',
      description: 'You will receive our private product drops and editorial dispatches.',
    });
  };

  return (
    <footer className="bg-dark text-stone border-t border-delicate/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Newsletter & Brand Statement Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-delicate/10">
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-sm bg-stone text-charcoal flex items-center justify-center font-serif text-lg font-bold">
                A
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                ATELIER & CO.
              </span>
            </div>
            <p className="text-xs text-muted leading-relaxed max-w-md">
              A single-vendor digital retail house dedicated to enduring materials, precision acoustics, sculptural interiors, and timeless everyday carry. Designed and fulfilled directly from our central ateliers.
            </p>
            <div className="text-[11px] text-sage font-mono">
              Independent Commerce Architecture • Pure Custom Code
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white/5 p-6 sm:p-8 rounded-card border border-white/10">
              <span className="text-[10px] uppercase tracking-widest text-champagne font-mono block mb-1">
                The Atelier Dispatch
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-white mb-2">
                A little something worth opening.
              </h3>
              <p className="text-xs text-stone/80 mb-6 max-w-lg leading-relaxed">
                Be the first to discover new arrivals, seasonal archive releases, and thoughtful editorial notes on craft and design.
              </p>

              {isSubscribed ? (
                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-4 py-3 rounded-button">
                  <Check className="w-4 h-4" />
                  <span>Thank you. You have been added to our private dispatch roster.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 bg-white/10 border border-white/20 rounded-button px-4 py-2.5 text-xs text-white placeholder:text-stone/50 outline-none focus:border-sage transition-colors"
                    required
                  />
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-1.5 px-5 py-2.5 bg-forest hover:bg-forest-light text-white text-xs font-semibold rounded-button transition-colors shadow-subtle shrink-0"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* 4 Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-delicate/10 text-xs">
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-widest text-white mb-4">
              Catalog & Shop
            </h4>
            <ul className="space-y-2.5 text-stone/80">
              <li><Link to="/shop" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/category/electronics" className="hover:text-white transition-colors">Electronics & Audio</Link></li>
              <li><Link to="/category/home-living" className="hover:text-white transition-colors">Home & Living</Link></li>
              <li><Link to="/category/fashion" className="hover:text-white transition-colors">Apparel & Leather</Link></li>
              <li><Link to="/category/beauty" className="hover:text-white transition-colors">Beauty & Skincare</Link></li>
              <li><Link to="/category/sports-outdoors" className="hover:text-white transition-colors">Active & Outdoors</Link></li>
              <li><Link to="/deals" className="hover:text-champagne transition-colors">Current Promotions</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-widest text-white mb-4">
              Customer Concierge
            </h4>
            <ul className="space-y-2.5 text-stone/80">
              <li><Link to="/help" className="hover:text-white transition-colors">Assistance & FAQ</Link></li>
              <li><Link to="/account/orders" className="hover:text-white transition-colors">Track an Order</Link></li>
              <li><Link to="/account/returns" className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/help" className="hover:text-white transition-colors">Complimentary Delivery</Link></li>
              <li><Link to="/help" className="hover:text-white transition-colors">Warranty & Repairs</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Concierge</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-widest text-white mb-4">
              Our House
            </h4>
            <ul className="space-y-2.5 text-stone/80">
              <li><Link to="/about" className="hover:text-white transition-colors">The Atelier Story</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Material Standards</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Carbon-Neutral Pledge</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Design Philosophies</Link></li>
              <li><Link to="/admin" className="text-sage hover:text-white transition-colors font-medium">Internal Administration</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-widest text-white mb-4">
              Client Account
            </h4>
            <ul className="space-y-2.5 text-stone/80">
              <li><Link to="/account" className="hover:text-white transition-colors">Account Overview</Link></li>
              <li><Link to="/account/orders" className="hover:text-white transition-colors">Order History</Link></li>
              <li><Link to="/wishlist" className="hover:text-white transition-colors">Saved Wishlist</Link></li>
              <li><Link to="/account/addresses" className="hover:text-white transition-colors">Shipping Addresses</Link></li>
              <li><Link to="/account/profile" className="hover:text-white transition-colors">Profile Preferences</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Payment Badges */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-muted">
          <div>
            © {new Date().getFullYear()} ATELIER & CO. All rights reserved. Custom single-vendor retail platform demonstration.
          </div>

          {/* Payment Method Badges */}
          <div className="flex items-center gap-3 text-stone/60 font-mono text-[10px]">
            <span className="px-2 py-1 bg-white/10 rounded-xs">VISA</span>
            <span className="px-2 py-1 bg-white/10 rounded-xs">MASTERCARD</span>
            <span className="px-2 py-1 bg-white/10 rounded-xs">AMEX</span>
            <span className="px-2 py-1 bg-white/10 rounded-xs">APPLE PAY</span>
            <span className="px-2 py-1 bg-white/10 rounded-xs">PAYPAL</span>
            <span className="px-2 py-1 bg-white/10 rounded-xs">KLARNA</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
