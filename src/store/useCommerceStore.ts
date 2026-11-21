import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Product, 
  ProductVariant, 
  CartItem, 
  Order, 
  OrderStatus, 
  ShippingAddress, 
  Promotion, 
  InventoryRecord, 
  StockAdjustmentEntry,
  CustomerProfile, 
  StaffMember, 
  ProductReview, 
  ProductQuestion, 
  AppNotification,
  CategorySlug
} from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { INITIAL_PROMOTIONS } from '../data/initialPromotions';
import { INITIAL_ORDERS } from '../data/initialOrders';
import { INITIAL_CUSTOMERS } from '../data/initialCustomers';
import { INITIAL_INVENTORY } from '../data/initialInventory';
import { INITIAL_STAFF } from '../data/initialStaff';
import { INITIAL_REVIEWS, INITIAL_QUESTIONS } from '../data/initialReviews';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  description?: string;
}

export interface FilterState {
  searchQuery: string;
  category: CategorySlug | 'all';
  brands: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
  sortBy: 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'bestselling';
}

interface CommerceState {
  // Catalog & Inventory
  products: Product[];
  inventory: InventoryRecord[];
  stockAdjustments: StockAdjustmentEntry[];
  
  // Cart & Wishlist
  cart: CartItem[];
  wishlist: string[]; // product IDs
  appliedPromo: Promotion | null;
  savedForLater: CartItem[];
  
  // Orders & Fulfillment
  orders: Order[];
  
  // Promotions
  promotions: Promotion[];
  
  // Customers & Staff
  customers: CustomerProfile[];
  currentCustomer: CustomerProfile;
  staff: StaffMember[];
  
  // Reviews & Q&A
  reviews: ProductReview[];
  questions: ProductQuestion[];
  
  // Notifications
  notifications: AppNotification[];
  
  // Browsing history
  recentlyViewedIds: string[];
  
  // UI & Demo Controls
  demoRole: 'customer' | 'admin';
  isCartDrawerOpen: boolean;
  isSearchModalOpen: boolean;
  quickViewProductId: string | null;
  toasts: ToastMessage[];
  hasSeenWelcome: boolean;
  hasLoadedInitialSplash: boolean;
  
  // Filter state for Shop/Search
  activeFilters: FilterState;

  // Actions: UI & Demo
  setDemoRole: (role: 'customer' | 'admin') => void;
  setCartDrawerOpen: (open: boolean) => void;
  setSearchModalOpen: (open: boolean) => void;
  setQuickViewProductId: (id: string | null) => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  dismissWelcome: () => void;
  completeInitialSplash: () => void;
  resetAllDemoData: () => void;
  
  // Actions: Filters
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;

  // Actions: Cart & Wishlist
  addToCart: (product: Product, quantity?: number, variant?: ProductVariant, selectedColor?: string, selectedSize?: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  saveItemForLater: (itemId: string) => void;
  moveToCartFromSaved: (itemId: string) => void;
  toggleWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  
  // Actions: Products & Catalog
  addProduct: (newProduct: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  recordProductView: (productId: string) => void;
  
  // Actions: Inventory
  adjustStock: (
    productId: string, 
    warehouseId: string, 
    delta: number, 
    adjustmentType: 'add' | 'remove' | 'reconcile' | 'transfer',
    reason: string,
    notes?: string
  ) => void;
  
  // Actions: Orders & Checkout
  createOrder: (orderData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: ShippingAddress;
    shippingMethod: 'Standard Delivery' | 'Express Courier' | 'Complimentary White Glove';
    paymentMethod: string;
  }) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, trackingNumber?: string, carrier?: string) => void;
  addOrderNote: (orderId: string, noteContent: string) => void;
  cancelOrder: (orderId: string, reason?: string) => void;
  
  // Actions: Promotions
  createPromotion: (promo: Omit<Promotion, 'id' | 'timesUsed'>) => void;
  togglePromotionActive: (promoId: string) => void;
  deletePromotion: (promoId: string) => void;
  
  // Actions: Reviews & Questions
  addReview: (review: Omit<ProductReview, 'id' | 'date' | 'helpfulCount'>) => void;
  voteHelpful: (reviewId: string) => void;
  addQuestion: (productId: string, question: string, askedBy: string) => void;
  answerQuestion: (questionId: string, answer: string, answeredBy: string) => void;
  
  // Actions: Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (target?: 'customer' | 'admin') => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'read' | 'createdAt'>) => void;
  
  // Actions: Staff
  inviteStaff: (staff: Omit<StaffMember, 'id' | 'lastActive'>) => void;
  updateStaffPermissions: (staffId: string, permissions: StaffMember['permissions']) => void;
}

const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  category: 'all',
  brands: [],
  minPrice: 0,
  maxPrice: 500,
  minRating: 0,
  inStockOnly: false,
  sortBy: 'relevance',
};

export const useCommerceStore = create<CommerceState>()(
  persist(
    (set, get) => ({
      // Initial Data
      products: INITIAL_PRODUCTS,
      inventory: INITIAL_INVENTORY,
      stockAdjustments: [],
      cart: [],
      wishlist: ['prod-elec-01', 'prod-home-01'],
      appliedPromo: null,
      savedForLater: [],
      orders: INITIAL_ORDERS,
      promotions: INITIAL_PROMOTIONS,
      customers: INITIAL_CUSTOMERS,
      currentCustomer: INITIAL_CUSTOMERS[0],
      staff: INITIAL_STAFF,
      reviews: INITIAL_REVIEWS,
      questions: INITIAL_QUESTIONS,
      recentlyViewedIds: ['prod-elec-02', 'prod-home-01', 'prod-fsh-01'],
      
      notifications: [
        {
          id: 'notif-1',
          type: 'order',
          targetAudience: 'customer',
          title: 'Order Delivered',
          message: 'Your order ORD-2026-8941 has been delivered to your concierge.',
          read: false,
          createdAt: '2026-02-26T13:42:00Z',
          actionUrl: '/account/orders/ORD-2026-8941',
        },
        {
          id: 'notif-2',
          type: 'order',
          targetAudience: 'admin',
          title: 'New High-Value Order Placed',
          message: 'Helena Vance placed order ORD-2026-8941 ($310.00).',
          read: false,
          createdAt: '2026-02-22T14:32:00Z',
          actionUrl: '/admin/orders/ORD-2026-8941',
        },
        {
          id: 'notif-3',
          type: 'inventory',
          targetAudience: 'admin',
          title: 'Low Stock Alert',
          message: 'Horizon Minimalist Smartwatch is down to 19 units total.',
          read: false,
          createdAt: '2026-03-01T08:00:00Z',
          actionUrl: '/admin/inventory',
        },
      ],

      // UI state
      demoRole: 'customer',
      isCartDrawerOpen: false,
      isSearchModalOpen: false,
      quickViewProductId: null,
      toasts: [],
      hasSeenWelcome: false,
      hasLoadedInitialSplash: false,
      activeFilters: DEFAULT_FILTERS,

      // UI Actions
      setDemoRole: (role) => set({ demoRole: role }),
      setCartDrawerOpen: (open) => set({ isCartDrawerOpen: open }),
      setSearchModalOpen: (open) => set({ isSearchModalOpen: open }),
      setQuickViewProductId: (id) => set({ quickViewProductId: id }),
      
      addToast: (toast) => {
        const id = 'toast-' + Math.random().toString(36).substr(2, 9);
        const newToast: ToastMessage = { ...toast, id };
        set((state) => ({ toasts: [...state.toasts, newToast] }));
        setTimeout(() => {
          get().removeToast(id);
        }, 4000);
      },
      
      removeToast: (id) => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
      },
      
      dismissWelcome: () => set({ hasSeenWelcome: true }),
      completeInitialSplash: () => set({ hasLoadedInitialSplash: true }),
      
      resetAllDemoData: () => {
        set({
          products: INITIAL_PRODUCTS,
          inventory: INITIAL_INVENTORY,
          stockAdjustments: [],
          cart: [],
          wishlist: ['prod-elec-01', 'prod-home-01'],
          appliedPromo: null,
          savedForLater: [],
          orders: INITIAL_ORDERS,
          promotions: INITIAL_PROMOTIONS,
          customers: INITIAL_CUSTOMERS,
          currentCustomer: INITIAL_CUSTOMERS[0],
          staff: INITIAL_STAFF,
          reviews: INITIAL_REVIEWS,
          questions: INITIAL_QUESTIONS,
          recentlyViewedIds: ['prod-elec-02', 'prod-home-01'],
          toasts: [],
        });
        get().addToast({
          type: 'info',
          title: 'Demo Data Restored',
          description: 'All catalog, inventory, orders, and promotion states have been reset to factory defaults.',
        });
      },

      // Filter Actions
      setFilters: (updates) => {
        set((state) => ({
          activeFilters: { ...state.activeFilters, ...updates },
        }));
      },
      resetFilters: () => set({ activeFilters: DEFAULT_FILTERS }),

      // Cart Actions
      addToCart: (product, quantity = 1, variant, selectedColor, selectedSize) => {
        set((state) => {
          const variantSuffix = variant ? `-${variant.id}` : (selectedColor ? `-${selectedColor}` : '');
          const itemId = `${product.id}${variantSuffix}`;
          
          const existingIndex = state.cart.findIndex((item) => item.id === itemId);
          let newCart: CartItem[];
          
          // Determine price taking active promotions / deals into account
          let unitPrice = variant?.price ?? product.price;

          if (existingIndex > -1) {
            newCart = state.cart.map((item, idx) => 
              idx === existingIndex 
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            newCart = [
              ...state.cart,
              {
                id: itemId,
                productId: product.id,
                product,
                variant,
                quantity,
                selectedColor: selectedColor || variant?.attributes.color,
                selectedSize: selectedSize || variant?.attributes.size,
                priceAtAdd: unitPrice,
              },
            ];
          }

          return { cart: newCart, isCartDrawerOpen: true };
        });

        get().addToast({
          type: 'success',
          title: 'Added to Shopping Bag',
          description: `${quantity} × ${product.name}`,
        });
      },

      updateCartQuantity: (itemId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return { cart: state.cart.filter((item) => item.id !== itemId) };
          }
          return {
            cart: state.cart.map((item) => 
              item.id === itemId ? { ...item, quantity } : item
            ),
          };
        });
      },

      removeFromCart: (itemId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== itemId),
        }));
        get().addToast({
          type: 'info',
          title: 'Item Removed',
          description: 'The item was removed from your shopping bag.',
        });
      },

      clearCart: () => set({ cart: [], appliedPromo: null }),

      saveItemForLater: (itemId) => {
        const item = get().cart.find((i) => i.id === itemId);
        if (!item) return;
        set((state) => ({
          cart: state.cart.filter((i) => i.id !== itemId),
          savedForLater: [...state.savedForLater, item],
        }));
        get().addToast({
          type: 'info',
          title: 'Saved for Later',
          description: `${item.product.name} moved to saved items.`,
        });
      },

      moveToCartFromSaved: (itemId) => {
        const item = get().savedForLater.find((i) => i.id === itemId);
        if (!item) return;
        set((state) => ({
          savedForLater: state.savedForLater.filter((i) => i.id !== itemId),
          cart: [...state.cart, item],
        }));
        get().addToast({
          type: 'success',
          title: 'Moved to Bag',
          description: `${item.product.name} is back in your shopping bag.`,
        });
      },

      toggleWishlist: (productId) => {
        const inWishlist = get().wishlist.includes(productId);
        const product = get().products.find((p) => p.id === productId);
        set((state) => ({
          wishlist: inWishlist 
            ? state.wishlist.filter((id) => id !== productId)
            : [...state.wishlist, productId],
        }));

        get().addToast({
          type: inWishlist ? 'info' : 'success',
          title: inWishlist ? 'Removed from Wishlist' : 'Saved to Wishlist',
          description: product ? product.name : undefined,
        });
      },

      removeFromWishlist: (productId) => {
        set((state) => ({
          wishlist: state.wishlist.filter((id) => id !== productId),
        }));
      },

      applyPromoCode: (codeToApply) => {
        const cleanCode = codeToApply.trim().toUpperCase();
        const promo = get().promotions.find(
          (p) => p.code.toUpperCase() === cleanCode && p.isActive
        );

        if (!promo) {
          get().addToast({
            type: 'error',
            title: 'Invalid Promo Code',
            description: `Code "${cleanCode}" is unrecognized or expired.`,
          });
          return { success: false, message: 'Invalid or inactive promotional code.' };
        }

        // Calculate subtotal
        const subtotal = get().cart.reduce(
          (sum, item) => sum + item.priceAtAdd * item.quantity, 
          0
        );

        if (promo.minimumSpend && subtotal < promo.minimumSpend) {
          const msg = `Code requires a minimum order of $${promo.minimumSpend}.`;
          get().addToast({
            type: 'warning',
            title: 'Minimum Spend Not Met',
            description: msg,
          });
          return { success: false, message: msg };
        }

        set({ appliedPromo: promo });
        get().addToast({
          type: 'success',
          title: 'Promotion Applied',
          description: `${promo.title} applied to your order!`,
        });
        return { success: true, message: 'Promotion applied successfully.' };
      },

      removePromoCode: () => {
        set({ appliedPromo: null });
        get().addToast({
          type: 'info',
          title: 'Promo Code Removed',
        });
      },

      // Catalog Actions
      addProduct: (newProdData) => {
        const id = `prod-cust-${Date.now()}`;
        const newProd: Product = {
          ...newProdData,
          id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Also create matching inventory record across warehouses
        const qMain = Math.floor(newProd.stock * 0.6);
        const qWest = Math.floor(newProd.stock * 0.25);
        const qEast = Math.max(0, newProd.stock - qMain - qWest);

        const newInv: InventoryRecord = {
          productId: id,
          productName: newProd.name,
          sku: newProd.sku,
          category: newProd.category,
          reorderThreshold: newProd.lowStockThreshold || 10,
          warehouses: [
            {
              warehouseId: 'wh-main',
              warehouseName: 'Central Distribution Hub (Chicago, IL)',
              location: 'Aisle 09, Bay A',
              quantity: qMain,
              reserved: 0,
              incoming: 0,
            },
            {
              warehouseId: 'wh-west',
              warehouseName: 'Pacific Coast Facility (Reno, NV)',
              location: 'Zone W-04',
              quantity: qWest,
              reserved: 0,
              incoming: 0,
            },
            {
              warehouseId: 'wh-east',
              warehouseName: 'Atlantic Gateway (Bethlehem, PA)',
              location: 'Rack E-02',
              quantity: qEast,
              reserved: 0,
              incoming: 0,
            },
          ],
          totalAvailable: newProd.stock,
          totalReserved: 0,
          totalIncoming: 0,
          status: newProd.stock > 10 ? 'in_stock' : (newProd.stock > 0 ? 'low_stock' : 'out_of_stock'),
          lastStockAdjustment: new Date().toISOString(),
        };

        set((state) => ({
          products: [newProd, ...state.products],
          inventory: [newInv, ...state.inventory],
        }));

        get().addToast({
          type: 'success',
          title: 'Product Published',
          description: `"${newProd.name}" is now live in the storefront catalog.`,
        });

        get().addNotification({
          type: 'system',
          targetAudience: 'both',
          title: 'New Product Catalog Entry',
          message: `${newProd.name} added to ${newProd.categoryName}.`,
          actionUrl: `/product/${newProd.slug}`,
        });
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) => 
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
          ),
          inventory: state.inventory.map((inv) => {
            if (inv.productId === id) {
              return {
                ...inv,
                productName: updates.name ?? inv.productName,
                sku: updates.sku ?? inv.sku,
                category: updates.category ?? inv.category,
                totalAvailable: updates.stock !== undefined ? updates.stock : inv.totalAvailable,
                status: (updates.stock !== undefined ? updates.stock : inv.totalAvailable) > 0 ? 'in_stock' : 'out_of_stock',
              };
            }
            return inv;
          }),
        }));

        get().addToast({
          type: 'success',
          title: 'Product Updated',
          description: 'Catalog and storefront details refreshed.',
        });
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
          inventory: state.inventory.filter((inv) => inv.productId !== id),
          cart: state.cart.filter((item) => item.productId !== id),
          wishlist: state.wishlist.filter((wId) => wId !== id),
        }));

        get().addToast({
          type: 'info',
          title: 'Product Removed',
          description: 'Item removed from catalog and active inventory.',
        });
      },

      recordProductView: (productId) => {
        set((state) => {
          const filtered = state.recentlyViewedIds.filter((id) => id !== productId);
          return { recentlyViewedIds: [productId, ...filtered].slice(0, 8) };
        });
      },

      // Inventory Adjustment Action
      adjustStock: (productId, warehouseId, delta, adjustmentType, reason, notes) => {
        const product = get().products.find((p) => p.id === productId);
        if (!product) return;

        let prevQty = 0;
        let newQty = 0;
        let whName = '';

        set((state) => {
          const updatedInventory = state.inventory.map((inv) => {
            if (inv.productId !== productId) return inv;

            const updatedWarehouses = inv.warehouses.map((wh) => {
              if (wh.warehouseId !== warehouseId) return wh;
              prevQty = wh.quantity;
              whName = wh.warehouseName;
              newQty = Math.max(0, wh.quantity + delta);
              return { ...wh, quantity: newQty };
            });

            const totalAvailable = updatedWarehouses.reduce((acc, w) => acc + w.quantity, 0);
            const status: 'in_stock' | 'low_stock' | 'out_of_stock' = 
              totalAvailable <= 0 
                ? 'out_of_stock' 
                : (totalAvailable <= inv.reorderThreshold ? 'low_stock' : 'in_stock');

            return {
              ...inv,
              warehouses: updatedWarehouses,
              totalAvailable,
              status,
              lastStockAdjustment: new Date().toISOString(),
            };
          });

          // Also update product available stock in catalog
          const invRecord = updatedInventory.find((i) => i.productId === productId);
          const newAggregateStock = invRecord ? invRecord.totalAvailable : product.stock;

          const updatedProducts = state.products.map((p) => 
            p.id === productId ? { ...p, stock: newAggregateStock } : p
          );

          // Record adjustment audit log
          const adjustmentEntry: StockAdjustmentEntry = {
            id: 'adj-' + Date.now(),
            productId,
            productName: product.name,
            sku: product.sku,
            warehouseName: whName || 'Central Distribution',
            adjustmentType,
            quantityDelta: delta,
            previousQuantity: prevQty,
            newQuantity: newQty,
            reason,
            performedBy: 'Elias Thorne (Administrator)',
            timestamp: new Date().toISOString(),
            notes,
          };

          return {
            inventory: updatedInventory,
            products: updatedProducts,
            stockAdjustments: [adjustmentEntry, ...state.stockAdjustments],
          };
        });

        get().addToast({
          type: 'success',
          title: 'Inventory Synchronized',
          description: `${product.name} stock updated. Storefront availability updated immediately.`,
        });

        get().addNotification({
          type: 'inventory',
          targetAudience: 'admin',
          title: 'Stock Adjustment Recorded',
          message: `${product.name} adjusted by ${delta > 0 ? '+' : ''}${delta} units (${reason}).`,
          actionUrl: '/admin/inventory',
        });
      },

      // Orders & Checkout Actions
      createOrder: (orderData) => {
        const state = get();
        const orderNum = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        
        // Calculate subtotal, discount, tax
        const subtotal = state.cart.reduce((sum, item) => sum + item.priceAtAdd * item.quantity, 0);
        let discount = 0;

        if (state.appliedPromo) {
          if (state.appliedPromo.discountType === 'percentage') {
            discount = Number(((subtotal * state.appliedPromo.discountValue) / 100).toFixed(2));
          } else if (state.appliedPromo.discountType === 'fixed_amount') {
            discount = Math.min(subtotal, state.appliedPromo.discountValue);
          }
        }

        const shippingCost = (state.appliedPromo?.discountType === 'free_shipping' || subtotal >= 150) ? 0 : 15;
        const tax = Number(((subtotal - discount) * 0.0825).toFixed(2));
        const total = Number((subtotal - discount + shippingCost + tax).toFixed(2));

        const orderItems = state.cart.map((item) => ({
          productId: item.productId,
          productName: item.product.name,
          sku: item.variant?.sku || item.product.sku,
          variantName: item.variant?.name || item.selectedColor,
          price: item.priceAtAdd,
          quantity: item.quantity,
          image: item.variant?.image || item.product.images[0],
        }));

        const newOrder: Order = {
          id: orderNum,
          orderNumber: orderNum,
          customerId: state.currentCustomer.id,
          customerName: orderData.customerName,
          customerEmail: orderData.customerEmail,
          customerPhone: orderData.customerPhone,
          items: orderItems,
          subtotal,
          discount,
          promoCodeApplied: state.appliedPromo?.code,
          shippingCost,
          shippingMethod: orderData.shippingMethod,
          tax,
          total,
          paymentMethod: orderData.paymentMethod,
          paymentStatus: 'paid',
          status: 'pending',
          shippingAddress: orderData.shippingAddress,
          estimatedDelivery: new Date(Date.now() + 86400000 * 3).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          notes: [
            {
              id: 'note-init',
              author: 'Checkout Gateway',
              content: 'Order placed via simulated checkout. Payment authorized.',
              timestamp: new Date().toISOString(),
            },
          ],
          timeline: [
            {
              status: 'pending',
              title: 'Order Confirmed',
              description: 'Payment authorized and receipt dispatched to customer email.',
              timestamp: new Date().toISOString(),
              completed: true,
              current: true,
            },
            {
              status: 'processing',
              title: 'Allocating Stock',
              description: 'Order queued for picking at warehouse.',
              timestamp: 'Pending',
              completed: false,
            },
            {
              status: 'packed',
              title: 'Custom Packaging',
              description: 'Inspected and packed in recyclable materials.',
              timestamp: 'Pending',
              completed: false,
            },
            {
              status: 'shipped',
              title: 'Dispatched with Carrier',
              description: 'Tracking number will be assigned upon pickup.',
              timestamp: 'Pending',
              completed: false,
            },
            {
              status: 'delivered',
              title: 'Delivered',
              description: 'Estimated delivery in 2-4 business days.',
              timestamp: 'Pending',
              completed: false,
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Deduct ordered inventory from products & warehouse inventory
        state.cart.forEach((item) => {
          get().adjustStock(
            item.productId, 
            'wh-main', 
            -item.quantity, 
            'remove', 
            `Order ${orderNum} fulfillment reservation`
          );
        });

        // Update customer total spend & orders
        const updatedCustomer: CustomerProfile = {
          ...state.currentCustomer,
          totalOrders: state.currentCustomer.totalOrders + 1,
          totalSpent: state.currentCustomer.totalSpent + total,
          lastOrderDate: new Date().toISOString().split('T')[0],
        };

        set((s) => ({
          orders: [newOrder, ...s.orders],
          cart: [],
          appliedPromo: null,
          currentCustomer: updatedCustomer,
          customers: s.customers.map((c) => c.id === updatedCustomer.id ? updatedCustomer : c),
        }));

        // Trigger Notifications for both customer and admin
        get().addNotification({
          type: 'order',
          targetAudience: 'customer',
          title: 'Order Confirmed!',
          message: `Your order ${orderNum} for $${total.toFixed(2)} has been placed.`,
          actionUrl: `/account/orders/${orderNum}`,
        });

        get().addNotification({
          type: 'order',
          targetAudience: 'admin',
          title: `New Order Received (${orderNum})`,
          message: `${orderData.customerName} placed an order for $${total.toFixed(2)}.`,
          actionUrl: `/admin/orders/${orderNum}`,
        });

        return newOrder;
      },

      updateOrderStatus: (orderId, newStatus, trackingNumber, carrier) => {
        set((state) => {
          const now = new Date().toISOString();
          const updatedOrders = state.orders.map((ord) => {
            if (ord.id !== orderId) return ord;

            const tracking = trackingNumber || ord.trackingNumber || (newStatus === 'shipped' ? 'ATL-EXP-' + Math.floor(100000 + Math.random() * 900000) : undefined);
            const carrierName = carrier || ord.carrier || (newStatus === 'shipped' ? 'DHL Express' : undefined);

            // Update timeline
            const updatedTimeline = ord.timeline.map((event) => {
              if (event.status === newStatus) {
                return {
                  ...event,
                  completed: true,
                  current: true,
                  timestamp: now,
                  description: newStatus === 'shipped' 
                    ? `Dispatched via ${carrierName} (Tracking #${tracking})`
                    : event.description,
                };
              }
              // Mark previous events as completed
              const statusOrder: OrderStatus[] = ['pending', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered'];
              const currentIndex = statusOrder.indexOf(newStatus);
              const eventIndex = statusOrder.indexOf(event.status as OrderStatus);
              
              if (eventIndex >= 0 && eventIndex < currentIndex) {
                return { ...event, completed: true, current: false };
              }
              if (eventIndex > currentIndex) {
                return { ...event, completed: false, current: false };
              }
              return event;
            });

            return {
              ...ord,
              status: newStatus,
              trackingNumber: tracking,
              carrier: carrierName,
              timeline: updatedTimeline,
              updatedAt: now,
            };
          });

          return { orders: updatedOrders };
        });

        get().addToast({
          type: 'success',
          title: 'Order Status Updated',
          description: `Order ${orderId} is now marked as ${newStatus.toUpperCase()}. Customer tracking updated.`,
        });

        get().addNotification({
          type: 'order',
          targetAudience: 'both',
          title: `Order ${orderId} Status: ${newStatus.toUpperCase()}`,
          message: `The order status has advanced to ${newStatus}.`,
          actionUrl: `/account/orders/${orderId}`,
        });
      },

      addOrderNote: (orderId, noteContent) => {
        const newNote = {
          id: 'note-' + Date.now(),
          author: 'Elias Thorne (Administrator)',
          content: noteContent,
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          orders: state.orders.map((ord) => 
            ord.id === orderId 
              ? { ...ord, notes: [newNote, ...ord.notes], updatedAt: new Date().toISOString() }
              : ord
          ),
        }));

        get().addToast({
          type: 'info',
          title: 'Internal Note Saved',
          description: 'Note appended to order record with timestamp.',
        });
      },

      cancelOrder: (orderId, reason) => {
        set((state) => ({
          orders: state.orders.map((ord) => {
            if (ord.id !== orderId) return ord;
            return {
              ...ord,
              status: 'cancelled',
              paymentStatus: 'refunded',
              notes: [
                {
                  id: 'note-cancel-' + Date.now(),
                  author: 'Operations',
                  content: `Order cancelled. Reason: ${reason || 'Customer request'}. Refund initiated.`,
                  timestamp: new Date().toISOString(),
                },
                ...ord.notes,
              ],
              updatedAt: new Date().toISOString(),
            };
          }),
        }));

        get().addToast({
          type: 'warning',
          title: 'Order Cancelled',
          description: `Order ${orderId} has been cancelled and refunded.`,
        });
      },

      // Promotions Actions
      createPromotion: (promoData) => {
        const id = 'promo-' + Date.now();
        const newPromo: Promotion = {
          ...promoData,
          id,
          timesUsed: 0,
        };

        set((state) => ({
          promotions: [newPromo, ...state.promotions],
        }));

        get().addToast({
          type: 'success',
          title: 'Promotion Created',
          description: `Code "${newPromo.code}" is now active in the system.`,
        });
      },

      togglePromotionActive: (promoId) => {
        set((state) => ({
          promotions: state.promotions.map((p) => 
            p.id === promoId ? { ...p, isActive: !p.isActive } : p
          ),
        }));

        get().addToast({
          type: 'info',
          title: 'Promotion Updated',
          description: 'Promotion status toggled.',
        });
      },

      deletePromotion: (promoId) => {
        set((state) => ({
          promotions: state.promotions.filter((p) => p.id !== promoId),
        }));
        get().addToast({
          type: 'info',
          title: 'Promotion Deleted',
        });
      },

      // Reviews & Q&A Actions
      addReview: (reviewData) => {
        const id = 'rev-' + Date.now();
        const newReview: ProductReview = {
          ...reviewData,
          id,
          date: 'Just now',
          helpfulCount: 0,
        };

        set((state) => {
          const updatedReviews = [newReview, ...state.reviews];
          // Recalculate product rating
          const prodReviews = updatedReviews.filter((r) => r.productId === reviewData.productId);
          const avgRating = Number((prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length).toFixed(1));

          return {
            reviews: updatedReviews,
            products: state.products.map((p) => 
              p.id === reviewData.productId 
                ? { ...p, rating: avgRating, reviewCount: prodReviews.length }
                : p
            ),
          };
        });

        get().addToast({
          type: 'success',
          title: 'Review Published',
          description: 'Thank you for sharing your considered feedback.',
        });
      },

      voteHelpful: (reviewId) => {
        set((state) => ({
          reviews: state.reviews.map((r) => {
            if (r.id === reviewId) {
              const alreadyVoted = r.userVotedHelpful;
              return {
                ...r,
                helpfulCount: alreadyVoted ? r.helpfulCount - 1 : r.helpfulCount + 1,
                userVotedHelpful: !alreadyVoted,
              };
            }
            return r;
          }),
        }));
      },

      addQuestion: (productId, question, askedBy) => {
        const newQ: ProductQuestion = {
          id: 'q-' + Date.now(),
          productId,
          question,
          askedBy,
          date: 'Just now',
          answer: 'Thank you for your question. Our product specialist is reviewing this and will post an answer shortly.',
          answeredBy: 'Atelier Concierge',
          answerDate: 'Simulated pending review',
        };

        set((state) => ({
          questions: [newQ, ...state.questions],
        }));

        get().addToast({
          type: 'success',
          title: 'Question Submitted',
          description: 'Your question has been sent to our product specialists.',
        });
      },

      answerQuestion: (questionId, answer, answeredBy) => {
        set((state) => ({
          questions: state.questions.map((q) => 
            q.id === questionId 
              ? { ...q, answer, answeredBy, answerDate: 'Just now' }
              : q
          ),
        }));
      },

      // Notifications
      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) => 
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },

      markAllNotificationsRead: (target) => {
        set((state) => ({
          notifications: state.notifications.map((n) => {
            if (!target || n.targetAudience === target || n.targetAudience === 'both') {
              return { ...n, read: true };
            }
            return n;
          }),
        }));
      },

      addNotification: (notifData) => {
        const newNotif: AppNotification = {
          ...notifData,
          id: 'notif-' + Date.now(),
          read: false,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          notifications: [newNotif, ...state.notifications],
        }));
      },

      // Staff
      inviteStaff: (staffData) => {
        const newMember: StaffMember = {
          ...staffData,
          id: 'staff-' + Date.now(),
          lastActive: 'Invited (Pending)',
        };

        set((state) => ({
          staff: [...state.staff, newMember],
        }));

        get().addToast({
          type: 'success',
          title: 'Invitation Sent',
          description: `Invitation dispatched to ${newMember.email}.`,
        });
      },

      updateStaffPermissions: (staffId, permissions) => {
        set((state) => ({
          staff: state.staff.map((s) => 
            s.id === staffId ? { ...s, permissions } : s
          ),
        }));

        get().addToast({
          type: 'info',
          title: 'Permissions Updated',
          description: 'Role access matrix updated.',
        });
      },
    }),
    {
      name: 'atelier-commerce-storage',
      partialize: (state) => ({
        products: state.products,
        inventory: state.inventory,
        stockAdjustments: state.stockAdjustments,
        cart: state.cart,
        wishlist: state.wishlist,
        appliedPromo: state.appliedPromo,
        savedForLater: state.savedForLater,
        orders: state.orders,
        promotions: state.promotions,
        customers: state.customers,
        currentCustomer: state.currentCustomer,
        staff: state.staff,
        reviews: state.reviews,
        questions: state.questions,
        recentlyViewedIds: state.recentlyViewedIds,
        notifications: state.notifications,
        demoRole: state.demoRole,
        hasSeenWelcome: state.hasSeenWelcome,
        hasLoadedInitialSplash: state.hasLoadedInitialSplash,
      }),
    }
  )
);
