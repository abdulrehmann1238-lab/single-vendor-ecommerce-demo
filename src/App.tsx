import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Global Overlays & Controls
import { InitialLoader } from './components/common/InitialLoader';
import { ToastContainer } from './components/common/ToastContainer';
import { DemoSwitcher } from './components/common/DemoSwitcher';
import { SearchModal } from './components/common/SearchModal';
import { CartDrawer } from './components/common/CartDrawer';
import { QuickViewModal } from './components/common/QuickViewModal';

// Layouts
import { StorefrontLayout } from './components/common/StorefrontLayout';
import { AdminLayout } from './components/admin/AdminLayout';

// Storefront Pages
import { HomePage } from './pages/storefront/HomePage';
import { ShopPage } from './pages/storefront/ShopPage';
import { CategoriesPage, CategoryDetailPage } from './pages/storefront/CategoryDetailPage';
import { DealsPage } from './pages/storefront/DealsPage';
import { ProductDetailPage } from './pages/storefront/ProductDetailPage';
import { SearchResultsPage } from './pages/storefront/SearchResultsPage';
import { CartPage } from './pages/storefront/CartPage';
import { WishlistPage } from './pages/storefront/WishlistPage';
import { CheckoutPage } from './pages/storefront/CheckoutPage';
import { CheckoutSuccessPage } from './pages/storefront/CheckoutSuccessPage';
import { AccountPage } from './pages/storefront/AccountPage';
import { HelpPage, ContactPage } from './pages/storefront/HelpPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminInventoryPage } from './pages/admin/AdminInventoryPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminPromotionsPage } from './pages/admin/AdminPromotionsPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminTeamPage } from './pages/admin/AdminTeamPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      {/* Brand Splash Screen on Initial Load */}
      <InitialLoader />

      {/* Global Toast Notifications & Modals */}
      <ToastContainer />
      <SearchModal />
      <CartDrawer />
      <QuickViewModal />
      
      {/* Persistent Demo Mode Switcher Pill */}
      <DemoSwitcher />

      <Routes>
        {/* Customer Storefront Routes */}
        <Route element={<StorefrontLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/category/:slug" element={<CategoryDetailPage />} />
          <Route path="/deals" element={<DealsPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/account/orders" element={<AccountPage />} />
          <Route path="/account/orders/:id" element={<AccountPage />} />
          <Route path="/account/addresses" element={<AccountPage />} />
          <Route path="/account/returns" element={<AccountPage />} />
          <Route path="/account/profile" element={<AccountPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<HelpPage />} />
        </Route>

        {/* Internal Administration Dashboard Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="products/new" element={<AdminProductsPage />} />
          <Route path="products/:id" element={<AdminProductsPage />} />
          <Route path="inventory" element={<AdminInventoryPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="orders/:id" element={<AdminOrdersPage />} />
          <Route path="promotions" element={<AdminPromotionsPage />} />
          <Route path="customers" element={<AdminCustomersPage />} />
          <Route path="customers/:id" element={<AdminCustomersPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
          <Route path="team" element={<AdminTeamPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
