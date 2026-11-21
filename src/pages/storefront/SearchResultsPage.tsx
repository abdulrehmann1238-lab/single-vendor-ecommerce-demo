import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCommerceStore } from '../../store/useCommerceStore';
import { ProductCard } from '../../components/product/ProductCard';
import { Search, Filter, ArrowRight } from 'lucide-react';

export const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { products } = useCommerceStore();

  const matchingProducts = useMemo(() => {
    if (!query.trim()) return [];
    const clean = query.toLowerCase().trim();

    return products.filter((p) => {
      return (
        p.name.toLowerCase().includes(clean) ||
        p.brand.toLowerCase().includes(clean) ||
        p.categoryName.toLowerCase().includes(clean) ||
        p.tags.some((t) => t.toLowerCase().includes(clean)) ||
        Object.values(p.specifications).some((val) => val.toLowerCase().includes(clean))
      );
    });
  }, [query, products]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      
      {/* Search Header */}
      <div className="pb-6 border-b border-delicate">
        <span className="text-xs font-mono uppercase tracking-widest text-forest">
          Search Discovery
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl text-charcoal font-normal mt-1">
          {query ? `Results for "${query}"` : 'Search our Catalog'}
        </h1>
        <p className="text-xs text-muted mt-1">
          {matchingProducts.length} matching products found in catalog
        </p>
      </div>

      {/* Grid or Empty */}
      {matchingProducts.length === 0 ? (
        <div className="p-16 text-center bg-white border border-delicate rounded-card max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-stone flex items-center justify-center text-muted mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl text-charcoal">No direct matches found</h3>
          <p className="text-xs text-muted leading-relaxed">
            We couldn't locate any products matching "{query}". Try checking your spelling or searching for broad keywords like "audio", "lamp", "linen", or "leather".
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-forest text-white text-xs font-semibold rounded-button"
            >
              <span>Explore All Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {matchingProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

    </div>
  );
};
