import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { useCommerceStore } from '../../store/useCommerceStore';
import { Star, Heart, Eye, ShoppingBag, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  featuredLayout?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, featuredLayout }) => {
  const { wishlist, toggleWishlist, addToCart, setQuickViewProductId } = useCommerceStore();
  const [isHovered, setIsHovered] = useState(false);
  const inWishlist = wishlist.includes(product.id);

  // Discount percentage calculation
  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProductId(product.id);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col bg-white border border-delicate rounded-card overflow-hidden hover:shadow-elevated transition-all duration-300"
    >
      {/* Product Image Stage */}
      <Link 
        to={`/product/${product.slug}`} 
        className="relative aspect-square w-full overflow-hidden bg-stone block"
      >
        <img
          src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover zoom-subtle transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges: Discount / Best Seller */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {discountPercent > 0 && (
            <span className="bg-forest text-white text-[10px] font-bold px-2 py-0.5 rounded-xs tracking-wider uppercase">
              Save {discountPercent}%
            </span>
          )}
          {product.featured && (
            <span className="bg-dark/80 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-xs tracking-wider uppercase">
              Considered Pick
            </span>
          )}
        </div>

        {/* Top-Right Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-xs transition-all z-10 ${
            inWishlist
              ? 'bg-white text-champagne shadow-sm'
              : 'bg-white/80 hover:bg-white text-charcoal opacity-90 group-hover:opacity-100'
          }`}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-champagne text-champagne' : ''}`} />
        </button>

        {/* Quick View & Quick Add Floating Overlay on Hover */}
        <div className="absolute inset-x-3 bottom-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            onClick={handleQuickAdd}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-charcoal hover:bg-forest text-white text-[11px] font-medium rounded-button shadow-md transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Quick Bag</span>
          </button>
          <button
            onClick={handleQuickView}
            className="p-2 bg-white/95 hover:bg-white text-charcoal text-[11px] font-medium rounded-button shadow-md transition-colors"
            title="Quick Preview"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </Link>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-charcoal">
              <Star className="w-3 h-3 fill-champagne text-champagne" />
              <span className="font-semibold">{product.rating}</span>
              <span className="text-muted text-[10px]">({product.reviewCount})</span>
            </div>
          </div>

          <Link to={`/product/${product.slug}`} className="block group-hover:text-forest transition-colors">
            <h3 className="font-serif text-sm sm:text-base font-bold text-charcoal line-clamp-1 mb-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-[11px] text-muted line-clamp-2 leading-relaxed mb-3">
            {product.shortDescription || product.description}
          </p>
        </div>

        {/* Price & Variant Chips */}
        <div className="pt-2 border-t border-delicate/60 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-bold text-charcoal font-mono">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-muted line-through font-mono">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {product.variants.length > 0 && (
            <span className="text-[10px] text-muted font-mono">
              {product.variants.length} finishes
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
