import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { LOGO_URL } from '../data/products';
import { ViewType } from '../types';

interface HeaderProps {
  deviceMode: 'desktop' | 'mobile';
  setDeviceMode: (mode: 'desktop' | 'mobile') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  deviceMode,
  setDeviceMode,
  searchQuery,
  setSearchQuery,
}) => {
  const { activeView, navigateTo, cartCount, openDrawer } = useCart();
  const [showNavMenu, setShowNavMenu] = useState(false);

  const screens: { id: ViewType; label: string; icon: string }[] = [
    { id: 'home', label: '1. Inicio (Landing)', icon: 'home' },
    { id: 'catalog', label: '2. Catálogo & Química Suelta', icon: 'grid_view' },
    { id: 'product-detail', label: '3. Detalle de Producto', icon: 'science' },
    { id: 'cart', label: '4. Carrito de Compras', icon: 'shopping_bag' },
    { id: 'checkout', label: '5. Despacho & Pago Seguro', icon: 'credit_card' },
    { id: 'confirmation', label: '6. Pedido Confirmado & Tracking', icon: 'check_circle' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeView !== 'catalog') {
      navigateTo('catalog');
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 p-space-xs sm:p-space-sm md:p-space-md">
      {/* Top Banner Toolbar with Screen Switcher & Viewport Mode */}
      <div className="max-w-[1280px] mx-auto mb-1 px-2 flex items-center justify-between text-[11px] font-semibold text-[#091b38]/70">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 bg-[#cde5ff] text-[#004b74] px-2 py-0.5 rounded-full font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0077b6] animate-pulse"></span>
            Detersur Oficial
          </span>
          <span className="hidden sm:inline">Venta Minorista y Mayorista ANMAT</span>
        </div>

        {/* Quick Screen Jumper & Device Toggle */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowNavMenu(!showNavMenu)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 shadow-sm border border-slate-200/80 hover:bg-white text-primary font-bold transition-all text-xs"
              title="Cambiar de pantalla"
            >
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              <span className="hidden sm:inline">Pantalla:</span>
              <span className="text-[#091b38]">
                {screens.find((s) => s.id === activeView)?.label.split(' ')[1] || 'Ver'}
              </span>
              <span className="material-symbols-outlined text-[16px]">expand_more</span>
            </button>

            {showNavMenu && (
              <div className="absolute right-0 top-full mt-1.5 w-64 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 tracking-wider">
                  Navegar Pantallas del Mockup
                </div>
                {screens.map((screen) => (
                  <button
                    key={screen.id}
                    onClick={() => {
                      navigateTo(screen.id);
                      setShowNavMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 text-xs transition-colors ${
                      activeView === screen.id
                        ? 'bg-[#0077b6] text-white font-bold shadow-sm'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {screen.icon}
                    </span>
                    <span>{screen.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Viewport Toggle: Desktop vs Mobile Simulation */}
          <div className="inline-flex items-center bg-white/90 rounded-full p-0.5 shadow-sm border border-slate-200/80">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`px-2.5 py-0.5 rounded-full flex items-center gap-1 text-[11px] font-bold transition-all ${
                deviceMode === 'desktop'
                  ? 'bg-[#0077b6] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#0077b6]'
              }`}
              title="Vista de escritorio"
            >
              <span className="material-symbols-outlined text-[14px]">desktop_windows</span>
              <span className="hidden sm:inline">Escritorio</span>
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`px-2.5 py-0.5 rounded-full flex items-center gap-1 text-[11px] font-bold transition-all ${
                deviceMode === 'mobile'
                  ? 'bg-[#0077b6] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#0077b6]'
              }`}
              title="Vista móvil / celular"
            >
              <span className="material-symbols-outlined text-[14px]">smartphone</span>
              <span className="hidden sm:inline">Móvil</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Glass Header Nav */}
      <div className="h-16 md:h-20 max-w-[1280px] mx-auto px-space-sm sm:px-space-md md:px-gutter-desktop rounded-full bg-white/80 backdrop-blur-2xl shadow-[0_20px_40px_-10px_rgba(9,27,56,0.08)] flex items-center justify-between gap-space-sm md:gap-space-md border border-white/60">
        {/* Brand Logo & Title */}
        <button
          onClick={() => navigateTo('home')}
          className="flex items-center gap-space-sm shrink-0 text-left group"
        >
          <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-primary-container flex items-center justify-center text-on-primary shadow-[inset_0_2px_4px_rgba(255,255,255,0.45),0_8px_16px_-4px_rgba(0,119,182,0.35)] overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
            <img
              alt="Detersur Logo 3D"
              className="w-7 h-7 md:w-8 md:h-8 object-contain drop-shadow"
              src={LOGO_URL}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-headline-md text-headline-sm md:text-headline-md tracking-tight text-primary leading-none font-bold">
              Detersur
            </span>
            <span className="font-label-sm text-[10px] md:text-label-sm text-secondary tracking-widest uppercase font-bold">
              Química &amp; Limpieza
            </span>
          </div>
        </button>

        {/* Location Dispatch Badge */}
        <div className="hidden lg:flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container-low/80 text-on-surface-variant font-label-md text-label-md">
          <span className="material-symbols-outlined text-[18px] text-secondary">
            local_shipping
          </span>
          <span>GBA &amp; CABA: Retiro o Envío Express</span>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-md mx-space-sm"
        >
          <div className="w-full flex items-center px-space-md py-2 rounded-full bg-surface-container-low focus-within:bg-white focus-within:shadow-[0_0_0_2px_#0077b6] transition-all">
            <span className="material-symbols-outlined text-outline text-[20px] mr-space-xs">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar lavandina, jabón, bidón, desinfectante..."
              className="w-full bg-transparent font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>
        </form>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-space-lg">
          <button
            onClick={() => navigateTo('home')}
            className={`font-label-lg text-label-lg transition-colors ${
              activeView === 'home'
                ? 'text-primary font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Inicio
          </button>
          <button
            onClick={() => navigateTo('catalog')}
            className={`font-label-lg text-label-lg transition-colors ${
              activeView === 'catalog'
                ? 'text-primary font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Categorías
          </button>
          <button
            onClick={() => navigateTo('catalog')}
            className="font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Química Suelta
          </button>
          <button
            onClick={() => navigateTo('catalog')}
            className="font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Mayorista
          </button>
        </nav>

        {/* Right Action Icons: Cart & Profile */}
        <div className="flex items-center gap-space-sm shrink-0">
          <button
            type="button"
            onClick={openDrawer}
            className="relative flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all active:scale-95 shadow-sm"
            aria-label="Ver carrito"
          >
            <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm flex items-center justify-center font-bold shadow-sm animate-in zoom-in">
                {cartCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => navigateTo('checkout')}
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 text-white hover:opacity-90 shadow-sm active:scale-95 transition-all"
            title="Mi Cuenta / Checkout"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </button>
        </div>
      </div>
    </header>
  );
};
