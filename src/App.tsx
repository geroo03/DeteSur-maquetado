import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { MobileNav } from './components/MobileNav';
import { Toasts } from './components/Toasts';
import { BackToTop } from './components/BackToTop';
import { HomeView } from './views/HomeView';
import { CatalogView } from './views/CatalogView';
import { ProductDetailView } from './views/ProductDetailView';
import { CartView } from './views/CartView';
import { CheckoutView } from './views/CheckoutView';
import { ConfirmationView } from './views/ConfirmationView';

/** Ambient gradient orbs that drift behind every page. */
const AmbientBackground: React.FC = () => (
  <div aria-hidden="true" className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-secondary-fixed/30 blur-3xl animate-drift" />
    <div
      className="absolute top-1/4 -right-24 w-80 h-80 rounded-full bg-primary-fixed/40 blur-3xl animate-float-slow"
      style={{ animationDelay: '2s' }}
    />
    <div
      className="absolute top-2/3 left-10 w-96 h-96 rounded-full bg-tertiary-fixed/30 blur-3xl animate-drift"
      style={{ animationDelay: '4s' }}
    />
    <div
      className="absolute -bottom-20 right-1/4 w-80 h-80 rounded-full bg-secondary-fixed-dim/20 blur-3xl animate-float-slow"
      style={{ animationDelay: '6s' }}
    />
  </div>
);

const Router: React.FC = () => {
  const { activeView, route } = useStore();

  switch (activeView) {
    case 'catalog':
      return <CatalogView />;
    case 'product-detail':
      return <ProductDetailView key={route.productId} />;
    case 'cart':
      return <CartView />;
    case 'checkout':
      return <CheckoutView />;
    case 'confirmation':
      return <ConfirmationView />;
    default:
      return <HomeView />;
  }
};

const Shell: React.FC = () => {
  const { activeView, route } = useStore();

  return (
    <div className="min-h-screen bg-background text-on-surface relative font-sans flex flex-col">
      <AmbientBackground />

      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[80] focus:px-4 focus:py-2 focus:rounded-full focus:bg-primary focus:text-on-primary focus:font-bold"
      >
        Saltar al contenido
      </a>

      <Header />
      <CartDrawer />
      <QuickViewModal />
      <Toasts />

      <main
        id="contenido"
        className="relative z-10 w-full flex-1 pt-28 md:pt-32 max-w-[1280px] mx-auto px-margin md:px-margin-desktop pb-space-xl"
      >
        {/* Keyed so each view replays its entrance animation. */}
        <div key={`${activeView}:${route.productId ?? ''}`} className="animate-fade-up">
          <Router />
        </div>
      </main>

      <Footer />
      <MobileNav />
      <BackToTop />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}
