import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { PRODUCTS, LOGO_URL } from '../data/products';

export const MobileView: React.FC = () => {
  const { cart, cartCount, total, addToCart, navigateTo, activeView } = useCart();
  const [mobileTab, setMobileTab] = useState<'inicio' | 'catalogo' | 'recargas' | 'carrito' | 'cuenta'>('inicio');

  return (
    <div className="w-full flex justify-center py-4 bg-slate-100 min-h-screen">
      {/* Mobile Device Frame */}
      <div className="w-full max-w-[420px] bg-gradient-to-b from-[#e8f7fa] via-[#eaf4fc] to-[#f2f0fc] min-h-[844px] rounded-[44px] shadow-2xl overflow-hidden border-8 border-slate-800 flex flex-col relative">
        {/* Mobile Header */}
        <header className="sticky top-0 inset-x-0 z-40 bg-white/80 backdrop-blur-xl shadow-xs px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={LOGO_URL} alt="Detersur Logo" className="h-7 w-auto object-contain" />
            <div className="flex flex-col">
              <span className="font-bold text-sm text-primary tracking-tight leading-none">
                Detersur
              </span>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                Química &amp; Limpieza
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileTab('catalogo')}
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-primary"
            >
              <span className="material-symbols-outlined text-[18px]">search</span>
            </button>
            <button
              onClick={() => setMobileTab('cuenta')}
              className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[16px]">person</span>
            </button>
          </div>
        </header>

        {/* Mobile Content Area */}
        <div className="flex-1 overflow-y-auto px-4 py-3 pb-24 space-y-4">
          {mobileTab === 'inicio' && (
            <>
              {/* Delivery Zone Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 shadow-sm self-start text-xs text-slate-600">
                <span className="material-symbols-outlined text-secondary text-[16px] animate-pulse">
                  local_shipping
                </span>
                <span>
                  Lanús, Avellaneda y Quilmes •{' '}
                  <strong className="text-secondary">Express 24hs</strong>
                </span>
              </div>

              {/* Hero Card */}
              <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#cff7f1] via-[#d5effd] to-[#e4e2fd] p-5 shadow-md border border-white">
                <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-secondary text-white text-[10px] font-bold uppercase tracking-wider mb-2">
                  <span className="material-symbols-outlined text-[12px]">eco</span>
                  <span>-40% en recarga</span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Química directa y suelta a precio de fábrica
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Cuidá tu bolsillo y el planeta. Comprá en bidón o rellená el tuyo en el acto sin intermediarios.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => setMobileTab('catalogo')}
                    className="px-4 py-2 rounded-full bg-primary text-white text-xs font-bold shadow-sm"
                  >
                    Ver ofertas
                  </button>
                  <button
                    onClick={() => setMobileTab('recargas')}
                    className="px-3 py-2 rounded-full bg-white/90 text-primary text-xs font-semibold shadow-xs"
                  >
                    Ahorro
                  </button>
                </div>
              </div>

              {/* Categorías Populares */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-900 text-sm">Categorías Populares</span>
                  <span
                    onClick={() => setMobileTab('catalogo')}
                    className="text-primary cursor-pointer"
                  >
                    Ver todas
                  </span>
                </div>
                <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
                  {[
                    { label: 'Sueltos', icon: 'science', bg: 'bg-teal-500' },
                    { label: 'Pisos', icon: 'cleaning_services', bg: 'bg-emerald-600' },
                    { label: 'Ropa', icon: 'local_laundry_service', bg: 'bg-blue-600' },
                    { label: 'Cocina', icon: 'soup_kitchen', bg: 'bg-purple-600' },
                    { label: 'Antisarro', icon: 'shower', bg: 'bg-cyan-600' },
                  ].map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setMobileTab('catalogo')}
                      className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-white shadow-xs min-w-[68px]"
                    >
                      <div className={`w-10 h-10 rounded-full ${c.bg} flex items-center justify-center text-white shadow-sm`}>
                        <span className="material-symbols-outlined text-[20px]">{c.icon}</span>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-700">{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Más Vendidos */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-900 text-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-secondary text-base">stars</span>
                    Más Vendidos de la Semana
                  </span>
                  <span className="text-secondary">12 cuotas</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {PRODUCTS.slice(0, 4).map((p) => (
                    <div
                      key={p.id}
                      className="bg-white rounded-2xl p-2.5 shadow-sm flex flex-col justify-between border border-slate-100"
                    >
                      <div
                        onClick={() => navigateTo('product-detail', p.id)}
                        className="relative w-full aspect-square rounded-xl bg-slate-50 flex items-center justify-center mb-2 overflow-hidden cursor-pointer"
                      >
                        <img src={p.image} alt={p.name} className="w-20 h-20 object-contain" />
                        <span className="absolute top-1 left-1 bg-teal-100 text-teal-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                          {p.badge || 'Suelto'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                          {p.brand} • {p.packageType.split(' ')[0]}
                        </span>
                        <h4
                          onClick={() => navigateTo('product-detail', p.id)}
                          className="font-bold text-xs text-slate-900 line-clamp-2 leading-tight cursor-pointer"
                        >
                          {p.name}
                        </h4>
                      </div>

                      <div className="flex items-end justify-between mt-2 pt-1 border-t border-slate-50">
                        <div className="text-primary font-black text-sm">
                          ${p.price.toLocaleString('es-AR')}
                        </div>
                        <button
                          onClick={() => addToCart(p, p.presentations?.[0], 1)}
                          className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-sm active:scale-90"
                        >
                          <span className="material-symbols-outlined text-[16px]">add</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Plan Canje Banner */}
              <div className="rounded-2xl bg-gradient-to-r from-emerald-100 via-teal-50 to-emerald-50 p-3.5 shadow-xs border border-emerald-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-xl">autorenew</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-teal-800 block">
                      Plan Canje Circular
                    </span>
                    <p className="font-bold text-xs text-slate-900 leading-tight">
                      Traé tu bidón vacío y ahorrá $860 por recarga
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {mobileTab === 'catalogo' && (
            <div className="space-y-3">
              <h3 className="font-extrabold text-lg text-slate-900">Catálogo de Productos</h3>
              <div className="grid grid-cols-2 gap-2.5">
                {PRODUCTS.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl p-2.5 shadow-sm flex flex-col justify-between border border-slate-100"
                  >
                    <div
                      onClick={() => navigateTo('product-detail', p.id)}
                      className="relative w-full aspect-square rounded-xl bg-slate-50 flex items-center justify-center mb-2 overflow-hidden cursor-pointer"
                    >
                      <img src={p.image} alt={p.name} className="w-20 h-20 object-contain" />
                      <span className="absolute top-1 left-1 bg-blue-100 text-blue-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                        {p.packageType}
                      </span>
                    </div>

                    <h4
                      onClick={() => navigateTo('product-detail', p.id)}
                      className="font-bold text-xs text-slate-900 line-clamp-2 leading-tight cursor-pointer"
                    >
                      {p.name}
                    </h4>

                    <div className="flex items-end justify-between mt-2 pt-1 border-t border-slate-50">
                      <div className="text-primary font-black text-sm">
                        ${p.price.toLocaleString('es-AR')}
                      </div>
                      <button
                        onClick={() => addToCart(p, p.presentations?.[0], 1)}
                        className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-sm active:scale-90"
                      >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {mobileTab === 'recargas' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 space-y-2">
                <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
                  Punto de Recarga
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  Ahorrá hasta 40% en Química Suelta
                </h3>
                <p className="text-xs text-slate-600">
                  Traé tus bidones de 5L a Lanús, Avellaneda o Quilmes y llevate Lavandina 55g/L, Jabón Matic y Desengrasante al costo directo.
                </p>
                <div className="p-3 bg-teal-50 rounded-2xl flex items-center justify-between text-xs font-bold text-teal-900">
                  <span>Plástico evitado este mes:</span>
                  <span className="text-teal-600 font-black text-base">75%</span>
                </div>
              </div>
            </div>
          )}

          {mobileTab === 'carrito' && (
            <div className="space-y-3">
              <h3 className="font-extrabold text-lg text-slate-900">
                Mi Carrito ({cartCount} artículos)
              </h3>
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-3 rounded-2xl shadow-sm flex items-center gap-3 border border-slate-100"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-12 object-contain"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs truncate text-slate-800">{item.product.name}</p>
                    <p className="text-[10px] text-slate-400">
                      {item.presentation?.title || item.product.packageType}
                    </p>
                    <p className="font-bold text-primary text-xs">
                      $ {(item.price * item.quantity).toLocaleString('es-AR')}
                    </p>
                  </div>
                  <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded-full">
                    x{item.quantity}
                  </span>
                </div>
              ))}
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-bold">${total.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between text-secondary">
                  <span>Envío:</span>
                  <span className="font-bold">GRATIS</span>
                </div>
              </div>
              <button
                onClick={() => navigateTo('checkout')}
                className="w-full py-3 rounded-full bg-primary text-white text-xs font-bold shadow-md flex items-center justify-center gap-2"
              >
                <span>Finalizar Pedido</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          )}

          {mobileTab === 'cuenta' && (
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 space-y-3 text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mx-auto text-2xl font-bold">
                FG
              </div>
              <h4 className="font-bold text-slate-900">Federico Gómez</h4>
              <p className="text-xs text-slate-500">Lanús Oeste • Cliente Habitual</p>
              <button
                onClick={() => navigateTo('confirmation')}
                className="w-full py-2.5 rounded-full bg-slate-100 text-slate-800 text-xs font-bold hover:bg-slate-200"
              >
                Ver Último Pedido (#DET-84920)
              </button>
            </div>
          )}
        </div>

        {/* Sticky Mobile Floating Cart Bar */}
        {cartCount > 0 && mobileTab !== 'carrito' && (
          <div className="absolute bottom-16 inset-x-3 z-30">
            <div
              onClick={() => setMobileTab('carrito')}
              className="bg-white/95 backdrop-blur-xl rounded-full p-2.5 shadow-lg flex items-center justify-between border border-white/60 cursor-pointer"
            >
              <div className="flex items-center gap-2 pl-2">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs">
                  {cartCount}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold leading-none">
                    Subtotal
                  </span>
                  <span className="text-xs font-extrabold text-slate-900">
                    ${total.toLocaleString('es-AR')}
                  </span>
                </div>
              </div>
              <button className="px-3.5 py-1.5 rounded-full bg-primary text-white text-xs font-bold flex items-center gap-1 shadow-sm">
                <span>Ver Carrito</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* Bottom Mobile Tab Bar */}
        <nav className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-2xl border-t border-slate-200/80 px-2 py-2 flex items-center justify-around z-40">
          <button
            onClick={() => setMobileTab('inicio')}
            className={`flex flex-col items-center justify-center w-12 py-1 rounded-xl transition-all ${
              mobileTab === 'inicio' ? 'text-primary font-bold' : 'text-slate-500'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">water_drop</span>
            <span className="text-[9px]">Inicio</span>
          </button>
          <button
            onClick={() => setMobileTab('catalogo')}
            className={`flex flex-col items-center justify-center w-12 py-1 rounded-xl transition-all ${
              mobileTab === 'catalogo' ? 'text-primary font-bold' : 'text-slate-500'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">grid_view</span>
            <span className="text-[9px]">Catálogo</span>
          </button>
          <button
            onClick={() => setMobileTab('recargas')}
            className={`flex flex-col items-center justify-center w-12 py-1 rounded-xl transition-all ${
              mobileTab === 'recargas' ? 'text-primary font-bold' : 'text-slate-500'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">recycling</span>
            <span className="text-[9px]">Recargas</span>
          </button>
          <button
            onClick={() => setMobileTab('carrito')}
            className={`flex flex-col items-center justify-center w-12 py-1 rounded-xl transition-all relative ${
              mobileTab === 'carrito' ? 'text-primary font-bold' : 'text-slate-500'
            }`}
          >
            <div className="relative">
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-secondary text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[9px]">Carrito</span>
          </button>
          <button
            onClick={() => setMobileTab('cuenta')}
            className={`flex flex-col items-center justify-center w-12 py-1 rounded-xl transition-all ${
              mobileTab === 'cuenta' ? 'text-primary font-bold' : 'text-slate-500'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">person</span>
            <span className="text-[9px]">Cuenta</span>
          </button>
        </nav>
      </div>
    </div>
  );
};
