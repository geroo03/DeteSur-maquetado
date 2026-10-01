import React from 'react';
import { useCart } from '../context/CartContext';

export const CartDrawer: React.FC = () => {
  const {
    isDrawerOpen,
    closeDrawer,
    cart,
    cartCount,
    subtotal,
    total,
    canjeDiscount,
    updateQuantity,
    removeFromCart,
    navigateTo,
  } = useCart();

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className="absolute inset-0 bg-[#091b38]/40 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
      />

      {/* Drawer Panel */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white/95 backdrop-blur-2xl shadow-[-20px_0_40px_rgba(9,27,56,0.2)] p-space-lg flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300 border-l border-white/60">
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-space-md border-b border-surface-container">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[20px]">shopping_basket</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Tu Carrito ({cartCount})
              </h3>
              <span className="font-label-sm text-label-sm text-secondary font-bold">
                Detersur Express
              </span>
            </div>
          </div>
          <button
            onClick={closeDrawer}
            className="w-9 h-9 rounded-full bg-surface-container-low text-on-surface flex items-center justify-center hover:bg-surface-container transition-all active:scale-95"
            aria-label="Cerrar carrito"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Drawer Items List */}
        <div className="flex-1 overflow-y-auto py-space-md space-y-space-sm pr-1">
          {cart.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center justify-center text-slate-500">
              <span className="material-symbols-outlined text-5xl text-slate-300 mb-2">
                shopping_cart
              </span>
              <p className="font-bold text-on-surface">Tu carrito está vacío</p>
              <p className="text-xs text-on-surface-variant max-w-xs mt-1">
                Agregá químicos sueltos, bidones o artículos de limpieza para iniciar tu compra.
              </p>
              <button
                onClick={() => {
                  closeDrawer();
                  navigateTo('catalog');
                }}
                className="mt-4 px-5 py-2 rounded-full bg-primary text-white text-xs font-bold shadow-sm"
              >
                Explorar catálogo
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="p-space-sm rounded-2xl bg-surface-container-low/70 flex items-center gap-space-sm border border-slate-100/60 shadow-xs group"
              >
                <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center text-primary shadow-xs shrink-0 p-1 overflow-hidden">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-label-md text-label-md text-on-surface font-bold truncate">
                    {item.product.name}
                  </p>
                  <span className="font-label-sm text-label-sm text-outline block">
                    {item.presentation?.title || item.product.packageType}
                  </span>
                  <p className="font-label-md text-label-md text-primary font-bold">
                    $ {(item.price * item.quantity).toLocaleString('es-AR')} ARS
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                    title="Eliminar"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                  <div className="flex items-center gap-1 bg-white rounded-full p-0.5 shadow-xs border border-slate-100">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-6 h-6 rounded-full bg-surface-container-low text-outline text-xs flex items-center justify-center hover:bg-slate-200 transition-colors font-bold"
                    >
                      -
                    </button>
                    <span className="font-label-md text-label-md px-1.5 font-bold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-6 h-6 rounded-full bg-surface-container-low text-outline text-xs flex items-center justify-center hover:bg-slate-200 transition-colors font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Promotion info block in drawer */}
          {cart.length > 0 && (
            <>
              <div className="p-space-sm rounded-2xl bg-secondary-fixed/30 text-on-secondary-fixed-variant font-body-sm text-body-sm flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[20px] text-secondary shrink-0">
                  local_shipping
                </span>
                <span>
                  ¡Genial! Tenés <strong>Envío Bonificado</strong> en GBA Sur y CABA.
                </span>
              </div>

              {canjeDiscount > 0 && (
                <div className="p-space-sm rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-teal-600">
                      recycling
                    </span>
                    <span>Plan Canje (Envases retornados):</span>
                  </div>
                  <span className="font-bold text-teal-700">-${canjeDiscount}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Drawer Footer: Subtotal & Argentine Checkout */}
        {cart.length > 0 && (
          <div className="pt-space-md border-t border-surface-container space-y-space-sm">
            <div className="flex items-center justify-between">
              <span className="font-body-md text-body-md text-on-surface-variant">
                Subtotal ({cartCount} artículos):
              </span>
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                $ {subtotal.toLocaleString('es-AR')} ARS
              </span>
            </div>
            {canjeDiscount > 0 && (
              <div className="flex items-center justify-between text-teal-700 text-xs font-semibold">
                <span>Bonificación Canje:</span>
                <span>-$ {canjeDiscount.toLocaleString('es-AR')} ARS</span>
              </div>
            )}
            <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
              <span>Envío a domicilio:</span>
              <span className="text-secondary font-bold uppercase">GRATIS</span>
            </div>
            <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
              <span>Total a abonar:</span>
              <span className="text-primary font-extrabold text-lg">
                $ {total.toLocaleString('es-AR')} ARS
              </span>
            </div>

            <button
              onClick={() => {
                closeDrawer();
                navigateTo('checkout');
              }}
              className="w-full py-3.5 rounded-full bg-primary text-on-primary font-label-lg text-label-lg shadow-[0_12px_24px_-6px_rgba(0,93,144,0.4),inset_0_2px_4px_rgba(255,255,255,0.4)] hover:bg-primary-container active:scale-98 transition-all flex items-center justify-center gap-space-xs font-bold"
            >
              <span>Continuar al Pago</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>

            <button
              onClick={() => {
                closeDrawer();
                navigateTo('cart');
              }}
              className="w-full py-2 text-center text-xs text-primary font-bold hover:underline"
            >
              Ver Carrito en Pantalla Completa
            </button>

            <p className="text-center font-label-sm text-label-sm text-outline text-[10px]">
              Pagos seguros con Débito, Crédito, Mercado Pago o Transferencia Bancaria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
