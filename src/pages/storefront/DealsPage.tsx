import React from 'react';
import { Link } from 'react-router-dom';
import { useCommerceStore } from '../../store/useCommerceStore';
import { ProductCard } from '../../components/product/ProductCard';
import { Tag, Clock, Flame, Sparkles, ArrowRight } from 'lucide-react';

export const DealsPage: React.FC = () => {
  const { products, promotions } = useCommerceStore();
  const dealProducts = products.filter((p) => p.isDeal || (p.originalPrice && p.originalPrice > p.price));
  const activePromos = promotions.filter((p) => p.isActive);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
      
      {/* Header Banner */}
      <div className="p-8 sm:p-12 rounded-card bg-stone/70 border border-delicate flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-champagne/15 text-champagne-dark text-xs font-mono">
            <Flame className="w-3.5 h-3.5 text-champagne" />
            <span>Limited-Time Curated Offers</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
            Seasonal Promotions & Value Edits
          </h1>
          <p className="text-xs sm:text-sm text-muted leading-relaxed font-light">
            Exceptional designs at archive promotional pricing. Every order includes our complimentary delivery over $150 and 30-day trial guarantee.
          </p>
        </div>

        {/* Promo Code Cards */}
        <div className="flex flex-col gap-2 shrink-0">
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted">
            Available Discount Codes:
          </span>
          <div className="flex flex-wrap gap-2">
            {activePromos.map((promo) => (
              <div key={promo.id} className="p-2.5 bg-white border border-delicate rounded-md text-xs shadow-xs">
                <span className="font-mono font-bold text-forest">{promo.code}</span>
                <span className="text-[11px] text-muted block">{promo.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Deals Product Grid */}
      <div>
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-delicate">
          <h2 className="font-serif text-xl sm:text-2xl text-charcoal">
            Promotional Archive ({dealProducts.length} items)
          </h2>
          <span className="text-xs text-muted font-mono">Prices reflected at checkout</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {dealProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </div>

    </div>
  );
};
