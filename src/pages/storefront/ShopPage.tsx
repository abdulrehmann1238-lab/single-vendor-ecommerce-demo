import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCommerceStore } from '../../store/useCommerceStore';
import { CATEGORIES } from '../../data/categories';
import { ProductCard } from '../../components/product/ProductCard';
import { CategorySlug } from '../../types';
import { 
  Filter, 
  X, 
  SlidersHorizontal, 
  Star, 
  ChevronDown, 
  Check, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products } = useCommerceStore();

  // Local filter states
  const initialCategory = (searchParams.get('category') as CategorySlug) || 'all';
  const initialBrand = searchParams.get('brand') || '';

  const [selectedCategory, setSelectedCategory] = useState<CategorySlug | 'all'>(initialCategory);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(initialBrand ? [initialBrand] : []);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Extract unique brands
  const allBrands = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.brand))).sort();
  }, [products]);

  // Sync with URL params if they change
  useEffect(() => {
    const cat = searchParams.get('category') as CategorySlug;
    if (cat) setSelectedCategory(cat);
    const br = searchParams.get('brand');
    if (br) setSelectedBrands([br]);
  }, [searchParams]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) {
        return false;
      }
      // Price range filter
      if (p.price < priceRange[0] || p.price > priceRange[1]) {
        return false;
      }
      // Rating filter
      if (minRating > 0 && p.rating < minRating) {
        return false;
      }
      // Stock filter
      if (inStockOnly && p.stock <= 0) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0; // relevance
    });
  }, [products, selectedCategory, selectedBrands, priceRange, minRating, inStockOnly, sortBy]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) => 
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSelectedBrands([]);
    setPriceRange([0, 500]);
    setMinRating(0);
    setInStockOnly(false);
    setSortBy('relevance');
    setSearchParams({});
  };

  const hasActiveFilters = 
    selectedCategory !== 'all' || 
    selectedBrands.length > 0 || 
    priceRange[0] > 0 || 
    priceRange[1] < 500 || 
    minRating > 0 || 
    inStockOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      
      {/* Header Banner */}
      <div className="mb-8 pb-6 border-b border-delicate flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-forest">
            The Catalog
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal mt-1">
            All Products
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Displaying {filteredProducts.length} of {products.length} independently crafted goods
          </p>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3.5 py-2 bg-white border border-delicate rounded-button text-xs font-medium text-charcoal"
          >
            <Filter className="w-4 h-4 text-forest" />
            <span>Filters ({hasActiveFilters ? 'Active' : 'All'})</span>
          </button>

          <div className="flex items-center gap-2 bg-white border border-delicate rounded-button px-3 py-2 text-xs">
            <span className="text-muted hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-charcoal font-medium outline-none cursor-pointer"
            >
              <option value="relevance">Featured Relevance</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-stone/40 border border-delicate rounded-card">
          <span className="text-xs text-muted font-mono">Active Filters:</span>
          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-delicate rounded-full text-xs text-charcoal">
              Category: {CATEGORIES.find((c) => c.slug === selectedCategory)?.name}
              <button onClick={() => setSelectedCategory('all')}>
                <X className="w-3 h-3 hover:text-error" />
              </button>
            </span>
          )}
          {selectedBrands.map((b) => (
            <span key={b} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-delicate rounded-full text-xs text-charcoal">
              Brand: {b}
              <button onClick={() => toggleBrand(b)}>
                <X className="w-3 h-3 hover:text-error" />
              </button>
            </span>
          ))}
          {(priceRange[0] > 0 || priceRange[1] < 500) && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-delicate rounded-full text-xs text-charcoal">
              Price: ${priceRange[0]} - ${priceRange[1]}
              <button onClick={() => setPriceRange([0, 500])}>
                <X className="w-3 h-3 hover:text-error" />
              </button>
            </span>
          )}
          {minRating > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-delicate rounded-full text-xs text-charcoal">
              ★ {minRating}+ Stars
              <button onClick={() => setMinRating(0)}>
                <X className="w-3 h-3 hover:text-error" />
              </button>
            </span>
          )}
          {inStockOnly && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-delicate rounded-full text-xs text-charcoal">
              In Stock Only
              <button onClick={() => setInStockOnly(false)}>
                <X className="w-3 h-3 hover:text-error" />
              </button>
            </span>
          )}
          <button
            onClick={handleClearFilters}
            className="text-xs text-forest hover:underline font-semibold ml-auto"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Grid with Sidebar Layout */}
      <div className="flex gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-6 sticky top-24">
          
          {/* Category Filter */}
          <div className="pb-5 border-b border-delicate">
            <h3 className="text-xs font-mono uppercase tracking-wider text-charcoal font-bold mb-3">
              Category
            </h3>
            <div className="space-y-1.5 text-xs">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left py-1 px-2 rounded-sm transition-colors flex items-center justify-between ${
                  selectedCategory === 'all'
                    ? 'bg-forest text-white font-medium'
                    : 'text-charcoal hover:bg-stone'
                }`}
              >
                <span>All Categories</span>
                <span>{products.length}</span>
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-left py-1 px-2 rounded-sm transition-colors flex items-center justify-between ${
                    selectedCategory === cat.slug
                      ? 'bg-forest text-white font-medium'
                      : 'text-charcoal hover:bg-stone'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span>{cat.itemCount}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="pb-5 border-b border-delicate">
            <h3 className="text-xs font-mono uppercase tracking-wider text-charcoal font-bold mb-3">
              Price Range
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-muted">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
              <input
                type="range"
                min="0"
                max="500"
                step="10"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-full accent-forest cursor-pointer"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-1/2 p-1.5 bg-white border border-delicate rounded text-xs text-charcoal"
                  placeholder="Min"
                />
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-1/2 p-1.5 bg-white border border-delicate rounded text-xs text-charcoal"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>

          {/* Brand Filter */}
          <div className="pb-5 border-b border-delicate">
            <h3 className="text-xs font-mono uppercase tracking-wider text-charcoal font-bold mb-3">
              Makers & Brands
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {allBrands.map((brand) => (
                <label key={brand} className="flex items-center gap-2.5 text-xs text-charcoal cursor-pointer hover:text-forest">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="rounded border-delicate text-forest focus:ring-forest"
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Customer Rating Filter */}
          <div className="pb-5 border-b border-delicate">
            <h3 className="text-xs font-mono uppercase tracking-wider text-charcoal font-bold mb-3">
              Customer Rating
            </h3>
            <div className="space-y-2">
              {[4, 3].map((stars) => (
                <button
                  key={stars}
                  onClick={() => setMinRating(minRating === stars ? 0 : stars)}
                  className={`w-full flex items-center justify-between text-xs p-1.5 rounded transition-colors ${
                    minRating === stars ? 'bg-stone text-forest font-semibold' : 'hover:bg-stone text-charcoal'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="flex text-champagne">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < stars ? 'fill-champagne text-champagne' : 'text-delicate'
                          }`}
                        />
                      ))}
                    </div>
                    <span>{stars}★ & above</span>
                  </div>
                  {minRating === stars && <Check className="w-3.5 h-3.5 text-forest" />}
                </button>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="pb-5">
            <label className="flex items-center gap-2.5 text-xs text-charcoal cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded border-delicate text-forest focus:ring-forest"
              />
              <span className="font-medium">In Stock Only</span>
            </label>
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="flex items-center justify-center gap-1.5 w-full py-2 bg-stone hover:bg-delicate text-xs font-medium rounded-button text-charcoal transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          )}
        </aside>

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center bg-white border border-delicate rounded-card space-y-4">
              <p className="font-serif text-xl text-charcoal">No products match your criteria</p>
              <p className="text-xs text-muted max-w-sm mx-auto">
                Try widening your price range, clearing brand selections, or searching for broader collections.
              </p>
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-forest text-white text-xs font-semibold rounded-button"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Slide-in Bottom Sheet */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-charcoal/50 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-elevated p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-delicate">
                <h3 className="font-serif text-lg font-bold">Filters</h3>
                <button onClick={() => setMobileFilterOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category */}
              <div>
                <h4 className="text-xs font-bold uppercase mb-2">Category</h4>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as any)}
                  className="w-full p-2 bg-stone border border-delicate rounded text-xs"
                >
                  <option value="all">All Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Brands */}
              <div>
                <h4 className="text-xs font-bold uppercase mb-2">Brands</h4>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {allBrands.map((b) => (
                    <label key={b} className="flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(b)}
                        onChange={() => toggleBrand(b)}
                      />
                      <span>{b}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* In stock */}
              <div>
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                  />
                  <span>In Stock Only</span>
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-delicate flex gap-2">
              <button
                onClick={handleClearFilters}
                className="flex-1 py-2 bg-stone text-xs font-semibold rounded-button"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2 bg-forest text-white text-xs font-semibold rounded-button"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
