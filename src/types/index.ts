// Core Type Definitions for Atelier & Co. E-Commerce Platform

export type CategorySlug = 
  | 'electronics'
  | 'home-living'
  | 'fashion'
  | 'beauty'
  | 'sports-outdoors'
  | 'accessories';

export interface Category {
  id: string;
  name: string;
  slug: CategorySlug;
  description: string;
  image: string;
  itemCount?: number;
  featured?: boolean;
}

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Matte Black / Large"
  sku: string;
  price?: number; // optional price override
  originalPrice?: number;
  stock: number;
  attributes: {
    color?: string;
    colorHex?: string;
    size?: string;
    bundle?: string;
    material?: string;
  };
  image?: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  author: string;
  rating: number; // 1-5
  title: string;
  content: string;
  date: string;
  verified: boolean;
  helpfulCount: number;
  userVotedHelpful?: boolean;
  avatar?: string;
  images?: string[];
}

export interface ProductQuestion {
  id: string;
  productId: string;
  question: string;
  askedBy: string;
  date: string;
  answer?: string;
  answeredBy?: string;
  answerDate?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: CategorySlug;
  categoryName: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  costPrice?: number; // for admin margins
  sku: string;
  barcode?: string;
  rating: number;
  reviewCount: number;
  stock: number; // aggregate available inventory
  lowStockThreshold?: number;
  images: string[];
  variants: ProductVariant[];
  specifications: Record<string, string>;
  tags: string[];
  featured?: boolean;
  isDeal?: boolean;
  dealDiscountPercent?: number;
  dealExpiresAt?: string; // ISO string for live countdown
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
  updatedAt: string;
  // SEO fields
  seoTitle?: string;
  metaDescription?: string;
}

export interface CartItem {
  id: string; // cart item id (e.g. productId + variantId)
  productId: string;
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  priceAtAdd: number;
}

export interface ShippingAddress {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  deliveryInstructions?: string;
  isDefault?: boolean;
}

export type OrderStatus = 
  | 'pending'
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';

export interface OrderItem {
  id?: string;
  productId: string;
  productName: string;
  sku: string;
  variantName?: string;
  price: number;
  quantity: number;
  image: string;
}

export interface OrderTimelineEvent {
  status: OrderStatus | string;
  title: string;
  description: string;
  timestamp: string;
  location?: string;
  completed: boolean;
  current?: boolean;
}

export interface OrderNote {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

export interface Order {
  id: string; // e.g. "ORD-2026-8941"
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  promoCodeApplied?: string;
  shippingCost: number;
  shippingMethod: 'Standard Delivery' | 'Express Courier' | 'Complimentary White Glove';
  tax: number;
  total: number;
  paymentMethod: string; // e.g. "Visa ending in 4242", "PayPal", "Klarna"
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  timeline: OrderTimelineEvent[];
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery: string;
  notes: OrderNote[];
  createdAt: string;
  updatedAt: string;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  orderNumber: string;
  customerEmail: string;
  productId: string;
  productName: string;
  quantity: number;
  reason: string;
  status: 'pending_review' | 'approved' | 'rejected' | 'completed';
  comments?: string;
  requestedAt: string;
}

export interface Promotion {
  id: string;
  code: string; // e.g. "AUTUMN20"
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed_amount' | 'free_shipping';
  discountValue: number; // e.g. 20 for 20% or $20
  minimumSpend?: number;
  applicableCategory?: CategorySlug | 'all';
  applicableProductIds?: string[];
  startDate: string;
  endDate: string;
  usageLimit?: number;
  timesUsed: number;
  isActive: boolean;
}

export interface WarehouseInventory {
  warehouseId: string;
  warehouseName: string;
  location: string;
  quantity: number;
  reserved: number;
  incoming: number;
}

export interface InventoryRecord {
  productId: string;
  productName: string;
  sku: string;
  category: CategorySlug;
  reorderThreshold: number;
  warehouses: WarehouseInventory[];
  totalAvailable: number;
  totalReserved: number;
  totalIncoming: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  lastStockAdjustment?: string;
}

export interface StockAdjustmentEntry {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  warehouseName: string;
  adjustmentType: 'add' | 'remove' | 'reconcile' | 'transfer';
  quantityDelta: number;
  previousQuantity: number;
  newQuantity: number;
  reason: string;
  performedBy: string;
  timestamp: string;
  notes?: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  registeredDate: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  status: 'active' | 'inactive' | 'vip';
  addresses: ShippingAddress[];
  tags: string[];
  notes?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Administrator' | 'Inventory Manager' | 'Order Manager' | 'Marketing Manager' | 'Customer Support';
  status: 'active' | 'invited' | 'disabled';
  lastActive: string;
  avatar?: string;
  permissions: {
    products: boolean;
    inventory: boolean;
    orders: boolean;
    promotions: boolean;
    customers: boolean;
    analytics: boolean;
    settings: boolean;
  };
}

export interface AppNotification {
  id: string;
  type: 'order' | 'inventory' | 'customer' | 'promotion' | 'system';
  targetAudience: 'customer' | 'admin' | 'both';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}
