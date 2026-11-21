import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCommerceStore } from '../../store/useCommerceStore';
import { ProductCard } from '../../components/product/ProductCard';
import { 
  Star, 
  Heart, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  RefreshCw, 
  Clock, 
  ChevronRight, 
  ArrowLeft, 
  Check, 
  ThumbsUp, 
  MessageSquare, 
  Plus, 
  Minus,
  Maximize2,
  X,
  Share2
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { 
    products, 
    reviews, 
    questions, 
    wishlist, 
    toggleWishlist, 
    addToCart, 
    recordProductView,
    addReview,
    voteHelpful,
    addQuestion,
    addToast
  } = useCommerceStore();

  const product = products.find((p) => p.slug === slug);

  // States
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'shipping' | 'warranty' | 'faq'>('desc');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [writeReviewOpen, setWriteReviewOpen] = useState(false);
  const [askQuestionOpen, setAskQuestionOpen] = useState(false);

  // Form states
  const [newRating, setNewRating] = useState(5);
  const [newAuthor, setNewAuthor] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionAuthor, setNewQuestionAuthor] = useState('');

  // Record product view for recently viewed
  useEffect(() => {
    if (product) {
      recordProductView(product.id);
      window.scrollTo(0, 0);
      setSelectedImage(0);
      setSelectedVariantIndex(0);
      setQuantity(1);
    }
  }, [product?.id]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl text-charcoal mb-2">Product Not Found</h2>
        <p className="text-xs text-muted mb-6">The requested product could not be located in our catalog.</p>
        <Link to="/shop" className="px-5 py-2.5 bg-forest text-white text-xs font-semibold rounded-button">
          Explore All Products
        </Link>
      </div>
    );
  }

  const inWishlist = wishlist.includes(product.id);
  const currentVariant = product.variants[selectedVariantIndex] || product.variants[0];
  const currentPrice = currentVariant?.price ?? product.price;

  // Product reviews and questions
  const productReviews = reviews.filter((r) => r.productId === product.id);
  const productQuestions = questions.filter((q) => q.productId === product.id);

  // Related products (same category)
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Frequently bought together item
  const bundledItem = products.find((p) => p.id !== product.id && p.category === product.category);

  // Handlers
  const handleAddToCart = () => {
    addToCart(product, quantity, currentVariant);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, currentVariant);
    navigate('/checkout');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast({
      type: 'info',
      title: 'Link Copied',
      description: 'Product link copied to clipboard.',
    });
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor || !newTitle || !newContent) return;

    addReview({
      productId: product.id,
      author: newAuthor,
      rating: newRating,
      title: newTitle,
      content: newContent,
      verified: true,
    });

    setWriteReviewOpen(false);
    setNewAuthor('');
    setNewTitle('');
    setNewContent('');
  };

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText || !newQuestionAuthor) return;

    addQuestion(product.id, newQuestionText, newQuestionAuthor);
    setAskQuestionOpen(false);
    setNewQuestionText('');
    setNewQuestionAuthor('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-16">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-muted font-mono">
        <Link to="/" className="hover:text-charcoal transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3 text-delicate" />
        <Link to="/shop" className="hover:text-charcoal transition-colors">Catalog</Link>
        <ChevronRight className="w-3 h-3 text-delicate" />
        <Link to={`/category/${product.category}`} className="hover:text-charcoal transition-colors">
          {product.categoryName}
        </Link>
        <ChevronRight className="w-3 h-3 text-delicate" />
        <span className="text-charcoal font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* ================= LEFT: GALLERY ================= */}
        <div className="lg:col-span-7 space-y-4">
          {/* Large Main Product View with Zoom trigger */}
          <div className="relative aspect-square w-full rounded-card overflow-hidden bg-stone border border-delicate group shadow-subtle">
            <img
              src={product.images[selectedImage] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 cursor-zoom-in"
              onClick={() => setIsLightboxOpen(true)}
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              {product.isDeal && (
                <span className="bg-champagne text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-xs">
                  Exclusive Offer
                </span>
              )}
              {product.featured && (
                <span className="bg-dark/80 backdrop-blur-xs text-white text-[10px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-xs">
                  Atelier Considered
                </span>
              )}
            </div>

            {/* Lightbox Expand Button */}
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white text-charcoal rounded-full backdrop-blur-xs shadow-sm transition-colors"
              title="Fullscreen Lightbox"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Thumbnails list */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-md overflow-hidden bg-stone border-2 transition-all shrink-0 ${
                    selectedImage === idx
                      ? 'border-forest ring-1 ring-forest'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ================= RIGHT: PRODUCT ESSENTIALS & ACTIONS ================= */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs uppercase font-mono tracking-widest text-muted">
                {product.brand}
              </span>
              <span className="text-[11px] font-mono text-muted">
                SKU: {currentVariant?.sku || product.sku}
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-charcoal font-normal leading-tight mb-3">
              {product.name}
            </h1>

            {/* Ratings & Reviews */}
            <div className="flex items-center gap-3 pb-4 border-b border-delicate">
              <div className="flex items-center text-champagne">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-champagne text-champagne'
                        : 'text-delicate'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-charcoal font-mono">{product.rating}</span>
              <span className="text-xs text-muted">({product.reviewCount} verified reviews)</span>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-charcoal font-mono">
              ${currentPrice.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-base text-muted line-through font-mono">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
            {product.originalPrice && (
              <span className="text-xs font-semibold text-forest bg-forest/10 px-2 py-0.5 rounded-xs">
                Save ${(product.originalPrice - currentPrice).toFixed(2)}
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-muted leading-relaxed font-light">
            {product.shortDescription || product.description}
          </p>

          {/* Stock & Delivery Estimate (Simulated Amazon-like badge) */}
          <div className="p-3.5 bg-stone/50 border border-delicate rounded-card space-y-2 text-xs">
            <div className="flex items-center gap-2 text-forest font-medium">
              <span className="w-2 h-2 rounded-full bg-forest animate-pulse" />
              <span>
                {product.stock > 10 ? 'In stock and ready to dispatch' : `Only ${product.stock} units remaining in stock`}
              </span>
            </div>

            <div className="flex items-center gap-2 text-charcoal">
              <Clock className="w-3.5 h-3.5 text-muted shrink-0" />
              <span>
                Order within the next <strong className="font-semibold text-forest">3 hrs 24 mins</strong> for estimated delivery between <strong className="font-semibold">Nov 24–26</strong>.
              </span>
            </div>
          </div>

          {/* Variant Selector (Colors / Sizes / Bundles) */}
          {product.variants.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-delicate">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono uppercase tracking-wider text-muted">
                  Option Selected:
                </span>
                <span className="font-semibold text-charcoal">
                  {currentVariant?.name}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.variants.map((v, idx) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariantIndex(idx)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-button text-xs transition-all border ${
                      selectedVariantIndex === idx
                        ? 'border-forest bg-forest text-white shadow-xs font-medium'
                        : 'border-delicate bg-white hover:bg-stone text-charcoal'
                    }`}
                  >
                    {v.attributes.colorHex && (
                      <span 
                        className="w-3 h-3 rounded-full border border-black/10 shrink-0" 
                        style={{ backgroundColor: v.attributes.colorHex }}
                      />
                    )}
                    <span>{v.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Actions */}
          <div className="space-y-3 pt-4 border-t border-delicate">
            <div className="flex items-center gap-3">
              {/* Quantity Counter */}
              <div className="flex items-center border border-delicate rounded-button bg-white overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2.5 text-charcoal hover:bg-stone transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-xs font-bold font-mono text-charcoal min-w-[2rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-2.5 text-charcoal hover:bg-stone transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-forest hover:bg-forest-dark text-white rounded-button text-xs font-semibold shadow-subtle transition-all tracking-wide"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Shopping Bag</span>
              </button>

              {/* Wishlist Toggle */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3 rounded-button border transition-colors ${
                  inWishlist
                    ? 'border-champagne text-champagne bg-champagne/10'
                    : 'border-delicate bg-white hover:bg-stone text-charcoal'
                }`}
                title={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-champagne' : ''}`} />
              </button>

              {/* Share button */}
              <button
                onClick={handleShare}
                className="p-3 rounded-button border border-delicate bg-white hover:bg-stone text-charcoal transition-colors"
                title="Share product link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Instant Buy Now button */}
            <button
              onClick={handleBuyNow}
              className="w-full py-3 bg-charcoal hover:bg-dark text-white rounded-button text-xs font-semibold shadow-subtle transition-all tracking-wide"
            >
              Buy Now with Instant Express Checkout
            </button>
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-delicate text-[11px] text-muted text-center">
            <div className="p-2 bg-ivory/50 rounded-sm">
              <ShieldCheck className="w-4 h-4 text-forest mx-auto mb-1" />
              <span>2-Year Warranty</span>
            </div>
            <div className="p-2 bg-ivory/50 rounded-sm">
              <Truck className="w-4 h-4 text-forest mx-auto mb-1" />
              <span>Carbon Neutral Freight</span>
            </div>
            <div className="p-2 bg-ivory/50 rounded-sm">
              <RefreshCw className="w-4 h-4 text-forest mx-auto mb-1" />
              <span>30-Day Evaluation</span>
            </div>
          </div>
        </div>

      </div>

      {/* ================= TABS: DESCRIPTION / SPECS / SHIPPING / WARRANTY / FAQ ================= */}
      <div className="pt-8 border-t border-delicate">
        {/* Tab Headers */}
        <div className="flex border-b border-delicate gap-6 overflow-x-auto text-xs font-medium tracking-wide text-muted">
          {[
            { id: 'desc', label: 'Detailed Description' },
            { id: 'specs', label: 'Technical Specifications' },
            { id: 'shipping', label: 'Delivery & Returns' },
            { id: 'warranty', label: 'Quality Guarantee' },
            { id: 'faq', label: 'Customer Q&A' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-forest text-forest font-semibold'
                  : 'border-transparent hover:text-charcoal'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Panes */}
        <div className="py-8 max-w-3xl text-xs sm:text-sm text-charcoal leading-relaxed">
          {activeTab === 'desc' && (
            <div className="space-y-4">
              <p>{product.description}</p>
              <p className="text-muted">
                Each product is crafted in numbered batches to preserve fidelity, reduce ecological footprint, and ensure uncompromising quality across every joint, finish, and electronic driver.
              </p>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="border border-delicate rounded-card overflow-hidden">
              <table className="w-full text-left text-xs">
                <tbody>
                  {Object.entries(product.specifications).map(([key, val], idx) => (
                    <tr 
                      key={key} 
                      className={idx % 2 === 0 ? 'bg-white' : 'bg-stone/30'}
                    >
                      <th className="py-2.5 px-4 font-mono text-muted w-1/3 border-b border-delicate/40 font-normal">
                        {key}
                      </th>
                      <td className="py-2.5 px-4 font-medium text-charcoal border-b border-delicate/40">
                        {val}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-3">
              <p>
                All orders are dispatched from our Central Logistics Hub in Chicago, Illinois. Standard ground delivery takes 2–4 business days within North America and 4–7 business days internationally via DHL Express.
              </p>
              <p className="text-muted">
                Enjoy 30 days of risk-free trial. If an item doesn't seamlessly integrate into your everyday routine, our concierge will issue a prepaid return courier shipping label.
              </p>
            </div>
          )}

          {activeTab === 'warranty' && (
            <div className="space-y-3">
              <p>
                Backed by our 2-Year Comprehensive Craftsmanship Guarantee covering any manufacturing deviations or mechanical failures under normal everyday use.
              </p>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 mb-4 border-b border-delicate">
                <span className="font-semibold text-charcoal">
                  Customer Questions ({productQuestions.length})
                </span>
                <button
                  onClick={() => setAskQuestionOpen(true)}
                  className="px-3 py-1.5 bg-forest text-white rounded-button text-xs font-semibold"
                >
                  Ask a Question
                </button>
              </div>

              {productQuestions.length === 0 ? (
                <p className="text-muted text-xs">No questions yet. Be the first to ask about this product.</p>
              ) : (
                productQuestions.map((q) => (
                  <div key={q.id} className="p-3 bg-stone/30 rounded-card border border-delicate space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-muted">
                      <span>Asked by {q.askedBy}</span>
                      <span>{q.date}</span>
                    </div>
                    <p className="font-medium text-charcoal">{q.question}</p>
                    {q.answer && (
                      <div className="pl-3 border-l-2 border-forest mt-2 text-xs text-muted">
                        <span className="font-semibold text-forest block mb-0.5">
                          {q.answeredBy} ({q.answerDate}):
                        </span>
                        <p>{q.answer}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* ================= FREQUENTLY BOUGHT TOGETHER ================= */}
      {bundledItem && (
        <div className="p-6 bg-white border border-delicate rounded-card shadow-subtle space-y-4">
          <h3 className="font-serif text-lg font-bold text-charcoal">
            Frequently Bought Together
          </h3>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex items-center gap-3">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-md bg-stone"
              />
              <span className="text-muted text-lg font-mono">+</span>
              <img
                src={bundledItem.images[0]}
                alt={bundledItem.name}
                className="w-16 h-16 object-cover rounded-md bg-stone"
              />
            </div>

            <div className="flex-1 text-xs">
              <p className="font-medium text-charcoal">
                {product.name} + {bundledItem.name}
              </p>
              <p className="text-muted mt-0.5">
                Bundle combined price:{' '}
                <strong className="text-charcoal font-bold font-mono">
                  ${(currentPrice + bundledItem.price).toFixed(2)}
                </strong>
              </p>
            </div>

            <button
              onClick={() => {
                addToCart(product, 1);
                addToCart(bundledItem, 1);
              }}
              className="px-5 py-2.5 bg-forest text-white text-xs font-semibold rounded-button hover:bg-forest-dark transition-colors shadow-subtle shrink-0"
            >
              Add Both to Bag
            </button>
          </div>
        </div>
      )}

      {/* ================= CUSTOMER REVIEWS SECTION ================= */}
      <div className="pt-8 border-t border-delicate space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-2xl font-normal text-charcoal">
              Customer Reviews ({productReviews.length})
            </h3>
            <p className="text-xs text-muted mt-1">
              Feedback from verified patrons who own and use this product.
            </p>
          </div>

          <button
            onClick={() => setWriteReviewOpen(true)}
            className="px-5 py-2.5 bg-white border border-delicate hover:bg-stone text-charcoal text-xs font-semibold rounded-button transition-colors shadow-subtle self-start sm:self-auto"
          >
            Write a Review
          </button>
        </div>

        {/* Rating distribution summary */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 items-center p-6 bg-stone/40 border border-delicate rounded-card">
          <div className="sm:col-span-4 text-center sm:text-left space-y-1">
            <div className="text-4xl font-bold font-mono text-charcoal">
              {product.rating}
            </div>
            <div className="flex justify-center sm:justify-start text-champagne">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'fill-champagne text-champagne'
                      : 'text-delicate'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-muted">Based on {product.reviewCount} customer ratings</p>
          </div>

          <div className="sm:col-span-8 space-y-2 text-xs">
            {[5, 4, 3, 2, 1].map((ratingVal) => {
              const count = productReviews.filter((r) => r.rating === ratingVal).length;
              const pct = productReviews.length > 0 ? (count / productReviews.length) * 100 : 0;
              return (
                <div key={ratingVal} className="flex items-center gap-3">
                  <span className="w-12 text-muted font-mono">{ratingVal} stars</span>
                  <div className="flex-1 h-2 bg-delicate rounded-full overflow-hidden">
                    <div
                      className="h-full bg-forest rounded-full"
                      style={{ width: `${ratingVal === 5 ? 85 : ratingVal === 4 ? 15 : 0}%` }}
                    />
                  </div>
                  <span className="w-8 text-right font-mono text-muted text-[11px]">
                    {ratingVal === 5 ? '85%' : ratingVal === 4 ? '15%' : '0%'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Review Cards */}
        <div className="space-y-4">
          {productReviews.length === 0 ? (
            <p className="text-xs text-muted text-center py-6">
              No reviews yet. Be the first to review this product.
            </p>
          ) : (
            productReviews.map((rev) => (
              <div 
                key={rev.id} 
                className="p-5 bg-white border border-delicate rounded-card space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex text-champagne">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'fill-champagne text-champagne' : 'text-delicate'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-charcoal">{rev.title}</span>
                  </div>
                  <span className="text-[11px] text-muted font-mono">{rev.date}</span>
                </div>

                <p className="text-xs text-muted leading-relaxed">{rev.content}</p>

                <div className="flex items-center justify-between pt-2 border-t border-delicate/40 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-charcoal">{rev.author}</span>
                    {rev.verified && (
                      <span className="text-forest flex items-center gap-1 font-mono text-[10px]">
                        <Check className="w-3 h-3" /> Verified Purchase
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => voteHelpful(rev.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded border transition-colors ${
                      rev.userVotedHelpful
                        ? 'bg-forest/10 border-forest/30 text-forest font-semibold'
                        : 'border-delicate hover:bg-stone text-muted'
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>Helpful ({rev.helpfulCount})</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ================= RELATED PRODUCTS ================= */}
      {relatedProducts.length > 0 && (
        <div className="pt-8 border-t border-delicate">
          <h3 className="font-serif text-xl sm:text-2xl text-charcoal font-normal mb-6">
            You Might Also Appreciate
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* ================= LIGHTBOX MODAL ================= */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/90 backdrop-blur-md animate-fade-in">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 p-2 text-white/80 hover:text-white rounded-full bg-white/10"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={product.images[selectedImage]}
            alt={product.name}
            className="max-h-[85vh] max-w-[85vw] object-contain rounded-md shadow-elevated"
          />
        </div>
      )}

      {/* ================= WRITE REVIEW MODAL ================= */}
      {writeReviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-xs animate-fade-in">
          <div className="max-w-md w-full bg-white border border-delicate rounded-card shadow-elevated p-6 text-charcoal relative">
            <button
              onClick={() => setWriteReviewOpen(false)}
              className="absolute top-4 right-4 text-muted hover:text-charcoal"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-serif text-xl font-bold mb-1">Write a Review</h3>
            <p className="text-xs text-muted mb-4">Share your honest impressions with the community.</p>

            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium mb-1">Rating</label>
                <div className="flex gap-1 text-champagne">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= newRating ? 'fill-champagne text-champagne' : 'text-delicate'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">Your Name</label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="e.g. Eleanor Vance"
                  className="w-full p-2 bg-stone/40 border border-delicate rounded text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Review Headline</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Exceptional tonal depth and tactile finish"
                  className="w-full p-2 bg-stone/40 border border-delicate rounded text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Your Review</label>
                <textarea
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Describe your day-to-day experience..."
                  className="w-full p-2 bg-stone/40 border border-delicate rounded text-xs"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setWriteReviewOpen(false)}
                  className="px-4 py-2 border border-delicate rounded-button text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-forest text-white rounded-button text-xs font-semibold"
                >
                  Publish Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= ASK QUESTION MODAL ================= */}
      {askQuestionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-xs animate-fade-in">
          <div className="max-w-md w-full bg-white border border-delicate rounded-card shadow-elevated p-6 text-charcoal relative">
            <button
              onClick={() => setAskQuestionOpen(false)}
              className="absolute top-4 right-4 text-muted hover:text-charcoal"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-serif text-xl font-bold mb-1">Ask a Question</h3>
            <p className="text-xs text-muted mb-4">Our product specialists will review and answer.</p>

            <form onSubmit={handleSubmitQuestion} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium mb-1">Your Name</label>
                <input
                  type="text"
                  value={newQuestionAuthor}
                  onChange={(e) => setNewQuestionAuthor(e.target.value)}
                  placeholder="e.g. Julian T."
                  className="w-full p-2 bg-stone/40 border border-delicate rounded text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Your Question</label>
                <textarea
                  rows={3}
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="e.g. Does this speaker support low-latency aptX codec?"
                  className="w-full p-2 bg-stone/40 border border-delicate rounded text-xs"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAskQuestionOpen(false)}
                  className="px-4 py-2 border border-delicate rounded-button text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-forest text-white rounded-button text-xs font-semibold"
                >
                  Submit Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
