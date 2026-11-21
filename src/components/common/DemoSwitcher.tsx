import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCommerceStore } from '../../store/useCommerceStore';
import { 
  SlidersHorizontal, 
  Store, 
  LayoutDashboard, 
  RotateCcw, 
  HelpCircle,
  X,
  Layers,
  ArrowRight,
  Sparkles,
  ShoppingBag
} from 'lucide-react';

export const DemoSwitcher: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    demoRole, 
    setDemoRole, 
    resetAllDemoData, 
    hasSeenWelcome, 
    dismissWelcome 
  } = useCommerceStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(!hasSeenWelcome);

  const isAdminRoute = location.pathname.startsWith('/admin');

  const handleRoleToggle = (newRole: 'customer' | 'admin') => {
    setDemoRole(newRole);
    if (newRole === 'admin' && !isAdminRoute) {
      navigate('/admin');
    } else if (newRole === 'customer' && isAdminRoute) {
      navigate('/');
    }
    setIsOpen(false);
  };

  const handleReset = () => {
    if (window.confirm('Reset all demo state (catalog, orders, inventory, and promotions) to original factory state?')) {
      resetAllDemoData();
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Discreet floating demo pill in bottom-left */}
      <div className="fixed bottom-5 left-5 z-40">
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3 py-2 bg-charcoal text-ivory text-xs font-medium rounded-full shadow-elevated hover:bg-forest transition-colors border border-delicate/20"
            title="Open Demo Controls & View Switcher"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="tracking-wide">
              {isAdminRoute ? 'Admin Ops View' : 'Storefront View'}
            </span>
            <SlidersHorizontal className="w-3.5 h-3.5 ml-1 text-sage" />
          </button>

          {/* Popover Menu */}
          {isOpen && (
            <div className="absolute bottom-12 left-0 w-80 bg-white border border-delicate rounded-card shadow-dropdown p-4 text-charcoal animate-fade-in z-50">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-delicate">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-champagne" />
                  <span className="font-serif text-sm font-semibold">Demo Control Center</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-muted hover:text-charcoal p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-[11px] uppercase tracking-wider text-muted font-mono">
                  Active Mode & View
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleRoleToggle('customer')}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-button text-xs font-medium transition-all text-left ${
                      !isAdminRoute
                        ? 'bg-forest text-white shadow-sm'
                        : 'bg-stone/60 text-charcoal hover:bg-stone'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    <div>
                      <p className="font-semibold leading-tight">Storefront</p>
                      <p className="text-[10px] opacity-80">Customer shopping</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleRoleToggle('admin')}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-button text-xs font-medium transition-all text-left ${
                      isAdminRoute
                        ? 'bg-forest text-white shadow-sm'
                        : 'bg-stone/60 text-charcoal hover:bg-stone'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <div>
                      <p className="font-semibold leading-tight">Admin Ops</p>
                      <p className="text-[10px] opacity-80">Catalog, Orders & Stocks</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Connected System Callout */}
              <div className="p-2.5 bg-stone/40 border border-delicate rounded-md text-[11px] text-muted mb-4 leading-relaxed">
                <p className="font-medium text-charcoal mb-0.5">Unified Persistent State</p>
                Adjusting stock or orders in Admin updates customer storefront availability in real-time.
              </div>

              <div className="flex flex-col gap-2 pt-2 border-t border-delicate">
                <button
                  onClick={() => setShowWelcomeModal(true)}
                  className="flex items-center gap-2 text-xs text-muted hover:text-charcoal py-1 transition-colors text-left"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Review Tour & End-to-End Scenarios</span>
                </button>

                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 text-xs text-error hover:text-error/80 py-1 transition-colors text-left"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Demo Data to Defaults</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Onboarding Welcome Modal */}
      {showWelcomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-xs animate-fade-in">
          <div className="max-w-lg w-full bg-white border border-delicate rounded-card shadow-elevated p-6 md:p-8 text-charcoal relative">
            <button
              onClick={() => {
                setShowWelcomeModal(false);
                dismissWelcome();
              }}
              className="absolute top-5 right-5 text-muted hover:text-charcoal p-1"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone text-forest text-xs font-mono mb-4">
              <Sparkles className="w-3.5 h-3.5 text-champagne" />
              <span>Interactive Commerce Demonstration</span>
            </div>

            <h2 className="font-serif text-2xl md:text-3xl text-charcoal mb-3">
              Welcome to Atelier & Co.
            </h2>
            <p className="text-sm text-muted leading-relaxed mb-6">
              This is a custom-coded, single-vendor luxury retail platform inspired by Amazon’s extensive shopping discovery, inventory infrastructure, and fulfillment engine.
            </p>

            <div className="space-y-3.5 mb-8 text-xs text-charcoal/90">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-stone flex items-center justify-center text-forest font-bold shrink-0">1</div>
                <div>
                  <strong className="block font-medium text-charcoal">Explore Customer Storefront</strong>
                  Browse considered products, filter by specs, customize variants, add to bag, and complete simulated checkout.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-stone flex items-center justify-center text-forest font-bold shrink-0">2</div>
                <div>
                  <strong className="block font-medium text-charcoal">Test Real-Time Interconnection</strong>
                  Switch to Admin to fulfill orders, adjust warehouse inventory, or publish a sale discount—then witness immediate storefront updates.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-stone flex items-center justify-center text-forest font-bold shrink-0">3</div>
                <div>
                  <strong className="block font-medium text-charcoal">Demonstration Controls</strong>
                  Use the floating button in the bottom left anytime to toggle views or reset data.
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-delicate">
              <button
                onClick={() => {
                  setShowWelcomeModal(false);
                  dismissWelcome();
                  navigate('/admin');
                }}
                className="px-4 py-2.5 text-xs font-medium border border-delicate hover:bg-stone rounded-button transition-colors"
              >
                Open Admin Dashboard
              </button>
              <button
                onClick={() => {
                  setShowWelcomeModal(false);
                  dismissWelcome();
                }}
                className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-medium bg-forest text-white hover:bg-forest-dark rounded-button shadow-subtle transition-all"
              >
                <span>Start Exploring Storefront</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
