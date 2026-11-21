import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCommerceStore } from '../../store/useCommerceStore';
import { CATEGORIES } from '../../data/categories';
import { 
  Search, 
  X, 
  ArrowRight, 
  Tag, 
  Flame, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const SearchModal: React.FC = () => {
  const navigate = useNavigate();
  const { isSearchModalOpen, setSearchModalOpen, products } = useCommerceStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchModalOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchModalOpen) {
        setSearchModalOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(!isSearchModalOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchModalOpen, setSearchModalOpen]);

  // Filter products by query (tolerant matching by name, brand, category, tags, specs)
  const results = useMemo(() => {
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
    }).slice(0, 6);
  }, [query, products]);

  // Matching categories
  const matchingCategories = useMemo(() => {
    if (!query.trim()) return [];
    const clean = query.toLowerCase().trim();
    return CATEGORIES.filter((c) => c.name.toLowerCase().includes(clean));
  }, [query]);

  // Matching brands
  const matchingBrands = useMemo(() => {
    if (!query.trim()) return [];
    const clean = query.toLowerCase().trim();
    const brands = Array.from(new Set(products.map((p) => p.brand)));
    return brands.filter((b) => b.toLowerCase().includes(clean));
  }, [query, products]);

  if (!isSearchModalOpen) return null;

  const handleSelectProduct = (slug: string) => {
    setSearchModalOpen(false);
    navigate(`/product/${slug}`);
  };

  const handleFullSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    setSearchModalOpen(false);
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 md:pt-20 px-4 bg-charcoal/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="fixed inset-0"
        onClick={() => setSearchModalOpen(false)}
      />

      <div className="relative w-full max-w-2xl bg-white border border-delicate rounded-card shadow-dropdown overflow-hidden z-10 flex flex-col text-charcoal">
        {/* Search Input Bar */}
        <form onSubmit={handleFullSearch} className="flex items-center gap-3 px-5 py-4 border-b border-delicate">
          <Search className="w-5 h-5 text-forest shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by product, brand, category, or specification..."
            className="flex-1 text-sm text-charcoal placeholder:text-muted/60 outline-none bg-transparent"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-muted hover:text-charcoal"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setSearchModalOpen(false)}
            className="text-xs text-muted hover:text-charcoal px-2 py-1 rounded bg-stone"
          >
            ESC
          </button>
        </form>

        {/* Content Box */}
        <div className="max-h-[65vh] overflow-y-auto p-5 space-y-6">
          {query.trim() === '' ? (
            /* Popular / Suggested Searches */
            <div className="space-y-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-muted font-mono block mb-2.5">
                  Popular Searches
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Wireless Headphones', 
                    'Ceramic Table Lamp', 
                    'French Linen Duvet', 
                    'Calfskin Sneaker', 
                    'Mazzucchelli Sunglasses',
                    'Cork Yoga Mat'
                  ].map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1.5 bg-stone/70 hover:bg-stone text-xs text-charcoal rounded-button transition-colors flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-champagne" />
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[11px] uppercase tracking-wider text-muted font-mono block mb-2.5">
                  Browse by Collection
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSearchModalOpen(false);
                        navigate(`/category/${cat.slug}`);
                      }}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-stone/60 transition-colors text-left"
                    >
                      <img 
                        src={cat.image} 
                        alt={cat.name} 
                        className="w-10 h-10 object-cover rounded-sm shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate text-charcoal">{cat.name}</p>
                        <p className="text-[10px] text-muted">{cat.itemCount} items</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : results.length === 0 ? (
            /* No Results */
            <div className="py-8 text-center">
              <p className="text-sm text-charcoal font-medium mb-1">No products found for "{query}"</p>
              <p className="text-xs text-muted mb-4">
                Try searching for broader keywords such as "speaker", "linen", "sneaker", or "lamp".
              </p>
              <button
                onClick={() => handleFullSearch()}
                className="px-4 py-2 bg-stone hover:bg-delicate text-xs font-medium rounded-button text-charcoal"
              >
                Browse All Products Instead
              </button>
            </div>
          ) : (
            /* Results Available */
            <div className="space-y-4">
              {/* Categories & Brand suggestions */}
              {(matchingCategories.length > 0 || matchingBrands.length > 0) && (
                <div className="flex flex-wrap gap-2 pb-3 border-b border-delicate">
                  {matchingCategories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSearchModalOpen(false);
                        navigate(`/category/${c.slug}`);
                      }}
                      className="px-2.5 py-1 bg-forest/10 text-forest text-xs rounded-full flex items-center gap-1 font-medium"
                    >
                      <Tag className="w-3 h-3" />
                      <span>Category: {c.name}</span>
                    </button>
                  ))}
                  {matchingBrands.map((b) => (
                    <button
                      key={b}
                      onClick={() => {
                        setSearchModalOpen(false);
                        navigate(`/shop?brand=${encodeURIComponent(b)}`);
                      }}
                      className="px-2.5 py-1 bg-stone text-charcoal text-xs rounded-full flex items-center gap-1 font-medium"
                    >
                      <span>Brand: {b}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Product Match List */}
              <div className="space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-muted font-mono block">
                  Product Matches ({results.length})
                </span>
                {results.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSelectProduct(product.slug)}
                    className="flex items-center gap-3.5 p-2.5 rounded-card hover:bg-stone/50 cursor-pointer transition-colors group"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-14 h-14 object-cover rounded-md bg-stone shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-mono text-muted tracking-wider">
                          {product.brand}
                        </span>
                        {product.isDeal && (
                          <span className="text-[9px] font-bold text-champagne bg-champagne/10 px-1.5 py-0.5 rounded-xs">
                            OFFER
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-charcoal group-hover:text-forest transition-colors truncate">
                        {product.name}
                      </p>
                      <p className="text-[11px] text-muted truncate">
                        {product.categoryName} • {product.variants.length} options
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-charcoal">
                        ${product.price.toFixed(2)}
                      </div>
                      {product.originalPrice && (
                        <div className="text-[10px] text-muted line-through">
                          ${product.originalPrice.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Full Search Link */}
              <div className="pt-2 text-center border-t border-delicate">
                <button
                  onClick={() => handleFullSearch()}
                  className="inline-flex items-center gap-1.5 text-xs text-forest font-semibold hover:underline"
                >
                  <span>View all matching results for "{query}"</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
