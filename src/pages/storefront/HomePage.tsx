import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCommerceStore } from '../../store/useCommerceStore';
import { CATEGORIES } from '../../data/categories';
import { ProductCard } from '../../components/product/ProductCard';
import { 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  Headphones, 
  ArrowRight, 
  ChevronRight, 
  ChevronLeft, 
  Flame, 
  Clock, 
  Sparkles, 
  Star, 
  CheckCircle2,
  Tag
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { products, recentlyViewedIds } = useCommerceStore();
  const trendingContainerRef = useRef<HTMLDivElement>(null);

  // Flash Sale Live Countdown Timer (simulated 3 days from now)
  const [timeLeft, setTimeLeft] = useState({
    hours: 28,
    minutes: 42,
    seconds: 19,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter curated products
  const featuredProducts = products.filter((p) => p.featured).slice(0, 8);
  const flashDeals = products.filter((p) => p.isDeal).slice(0, 4);
  const trendingProducts = products.slice(8, 16);
  const recommendedProducts = products.filter((p) => p.category === 'home-living' || p.category === 'electronics').slice(0, 4);
  const recentlyViewedProducts = products.filter((p) => recentlyViewedIds.includes(p.id)).slice(0, 4);

  const scrollTrending = (direction: 'left' | 'right') => {
    if (trendingContainerRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      trendingContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* ================= SECTION 1: HERO EXPERIENCE ================= */}
      <section className="relative w-full min-h-[82vh] md:min-h-[88vh] flex items-center bg-dark overflow-hidden">
        {/* Cinematic Background Video & Fallback Poster */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1920&q=80"
            className="w-full h-full object-cover opacity-45 scale-102 transition-opacity duration-1000"
          >
            <source
              src="https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-living-room-with-cozy-furniture-41480-large.mp4"
              type="video/mp4"
            />
          </video>
          {/* Subtle gradient overlay to ensure WCAG AA contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-dark/90 via-dark/65 to-dark/40" />
        </div>

        {/* Content Box */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-2xl text-ivory space-y-6 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-xs border border-white/15 rounded-full text-[11px] font-mono tracking-widest uppercase text-champagne">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Thoughtfully Selected. Made for Everyday.</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white font-normal leading-[1.1] tracking-tight">
              Everything you need. <br />
              <span className="italic font-normal text-stone/90">A better way to shop.</span>
            </h1>

            <p className="text-sm sm:text-base text-stone/80 max-w-lg leading-relaxed font-light">
              Discover a considered collection of precision audio, architectural ceramics, and enduring leather essentials—direct from our makers with unified fulfillment.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-forest hover:bg-forest-light text-white text-xs sm:text-sm font-semibold rounded-button transition-all shadow-subtle tracking-wide"
              >
                <span>Explore the Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/deals"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium rounded-button border border-white/20 backdrop-blur-xs transition-colors"
              >
                <Tag className="w-4 h-4 text-champagne" />
                <span>Discover This Week's Offers</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Corner Caption */}
        <div className="absolute bottom-6 right-6 z-10 hidden sm:block text-right text-[11px] text-stone/60 font-mono">
          <p>Atelier Collection No. 04</p>
          <p className="text-sage">Stocked in Central Logistics</p>
        </div>
      </section>

      {/* ================= SECTION 2: TRUST STRIP ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20">
        <div className="bg-white border border-delicate rounded-card shadow-elevated p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-stone flex items-center justify-center text-forest shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-charcoal">Secure Checkout</h4>
              <p className="text-[11px] text-muted">256-bit encrypted simulated orders</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-stone flex items-center justify-center text-forest shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-charcoal">Fast & Reliable</h4>
              <p className="text-[11px] text-muted">Complimentary on orders $150+</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-stone flex items-center justify-center text-forest shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-charcoal">Considerate Returns</h4>
              <p className="text-[11px] text-muted">30-day hassle-free return policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-stone flex items-center justify-center text-forest shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-charcoal">Dedicated Support</h4>
              <p className="text-[11px] text-muted">Personal product specialists</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 3: SHOP BY CATEGORY ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-forest">
              Considered Curations
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-charcoal font-normal mt-1">
              Find your next favorite.
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted max-w-sm">
            Explore six focused collections selected for the way you live, work, and dwell.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="group relative h-80 rounded-card overflow-hidden bg-stone border border-delicate shadow-subtle hover:shadow-elevated transition-all duration-300 flex flex-col justify-end p-6"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover zoom-subtle transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent" />

              <div className="relative z-10 text-white space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-champagne">
                  {cat.itemCount} Curated Goods
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight">
                  {cat.name}
                </h3>
                <p className="text-xs text-stone/80 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
                <div className="pt-2 flex items-center gap-1.5 text-xs text-white font-semibold group-hover:text-champagne transition-colors">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= SECTION 4: FEATURED PRODUCTS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-forest">
              Everyday Value
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-charcoal font-normal mt-1">
              Considered favorites.
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest hover:text-forest-dark transition-colors"
          >
            <span>View All ({products.length} Products)</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ================= SECTION 5: FEATURED DEALS / FLASH SALES ================= */}
      <section className="bg-stone/60 border-y border-delicate py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-delicate">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-champagne-dark mb-1">
                <Flame className="w-4 h-4 text-champagne" />
                <span>Limited-Time Promotions</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-charcoal font-normal">
                Exceptional finds. Limited-time prices.
              </h2>
            </div>

            {/* Live Countdown Timer */}
            <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-card border border-delicate shadow-subtle">
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <Clock className="w-4 h-4 text-forest" />
                <span>Offer ends in:</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-sm font-bold text-charcoal">
                <div className="bg-stone px-2 py-1 rounded text-center min-w-[2.2rem]">
                  {String(timeLeft.hours).padStart(2, '0')}
                  <span className="block text-[9px] font-sans font-normal text-muted -mt-0.5">hrs</span>
                </div>
                <span>:</span>
                <div className="bg-stone px-2 py-1 rounded text-center min-w-[2.2rem]">
                  {String(timeLeft.minutes).padStart(2, '0')}
                  <span className="block text-[9px] font-sans font-normal text-muted -mt-0.5">min</span>
                </div>
                <span>:</span>
                <div className="bg-stone px-2 py-1 rounded text-center min-w-[2.2rem]">
                  {String(timeLeft.seconds).padStart(2, '0')}
                  <span className="block text-[9px] font-sans font-normal text-muted -mt-0.5">sec</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {flashDeals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/deals"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-ivory text-charcoal text-xs font-semibold rounded-button border border-delicate shadow-subtle transition-all"
            >
              <span>Explore All Current Offers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= SECTION 6: EDITORIAL SPLIT BANNER ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 rounded-card overflow-hidden bg-white border border-delicate shadow-elevated">
          {/* Left Lifestyle Photo */}
          <div className="relative h-72 sm:h-96 lg:h-auto min-h-[360px] bg-stone">
            <img
              src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80"
              alt="Sculptural Interior"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-dark/20" />
          </div>

          {/* Right Editorial Copy */}
          <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center space-y-6 bg-ivory">
            <span className="text-xs font-mono uppercase tracking-widest text-forest">
              Direct-to-Consumer Integrity
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal leading-tight">
              The little upgrades make a difference.
            </h2>
            <p className="text-xs sm:text-sm text-muted leading-relaxed font-light">
              We design and produce with single-minded focus on materials that gain character over time—from unlacquered marine brass and European white oak to Normandy linen and vegetable-tanned Tuscan calfskin.
            </p>
            <div className="pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-forest hover:bg-forest-dark text-white text-xs font-semibold rounded-button transition-colors shadow-subtle"
              >
                <span>Explore the Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 7: TRENDING NOW ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-forest">
              High Velocity
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-charcoal font-normal mt-1">
              Trending now.
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollTrending('left')}
              className="p-2 rounded-full border border-delicate bg-white hover:bg-stone text-charcoal transition-colors shadow-subtle"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollTrending('right')}
              className="p-2 rounded-full border border-delicate bg-white hover:bg-stone text-charcoal transition-colors shadow-subtle"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Carousel */}
        <div
          ref={trendingContainerRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory scrollbar-none"
        >
          {trendingProducts.map((product) => (
            <div
              key={product.id}
              className="w-64 sm:w-72 shrink-0 snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* ================= SECTION 8: PERSONALIZED RECOMMENDATIONS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Recommended for you */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-xl sm:text-2xl text-charcoal font-normal">
              Recommended for you
            </h3>
            <span className="text-xs text-muted font-mono">Curated by Atelier algorithms</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {recommendedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>

        {/* Recently viewed products */}
        {recentlyViewedProducts.length > 0 && (
          <div className="pt-6 border-t border-delicate">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-xl sm:text-2xl text-charcoal font-normal">
                Recently viewed
              </h3>
              <span className="text-xs text-muted font-mono">From your current session</span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {recentlyViewedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ================= SECTION 9: CUSTOMER TRUST AND REVIEWS ================= */}
      <section className="bg-white border-y border-delicate py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <div className="flex items-center justify-center gap-1 text-champagne mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-champagne text-champagne" />
              ))}
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-charcoal font-normal">
              Trusted by 14,000+ patrons worldwide.
            </h2>
            <p className="text-xs text-muted mt-2">
              4.9 out of 5 stars based on verified purchases across our single-vendor catalog.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-ivory rounded-card border border-delicate flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-1 text-champagne mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-champagne text-champagne" />
                  ))}
                </div>
                <h4 className="font-serif text-base font-bold text-charcoal mb-2">
                  "The stoneware lamp is pure sculpture."
                </h4>
                <p className="text-xs text-muted leading-relaxed">
                  The mineral glaze and linen drum shade diffuse light with such warmth. You can immediately feel the weight and artisanal craft in the base.
                </p>
              </div>
              <div className="pt-3 border-t border-delicate/60 flex items-center justify-between text-[11px]">
                <span className="font-bold text-charcoal">Helena Vance</span>
                <span className="text-forest flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Patron
                </span>
              </div>
            </div>

            <div className="p-6 bg-ivory rounded-card border border-delicate flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-1 text-champagne mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-champagne text-champagne" />
                  ))}
                </div>
                <h4 className="font-serif text-base font-bold text-charcoal mb-2">
                  "Bio-cellulose acoustic brilliance."
                </h4>
                <p className="text-xs text-muted leading-relaxed">
                  As an audio engineer, I appreciate the neutral tuning. The lambskin cushions are exceptionally comfortable for extended listening sessions.
                </p>
              </div>
              <div className="pt-3 border-t border-delicate/60 flex items-center justify-between text-[11px]">
                <span className="font-bold text-charcoal">Marcus Sterling</span>
                <span className="text-forest flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Patron
                </span>
              </div>
            </div>

            <div className="p-6 bg-ivory rounded-card border border-delicate flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-1 text-champagne mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-champagne text-champagne" />
                  ))}
                </div>
                <h4 className="font-serif text-base font-bold text-charcoal mb-2">
                  "Flawless linen and fast delivery."
                </h4>
                <p className="text-xs text-muted leading-relaxed">
                  The washed Normandy linen duvet is effortlessly soft. Order arrived in two days with zero plastic packaging. Highly impressed.
                </p>
              </div>
              <div className="pt-3 border-t border-delicate/60 flex items-center justify-between text-[11px]">
                <span className="font-bold text-charcoal">Camille Laurent</span>
                <span className="text-forest flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Patron
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
