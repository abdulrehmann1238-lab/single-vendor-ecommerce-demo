import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCommerceStore } from '../../store/useCommerceStore';
import { CATEGORIES } from '../../data/categories';
import { ProductCard } from '../../components/product/ProductCard';
import { ArrowLeft, Sparkles, Filter } from 'lucide-react';

export const CategoryDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { products } = useCommerceStore();

  const category = CATEGORIES.find((c) => c.slug === slug);
  const categoryProducts = products.filter((p) => p.category === slug);

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl mb-2">Category Not Found</h2>
        <Link to="/categories" className="text-forest hover:underline text-xs">
          Return to all collections
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
      
      {/* Editorial Category Banner */}
      <div className="relative rounded-card overflow-hidden bg-dark min-h-[280px] flex items-center p-8 sm:p-12">
        <img
          src={category.image}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark/95 via-dark/70 to-transparent" />

        <div className="relative z-10 max-w-xl text-white space-y-3">
          <Link
            to="/categories"
            className="inline-flex items-center gap-1.5 text-xs text-stone/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Collections</span>
          </Link>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight">
            {category.name}
          </h1>
          <p className="text-xs sm:text-sm text-stone/80 leading-relaxed font-light">
            {category.description}
          </p>
          <span className="inline-block text-[11px] font-mono uppercase tracking-widest text-champagne pt-1">
            {categoryProducts.length} Items In Stock & Available
          </span>
        </div>
      </div>

      {/* Products Grid */}
      <div>
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-delicate">
          <h2 className="font-serif text-xl sm:text-2xl text-charcoal">
            Curated {category.name} ({categoryProducts.length})
          </h2>
          <Link
            to={`/shop?category=${category.slug}`}
            className="inline-flex items-center gap-1 text-xs text-forest font-semibold hover:underline"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filter and Sort in Shop</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categoryProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </div>

    </div>
  );
};

export const CategoriesPage: React.FC = () => {
  const { products } = useCommerceStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10">
      <div>
        <span className="text-xs uppercase font-mono tracking-widest text-forest">
          Atelier Directory
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal mt-1">
          Explore by Category
        </h1>
        <p className="text-xs sm:text-sm text-muted mt-1 max-w-lg">
          Browse our comprehensive spectrum of audio equipment, artisanal home ceramics, tailored apparel, and conscious outdoor equipment.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((cat) => {
          const count = products.filter((p) => p.category === cat.slug).length;
          return (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="group relative h-96 rounded-card overflow-hidden bg-stone border border-delicate shadow-subtle hover:shadow-elevated transition-all flex flex-col justify-end p-8"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover zoom-subtle transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent" />

              <div className="relative z-10 text-white space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-champagne">
                  {count} Products Stocked
                </span>
                <h3 className="font-serif text-2xl font-bold tracking-tight">
                  {cat.name}
                </h3>
                <p className="text-xs text-stone/80 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
                <div className="pt-2 text-xs font-semibold text-white group-hover:text-champagne transition-colors">
                  Explore Collection →
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
