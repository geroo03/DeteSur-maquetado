import React from 'react';
import { useCart } from '../context/CartContext';

export const CartView: React.FC = () => {
  const {
    cart,
    cartCount,
    subtotal,
    canjeDiscount,
    total,
    cartViewMode,
    setCartViewMode,
    updateQuantity,
    removeFromCart,
    navigateTo,
  } = useCart();

  return (
    <div className="flex flex-col w-full relative">
      {/* Interactive View Switcher Pill */}
      <div className="flex justify-end mb-space-md">
        <div className="inline-flex items-center gap-space-xs p-1.5 rounded-full bg-surface-container-low shadow-sm border border-slate-200/60">
          <button
            onClick={() => setCartViewMode('filled')}
            className={`px-space-md py-1.5 rounded-full font-label-md text-label-md transition-all duration-300 font-bold ${
              cartViewMode === 'filled'
                ? 'bg-primary text-on-primary shadow-[0_4px_12px_rgba(0,93,144,0.35)]'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Carrito Lleno ({cart.length})
          </button>
          <button
            onClick={() => setCartViewMode('empty')}
            className={`px-space-md py-1.5 rounded-full font-label-md text-label-md transition-all duration-300 font-bold ${
              cartViewMode === 'empty'
                ? 'bg-primary text-on-primary shadow-[0_4px_12px_rgba(0,93,144,0.35)]'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Vista Carrito Vacío
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start">
        {/* Left Column: Background Store Snapshot */}
        <div className="lg:col-span-6 xl:col-span-5 flex flex-col gap-space-lg select-none">
          <div className="p-space-lg rounded-2xl bg-surface-container-lowest/80 shadow-[0_16px_32px_-8px_rgba(0,119,182,0.12)] border border-slate-100">
            <div className="flex items-center justify-between mb-space-md">
              <div className="flex items-center gap-space-sm">
                <span className="w-3 h-3 rounded-full bg-secondary-fixed-dim"></span>
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Catálogo Rápido
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-secondary bg-secondary-fixed/40 px-space-sm py-1 rounded-full font-bold">
                Precios Mayoristas
              </span>
            </div>

            <div className="space-y-space-sm">
              <div className="p-space-sm rounded-xl bg-surface-container-low flex items-center gap-space-md border border-slate-100">
                <div className="w-14 h-14 rounded-lg bg-surface-container-lowest p-1 flex items-center justify-center shrink-0">
                  <img
                    className="w-full h-full object-contain"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeYxO94lWG6Sr1RTKxzRVVR5qYCo798AQGi-gkOd6sDsc_Yra5ZM03Q4FtJTCTEBuWdQh3sMmN1sciLKlQhYezDQa882aSCjoPOtwUeGHWyWmxvqIdctK2UJPOYlv-79lXSlcgEyQ1XKrJB9lR94-tUGNNBx6lM521a66jXIjFtWmTs1Zbkpu0oG8dMMgvNVif2netYP8jr5ah08G_s13gu4EhBYYR1XD1X9zpVAO01wiRhlL2Nm7wag"
                    alt="Cloro Multiacción"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-headline-sm text-headline-sm text-on-surface truncate font-bold">
                    Cloro Multiacción 100g/L
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Bidón sellado x 10L
                  </p>
                </div>
                <span className="font-price-integer text-price-integer text-primary font-extrabold">
                  $4.890
                </span>
              </div>

              <div className="p-space-sm rounded-xl bg-surface-container-low flex items-center gap-space-md border border-slate-100">
                <div className="w-14 h-14 rounded-lg bg-surface-container-lowest p-1 flex items-center justify-center shrink-0">
                  <img
                    className="w-full h-full object-contain"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjlGEOgQSNvJoyPFtXwT-nqpwI6JrhdN1NSWw7N3CiL7dDiRlhXJ3k1rnfiOzBPlECOMUxrWdofD0Faa9-dBFPv5HBL6ZFKO43Wx9sXvNqn9MALpMVCoVei0lZd_mSBEHbirmzqoflQ8TB_2ah7jrUSDgUVWT_GI-kCGDsMr2TRsoYrXNqu6vprin-GHFB8XEjkwlC-Bnb5vVvQ3cANuqroSeC9PbdAi8sYmiHgdwXbOWZoR38TxoWfw"
                    alt="Suavizante Hipoalergénico"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-headline-sm text-headline-sm text-on-surface truncate font-bold">
                    Suavizante Hipoalergénico
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Fragancia Brisa Marina x 5L
                  </p>
                </div>
                <span className="font-price-integer text-price-integer text-primary font-extrabold">
                  $3.920
                </span>
              </div>
            </div>
          </div>

          {/* Reciclado & Sustentabilidad Promo Card */}
          <div className="p-space-lg rounded-2xl bg-gradient-to-br from-secondary-fixed/30 to-primary-fixed/40 shadow-sm relative overflow-hidden border border-white">
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1 font-label-sm text-label-sm uppercase tracking-wider text-secondary mb-space-xs font-bold">
                <span className="material-symbols-outlined text-[16px]">eco</span>
                Plan Canje Detersur
              </span>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-space-xs font-bold">
                Ahorrá hasta $860 por bidón devuelto
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Entregá tus envases limpios con precinto al transportista o en sucursal y se acredita en tu compra al instante.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Glass Drawer / Modal Flotante de Carrito */}
        <div className="lg:col-span-6 xl:col-span-7 w-full">
          {cartViewMode === 'filled' && cart.length > 0 ? (
            /* FILLED CART CONTAINER */
            <div className="w-full rounded-2xl md:rounded-[32px] bg-surface-container-lowest/90 backdrop-blur-2xl shadow-[0_24px_48px_-12px_rgba(9,27,56,0.18)] p-space-md md:p-space-lg flex flex-col gap-space-md relative overflow-hidden transition-all duration-300 border border-white">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-space-sm border-b border-slate-100">
                <div className="flex flex-col">
                  <div className="flex items-center gap-space-xs">
                    <h2 className="font-headline-lg text-2xl md:text-headline-lg text-on-surface font-extrabold">
                      Tu Carrito
                    </h2>
                    <span className="font-label-md text-label-md px-space-xs py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-bold">
                      ({cartCount} productos)
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-[16px] text-secondary">
                      verified
                    </span>
                    <span className="font-label-sm text-label-sm text-secondary font-semibold">
                      Envío gratis a Lanús y CABA
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigateTo('catalog')}
                  className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-transform active:scale-95 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)]"
                  aria-label="Cerrar carrito"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              {/* Free Shipping Progress Tracker */}
              <div className="p-space-md rounded-2xl bg-surface-container-low/70 backdrop-blur-md shadow-[inset_0_2px_4px_rgba(9,27,56,0.03)] flex flex-col gap-space-xs border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-on-surface font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[18px]">
                      local_shipping
                    </span>
                    ¡Estás a solo $3.500 de conseguir Envío Gratis!
                  </span>
                  <span className="font-label-sm text-label-sm text-primary font-bold">81%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-surface-container-highest overflow-hidden relative p-0.5 shadow-inner">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-secondary to-primary transition-all duration-500 relative"
                    style={{ width: '81%' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent"></div>
                  </div>
                </div>
              </div>

              {/* Products List */}
              <div className="flex flex-col gap-space-sm max-h-[460px] overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-space-md rounded-2xl bg-surface-container-lowest shadow-[0_12px_24px_-6px_rgba(0,119,182,0.12),inset_0_2px_4px_rgba(255,255,255,0.9)] flex flex-col sm:flex-row items-center gap-space-md group hover:shadow-[0_16px_32px_-8px_rgba(0,119,182,0.18)] transition-all border border-slate-100"
                  >
                    <div className="w-20 h-20 rounded-xl bg-surface-container-low flex items-center justify-center p-1 relative shrink-0">
                      <img
                        className="w-full h-full object-contain"
                        src={item.product.image}
                        alt={item.product.name}
                      />
                      <span className="absolute -top-1.5 -left-1.5 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold shadow-sm">
                        {item.presentation?.volume || item.product.packageType.split(' ')[0]}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0 text-center sm:text-left">
                      <h3 className="font-headline-sm text-headline-sm text-on-surface truncate font-bold">
                        {item.product.name}
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        {item.presentation?.title || item.product.packageType}
                      </p>
                      <div className="mt-1 flex items-baseline justify-center sm:justify-start gap-space-xs">
                        <span className="font-price-currency text-price-currency text-on-surface-variant font-bold">
                          $ {item.price.toLocaleString('es-AR')}
                        </span>
                        <span className="font-label-sm text-label-sm text-outline">c/u</span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center justify-between sm:items-end gap-space-sm shrink-0 w-full sm:w-auto">
                      <div className="flex items-center gap-space-xs p-1 rounded-full bg-surface-container-low shadow-[inset_0_2px_4px_rgba(9,27,56,0.06)]">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 rounded-full bg-surface-container-lowest flex items-center justify-center text-on-surface hover:text-primary active:scale-90 transition-transform shadow-[0_2px_4px_rgba(0,0,0,0.08)] font-bold"
                        >
                          <span className="material-symbols-outlined text-[16px]">remove</span>
                        </button>
                        <span className="font-label-lg text-label-lg text-on-surface w-6 text-center font-bold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 rounded-full bg-surface-container-lowest flex items-center justify-center text-on-surface hover:text-primary active:scale-90 transition-transform shadow-[0_2px_4px_rgba(0,0,0,0.08)] font-bold"
                        >
                          <span className="material-symbols-outlined text-[16px]">add</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-space-sm">
                        <span className="font-price-integer text-price-integer text-primary font-black">
                          $ {(item.price * item.quantity).toLocaleString('es-AR')}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          aria-label="Eliminar producto"
                          className="w-7 h-7 rounded-full flex items-center justify-center text-outline hover:text-error hover:bg-error-container/30 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Plan Canje Recycle Badge */}
              <div className="p-space-sm px-space-md rounded-xl bg-secondary-fixed/30 flex items-center justify-between border border-secondary/20">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-secondary text-[20px]">
                    recycling
                  </span>
                  <span className="font-label-md text-label-md text-on-secondary-fixed font-bold">
                    Plan Canje: 1 envase entregado
                  </span>
                </div>
                <span className="font-label-md text-label-md text-secondary font-bold">-$860</span>
              </div>

              {/* Checkout Summary Bottom Block */}
              <div className="pt-space-sm flex flex-col gap-space-xs border-t border-slate-100">
                <div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
                  <span>Subtotal de productos</span>
                  <span className="font-bold text-slate-800">
                    $ {subtotal.toLocaleString('es-AR')}
                  </span>
                </div>
                <div className="flex justify-between font-body-sm text-body-sm text-secondary font-semibold">
                  <span>Bonificación devolución envase</span>
                  <span>-$ {canjeDiscount.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
                  <span>Envío a domicilio</span>
                  <span className="text-primary font-bold">A calcular en checkout</span>
                </div>

                <div className="h-px w-full bg-surface-container-high my-space-xs"></div>

                {/* Total Row */}
                <div className="flex items-end justify-between">
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                      Total a pagar
                    </span>
                    <span className="font-label-sm text-label-sm text-secondary font-semibold">
                      Precio final (IVA incluido)
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display-hero text-3xl md:text-4xl text-primary font-black leading-none">
                      $ {total.toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>

                {/* Primary CTA Button */}
                <button
                  type="button"
                  onClick={() => navigateTo('checkout')}
                  className="mt-space-sm w-full py-space-md px-space-lg rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-space-sm shadow-[0_16px_28px_-6px_rgba(0,119,182,0.45),inset_0_2px_4px_rgba(255,255,255,0.45)] hover:bg-primary transition-all active:scale-[0.98] font-bold"
                >
                  <span>Iniciar Checkout Seguro</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>

                <div className="flex items-center justify-center gap-space-md text-on-surface-variant font-label-sm text-label-sm mt-1">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-secondary">
                      lock
                    </span>{' '}
                    Pago Seguro SSL
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-primary">
                      receipt_long
                    </span>{' '}
                    Facturación A o B
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* EMPTY CART CONTAINER */
            <div className="w-full rounded-2xl md:rounded-[32px] bg-surface-container-lowest/80 backdrop-blur-2xl shadow-[0_24px_48px_-12px_rgba(9,27,56,0.18)] p-space-lg md:p-space-xl flex flex-col items-center justify-center text-center gap-space-md transition-all duration-300 min-h-[580px] border border-white">
              {/* 3D Clay Overturned Bucket with Bubbles */}
              <div className="relative w-44 h-44 flex items-center justify-center">
                <div className="absolute inset-0 bg-primary-fixed/30 rounded-full blur-2xl"></div>
                <div className="relative z-10 w-36 h-36 rounded-full bg-surface-container-low flex items-center justify-center shadow-[inset_0_4px_10px_rgba(0,119,182,0.12),0_12px_24px_rgba(0,119,182,0.1)] p-4 border border-white">
                  <img
                    className="w-28 h-28 object-contain"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwNamYnCmmIHBRqa-yIw3cMto6vVCKdbu4ucMxZpLlAWHGvbedbfigQgJWK1BvyzSv-vKA-6zAlk-sgRP-QQSnXMODz6gwNWqO5Q3rKeYPRez3WUOr8rf2spjS3hS667m_SIiWC_IVC3Pha1VRVPdbhhgqprO6Q_N2CtWvsBilYvdJazSW-VSWCEK__A3q9SmZxALekTEjFi5mKQPWc3okMqku_5M1boO1QF3eBIrlztuRWxguucfqSQ"
                    alt="Carrito Vacío Detersur"
                  />
                </div>
                <div
                  className="absolute top-2 right-4 w-6 h-6 rounded-full bg-secondary-fixed/80 backdrop-blur-sm shadow-md animate-bounce"
                  style={{ animationDuration: '3s' }}
                ></div>
                <div className="absolute bottom-4 left-2 w-4 h-4 rounded-full bg-primary-fixed/80 backdrop-blur-sm shadow-md animate-pulse"></div>
                <div className="absolute -top-1 left-8 w-3 h-3 rounded-full bg-secondary-container"></div>
              </div>

              <div className="max-w-sm flex flex-col items-center gap-space-xs">
                <span className="font-label-md text-label-md uppercase tracking-widest text-primary font-bold bg-primary-fixed/40 px-3 py-1 rounded-full">
                  Carrito sin artículos
                </span>
                <h2 className="font-display-hero-mobile text-2xl md:text-3xl text-on-surface font-extrabold mt-1">
                  Tu carrito está vacío
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Todavía no agregaste productos a tu pedido. Aprovechá nuestras ofertas en lavandinas y jabón líquido en bidón de 5 litros.
                </p>
              </div>

              {/* Quick Suggestions Chips */}
              <div className="flex flex-wrap items-center justify-center gap-space-xs max-w-md my-space-xs">
                <button
                  onClick={() => navigateTo('product-detail', 'lavandina-55g')}
                  className="px-space-md py-1.5 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm font-semibold hover:bg-slate-200"
                >
                  Lavandina 5L
                </button>
                <button
                  onClick={() => navigateTo('catalog')}
                  className="px-space-md py-1.5 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm font-semibold hover:bg-slate-200"
                >
                  Jabón Ropa Matic
                </button>
                <button
                  onClick={() => navigateTo('catalog')}
                  className="px-space-md py-1.5 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm font-semibold hover:bg-slate-200"
                >
                  Desinfectante Pino
                </button>
              </div>

              {/* Clay Explore Button */}
              <button
                type="button"
                onClick={() => navigateTo('catalog')}
                className="py-space-md px-space-xl rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg flex items-center gap-space-sm shadow-[0_16px_28px_-6px_rgba(0,119,182,0.45),inset_0_2px_4px_rgba(255,255,255,0.45)] hover:bg-primary transition-all active:scale-95 font-bold"
              >
                <span className="material-symbols-outlined text-[20px]">storefront</span>
                <span>Explorar el catálogo</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
