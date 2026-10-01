import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';
import { ProductPresentation } from '../types';

export const ProductDetailView: React.FC = () => {
  const { selectedProduct, addToCart, navigateTo } = useCart();
  const [selectedPresentation, setSelectedPresentation] = useState<ProductPresentation>(
    selectedProduct.presentations?.[1] ||
      selectedProduct.presentations?.[0] || {
        id: 'standard',
        title: selectedProduct.packageType,
        volume: '5L',
        price: selectedProduct.price,
        unitPrice: selectedProduct.price,
      }
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isAddedFeedback, setIsAddedFeedback] = useState<boolean>(false);
  const [showFichaModal, setShowFichaModal] = useState<boolean>(false);

  const unitPrice = selectedPresentation.price;
  const totalPrice = unitPrice * quantity;
  const transferPrice = Math.round(totalPrice * 0.9);

  const handleAdd = () => {
    addToCart(selectedProduct, selectedPresentation, quantity);
    setIsAddedFeedback(true);
    setTimeout(() => setIsAddedFeedback(false), 2000);
  };

  const complementaryProducts = PRODUCTS.filter((p) => p.id !== selectedProduct.id).slice(0, 4);

  return (
    <div className="flex flex-col w-full gap-space-lg md:gap-space-xl">
      {/* Breadcrumb Pill Liquid Glass */}
      <div className="flex items-center">
        <nav className="inline-flex items-center gap-2 px-space-md py-space-xs rounded-full bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_10px_24px_-6px_rgba(9,27,56,0.06)] text-on-surface-variant font-label-md text-label-md overflow-x-auto max-w-full border border-slate-100">
          <button
            onClick={() => navigateTo('home')}
            className="hover:text-primary transition-colors flex items-center gap-1 shrink-0 font-medium"
          >
            <span className="material-symbols-outlined text-[16px]">home</span>
            <span>Inicio</span>
          </button>
          <span className="material-symbols-outlined text-[14px] text-outline-variant shrink-0">
            chevron_right
          </span>
          <button
            onClick={() => navigateTo('catalog')}
            className="hover:text-primary transition-colors shrink-0 font-medium"
          >
            Química Suelta &amp; Bidones
          </button>
          <span className="material-symbols-outlined text-[14px] text-outline-variant shrink-0">
            chevron_right
          </span>
          <button
            onClick={() => navigateTo('catalog')}
            className="hover:text-primary transition-colors shrink-0 font-medium"
          >
            Lavandinas &amp; Cloro
          </button>
          <span className="material-symbols-outlined text-[14px] text-outline-variant shrink-0">
            chevron_right
          </span>
          <span className="text-primary font-bold truncate shrink-0">
            {selectedProduct.name}
          </span>
        </nav>
      </div>

      {/* Main 2-Column Product Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg lg:gap-gutter-desktop items-start">
        {/* LEFT COLUMN: Product Visualizer Clay Stage */}
        <div className="lg:col-span-6 flex flex-col gap-space-md">
          {/* Big Hero Showcase Clay Card */}
          <div className="relative w-full rounded-3xl bg-surface-container-lowest p-space-md md:p-space-lg shadow-[0_24px_48px_-12px_rgba(0,119,182,0.14)] overflow-hidden flex flex-col justify-between min-h-[480px] border border-white">
            {/* Ambient Clay Glow Inside */}
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-secondary-fixed/40 blur-2xl pointer-events-none"></div>
            <div className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full bg-primary-fixed/50 blur-3xl pointer-events-none"></div>

            {/* Floating Badges Top Layer */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-space-xs">
              <span className="inline-flex items-center gap-1.5 px-space-md py-1.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm shadow-[inset_0_2px_4px_rgba(255,255,255,0.7),0_8px_16px_-4px_rgba(0,113,104,0.2)] font-bold">
                <span
                  className="material-symbols-outlined text-[16px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  eco
                </span>
                Ahorrá 25% recargando
              </span>
              <span className="inline-flex items-center gap-1 px-space-sm py-1 rounded-full bg-surface-container-high/90 backdrop-blur-md text-primary font-label-sm text-label-sm shadow-sm font-semibold">
                <span
                  className="material-symbols-outlined text-[16px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
                Bactericida Certificado
              </span>
            </div>

            {/* Central Product Visual Stage */}
            <div className="relative z-10 my-auto py-space-md flex flex-col items-center justify-center">
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-b from-secondary-fixed/30 via-primary-fixed/20 to-surface-container flex items-center justify-center shadow-[inset_0_8px_20px_rgba(0,119,182,0.12),0_12px_28px_-6px_rgba(0,0,0,0.04)]">
                {/* Animated Ambient Chemical Droplets */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none animate-[spin_24s_linear_infinite]"
                  viewBox="0 0 200 200"
                >
                  <circle cx="28" cy="70" fill="#70f8e8" opacity="0.6" r="6" />
                  <circle cx="175" cy="85" fill="#94ccff" opacity="0.8" r="4" />
                  <circle cx="130" cy="170" fill="#4fdbcc" opacity="0.5" r="7" />
                  <circle cx="60" cy="155" fill="#0077b6" opacity="0.4" r="3.5" />
                </svg>

                {/* 3D Product Container Asset */}
                <div className="relative w-48 h-64 md:w-56 md:h-72 flex items-center justify-center transition-transform hover:scale-105 duration-300">
                  <img
                    className="w-full h-full object-contain drop-shadow-[0_22px_28px_rgba(0,119,182,0.28)]"
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                  />
                </div>

                {/* Active Formula Pill */}
                <div className="absolute bottom-2 inset-x-auto px-4 py-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_12px_24px_-4px_rgba(9,27,56,0.12),inset_0_2px_4px_rgba(255,255,255,0.9)] flex items-center gap-2 border border-white">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></span>
                  <span className="font-label-sm text-label-sm text-primary tracking-wide font-bold">
                    FÓRMULA ACTIVA 55g/L CLORO ACTIVO
                  </span>
                </div>
              </div>
            </div>

            {/* Spec Pill Bar Bottom */}
            <div className="relative z-10 pt-space-xs flex items-center justify-around rounded-2xl bg-surface-container-low/70 py-2.5 px-space-sm text-center border border-slate-100">
              <div>
                <div className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                  Densidad 20°C
                </div>
                <div className="font-headline-sm text-headline-sm text-primary font-bold">
                  {selectedProduct.density || '1.09 g/cm³'}
                </div>
              </div>
              <div className="h-6 w-px bg-outline-variant/40"></div>
              <div>
                <div className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                  Pureza de Origen
                </div>
                <div className="font-headline-sm text-headline-sm text-secondary font-bold">
                  {selectedProduct.origin || 'Cloro Virgen'}
                </div>
              </div>
              <div className="h-6 w-px bg-outline-variant/40"></div>
              <div>
                <div className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                  Fraccionado
                </div>
                <div className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Hermético
                </div>
              </div>
            </div>
          </div>

          {/* Clay Thumbnails / Gallery Row */}
          <div className="grid grid-cols-4 gap-space-sm">
            <button
              onClick={() => setActiveTab(0)}
              className={`group p-2 rounded-2xl transition-all text-left flex flex-col items-center gap-1.5 ${
                activeTab === 0
                  ? 'bg-surface-container-lowest shadow-[0_8px_16px_-4px_rgba(0,119,182,0.18),inset_0_2px_4px_rgba(255,255,255,0.95)] ring-2 ring-primary'
                  : 'bg-surface-container-lowest/80 hover:bg-surface-container-lowest shadow-sm'
              }`}
            >
              <div className="w-full h-14 rounded-xl bg-surface-container-low flex items-center justify-center overflow-hidden">
                <span className="material-symbols-outlined text-[28px] text-primary group-hover:scale-110 transition-transform">
                  water_full
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-primary font-bold text-center leading-tight">
                Bidón 5L Tradicional
              </span>
            </button>

            <button
              onClick={() => setActiveTab(1)}
              className={`group p-2 rounded-2xl transition-all text-left flex flex-col items-center gap-1.5 ${
                activeTab === 1
                  ? 'bg-surface-container-lowest shadow-[0_8px_16px_-4px_rgba(0,119,182,0.18),inset_0_2px_4px_rgba(255,255,255,0.95)] ring-2 ring-primary'
                  : 'bg-surface-container-lowest/80 hover:bg-surface-container-lowest shadow-sm'
              }`}
            >
              <div className="w-full h-14 rounded-xl bg-surface-container-low flex items-center justify-center overflow-hidden">
                <span className="material-symbols-outlined text-[28px] text-secondary group-hover:scale-110 transition-transform">
                  autorenew
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant text-center leading-tight">
                Recarga a Granel
              </span>
            </button>

            <button
              onClick={() => setActiveTab(2)}
              className={`group p-2 rounded-2xl transition-all text-left flex flex-col items-center gap-1.5 ${
                activeTab === 2
                  ? 'bg-surface-container-lowest shadow-[0_8px_16px_-4px_rgba(0,119,182,0.18),inset_0_2px_4px_rgba(255,255,255,0.95)] ring-2 ring-primary'
                  : 'bg-surface-container-lowest/80 hover:bg-surface-container-lowest shadow-sm'
              }`}
            >
              <div className="w-full h-14 rounded-xl bg-surface-container-low flex items-center justify-center overflow-hidden">
                <span className="material-symbols-outlined text-[28px] text-tertiary group-hover:scale-110 transition-transform">
                  shield
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant text-center leading-tight">
                Sello ANMAT
              </span>
            </button>

            <button
              onClick={() => setActiveTab(3)}
              className={`group p-2 rounded-2xl transition-all text-left flex flex-col items-center gap-1.5 ${
                activeTab === 3
                  ? 'bg-surface-container-lowest shadow-[0_8px_16px_-4px_rgba(0,119,182,0.18),inset_0_2px_4px_rgba(255,255,255,0.95)] ring-2 ring-primary'
                  : 'bg-surface-container-lowest/80 hover:bg-surface-container-lowest shadow-sm'
              }`}
            >
              <div className="w-full h-14 rounded-xl bg-surface-container-low flex items-center justify-center overflow-hidden">
                <span className="material-symbols-outlined text-[28px] text-outline group-hover:scale-110 transition-transform">
                  factory
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant text-center leading-tight">
                Planta &amp; Tambor
              </span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Purchase Panel & Dynamic Spec Card */}
        <div className="lg:col-span-6 flex flex-col gap-space-md">
          {/* Primary Main Product Card (Claymorphic) */}
          <div className="rounded-3xl bg-surface-container-lowest p-space-md md:p-space-lg shadow-[0_20px_44px_-10px_rgba(0,119,182,0.12),inset_0_3px_6px_rgba(255,255,255,0.95)] flex flex-col gap-space-md border border-white">
            {/* Header Badges & Serial Code */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="px-space-sm py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm font-bold uppercase tracking-wider">
                  Detersur Profesional
                </span>
                <span className="font-label-sm text-label-sm text-outline">
                  SKU: {selectedProduct.sku || 'DET-LAV-55G5L'}
                </span>
              </div>
              <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm bg-surface-container-low px-2.5 py-1 rounded-full">
                <span className="material-symbols-outlined text-[15px] text-secondary">
                  verified_user
                </span>
                <span>R.N.P.A. N° {selectedProduct.rnpa || '0254129'}</span>
              </div>
            </div>

            {/* Main Product Title */}
            <div>
              <h1 className="font-headline-lg text-2xl md:text-3xl font-extrabold text-on-background tracking-tight">
                {selectedProduct.name}
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                {selectedProduct.description}
              </p>
            </div>

            {/* Review Rating & Volume Sold */}
            <div className="flex items-center gap-space-md pb-space-xs border-b border-surface-container-low">
              <div className="flex items-center gap-1">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-[18px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <span className="font-label-lg text-label-lg text-on-surface ml-1 font-bold">
                  {selectedProduct.rating || 4.9}
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  ({selectedProduct.reviewsCount || 128} opiniones)
                </span>
              </div>
              <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
              <div className="hidden sm:flex items-center gap-1 font-label-sm text-label-sm text-secondary font-bold">
                <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
                <span>{selectedProduct.salesCount || '+1.450 bidones vendidos este mes'}</span>
              </div>
            </div>

            {/* Presentation Selector (Interactive Clay Tiles) */}
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center justify-between">
                <label className="font-label-lg text-label-lg text-on-surface font-bold">
                  Seleccioná la Presentación:
                </label>
                <span className="font-label-sm text-label-sm text-primary font-bold">
                  A granel disponible en planta
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-xs">
                {(selectedProduct.presentations || []).map((pres) => {
                  const isSelected = selectedPresentation.id === pres.id;
                  return (
                    <button
                      key={pres.id}
                      type="button"
                      onClick={() => setSelectedPresentation(pres)}
                      className={`group p-space-sm rounded-2xl text-left transition-all relative overflow-hidden ${
                        isSelected
                          ? 'bg-primary text-on-primary shadow-[0_12px_24px_-6px_rgba(0,119,182,0.35),inset_0_2px_4px_rgba(255,255,255,0.45)]'
                          : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                      }`}
                    >
                      {pres.badge && (
                        <div className="absolute top-1 right-2">
                          <span
                            className={`px-2 py-0.5 rounded-full font-label-sm text-[10px] tracking-tight font-bold ${
                              isSelected
                                ? 'bg-secondary text-on-secondary'
                                : 'bg-secondary-container text-on-secondary-container'
                            }`}
                          >
                            {pres.badge}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-label-md text-label-md font-semibold ${
                            isSelected ? 'text-white' : 'text-on-surface'
                          }`}
                        >
                          {pres.title}
                        </span>
                      </div>
                      <div
                        className={`mt-1 font-price-integer text-[20px] font-extrabold ${
                          isSelected ? 'text-white' : 'text-primary'
                        }`}
                      >
                        $ {pres.price.toLocaleString('es-AR')}
                      </div>
                      <div
                        className={`font-body-sm text-xs ${
                          isSelected ? 'text-primary-fixed opacity-90' : 'text-on-surface-variant'
                        }`}
                      >
                        ${pres.unitPrice}/L {pres.isEco ? '• Traé tu bidón limpio' : ''}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Display Block */}
            <div className="p-space-md rounded-2xl bg-surface-container-low/80 flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm border border-slate-100">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-price-integer text-3xl md:text-4xl text-primary font-black leading-none">
                    $ {totalPrice.toLocaleString('es-AR')}
                  </span>
                  <span className="font-label-sm text-label-sm text-outline uppercase font-bold">
                    IVA Incluido
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Precio final con Factura A o B automática
                </p>
              </div>
              <div className="flex flex-col items-start sm:items-end gap-1">
                <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-[16px]">payments</span>
                  10% OFF pagando con Transferencia ($ {transferPrice.toLocaleString('es-AR')})
                </span>
                <span className="font-label-sm text-label-sm text-primary font-medium">
                  Hasta 3 cuotas sin interés con MODO / Débito
                </span>
              </div>
            </div>

            {/* Quantity Stepper & Add to Cart Clay Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-md pt-space-xs">
              {/* Stepper */}
              <div className="flex items-center justify-between p-1.5 rounded-full bg-surface-container-low shadow-[inset_0_2px_4px_rgba(9,27,56,0.06)] shrink-0 sm:w-40">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-full bg-surface-container-lowest text-primary flex items-center justify-center shadow-[0_4px_10px_-2px_rgba(0,119,182,0.18),inset_0_2px_4px_rgba(255,255,255,0.9)] hover:scale-95 active:scale-90 transition-transform font-bold"
                >
                  <span className="material-symbols-outlined text-[20px]">remove</span>
                </button>
                <span className="font-headline-md text-headline-md text-on-surface font-bold px-3 select-none">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 rounded-full bg-surface-container-lowest text-primary flex items-center justify-center shadow-[0_4px_10px_-2px_rgba(0,119,182,0.18),inset_0_2px_4px_rgba(255,255,255,0.9)] hover:scale-95 active:scale-90 transition-transform font-bold"
                >
                  <span className="material-symbols-outlined text-[20px]">add</span>
                </button>
              </div>

              {/* Add CTA */}
              <button
                type="button"
                onClick={handleAdd}
                className={`flex-1 py-4 px-space-lg rounded-full font-headline-sm text-headline-sm font-bold shadow-[0_16px_32px_-8px_rgba(0,119,182,0.42),inset_0_3px_6px_rgba(255,255,255,0.45)] transition-all active:scale-[0.98] flex items-center justify-center gap-space-sm group ${
                  isAddedFeedback
                    ? 'bg-secondary text-white'
                    : 'bg-primary-container hover:bg-primary text-on-primary'
                }`}
              >
                <span className="material-symbols-outlined text-[24px] group-hover:rotate-12 transition-transform">
                  {isAddedFeedback ? 'check_circle' : 'shopping_bag'}
                </span>
                <span>{isAddedFeedback ? '¡Agregado con éxito!' : 'Agregar al carrito'}</span>
                <span className="ml-auto sm:ml-2 px-2.5 py-0.5 rounded-full bg-on-primary/20 text-on-primary font-label-sm text-label-sm">
                  Stock Inmediato
                </span>
              </button>
            </div>

            {/* Logistics & Pickup Benefits Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-xs pt-space-xs">
              <div className="p-space-sm rounded-2xl bg-surface-container-low/60 flex items-start gap-space-xs border border-slate-100">
                <span className="material-symbols-outlined text-[22px] text-secondary shrink-0">
                  storefront
                </span>
                <div>
                  <div className="font-label-md text-label-md text-on-surface font-bold">
                    Retiro Gratis Hoy
                  </div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant">
                    Planta Lanús Oeste &amp; Avellaneda
                  </div>
                </div>
              </div>
              <div className="p-space-sm rounded-2xl bg-surface-container-low/60 flex items-start gap-space-xs border border-slate-100">
                <span className="material-symbols-outlined text-[22px] text-primary shrink-0">
                  local_shipping
                </span>
                <div>
                  <div className="font-label-md text-label-md text-on-surface font-bold">
                    Envío Express GBA
                  </div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant">
                    Gratis superando $25.000
                  </div>
                </div>
              </div>
              <div className="p-space-sm rounded-2xl bg-surface-container-low/60 flex items-start gap-space-xs border border-slate-100">
                <span className="material-symbols-outlined text-[22px] text-tertiary shrink-0">
                  download
                </span>
                <div>
                  <div className="font-label-md text-label-md text-on-surface font-bold">
                    Ficha Técnica
                  </div>
                  <button
                    onClick={() => setShowFichaModal(true)}
                    className="font-body-sm text-body-sm text-primary hover:underline font-bold text-left"
                  >
                    Descargar PDF (MSDS)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Informative Accordions Section */}
          <div className="flex flex-col gap-space-xs">
            {/* Accordion 1: Modo de Uso y Dilución */}
            <details
              className="group rounded-2xl bg-surface-container-lowest p-space-md shadow-[0_8px_20px_-6px_rgba(9,27,56,0.06)] border border-slate-100"
              open
            >
              <summary className="flex items-center justify-between cursor-pointer list-none font-headline-sm text-headline-sm text-on-surface font-bold">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    science
                  </span>
                  Modo de uso, proporciones &amp; dilución recomendada
                </span>
                <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">
                  expand_more
                </span>
              </summary>
              <div className="mt-space-sm pt-space-xs text-on-surface-variant font-body-md text-body-md space-y-2 border-t border-surface-container-low">
                <p>
                  <strong>Pisos y baldosas:</strong> Diluir 1 taza (200 ml) de Lavandina Concentrada Detersur en 10 litros de agua limpia. Fregar y dejar actuar durante 5 minutos para eliminar el 99,9% de hongos y bacterias.
                </p>
                <p>
                  <strong>Desinfección de agua para consumo (emergencias):</strong> Aplicar 2 gotas por litro de agua. Aguardar 30 minutos antes de consumir.
                </p>
                <p>
                  <strong>Sanitización de frutas y verduras:</strong> 1 cucharadita (5 ml) por cada 5 litros de agua. Enjuagar con abundante agua potable luego del reposo.
                </p>
              </div>
            </details>

            {/* Accordion 2: Composición Química y Seguridad */}
            <details className="group rounded-2xl bg-surface-container-lowest p-space-md shadow-[0_8px_20px_-6px_rgba(9,27,56,0.06)] border border-slate-100">
              <summary className="flex items-center justify-between cursor-pointer list-none font-headline-sm text-headline-sm text-on-surface font-bold">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[20px]">
                    sanitizer
                  </span>
                  Composición química &amp; precauciones de seguridad
                </span>
                <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">
                  expand_more
                </span>
              </summary>
              <div className="mt-space-sm pt-space-xs text-on-surface-variant font-body-md text-body-md space-y-2 border-t border-surface-container-low">
                <p>
                  <strong>Principio Activo:</strong> Hipoclorito de sodio al 5.5% (concentración nominal 55 gramos de cloro activo por litro a la salida de fábrica).
                </p>
                <p>
                  <strong>Estabilizantes alcalinos:</strong> Hidróxido de sodio (&lt;0.5%) para prolongar la vida útil del cloro activo frente a los rayos UV.
                </p>
                <p className="text-red-600 font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">warning</span>
                  ¡No mezclar con amoníacos, vinagres ni detergentes ácidos! Produce vapores tóxicos.
                </p>
              </div>
            </details>

            {/* Accordion 3: Escala Mayorista B2B */}
            <details className="group rounded-2xl bg-surface-container-lowest p-space-md shadow-[0_8px_20px_-6px_rgba(9,27,56,0.06)] border border-slate-100">
              <summary className="flex items-center justify-between cursor-pointer list-none font-headline-sm text-headline-sm text-on-surface font-bold">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary text-[20px]">
                    inventory_2
                  </span>
                  Descuentos por escala mayorista &amp; pallet cerrado
                </span>
                <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">
                  expand_more
                </span>
              </summary>
              <div className="mt-space-sm pt-space-xs text-on-surface-variant font-body-md text-body-md border-t border-surface-container-low overflow-x-auto">
                <table className="w-full text-left font-body-sm text-body-sm">
                  <thead>
                    <tr className="text-outline border-b border-surface-container-low">
                      <th className="py-1">Volumen</th>
                      <th className="py-1">Descuento</th>
                      <th className="py-1">Precio x Bidón 5L</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-low">
                    <tr>
                      <td className="py-2 font-medium">De 4 a 19 bidones (Caja/Bulto)</td>
                      <td className="py-2 text-secondary font-bold">10% OFF</td>
                      <td className="py-2 font-bold text-on-surface">$ 3.105</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium">De 20 a 59 bidones</td>
                      <td className="py-2 text-secondary font-bold">18% OFF</td>
                      <td className="py-2 font-bold text-on-surface">$ 2.829</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium">Pallet Completo (60 bidones)</td>
                      <td className="py-2 text-primary font-bold">25% OFF</td>
                      <td className="py-2 font-bold text-primary">$ 2.587</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </details>
          </div>
        </div>
      </div>

      {/* Wholesale B2B Callout Banner */}
      <div className="relative w-full rounded-2xl bg-gradient-to-r from-surface-container via-surface-container-highest to-secondary-fixed/40 p-space-md md:p-space-lg shadow-[0_16px_36px_-8px_rgba(0,119,182,0.12),inset_0_2px_4px_rgba(255,255,255,0.8)] overflow-hidden flex flex-col md:flex-row items-center justify-between gap-space-md border border-white">
        <div className="flex items-center gap-space-md">
          <div className="w-14 h-14 rounded-2xl bg-surface-container-lowest text-primary flex items-center justify-center shrink-0 shadow-[0_8px_16px_-4px_rgba(0,119,182,0.25)]">
            <span className="material-symbols-outlined text-[32px]">pallet</span>
          </div>
          <div>
            <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">
              Venta Directa a Comercios &amp; Limpieza Institucional
            </span>
            <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
              ¿Tenés lavadero, consorcio o distribuidora?
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Cotizá tambores de 200L o cisternas de 1000L con flete bonificado en Zona Sur y CABA.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-space-sm shrink-0 w-full md:w-auto">
          <a
            href="https://wa.me/5491145678900?text=Hola%20Detersur!%20Solicito%20Lista%20Mayorista%20B2B"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto text-center px-space-lg py-3 rounded-full bg-surface-container-lowest text-primary font-label-lg text-label-lg font-bold shadow-[0_8px_18px_-4px_rgba(9,27,56,0.1),inset_0_2px_4px_rgba(255,255,255,0.9)] hover:bg-white transition-all"
          >
            Consultar Lista Mayorista
          </a>
        </div>
      </div>

      {/* Complementary Cross-Selling Carousel */}
      <section className="flex flex-col gap-space-md mt-space-md">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-label-sm text-label-sm text-secondary uppercase font-bold tracking-widest">
              Recomendados para vos
            </span>
            <h2 className="font-headline-lg text-2xl md:text-headline-lg text-on-background font-extrabold">
              También te puede servir
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter-desktop">
          {complementaryProducts.map((item) => (
            <div
              key={item.id}
              className="group rounded-2xl bg-surface-container-lowest p-space-md shadow-[0_16px_32px_-8px_rgba(0,119,182,0.10),inset_0_3px_6px_rgba(255,255,255,0.95)] flex flex-col justify-between hover:-translate-y-1 transition-all border border-slate-100"
            >
              <div>
                <div
                  onClick={() => navigateTo('product-detail', item.id)}
                  className="relative w-full h-44 rounded-xl bg-gradient-to-b from-surface-container-low to-surface-container/60 flex items-center justify-center overflow-hidden mb-space-sm cursor-pointer"
                >
                  <span className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-primary font-label-sm text-label-sm font-semibold shadow-xs">
                    {item.packageType}
                  </span>
                  <img
                    className="w-28 h-36 object-contain group-hover:scale-105 transition-transform drop-shadow-[0_12px_18px_rgba(0,119,182,0.2)]"
                    src={item.image}
                    alt={item.name}
                  />
                </div>
                <span className="font-label-sm text-label-sm text-secondary font-bold">
                  {item.brand}
                </span>
                <h4
                  onClick={() => navigateTo('product-detail', item.id)}
                  className="font-headline-sm text-headline-sm text-on-surface line-clamp-1 mt-0.5 font-bold cursor-pointer hover:text-primary transition-colors"
                >
                  {item.name}
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-2">
                  {item.details || item.description}
                </p>
              </div>

              <div className="mt-space-md pt-space-xs border-t border-surface-container-low flex items-center justify-between">
                <div>
                  <span className="font-label-sm text-label-sm text-outline">Precio final</span>
                  <div className="font-price-integer text-price-integer text-primary font-extrabold">
                    $ {item.price.toLocaleString('es-AR')}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => addToCart(item, item.presentations?.[0], 1)}
                  className="w-11 h-11 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-[0_8px_16px_-4px_rgba(0,119,182,0.35),inset_0_2px_4px_rgba(255,255,255,0.45)] hover:bg-primary transition-all active:scale-95"
                  title="Agregar al carrito"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    add_shopping_cart
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ficha Técnica Modal */}
      {showFichaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative">
            <div className="flex items-center justify-between pb-3 border-b">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-2xl">description</span>
                <h3 className="font-bold text-lg text-slate-800">Hoja de Seguridad MSDS (ANMAT)</h3>
              </div>
              <button
                onClick={() => setShowFichaModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-black"
              >
                ✕
              </button>
            </div>
            <div className="py-4 text-sm text-slate-600 space-y-2">
              <p>
                <strong>Producto:</strong> Lavandina Concentrada 55g/L Cloro Activo
              </p>
              <p>
                <strong>Certificado ANMAT:</strong> R.N.P.A. N° 0254129 / R.N.E. N° 02003841
              </p>
              <p>
                <strong>Fórmula química:</strong> NaClO al 5.5% en solución acuosa estabilizada.
              </p>
              <p>
                <strong>Envasado y almacenamiento:</strong> Conservar al abrigo de la luz solar directa y calor extremo en envases de polietileno de alta densidad (PEAD).
              </p>
              <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs">
                Ficha técnica descargada y verificada para uso bromatológico e institucional.
              </div>
            </div>
            <button
              onClick={() => {
                alert('Descargando Ficha_Tecnica_Lavandina_55g_ANMAT.pdf...');
                setShowFichaModal(false);
              }}
              className="w-full py-3 rounded-full bg-primary text-white font-bold text-sm shadow-md hover:bg-primary-container transition-colors"
            >
              Descargar PDF Oficial
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
