import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCommerceStore } from '../../store/useCommerceStore';
import { CATEGORIES } from '../../data/categories';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  User, 
  Menu, 
  X, 
  ChevronDown, 
  LayoutDashboard,
  Bell,
  Check,
  Tag
} from 'lucide-react';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    cart, 
    wishlist, 
    setCartDrawerOpen, 
    setSearchModalOpen, 
    notifications,
    markNotificationRead,
    markAllNotificationsRead 
  } = useCommerceStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuCategory, setMegaMenuCategory] = useState<string | null>(null);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [currency, setCurrency] = useState('USD ($)');

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const customerUnreadNotifs = notifications.filter((n) => !n.read && (n.targetAudience === 'customer' || n.targetAudience === 'both'));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setMegaMenuCategory(null);
  }, [location.pathname]);

  return (
    <>
      {/* Top Utility Announcement Bar */}
      <div className="bg-dark text-stone/90 text-[11px] py-1.5 px-4 tracking-wider uppercase border-b border-delicate/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span>Complimentary worldwide courier delivery on orders over $150</span>
            <span className="hidden md:inline text-sage">• Code FREESHIP</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/help" className="hover:text-white transition-colors">
              Customer Support
            </Link>
            <div className="hidden sm:flex items-center gap-2">
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-transparent text-stone/90 border-none outline-none text-[11px] cursor-pointer hover:text-white"
              >
                <option value="USD ($)" className="bg-dark text-white">USD ($)</option>
                <option value="EUR (€)" className="bg-dark text-white">EUR (€)</option>
                <option value="GBP (£)" className="bg-dark text-white">GBP (£)</option>
                <option value="SEK (kr)" className="bg-dark text-white">SEK (kr)</option>
              </select>
            </div>
            <Link to="/admin" className="flex items-center gap-1.5 text-sage hover:text-white transition-colors font-medium">
              <LayoutDashboard className="w-3 h-3" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header
        className={`sticky top-0 z-30 bg-ivory/95 backdrop-blur-md border-b border-delicate transition-all duration-200 ${
          isScrolled ? 'py-2.5 shadow-subtle' : 'py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 lg:gap-8">
            
            {/* Mobile Hamburger & Logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-charcoal hover:bg-stone rounded-button transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 rounded-sm bg-charcoal text-ivory flex items-center justify-center font-serif text-lg font-bold group-hover:bg-forest transition-colors">
                  A
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-charcoal">
                    ATELIER & CO.
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-muted -mt-1 hidden sm:block">
                    Independent Retailer
                  </span>
                </div>
              </Link>
            </div>

            {/* Central Search Bar (Amazon-inspired prominent search) */}
            <div className="flex-1 max-w-xl mx-2 hidden md:block">
              <div 
                onClick={() => setSearchModalOpen(true)}
                className="flex items-center gap-2.5 w-full bg-white border border-delicate hover:border-forest/50 rounded-full px-4 py-2 cursor-pointer shadow-subtle transition-all"
              >
                <Search className="w-4 h-4 text-muted" />
                <span className="text-xs text-muted/80 flex-1 truncate">
                  Search acoustic audio, ceramics, leather, essentials...
                </span>
                <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] text-muted font-mono bg-stone rounded-xs border border-delicate">
                  ⌘K
                </kbd>
              </div>
            </div>

            {/* Actions: Search (mobile), Notifications, Wishlist, Account, Cart */}
            <div className="flex items-center gap-1 sm:gap-3">
              {/* Mobile search button */}
              <button
                onClick={() => setSearchModalOpen(true)}
                className="md:hidden p-2 text-charcoal hover:bg-stone rounded-full transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Notifications Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className="relative p-2 text-charcoal hover:bg-stone rounded-full transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {customerUnreadNotifs.length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-forest animate-pulse" />
                  )}
                </button>

                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-delicate rounded-card shadow-dropdown p-4 z-50 animate-fade-in text-charcoal">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-delicate">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted font-mono">
                        Notifications
                      </span>
                      {customerUnreadNotifs.length > 0 && (
                        <button
                          onClick={() => markAllNotificationsRead('customer')}
                          className="text-[11px] text-forest hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {customerUnreadNotifs.length === 0 ? (
                        <p className="text-xs text-muted text-center py-4">
                          No unread notifications.
                        </p>
                      ) : (
                        customerUnreadNotifs.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => {
                              markNotificationRead(n.id);
                              if (n.actionUrl) navigate(n.actionUrl);
                              setNotifDropdownOpen(false);
                            }}
                            className="p-2.5 rounded-md hover:bg-stone/50 cursor-pointer transition-colors border-l-2 border-forest"
                          >
                            <p className="text-xs font-semibold text-charcoal">{n.title}</p>
                            <p className="text-[11px] text-muted mt-0.5">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative p-2 text-charcoal hover:bg-stone rounded-full transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-champagne text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Customer Account */}
              <Link
                to="/account"
                className="p-2 text-charcoal hover:bg-stone rounded-full transition-colors"
                aria-label="Customer Account"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setCartDrawerOpen(true)}
                className="relative flex items-center gap-2 px-3 py-2 bg-forest text-white rounded-button hover:bg-forest-dark transition-all shadow-subtle ml-1"
                aria-label="View Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="text-xs font-medium hidden sm:inline">Bag</span>
                <span className="w-5 h-5 bg-white text-forest text-xs font-bold rounded-full flex items-center justify-center">
                  {totalCartCount}
                </span>
              </button>
            </div>
          </div>

          {/* Desktop Category Bar */}
          <nav className="hidden lg:flex items-center justify-between pt-3 mt-1 border-t border-delicate/60 text-xs font-medium tracking-wide text-charcoal">
            <div className="flex items-center gap-7">
              <Link
                to="/shop"
                className={`py-1 hover:text-forest transition-colors ${
                  location.pathname === '/shop' ? 'text-forest font-semibold border-b-2 border-forest' : ''
                }`}
              >
                Shop All
              </Link>

              {CATEGORIES.map((cat) => (
                <div 
                  key={cat.id} 
                  className="relative group"
                  onMouseEnter={() => setMegaMenuCategory(cat.slug)}
                  onMouseLeave={() => setMegaMenuCategory(null)}
                >
                  <Link
                    to={`/category/${cat.slug}`}
                    className={`flex items-center gap-1 py-1 hover:text-forest transition-colors ${
                      location.pathname === `/category/${cat.slug}` ? 'text-forest font-semibold border-b-2 border-forest' : ''
                    }`}
                  >
                    <span>{cat.name}</span>
                    <ChevronDown className="w-3 h-3 text-muted group-hover:rotate-180 transition-transform" />
                  </Link>

                  {/* Mega-menu dropdown */}
                  {megaMenuCategory === cat.slug && (
                    <div className="absolute top-full left-0 w-96 bg-white border border-delicate rounded-card shadow-dropdown p-5 z-40 animate-fade-in text-charcoal">
                      <div className="flex gap-4">
                        <img 
                          src={cat.image} 
                          alt={cat.name} 
                          className="w-24 h-28 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h4 className="font-serif text-sm font-bold text-charcoal mb-1">{cat.name}</h4>
                          <p className="text-[11px] text-muted mb-3 leading-relaxed">{cat.description}</p>
                          <Link 
                            to={`/category/${cat.slug}`}
                            className="inline-flex items-center text-xs text-forest font-semibold hover:underline"
                          >
                            Explore Collection ({cat.itemCount} items) →
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <Link
                to="/deals"
                className={`flex items-center gap-1 py-1 text-champagne-dark font-semibold hover:text-champagne transition-colors ${
                  location.pathname === '/deals' ? 'border-b-2 border-champagne' : ''
                }`}
              >
                <Tag className="w-3.5 h-3.5 text-champagne" />
                <span>Offers & Deals</span>
              </Link>
            </div>

            <div className="text-[11px] text-muted font-mono">
              Direct-to-Consumer Atelier
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Slide-out Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="fixed inset-0 bg-charcoal/40 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-ivory border-r border-delicate shadow-elevated p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-delicate">
                <span className="font-serif text-lg font-bold">Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-muted hover:text-charcoal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-sm font-medium">
                <Link to="/shop" className="block py-1 hover:text-forest">Shop All Products</Link>
                <div className="pt-2 pb-1 border-t border-delicate text-xs uppercase tracking-wider text-muted font-mono">
                  Categories
                </div>
                {CATEGORIES.map((cat) => (
                  <Link 
                    key={cat.id} 
                    to={`/category/${cat.slug}`}
                    className="block py-1 text-charcoal hover:text-forest"
                  >
                    {cat.name}
                  </Link>
                ))}
                <div className="pt-2 pb-1 border-t border-delicate text-xs uppercase tracking-wider text-muted font-mono">
                  Special
                </div>
                <Link to="/deals" className="block py-1 text-champagne font-semibold">
                  Offers & Flash Sales
                </Link>
                <Link to="/wishlist" className="block py-1 text-charcoal">
                  My Wishlist ({wishlist.length})
                </Link>
                <Link to="/account" className="block py-1 text-charcoal">
                  Customer Account
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-delicate">
              <Link
                to="/admin"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-charcoal text-white rounded-button text-xs font-semibold"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Open Admin Portal</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
