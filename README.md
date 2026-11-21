# ATELIER & CO. — Custom Single-Vendor E-Commerce Platform

> **A luxury, custom-coded single-vendor retail platform inspired by Amazon’s extensive shopping discovery, inventory management, and order fulfillment infrastructure.**

---

## 🏛️ Project Overview

This is a complete, independently developed e-commerce platform demonstration for a business selling directly to customers (D2C). 
**This is NOT a multi-vendor marketplace.**

- **One Business / One Seller**: Atelier & Co.
- **Centralized Catalog**: 36+ curated products across 6 luxury lifestyle categories.
- **Internal Multi-Warehouse Inventory**: Chicago Central, Reno Pacific, and Bethlehem Atlantic facilities with real-time stock adjustments.
- **Unified Order Fulfillment**: Complete pipeline from order placement through warehouse picking, packing, and carrier dispatch with live tracking.
- **Interconnected Persistent State**: Changes made in the Admin Dashboard (inventory levels, price discounts, order fulfillment status) update the Customer Storefront in real time via shared persistent frontend state.

---

## 🎨 Design Direction

- **Primary Background**: `#F8F7F3` (Warm Ivory)
- **Secondary Background**: `#F0EFE9` (Soft Stone)
- **Card Surfaces**: `#FFFFFF` (Clean White)
- **Primary Typography / Accents**: `#242820` (Deep Warm Charcoal)
- **Brand Accents**: `#52634F` (Sophisticated Forest Green), `#A8AA91` (Sage), `#B49A72` (Champagne)
- **Headings**: DM Serif Display / Cormorant Garamond
- **Body & Metrics**: Inter

---

## ⚡ Tech Stack

- **Framework**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM (v6)
- **State Management**: Zustand (with persistent localStorage middleware)
- **Icons**: Lucide React
- **Analytics & Charts**: Recharts
- **Celebration Effects**: Canvas Confetti

---

## 🚀 Live Demo & Navigation

- **Customer Storefront**: `/` (Homepage), `/shop`, `/categories`, `/deals`, `/product/:slug`, `/cart`, `/checkout`, `/account`
- **Internal Admin Operations**: `/admin` (Overview), `/admin/products`, `/admin/inventory`, `/admin/orders`, `/admin/promotions`, `/admin/customers`, `/admin/analytics`, `/admin/reports`, `/admin/team`, `/admin/settings`
- **Demo Switcher Pill**: A discreet floating widget in the bottom-left corner of the screen provides one-click switching between Customer View and Admin View, as well as a "Reset All Demo Data" button.

---

## 📦 Netlify Deployment

This repository is pre-configured for instant zero-configuration deployment on **Netlify**:

1. Import this repository into Netlify.
2. Build Settings are automatically populated via `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Single-Page Application (SPA) redirect rewrites are handled by both `netlify.toml` and `public/_redirects`.
