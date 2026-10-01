import React, { useRef } from 'react';
import { useCart } from '../context/CartContext';
import { PRODUCTS, LOGO_3D_URL } from '../data/products';
import { CategoryId } from '../types';

interface HomeViewProps {
  onSelectCategory?: (category: CategoryId) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onSelectCategory }) => {
  const { addToCart, navigateTo, cartCount, subtotal } = useCart();
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleCategoryClick = (cat: CategoryId) => {
    if (onSelectCategory) {
      onSelectCategory(cat);
    }
    navigateTo('catalog');
  };

  const categories = [
    { id: 'sueltos' as CategoryId, label: 'Químicos Sueltos', count: '42 productos', icon: 'water_drop', color: 'from-secondary-fixed/60 to-primary-fixed/40', textColor: 'text-secondary' },
    { id: 'pisos' as CategoryId, label: 'Pisos & Cerámicos', count: '28 productos', icon: 'mop', color: 'from-primary-fixed/60 to-surface-container-highest', textColor: 'text-primary' },
    { id: 'cocina' as CategoryId, label: 'Cocina & Grasas', count: '19 productos', icon: 'countertops', color: 'from-tertiary-fixed/60 to-surface-container-high', textColor: 'text-tertiary' },
    { id: 'sueltos' as CategoryId, label: 'Baño & Antisarro', count: '24 productos', icon: 'bathroom', color: 'from-secondary-fixed/50 to-surface-container-low', textColor: 'text-secondary' },
    { id: 'ropa' as CategoryId, label: 'Lavado de Ropa', count: '35 productos', icon: 'local_laundry_service', color: 'from-primary-fixed/60 to-secondary-fixed/40', textColor: 'text-primary' },
    { id: 'piscinas' as CategoryId, label: 'Cuidado Piscina', count: '16 productos', icon: 'pool', color: 'from-primary-fixed/80 to-surface-container-lowest', textColor: 'text-primary' },
    { id: 'accesorios' as CategoryId, label: 'Escobas & Palas', count: '22 productos', icon: 'cleaning_services', color: 'from-surface-container-highest to-surface-container-low', textColor: 'text-primary' },
    { id: 'papeleria' as CategoryId, label: 'Papel & Rollos', count: '31 productos', icon: 'inventory_2', color: 'from-tertiary-fixed/50 to-primary-fixed/40', textColor: 'text-tertiary' },
    { id: 'pisos' as CategoryId, label: 'Aromas & Difusor', count: '27 productos', icon: 'air_freshener', color: 'from-secondary-fixed/50 to-surface-container-lowest', textColor: 'text-secondary' },
    { id: 'sueltos' as CategoryId, label: 'Insecticidas', count: '14 productos', icon: 'pest_control', color: 'from-primary-fixed/50 to-surface-container-highest', textColor: 'text-primary' },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Subtle Ambient Glow Orbs */}
      <div className="relative w-full overflow-hidden pb-12">
        <div className="absolute -top-10 left-1/4 w-72 h-72 rounded-full bg-secondary-fixed/25 blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-80 right-10 w-96 h-96 rounded-full bg-primary-fixed/30 blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-[1200px] left-8 w-80 h-80 rounded-full bg-tertiary-fixed/25 blur-3xl pointer-events-none -z-10"></div>

        {/* Quick Search Badges Bar */}
        <div className="w-full flex items-center justify-between gap-space-sm overflow-x-auto py-space-sm px-space-xs no-scrollbar mb-space-md">
          <div className="flex items-center gap-space-xs text-on-surface-variant shrink-0">
            <span className="material-symbols-outlined text-[18px] text-primary">trending_up</span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold">
              Búsquedas del día:
            </span>
          </div>
          <div className="flex items-center gap-space-xs shrink-0">
            <button
              onClick={() => navigateTo('product-detail', 'lavandina-55g')}
              className="px-space-md py-1.5 rounded-full bg-white/80 text-on-primary-fixed-variant font-label-md text-label-md shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),0_4px_12px_rgba(0,119,182,0.06)] hover:bg-white transition-all hover:scale-105 active:scale-95 flex items-center gap-1 border border-slate-100"
            >
              <span className="material-symbols-outlined text-[15px] text-secondary">water_drop</span>
              <span>Lavandina concentrada 55g</span>
            </button>
            <button
              onClick={() => navigateTo('catalog')}
              className="px-space-md py-1.5 rounded-full bg-white/80 text-on-primary-fixed-variant font-label-md text-label-md shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),0_4px_12px_rgba(0,119,182,0.06)] hover:bg-white transition-all hover:scale-105 active:scale-95 flex items-center gap-1 border border-slate-100"
            >
              <span className="material-symbols-outlined text-[15px] text-primary">local_laundry_service</span>
              <span>Jabón líquido baja espuma</span>
            </button>
            <button
              onClick={() => navigateTo('catalog')}
              className="px-space-md py-1.5 rounded-full bg-white/80 text-on-primary-fixed-variant font-label-md text-label-md shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),0_4px_12px_rgba(0,119,182,0.06)] hover:bg-white transition-all hover:scale-105 active:scale-95 flex items-center gap-1 border border-slate-100"
            >
              <span className="material-symbols-outlined text-[15px] text-tertiary">pool</span>
              <span>Pastillas triple acción</span>
            </button>
            <button
              onClick={() => navigateTo('product-detail', 'lavandina-55g')}
              className="px-space-md py-1.5 rounded-full bg-white/80 text-on-primary-fixed-variant font-label-md text-label-md shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),0_4px_12px_rgba(0,119,182,0.06)] hover:bg-white transition-all hover:scale-105 active:scale-95 flex items-center gap-1 border border-slate-100"
            >
              <span className="material-symbols-outlined text-[15px] text-secondary">eco</span>
              <span>Recarga bidón 5L</span>
            </button>
          </div>
        </div>

        {/* Ticker Banner */}
        <div className="relative w-full rounded-2xl bg-gradient-to-r from-secondary-fixed/40 via-white/90 to-primary-fixed/40 p-space-sm shadow-[inset_0_2px_6px_rgba(255,255,255,0.9),0_8px_20px_rgba(0,119,182,0.07)] backdrop-blur-xl mb-space-lg border border-white/60">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-space-xs px-space-sm text-center sm:text-left">
            <div className="flex items-center gap-space-xs">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-on-secondary shadow-sm">
                <span className="material-symbols-outlined text-[18px]">local_shipping</span>
              </span>
              <p className="font-body-md text-body-md text-on-surface">
                <span className="font-bold text-primary">Envíos gratis</span> en compras mayores a{' '}
                <span className="font-bold text-on-surface">$25.000</span> en el día en CABA y GBA Sur.
              </p>
            </div>
            <div className="flex items-center gap-space-xs text-on-secondary-fixed-variant font-label-md text-label-md bg-secondary-container/60 px-space-md py-1 rounded-full shadow-xs">
              <span className="material-symbols-outlined text-[16px] text-secondary">recycling</span>
              <span>
                Traé tu envase y ahorrá hasta un <strong>40%</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Hero Section (Clay + Specular Tactility) */}
        <section className="relative w-full rounded-3xl bg-gradient-to-br from-surface-container-lowest via-surface-container-low/60 to-surface-container-high/40 p-space-lg md:p-space-xl shadow-[inset_0_4px_10px_rgba(255,255,255,0.9),0_24px_48px_-12px_rgba(0,119,182,0.12)] mb-space-xl border border-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-center">
            {/* Text Content */}
            <div className="lg:col-span-7 space-y-space-md">
              <div className="inline-flex items-center gap-space-xs px-space-md py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-md text-label-md shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)]">
                <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                <span>Química directa &amp; Fraccionadora Mayorista</span>
              </div>
              <h1 className="font-display-hero text-3xl sm:text-4xl md:text-5xl lg:text-[46px] text-primary tracking-tight font-extrabold leading-[1.15]">
                Todo para la limpieza de tu casa y tu negocio
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                Comprá directo de fábrica: químicos sueltos, bidones por mayor y las primeras marcas de higiene institucional al mejor precio de Zona Sur. Fraccionado exacto y seguro.
              </p>

              {/* Action CTA Clay Buttons */}
              <div className="flex flex-wrap items-center gap-space-md pt-space-xs">
                <button
                  onClick={() => navigateTo('catalog')}
                  className="group relative px-space-xl py-space-md rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg shadow-[inset_0_3px_6px_rgba(255,255,255,0.5),0_14px_28px_-6px_rgba(0,119,182,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-space-xs font-bold"
                >
                  <span>Ver ofertas de la semana</span>
                  <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </button>
                <button
                  onClick={() => navigateTo('product-detail', 'lavandina-55g')}
                  className="px-space-xl py-space-md rounded-full bg-secondary-container text-on-secondary-fixed-variant font-label-lg text-label-lg shadow-[inset_0_3px_6px_rgba(255,255,255,0.85),0_12px_24px_-6px_rgba(0,168,150,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-space-xs font-bold"
                >
                  <span className="material-symbols-outlined text-[20px] text-secondary">
                    calculate
                  </span>
                  <span>Calculá tu bidón suelto</span>
                </button>
              </div>

              {/* Trust Badges Under Hero */}
              <div className="pt-space-md grid grid-cols-3 gap-space-sm text-center md:text-left">
                <div className="p-space-xs">
                  <div className="font-price-integer text-2xl md:text-3xl text-primary font-black leading-none">
                    +250
                  </div>
                  <div className="font-body-sm text-xs md:text-body-sm text-on-surface-variant mt-1">
                    Fórmulas activas certificadas
                  </div>
                </div>
                <div className="p-space-xs">
                  <div className="font-price-integer text-2xl md:text-3xl text-secondary font-black leading-none">
                    -40%
                  </div>
                  <div className="font-body-sm text-xs md:text-body-sm text-on-surface-variant mt-1">
                    Ahorro en recarga de envase
                  </div>
                </div>
                <div className="p-space-xs">
                  <div className="font-price-integer text-2xl md:text-3xl text-tertiary font-black leading-none">
                    24hs
                  </div>
                  <div className="font-body-sm text-xs md:text-body-sm text-on-surface-variant mt-1">
                    Despacho express garantizado
                  </div>
                </div>
              </div>
            </div>

            {/* 3D Clay & Glass Visual Showcase */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-[420px] aspect-square rounded-3xl bg-gradient-to-tr from-secondary-fixed/50 via-surface-container-lowest to-primary-fixed/40 p-space-md shadow-[inset_0_4px_12px_rgba(255,255,255,0.9),0_20px_40px_-10px_rgba(9,27,56,0.12)] flex items-center justify-center border border-white">
                <img
                  alt="Detersur Logo 3D Clay Drop"
                  className="w-56 h-56 object-contain filter drop-shadow-[0_20px_30px_rgba(0,119,182,0.25)] hover:scale-105 transition-transform duration-500 z-10"
                  src={LOGO_3D_URL}
                />
                <div className="absolute -top-3 right-2 backdrop-blur-xl bg-surface-container-lowest/80 px-space-md py-space-xs rounded-full shadow-[0_12px_24px_rgba(9,27,56,0.08),inset_0_2px_4px_rgba(255,255,255,0.9)] flex items-center gap-space-xs z-20 border border-white/60">
                  <span className="material-symbols-outlined text-secondary text-[20px]">verified</span>
                  <span className="font-label-md text-label-md text-on-surface font-bold">
                    Fórmula 100% Biodegradable
                  </span>
                </div>
                <div className="absolute -bottom-4 left-4 backdrop-blur-xl bg-surface-container-lowest/85 px-space-md py-space-sm rounded-2xl shadow-[0_16px_32px_rgba(9,27,56,0.1),inset_0_2px_4px_rgba(255,255,255,0.9)] flex items-center gap-space-sm z-20 border border-white/60">
                  <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-container">
                    <span className="material-symbols-outlined text-[20px]">science</span>
                  </div>
                  <div className="text-left">
                    <div className="font-label-md text-label-md text-on-surface font-bold">
                      Lavandina 55g/L
                    </div>
                    <div className="font-body-sm text-body-sm text-secondary font-semibold">
                      Máxima densidad activa
                    </div>
                  </div>
                </div>
                <div className="absolute top-1/2 -left-4 -translate-y-1/2 backdrop-blur-lg bg-primary-fixed/70 px-space-sm py-space-xs rounded-full shadow-md flex items-center gap-1 text-on-primary-fixed-variant font-label-sm text-label-sm border border-white/50">
                  <span className="material-symbols-outlined text-[16px]">bubble_chart</span>
                  <span>Ultra Espuma</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category Grid: 10 Tangible 3D Clay Tiles */}
        <section className="w-full mb-space-xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-space-md">
            <div>
              <span className="font-label-sm text-label-sm text-secondary uppercase font-extrabold tracking-widest">
                Explorá por Sector
              </span>
              <h2 className="font-headline-lg text-2xl md:text-headline-lg text-primary tracking-tight font-extrabold">
                Categorías Principales
              </h2>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 sm:mt-0">
              Precios directos para el hogar, oficinas y grandes superficies
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-space-md">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => handleCategoryClick(cat.id)}
                className="group relative flex flex-col items-center text-center p-space-md rounded-3xl bg-surface-container-lowest shadow-[inset_0_3px_6px_rgba(255,255,255,0.95),0_14px_28px_-6px_rgba(0,119,182,0.12)] hover:-translate-y-1.5 active:translate-y-0 transition-all duration-200 border border-slate-100"
              >
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)] mb-space-sm group-hover:scale-110 transition-transform`}
                >
                  <span className={`material-symbols-outlined text-[32px] ${cat.textColor}`}>
                    {cat.icon}
                  </span>
                </div>
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold leading-tight mb-1">
                  {cat.label}
                </span>
                <span className="font-label-sm text-label-sm px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Más Vendidos Carousel Section */}
        <section className="w-full mb-space-xl" id="ofertas-semana">
          <div className="flex items-center justify-between mb-space-md">
            <div>
              <div className="inline-flex items-center gap-1 font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider">
                <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
                <span>Los Favoritos de la Gente</span>
              </div>
              <h2 className="font-headline-lg text-2xl md:text-headline-lg text-primary tracking-tight font-extrabold">
                Más Vendidos de la Semana
              </h2>
            </div>
            <div className="flex items-center gap-space-xs">
              <button
                onClick={() => scrollCarousel('left')}
                aria-label="Anterior"
                className="w-10 h-10 rounded-full bg-surface-container-lowest shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),0_6px_14px_rgba(0,119,182,0.08)] flex items-center justify-center text-on-surface-variant hover:text-primary active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                aria-label="Siguiente"
                className="w-10 h-10 rounded-full bg-surface-container-lowest shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),0_6px_14px_rgba(0,119,182,0.08)] flex items-center justify-center text-on-surface-variant hover:text-primary active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>
          </div>

          <div
            ref={carouselRef}
            className="flex md:grid md:grid-cols-3 lg:grid-cols-5 gap-space-md overflow-x-auto pb-space-sm no-scrollbar scroll-smooth"
          >
            {PRODUCTS.slice(0, 5).map((product) => (
              <div
                key={product.id}
                className="min-w-[240px] md:min-w-0 flex flex-col justify-between p-space-md rounded-3xl bg-surface-container-lowest shadow-[inset_0_3px_6px_rgba(255,255,255,0.95),0_16px_32px_-8px_rgba(0,119,182,0.14)] hover:shadow-[0_20px_40px_-8px_rgba(0,119,182,0.2)] transition-all relative border border-slate-100 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-space-sm">
                    <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-bold">
                      {product.badge || 'Destacado'}
                    </span>
                    <span className="font-label-sm text-label-sm text-outline font-semibold">
                      {product.packageType}
                    </span>
                  </div>

                  <div
                    onClick={() => navigateTo('product-detail', product.id)}
                    className="relative w-full h-40 rounded-2xl bg-gradient-to-b from-surface-container-low to-secondary-fixed/20 flex items-center justify-center mb-space-sm overflow-hidden cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-28 h-28 object-contain filter drop-shadow-md group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <h3
                    onClick={() => navigateTo('product-detail', product.id)}
                    className="font-headline-sm text-headline-sm text-on-surface line-clamp-2 mb-1 cursor-pointer hover:text-primary transition-colors font-bold"
                  >
                    {product.name}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm line-clamp-2">
                    {product.details || product.description}
                  </p>
                </div>

                <div className="pt-space-xs flex items-end justify-between border-t border-slate-100">
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-secondary font-bold uppercase">
                      Precio final
                    </span>
                    <div className="flex items-baseline gap-0.5">
                      <span className="font-price-currency text-price-currency text-primary font-bold">
                        $
                      </span>
                      <span className="font-price-integer text-price-integer text-primary leading-none font-extrabold">
                        {product.price.toLocaleString('es-AR')}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(product, product.presentations?.[0], 1)}
                    className="w-11 h-11 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.45),0_8px_16px_-4px_rgba(0,119,182,0.4)] active:scale-90 hover:scale-105 transition-all"
                    title="Agregar al carrito"
                  >
                    <span className="material-symbols-outlined text-[22px]">add</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Special Banner Section: Químicos Sueltos & Comparativa */}
        <section
          className="relative w-full rounded-3xl bg-gradient-to-r from-secondary-fixed/30 via-surface-container-lowest/90 to-primary-fixed/30 p-space-lg md:p-space-xl backdrop-blur-2xl shadow-[inset_0_3px_10px_rgba(255,255,255,0.9),0_20px_40px_-10px_rgba(0,119,182,0.12)] mb-space-xl border border-white"
          id="calculadora-suelto"
        >
          <div className="max-w-4xl mx-auto space-y-space-lg">
            <div className="text-center space-y-space-xs">
              <div className="inline-flex items-center gap-space-xs px-space-md py-1 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm font-bold uppercase tracking-wider shadow-sm">
                <span className="material-symbols-outlined text-[16px]">compost</span>
                <span>Economía Circular &amp; Ahorro Real</span>
              </div>
              <h2 className="font-headline-lg text-2xl md:text-headline-lg text-primary tracking-tight font-extrabold">
                Líquidos sueltos: Traé tu envase o llevate bidón nuevo
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
                El 40% del costo de un producto de limpieza empaquetado de supermercado corresponde al plástico, etiquetado y marketing. En Detersur pagás el químico activo puro.
              </p>
            </div>

            {/* 3 Step Clay Stepper Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
              <div className="p-space-md rounded-2xl bg-surface-container-lowest/90 shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),0_8px_16px_rgba(0,119,182,0.06)] flex flex-col items-center text-center border border-white">
                <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-headline-md text-headline-md mb-space-sm font-extrabold shadow-sm">
                  1
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1 font-bold">
                  Elegí tu fórmula
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Seleccioná la densidad, fragancia o poder antibacterial según la necesidad de tu superficie.
                </p>
              </div>

              <div className="p-space-md rounded-2xl bg-surface-container-lowest/90 shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),0_8px_16px_rgba(0,119,182,0.06)] flex flex-col items-center text-center border border-white">
                <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-container font-headline-md text-headline-md mb-space-sm font-extrabold shadow-sm">
                  2
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1 font-bold">
                  Traé tu bidón
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Vení con cualquier bidón o botella limpia. Si no tenés, te proveemos uno reforzado de primer uso.
                </p>
              </div>

              <div className="p-space-md rounded-2xl bg-surface-container-lowest/90 shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),0_8px_16px_rgba(0,119,182,0.06)] flex flex-col items-center text-center border border-white">
                <div className="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed-variant font-headline-md text-headline-md mb-space-sm font-extrabold shadow-sm">
                  3
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1 font-bold">
                  Pagás sólo el líquido
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Ahorrá hasta un 40% en cada recarga, reducí plástico de un solo uso y llevate calidad testeada.
                </p>
              </div>
            </div>

            {/* Comparative Price Table */}
            <div className="overflow-hidden rounded-2xl bg-surface-container-lowest/90 shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),0_12px_24px_rgba(9,27,56,0.08)] border border-slate-100">
              <div className="p-space-sm bg-surface-container-low flex items-center justify-between px-space-md border-b border-slate-200/60">
                <span className="font-label-md text-label-md text-primary font-bold">
                  Comparativa de valor por Litro ($ ARS)
                </span>
                <span className="font-label-sm text-label-sm text-secondary font-extrabold">
                  Ahorro Promedio: 41%
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-body-sm text-body-sm">
                  <thead className="bg-surface-container/40 text-on-surface-variant uppercase text-[11px] font-bold">
                    <tr>
                      <th className="py-space-sm px-space-md">Producto de Limpieza</th>
                      <th className="py-space-sm px-space-md">Precio Suelto Detersur (x Litro)</th>
                      <th className="py-space-sm px-space-md text-outline">Marca Comercial Envasada</th>
                      <th className="py-space-sm px-space-md text-right text-secondary">Tu Ahorro</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-low text-on-surface">
                    <tr className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-space-sm px-space-md font-semibold">
                        Lavandina Concentrada 55g
                      </td>
                      <td className="py-space-sm px-space-md font-bold text-primary">$ 690 / L</td>
                      <td className="py-space-sm px-space-md text-outline line-through">
                        $ 1.250 / L
                      </td>
                      <td className="py-space-sm px-space-md text-right font-bold text-secondary">
                        45% OFF
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-space-sm px-space-md font-semibold">
                        Jabón Ropa Baja Espuma Tipo Premium
                      </td>
                      <td className="py-space-sm px-space-md font-bold text-primary">
                        $ 1.240 / L
                      </td>
                      <td className="py-space-sm px-space-md text-outline line-through">
                        $ 2.300 / L
                      </td>
                      <td className="py-space-sm px-space-md text-right font-bold text-secondary">
                        46% OFF
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-space-sm px-space-md font-semibold">
                        Desodorante para Pisos Lavanda Silvestre
                      </td>
                      <td className="py-space-sm px-space-md font-bold text-primary">$ 450 / L</td>
                      <td className="py-space-sm px-space-md text-outline line-through">
                        $ 890 / L
                      </td>
                      <td className="py-space-sm px-space-md text-right font-bold text-secondary">
                        49% OFF
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-space-sm px-space-md font-semibold">
                        Detergente Lavavajillas Ultra Limón 20%
                      </td>
                      <td className="py-space-sm px-space-md font-bold text-primary">$ 980 / L</td>
                      <td className="py-space-sm px-space-md text-outline line-through">
                        $ 1.600 / L
                      </td>
                      <td className="py-space-sm px-space-md text-right font-bold text-secondary">
                        38% OFF
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-center pt-space-xs">
              <button
                onClick={() => navigateTo('product-detail', 'lavandina-55g')}
                className="px-space-xl py-space-sm rounded-full bg-primary text-on-primary font-label-lg text-label-lg shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_10px_20px_rgba(0,93,144,0.35)] hover:scale-105 active:scale-95 transition-all flex items-center gap-space-xs font-bold"
              >
                <span className="material-symbols-outlined text-[18px]">calculate</span>
                <span>Armar pedido de recarga suelta</span>
              </button>
            </div>
          </div>
        </section>

        {/* Wholesale Bulk Tier Banner */}
        <section className="w-full rounded-3xl bg-gradient-to-r from-tertiary-fixed/60 via-surface-container-lowest to-secondary-fixed/50 p-space-lg md:p-space-xl shadow-[inset_0_3px_6px_rgba(255,255,255,0.9),0_16px_32px_rgba(9,27,56,0.08)] mb-space-xl border border-white">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-space-md items-center">
            <div className="md:col-span-8 space-y-space-xs">
              <div className="inline-flex items-center gap-1 text-tertiary font-label-sm text-label-sm uppercase font-extrabold tracking-wider">
                <span className="material-symbols-outlined text-[18px]">apartment</span>
                <span>Consorcios, Colegios, Fábricas y Lavaderos</span>
              </div>
              <h2 className="font-headline-lg text-2xl md:text-headline-lg text-on-surface tracking-tight font-extrabold">
                Canal Mayorista Directo: Descuentos escalonados por bulto cerrado
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Emitimos Factura A y B con CUIT en el acto. Envíos programados con flota propia en tambores de 200L o pallets de bidones de 5L.
              </p>
              <div className="flex flex-wrap gap-space-sm pt-space-xs">
                <span className="px-space-md py-1 rounded-full bg-surface-container-lowest text-primary font-label-md text-label-md font-bold shadow-sm">
                  +10 unid: 15% OFF
                </span>
                <span className="px-space-md py-1 rounded-full bg-surface-container-lowest text-primary font-label-md text-label-md font-bold shadow-sm">
                  +30 unid: 25% OFF
                </span>
                <span className="px-space-md py-1 rounded-full bg-surface-container-lowest text-secondary font-label-md text-label-md font-bold shadow-sm">
                  Tambor 200L: Cotización Especial
                </span>
              </div>
            </div>
            <div className="md:col-span-4 flex flex-col items-center md:items-end justify-center">
              <a
                href="https://wa.me/5491145678900?text=Hola%20Detersur!%20Quiero%20asesoramiento%20mayorista%20B2B"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-space-xl py-space-md rounded-full bg-tertiary text-on-tertiary font-label-lg text-label-lg shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_12px_24px_rgba(101,79,126,0.35)] hover:scale-105 active:scale-95 transition-all text-center flex items-center justify-center gap-space-xs font-bold"
              >
                <span className="material-symbols-outlined text-[20px]">support_agent</span>
                <span>Hablar con un Asesor B2B</span>
              </a>
              <span className="font-label-sm text-label-sm text-on-surface-variant mt-2">
                Respuesta promedio: 15 minutos
              </span>
            </div>
          </div>
        </section>

        {/* Customer Trust Pills Bar */}
        <section className="w-full grid grid-cols-1 sm:grid-cols-3 gap-space-md mb-space-md">
          <div className="p-space-md rounded-2xl bg-surface-container-lowest/80 backdrop-blur-md shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),0_6px_16px_rgba(9,27,56,0.05)] flex items-center gap-space-sm border border-slate-100">
            <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-container shrink-0">
              <span className="material-symbols-outlined text-[24px]">credit_card</span>
            </div>
            <div>
              <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Pago Seguro
              </h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Mercado Pago, 3 Cuotas sin interés y 10% OFF en Efectivo o Transferencia.
              </p>
            </div>
          </div>

          <div className="p-space-md rounded-2xl bg-surface-container-lowest/80 backdrop-blur-md shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),0_6px_16px_rgba(9,27,56,0.05)] flex items-center gap-space-sm border border-slate-100">
            <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[24px]">storefront</span>
            </div>
            <div>
              <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Puntos de Retiro
              </h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Sucursales con carga rápida en Lanús, Quilmes y Avellaneda sin costo adicional.
              </p>
            </div>
          </div>

          <div className="p-space-md rounded-2xl bg-surface-container-lowest/80 backdrop-blur-md shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),0_6px_16px_rgba(9,27,56,0.05)] flex items-center gap-space-sm border border-slate-100">
            <div className="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary shrink-0">
              <span className="material-symbols-outlined text-[24px]">verified_user</span>
            </div>
            <div>
              <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Garantía ANMAT
              </h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Todos nuestros desinfectantes y fórmulas cuentan con certificación y trazabilidad.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Floating Liquid Glass Mini Cart Dock */}
      {cartCount > 0 && (
        <aside className="fixed bottom-20 md:bottom-6 right-margin md:right-margin-desktop z-40 transition-all transform duration-300">
          <div className="px-space-md py-space-sm rounded-full bg-surface-container-lowest/90 backdrop-blur-2xl shadow-[0_20px_40px_-10px_rgba(9,27,56,0.22),inset_0_2px_4px_rgba(255,255,255,0.95)] flex items-center gap-space-md border border-white">
            <div className="flex items-center gap-space-sm">
              <div className="relative w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm flex items-center justify-center font-extrabold shadow-sm">
                  {cartCount}
                </span>
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">
                  Subtotal
                </span>
                <span className="font-label-lg text-label-lg text-primary font-bold leading-none">
                  $ {subtotal.toLocaleString('es-AR')}
                </span>
              </div>
            </div>
            <button
              onClick={() => navigateTo('cart')}
              className="px-space-md py-2 rounded-full bg-secondary-container text-on-secondary-container font-label-md text-label-md font-bold shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_6px_12px_rgba(0,113,104,0.25)] hover:scale-105 active:scale-95 transition-all flex items-center gap-1"
            >
              <span>Ver Carrito</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </aside>
      )}
    </div>
  );
};
