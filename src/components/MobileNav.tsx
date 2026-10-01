import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { CategoryId, ViewType } from '../types';

/** Floating bottom tab bar, shown only on small screens. */
export const MobileNav: React.FC = () => {
  const { activeView, navigate, cartCount, openDrawer, wishlist } = useStore();
  const [wishlistTab, setWishlistTab] = useState(false);

  // Leaving the catalog clears the favourites highlight.
  useEffect(() => {
    if (activeView !== 'catalog') setWishlistTab(false);
  }, [activeView]);

  const tabs: {
    id: string;
    icon: string;
    label: string;
    view?: ViewType;
    category?: CategoryId;
    badge?: number;
    action?: () => void;
  }[] = [
    { id: 'home', icon: 'home', label: 'Inicio', view: 'home' },
    { id: 'catalog', icon: 'grid_view', label: 'Catálogo', view: 'catalog' },
    {
      id: 'cart-drawer',
      icon: 'shopping_bag',
      label: 'Carrito',
      badge: cartCount,
      action: openDrawer,
    },
    {
      id: 'wishlist',
      icon: 'favorite',
      label: 'Favoritos',
      badge: wishlist.length,
      view: 'catalog',
      action: () => {
        setWishlistTab(true);
        navigate({ view: 'catalog' });
      },
    },
    { id: 'checkout', icon: 'person', label: 'Cuenta', view: 'checkout' },
  ];

  // Catálogo and Favoritos share a destination, so only one may read as active.
  const isActive = (tab: (typeof tabs)[number]) => {
    if (tab.id === 'wishlist') return activeView === 'catalog' && wishlistTab;
    if (tab.id === 'catalog')
      return (activeView === 'catalog' && !wishlistTab) || activeView === 'product-detail';
    if (tab.id === 'checkout')
      return activeView === 'checkout' || activeView === 'confirmation';
    return tab.view === activeView;
  };

  return (
    <div className="md:hidden fixed bottom-space-sm inset-x-space-sm z-40">
      <nav
        aria-label="Navegación principal"
        className="h-16 px-space-xs rounded-full glass-panel shadow-[0_18px_40px_-8px_rgba(9,27,56,0.25)] flex items-center justify-around"
      >
        {tabs.map((tab) => {
          const active = isActive(tab);
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'catalog') setWishlistTab(false);
                if (tab.action) tab.action();
                else navigate({ view: tab.view! });
              }}
              aria-label={tab.label}
              aria-current={active}
              className={`relative flex flex-col items-center justify-center gap-0.5 px-space-sm py-1.5 rounded-2xl transition-all duration-300 ${
                active
                  ? 'text-primary -translate-y-0.5'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[22px] transition-transform duration-300 ${
                  active ? 'fill-icon scale-110' : ''
                }`}
              >
                {tab.icon}
              </span>
              <span className="font-label-sm text-[9px] font-bold">{tab.label}</span>

              {active && (
                <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-primary-container animate-fade-in" />
              )}

              {Boolean(tab.badge) && tab.badge! > 0 && (
                <span className="absolute top-0 right-1 min-w-[16px] h-4 px-1 rounded-full bg-secondary text-on-secondary font-label-sm text-[9px] font-black flex items-center justify-center shadow-sm">
                  {tab.badge! > 9 ? '9+' : tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
