import React from 'react';
import { SmartImage } from './SmartImage';
import { useStore } from '../context/StoreContext';
import { useEscapeKey, useLockBodyScroll } from '../hooks';
import { formatPrice } from '../lib/format';
import { freeShippingProgress, nextWholesaleTier } from '../lib/pricing';
import { FREE_SHIPPING_THRESHOLD } from '../data/content';
import { BEST_SELLERS } from '../data/products';

export const CartDrawer: React.FC = () => {
  const {
    isDrawerOpen,
    closeDrawer,
    cart,
    cartCount,
    totals,
    updateQuantity,
    removeFromCart,
    navigate,
    addToCart,
    loadDemoCart,
  } = useStore();

  useLockBodyScroll(isDrawerOpen);
  useEscapeKey(closeDrawer, isDrawerOpen);

  if (!isDrawerOpen) return null;

  const progress = freeShippingProgress(totals.subtotal);
  const upsell = nextWholesaleTier(totals.totalUnits);
  const suggestions = BEST_SELLERS.filter(
    (product) => !cart.some((item) => item.product.id === product.id)
  ).slice(0, 3);

  return (
    <div className="fixed inset-0 z-[60]">
      <div
        onClick={closeDrawer}
        className="absolute inset-0 bg-[#091b38]/45 backdrop-blur-sm animate-fade-in"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-surface-container-lowest shadow-[-20px_0_60px_rgba(9,27,56,0.28)] flex flex-col animate-slide-in-right"
      >
        {/* Header */}
        <div className="p-space-md flex items-center justify-between border-b border-surface-container shrink-0">
          <div className="flex items-center gap-space-sm">
            <div className="relative w-11 h-11 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[22px]">shopping_basket</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm flex items-center justify-center font-black">
                  {cartCount}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
                Tu Carrito
              </h3>
              <span className="font-label-sm text-label-sm text-secondary font-bold">
                {cartCount === 0
                  ? 'Sin artículos'
                  : `${cartCount} ${cartCount === 1 ? 'artículo' : 'artículos'} · Detersur Express`}
              </span>
            </div>
          </div>
          <button
            onClick={closeDrawer}
            aria-label="Cerrar carrito"
            className="w-9 h-9 rounded-full bg-surface-container-low text-on-surface flex items-center justify-center hover:bg-surface-container active:scale-90 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Free shipping tracker */}
        {cart.length > 0 && (
          <div className="px-space-md pt-space-sm shrink-0">
            <div className="p-space-sm rounded-2xl bg-secondary-fixed/25 border border-secondary-fixed-dim/40">
              {totals.freeShippingGap > 0 ? (
                <p className="font-label-md text-label-md text-on-secondary-fixed-variant">
                  Te faltan{' '}
                  <strong className="text-secondary">
                    {formatPrice(totals.freeShippingGap)}
                  </strong>{' '}
                  para el envío gratis
                </p>
              ) : (
                <p className="font-label-md text-label-md text-secondary font-bold flex items-center gap-1 animate-pop">
                  <span className="material-symbols-outlined text-[17px]">
                    local_shipping
                  </span>
                  ¡Conseguiste el envío bonificado!
                </p>
              )}
              <div className="mt-1.5 h-2 rounded-full bg-white/70 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-secondary to-primary-container transition-[width] duration-700 ease-out"
                  style={{ width: `${Math.max(4, progress * 100)}%` }}
                />
              </div>
              <p className="mt-1 font-label-sm text-label-sm text-outline">
                Mínimo {formatPrice(FREE_SHIPPING_THRESHOLD)} en CABA y GBA Sur
              </p>
            </div>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto pretty-scroll p-space-md space-y-space-sm">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-space-xl">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <span className="absolute inset-0 rounded-full bg-primary-fixed/40 animate-ripple" />
                <span className="material-symbols-outlined text-[64px] text-primary-fixed-dim animate-bob">
                  shopping_cart
                </span>
              </div>
              <p className="mt-space-md font-headline-sm text-headline-sm text-on-surface font-bold">
                Tu carrito está vacío
              </p>
              <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant max-w-xs">
                Agregá químicos sueltos, bidones o artículos de limpieza para iniciar tu
                compra.
              </p>
              <button
                onClick={() => {
                  closeDrawer();
                  navigate({ view: 'catalog' });
                }}
                className="mt-space-md px-space-xl py-2.5 rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg font-bold clay-button-primary hover:scale-105 active:scale-95 transition-all"
              >
                Explorar catálogo
              </button>
              <button
                onClick={loadDemoCart}
                className="mt-space-sm font-label-md text-label-md text-primary font-bold hover:underline inline-flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">bolt</span>
                Cargar pedido de ejemplo
              </button>
            </div>
          ) : (
            <>
              {cart.map((item, index) => (
                <div
                  key={item.id}
                  className="group p-space-sm rounded-2xl bg-surface-container-low/70 flex items-center gap-space-sm border border-slate-100/60 animate-fade-up"
                  style={{ animationDelay: `${index * 45}ms` }}
                >
                  <button
                    onClick={() => {
                      closeDrawer();
                      navigate({ view: 'product-detail', productId: item.product.id });
                    }}
                    className="w-16 h-16 rounded-xl bg-white flex items-center justify-center shrink-0 p-1 overflow-hidden shadow-xs"
                  >
                    <SmartImage
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className="font-label-md text-label-md text-on-surface font-bold line-clamp-2">
                      {item.product.name}
                    </p>
                    <span className="font-label-sm text-label-sm text-outline block">
                      {item.presentation?.title || item.product.packageType}
                    </span>
                    <p className="font-label-lg text-label-lg text-primary font-extrabold mt-0.5">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Eliminar ${item.product.name}`}
                      className="text-outline hover:text-error p-1 transition-colors active:scale-90"
                    >
                      <span className="material-symbols-outlined text-[17px]">delete</span>
                    </button>
                    <div className="flex items-center gap-0.5 bg-white rounded-full p-0.5 shadow-xs border border-slate-100">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        aria-label="Quitar una unidad"
                        className="w-7 h-7 rounded-full bg-surface-container-low text-on-surface-variant flex items-center justify-center hover:bg-surface-container active:scale-90 transition-all"
                      >
                        <span className="material-symbols-outlined text-[15px]">remove</span>
                      </button>
                      <span className="font-label-md text-label-md px-2 font-extrabold tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        aria-label="Agregar una unidad"
                        className="w-7 h-7 rounded-full bg-primary-fixed text-on-primary-fixed-variant flex items-center justify-center hover:bg-primary-fixed-dim active:scale-90 transition-all"
                      >
                        <span className="material-symbols-outlined text-[15px]">add</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Wholesale upsell */}
              {upsell && (
                <div className="p-space-sm rounded-2xl bg-tertiary-fixed/40 border border-tertiary-fixed-dim/50 flex items-start gap-space-xs animate-fade-up">
                  <span className="material-symbols-outlined text-[20px] text-tertiary shrink-0">
                    inventory
                  </span>
                  <p className="font-body-sm text-body-sm text-on-tertiary-fixed-variant">
                    Sumá <strong>{upsell.minUnits - totals.totalUnits} unidades</strong> más y
                    accedés al <strong>{Math.round(upsell.rate * 100)}% OFF</strong> mayorista
                    sobre todo el pedido.
                  </p>
                </div>
              )}

              {/* Cross-sell */}
              {suggestions.length > 0 && (
                <div className="pt-space-sm">
                  <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-bold mb-space-sm">
                    Sumá a tu pedido
                  </p>
                  <div className="space-y-space-xs">
                    {suggestions.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-space-sm p-space-xs rounded-xl hover:bg-surface-container-low transition-colors"
                      >
                        <SmartImage
                          src={product.image}
                          alt=""
                          className="w-10 h-10 object-contain shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-label-md text-label-md text-on-surface font-semibold truncate">
                            {product.name}
                          </p>
                          <p className="font-label-sm text-label-sm text-primary font-bold">
                            {formatPrice(product.price)}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            addToCart(
                              product,
                              product.presentations?.find((p) => p.isPopular) ??
                                product.presentations?.[0],
                              1
                            )
                          }
                          aria-label={`Agregar ${product.name}`}
                          className="w-8 h-8 rounded-full bg-primary-fixed text-on-primary-fixed-variant flex items-center justify-center shrink-0 hover:bg-primary-container hover:text-on-primary active:scale-90 transition-all"
                        >
                          <span className="material-symbols-outlined text-[17px]">add</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer summary */}
        {cart.length > 0 && (
          <div className="p-space-md border-t border-surface-container shrink-0 space-y-1.5 bg-surface-container-lowest">
            <div className="flex items-center justify-between font-body-md text-body-md text-on-surface-variant">
              <span>Subtotal</span>
              <span className="font-bold text-on-surface">{formatPrice(totals.subtotal)}</span>
            </div>

            {totals.wholesaleDiscount > 0 && (
              <div className="flex items-center justify-between font-label-md text-label-md text-tertiary font-semibold">
                <span>Mayorista ({Math.round((totals.wholesaleTier?.rate ?? 0) * 100)}%)</span>
                <span>−{formatPrice(totals.wholesaleDiscount)}</span>
              </div>
            )}

            {totals.canjeDiscount > 0 && (
              <div className="flex items-center justify-between font-label-md text-label-md text-secondary font-semibold">
                <span className="inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">recycling</span>
                  Plan Canje
                </span>
                <span>−{formatPrice(totals.canjeDiscount)}</span>
              </div>
            )}

            {totals.paymentDiscount > 0 && (
              <div className="flex items-center justify-between font-label-md text-label-md text-secondary font-semibold">
                <span>Descuento por pago</span>
                <span>−{formatPrice(totals.paymentDiscount)}</span>
              </div>
            )}

            <div className="flex items-center justify-between font-label-md text-label-md text-on-surface-variant">
              <span>Envío</span>
              <span
                className={
                  totals.shippingCost === 0 ? 'text-secondary font-extrabold uppercase' : 'font-bold'
                }
              >
                {totals.shippingCost === 0 ? 'Gratis' : formatPrice(totals.shippingCost)}
              </span>
            </div>

            <div className="flex items-end justify-between pt-space-xs border-t border-surface-container">
              <span className="font-label-lg text-label-lg text-on-surface font-bold">
                Total
              </span>
              <span className="font-price-integer text-2xl text-primary font-black leading-none">
                {formatPrice(totals.total)}
              </span>
            </div>

            {totals.savings > 0 && (
              <p className="font-label-md text-label-md text-secondary font-bold text-right">
                Ahorrás {formatPrice(totals.savings)} en este pedido
              </p>
            )}

            <button
              onClick={() => {
                closeDrawer();
                navigate({ view: 'checkout' });
              }}
              className="w-full mt-space-sm py-3.5 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-bold clay-button-primary hover:bg-primary-container hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-space-xs"
            >
              Continuar al pago
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>

            <button
              onClick={() => {
                closeDrawer();
                navigate({ view: 'cart' });
              }}
              className="w-full py-2 font-label-md text-label-md text-primary font-bold hover:underline"
            >
              Ver carrito completo
            </button>
          </div>
        )}
      </aside>
    </div>
  );
};
