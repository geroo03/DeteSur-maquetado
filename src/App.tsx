/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { HomeView } from './views/HomeView';
import { CatalogView } from './views/CatalogView';
import { ProductDetailView } from './views/ProductDetailView';
import { CartView } from './views/CartView';
import { CheckoutView } from './views/CheckoutView';
import { ConfirmationView } from './views/ConfirmationView';
import { MobileView } from './views/MobileView';
import { CategoryId } from './types';

const MainAppContent: React.FC = () => {
  const { activeView, navigateTo, cartCount } = useCart();
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [catalogCategory, setCatalogCategory] = useState<CategoryId>('ALL');

  const handleSelectCategoryFromHome = (cat: CategoryId) => {
    setCatalogCategory(cat);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface relative font-sans flex flex-col justify-between selection:bg-secondary-container selection:text-on-secondary-container">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-secondary-fixed/30 blur-3xl"></div>
        <div className="absolute top-1/4 -right-24 w-80 h-80 rounded-full bg-primary-fixed/40 blur-3xl"></div>
        <div className="absolute top-2/3 left-10 w-96 h-96 rounded-full bg-tertiary-fixed/30 blur-3xl"></div>
        <div className="absolute -bottom-20 right-1/4 w-80 h-80 rounded-full bg-secondary-fixed-dim/20 blur-3xl"></div>
      </div>

      {/* Main App Navigation Bar */}
      <Header
        deviceMode={deviceMode}
        setDeviceMode={setDeviceMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Slide-over Global Cart Drawer */}
      <CartDrawer />

      {/* Main View Router */}
      <main className="relative z-10 w-full pt-28 md:pt-32 max-w-[1280px] mx-auto px-margin md:px-margin-desktop pb-24 md:pb-12 flex-1">
        {deviceMode === 'mobile' ? (
          <MobileView />
        ) : (
          <>
            {activeView === 'home' && (
              <HomeView onSelectCategory={handleSelectCategoryFromHome} />
            )}
            {activeView === 'catalog' && (
              <CatalogView
                initialCategory={catalogCategory}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            )}
            {activeView === 'product-detail' && <ProductDetailView />}
            {activeView === 'cart' && <CartView />}
            {activeView === 'checkout' && <CheckoutView />}
            {activeView === 'confirmation' && <ConfirmationView />}
          </>
        )}
      </main>

      {/* Persistent Footer on Desktop views */}
      {deviceMode === 'desktop' && <Footer />}

      {/* Floating Bottom Nav on standard Mobile screens */}
      {deviceMode === 'desktop' && (
        <div className="md:hidden fixed bottom-space-sm inset-x-margin z-50">
          <nav className="h-16 px-space-sm rounded-full bg-surface-container-lowest/85 backdrop-blur-2xl shadow-[0_16px_36px_-6px_rgba(9,27,56,0.18)] flex items-center justify-around border border-white/60">
            <button
              onClick={() => navigateTo('home')}
              className={`flex flex-col items-center justify-center p-2 rounded-full transition-all ${
                activeView === 'home'
                  ? 'bg-primary-container text-on-primary shadow-md'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">home</span>
            </button>
            <button
              onClick={() => navigateTo('catalog')}
              className={`flex flex-col items-center justify-center p-2 rounded-full transition-all ${
                activeView === 'catalog'
                  ? 'bg-primary-container text-on-primary shadow-md'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">grid_view</span>
            </button>
            <button
              onClick={() => navigateTo('product-detail', 'lavandina-55g')}
              className={`flex flex-col items-center justify-center p-2 rounded-full transition-all ${
                activeView === 'product-detail'
                  ? 'bg-primary-container text-on-primary shadow-md'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">water_drop</span>
            </button>
            <button
              onClick={() => navigateTo('cart')}
              className={`flex flex-col items-center justify-center p-2 rounded-full transition-all relative ${
                activeView === 'cart'
                  ? 'bg-primary-container text-on-primary shadow-md'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">shopping_cart</span>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-secondary"></span>
              )}
            </button>
            <button
              onClick={() => navigateTo('checkout')}
              className={`flex flex-col items-center justify-center p-2 rounded-full transition-all ${
                activeView === 'checkout' || activeView === 'confirmation'
                  ? 'bg-primary-container text-on-primary shadow-md'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">person</span>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <CartProvider>
      <MainAppContent />
    </CartProvider>
  );
}
