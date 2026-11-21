import React from 'react';
import { Link } from 'react-router-dom';
import { useCommerceStore } from '../../store/useCommerceStore';
import { ProductCard } from '../../components/product/ProductCard';
import { Heart, Trash2, ArrowRight } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, products, removeFromWishlist } = useCommerceStore();
  const savedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      
      {/* Header */}
      <div className="pb-4 border-b border-delicate flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
            Saved Wishlist
          </h1>
          <p className="text-xs text-muted mt-1">
            {savedProducts.length} items curated for your future considerations
          </p>
        </div>

        {savedProducts.length > 0 && (
          <button
            onClick={() => savedProducts.forEach((p) => removeFromWishlist(p.id))}
            className="text-xs text-muted hover:text-error transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Wishlist</span>
          </button>
        )}
      </div>

      {savedProducts.length === 0 ? (
        <div className="p-16 text-center bg-white border border-delicate rounded-card max-w-md mx-auto space-y-4">
          <div className="w-14 h-14 rounded-full bg-stone flex items-center justify-center text-muted mx-auto">
            <Heart className="w-6 h-6 stroke-1" />
          </div>
          <h3 className="font-serif text-xl text-charcoal">Your wishlist is empty</h3>
          <p className="text-xs text-muted">
            Tap the heart emblem on any product card while browsing to save it to your private atelier collection.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-forest text-white text-xs font-semibold rounded-button"
          >
            <span>Explore Goods</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {savedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

    </div>
  );
};
