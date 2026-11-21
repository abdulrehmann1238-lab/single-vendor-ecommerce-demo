import React, { useState } from 'react';
import { useCommerceStore } from '../../store/useCommerceStore';
import { 
  X, 
  Star, 
  ShoppingBag, 
  Heart, 
  Check, 
  ShieldCheck, 
  Truck,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const QuickViewModal: React.FC = () => {
  const navigate = useNavigate();
  const { 
    products, 
    quickViewProductId, 
    setQuickViewProductId, 
    addToCart, 
    toggleWishlist, 
    wishlist 
  } = useCommerceStore();

  const product = products.find((p) => p.id === quickViewProductId);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const inWishlist = wishlist.includes(product.id);
  const currentVariant = product.variants[selectedVariantIndex] || product.variants[0];
  const currentPrice = currentVariant?.price ?? product.price;

  const handleClose = () => {
    setQuickViewProductId(null);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, currentVariant);
    handleClose();
  };

  const handleFullDetail = () => {
    handleClose();
    navigate(`/product/${product.slug}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="fixed inset-0"
        onClick={handleClose}
      />

      <div className="relative max-w-3xl w-full bg-white border border-delicate rounded-card shadow-dropdown overflow-hidden z-10 flex flex-col md:flex-row text-charcoal">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-1.5 text-muted hover:text-charcoal rounded-full bg-white/80 backdrop-blur-xs transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Media Gallery */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between bg-ivory/40">
          <div className="aspect-square rounded-card overflow-hidden bg-stone mb-4 relative">
            <img
              src={product.images[selectedImage] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.isDeal && (
              <span className="absolute top-3 left-3 bg-champagne text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs">
                Limited Deal
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-14 h-14 rounded-md overflow-hidden border-2 transition-all ${
                    selectedImage === idx ? 'border-forest' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Actions */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between space-y-5">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-muted mb-1">
              {product.brand} • {product.categoryName}
            </div>
            <h2 className="font-serif text-xl font-bold text-charcoal mb-2">
              {product.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center text-champagne">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-champagne text-champagne'
                        : 'text-delicate'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-charcoal">{product.rating}</span>
              <span className="text-xs text-muted">({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-2xl font-bold text-charcoal font-mono">
                ${currentPrice.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted line-through font-mono">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-xs text-muted leading-relaxed line-clamp-3 mb-4">
              {product.description}
            </p>

            {/* Variant Selector */}
            {product.variants.length > 0 && (
              <div className="mb-4">
                <span className="text-[11px] uppercase font-mono tracking-wider text-muted block mb-2">
                  Options: <strong className="text-charcoal font-sans">{currentVariant?.name}</strong>
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v, idx) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariantIndex(idx)}
                      className={`px-3 py-1.5 rounded-button text-xs transition-all border ${
                        selectedVariantIndex === idx
                          ? 'border-forest bg-forest text-white'
                          : 'border-delicate bg-stone/40 text-charcoal hover:bg-stone'
                      }`}
                    >
                      {v.attributes.color || v.attributes.size || v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock indicator */}
            <div className="flex items-center gap-1.5 text-xs text-forest mb-4">
              <span className="w-2 h-2 rounded-full bg-forest" />
              <span>
                {product.stock > 10 ? 'In stock and ready to ship' : `Only ${product.stock} left in stock`}
              </span>
            </div>
          </div>

          {/* Add to bag / Wishlist / Full Detail */}
          <div className="space-y-2 pt-2 border-t border-delicate">
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-forest hover:bg-forest-dark text-white rounded-button text-xs font-semibold shadow-subtle transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Shopping Bag</span>
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-2.5 rounded-button border transition-colors ${
                  inWishlist
                    ? 'border-champagne text-champagne bg-champagne/10'
                    : 'border-delicate hover:bg-stone text-charcoal'
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-champagne' : ''}`} />
              </button>
            </div>

            <button
              onClick={handleFullDetail}
              className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-muted hover:text-charcoal transition-colors font-medium"
            >
              <span>View Full Product Specifications</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
