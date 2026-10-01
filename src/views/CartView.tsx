import React from 'react';
import { SmartImage } from '../components/SmartImage';
import { useStore } from '../context/StoreContext';
import { BEST_SELLERS } from '../data/products';
import { CANJE_CREDIT_PER_UNIT, FREE_SHIPPING_THRESHOLD } from '../data/content';
import { ProductCard } from '../components/ProductCard';
import { ScrollCarousel } from '../components/Carousel';
import { Reveal } from '../components/Reveal';
import { formatPrice } from '../lib/format';
import { freeShippingProgress, nextWholesaleTier } from '../lib/pricing';

export const CartView: React.FC = () => {
  const {
    cart,
    cartCount,
    totals,
    updateQuantity,
    setQuantity,
    removeFromCart,
    clearCart,
    loadDemoCart,
    navigate,
    canjeUnits,
    canjeMax,
    setCanjeUnits,
  } = useStore();

  const progress = freeShippingProgress(totals.subtotal);
  const upsell = nextWholesaleTier(totals.totalUnits);

  /* ------------------------------ empty ------------------------------ */
  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-space-2xl gap-space-md">
        <Reveal from="up">
          <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-primary-fixed/40 animate-ripple" />
            <span
              className="absolute inset-4 rounded-full bg-secondary-fixed/40 animate-ripple"
              style={{ animationDelay: '0.9s' }}
            />
            <span className="material-symbols-outlined text-[84px] text-primary-fixed-dim animate-bob relative">
              production_quantity_limits
            </span>
          </div>
        </Reveal>

        <Reveal from="up" delay={120}>
          <>
            <h1 className="font-headline-lg text-2xl md:text-headline-lg text-primary font-extrabold tracking-tight">
              Tu carrito está vacío
            </h1>
            <p className="mt-space-sm font-body-lg text-body-md md:text-body-lg text-on-surface-variant max-w-lg mx-auto">
              Agregá químicos sueltos, bidones por mayor o artículos de higiene para empezar.
              Recordá que con $25.000 el envío te sale gratis.
            </p>
          </>
        </Reveal>

        <Reveal from="up" delay={220}>
          <div className="flex flex-wrap items-center justify-center gap-space-sm">
            <button
              onClick={() => navigate({ view: 'catalog' })}
              className="px-space-xl py-3.5 rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg font-bold clay-button-primary hover:scale-105 active:scale-95 transition-all flex items-center gap-space-xs"
            >
              <span className="material-symbols-outlined text-[20px]">grid_view</span>
              Explorar catálogo
            </button>
            <button
              onClick={loadDemoCart}
              className="px-space-xl py-3.5 rounded-full bg-surface-container-lowest text-primary font-label-lg text-label-lg font-bold clay-card border border-slate-100 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-space-xs"
            >
              <span className="material-symbols-outlined text-[20px]">bolt</span>
              Cargar pedido de ejemplo
            </button>
          </div>
        </Reveal>

        {/* Suggestions */}
        <div className="w-full mt-space-xl">
          <ScrollCarousel
            label="Productos sugeridos"
            header={
              <h2 className="font-headline-md text-headline-md text-primary font-extrabold">
                Los más pedidos de la semana
              </h2>
            }
          >
            {BEST_SELLERS.map((product) => (
              <div
                key={product.id}
                className="snap-item min-w-[250px] w-[250px] shrink-0 text-left"
              >
                <ProductCard product={product} variant="compact" className="h-full" />
              </div>
            ))}
          </ScrollCarousel>
        </div>
      </div>
    );
  }

  /* ------------------------------ filled ----------------------------- */
  return (
    <div className="flex flex-col w-full gap-space-lg">
      <Reveal from="down">
        <div className="flex flex-wrap items-end justify-between gap-space-sm">
          <div>
            <nav className="flex items-center gap-1 font-label-md text-label-md text-on-surface-variant mb-1">
              <button
                onClick={() => navigate({ view: 'home' })}
                className="hover:text-primary transition-colors"
              >
                Inicio
              </button>
              <span className="material-symbols-outlined text-[16px] text-outline-variant">
                chevron_right
              </span>
              <span className="text-primary font-bold">Carrito</span>
            </nav>
            <h1 className="font-headline-lg text-2xl md:text-headline-lg text-primary font-extrabold tracking-tight">
              Tu carrito ({cartCount} {cartCount === 1 ? 'artículo' : 'artículos'})
            </h1>
          </div>

          <div className="flex items-center gap-space-sm">
            <button
              onClick={() => navigate({ view: 'catalog' })}
              className="px-space-md py-2 rounded-full bg-surface-container-low text-on-surface-variant font-label-md text-label-md font-bold hover:bg-surface-container transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[17px]">add</span>
              Seguir comprando
            </button>
            <button
              onClick={clearCart}
              className="px-space-md py-2 rounded-full bg-error-container text-on-error-container font-label-md text-label-md font-bold hover:scale-105 active:scale-95 transition-all flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[17px]">delete_sweep</span>
              Vaciar
            </button>
          </div>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        {/* ---------------------- items ---------------------- */}
        <div className="lg:col-span-8 space-y-space-md">
          {/* Free shipping tracker */}
          <Reveal from="up">
            <div className="p-space-md rounded-3xl bg-gradient-to-r from-secondary-fixed/40 to-primary-fixed/30 border border-white clay-card">
              <div className="flex flex-wrap items-center justify-between gap-space-xs mb-space-sm">
                {totals.freeShippingGap > 0 ? (
                  <p className="font-label-lg text-label-lg text-on-surface font-bold">
                    Te faltan{' '}
                    <span className="text-primary">
                      {formatPrice(totals.freeShippingGap)}
                    </span>{' '}
                    para el envío gratis
                  </p>
                ) : (
                  <p className="font-label-lg text-label-lg text-secondary font-extrabold flex items-center gap-1.5 animate-pop">
                    <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                    ¡Envío bonificado conseguido!
                  </p>
                )}
                <span className="font-label-md text-label-md text-on-surface-variant">
                  Mínimo {formatPrice(FREE_SHIPPING_THRESHOLD)}
                </span>
              </div>

              <div className="relative h-3 rounded-full bg-white/70 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-secondary via-secondary-fixed-dim to-primary-container transition-[width] duration-1000 ease-out"
                  style={{ width: `${Math.max(3, progress * 100)}%` }}
                />
              </div>
            </div>
          </Reveal>

          {/* Lines */}
          <div className="space-y-space-sm">
            {cart.map((item, index) => (
              <Reveal key={item.id} from="up" delay={index * 60}>
                <div className="group p-space-md rounded-3xl bg-surface-container-lowest clay-card border border-slate-100 flex flex-col sm:flex-row gap-space-md hover:clay-card-lifted transition-all duration-300">
                  <button
                    onClick={() =>
                      navigate({ view: 'product-detail', productId: item.product.id })
                    }
                    className="w-full sm:w-28 h-28 rounded-2xl bg-gradient-to-b from-surface-container-low to-secondary-fixed/20 flex items-center justify-center shrink-0 overflow-hidden"
                  >
                    <SmartImage
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3"
                    />
                  </button>

                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex items-start justify-between gap-space-sm">
                      <div className="min-w-0">
                        <span className="font-label-sm text-label-sm text-secondary font-extrabold uppercase tracking-wide">
                          {item.product.brand}
                        </span>
                        <button
                          onClick={() =>
                            navigate({ view: 'product-detail', productId: item.product.id })
                          }
                          className="block text-left font-headline-sm text-headline-sm text-on-surface font-bold hover:text-primary transition-colors"
                        >
                          {item.product.name}
                        </button>
                        <span className="font-label-md text-label-md text-on-surface-variant">
                          {item.presentation?.title ?? item.product.packageType}
                        </span>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Eliminar ${item.product.name}`}
                        className="w-9 h-9 rounded-full bg-surface-container-low text-outline hover:bg-error-container hover:text-on-error-container flex items-center justify-center shrink-0 transition-all active:scale-90"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>

                    <div className="mt-auto pt-space-sm flex flex-wrap items-end justify-between gap-space-sm">
                      <div className="flex items-center gap-space-sm">
                        <div className="flex items-center gap-0.5 bg-surface-container-low rounded-full p-1 clay-inset">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            aria-label="Quitar una unidad"
                            className="w-8 h-8 rounded-full bg-white text-on-surface-variant flex items-center justify-center shadow-xs active:scale-90 transition-all"
                          >
                            <span className="material-symbols-outlined text-[17px]">remove</span>
                          </button>
                          <input
                            type="number"
                            min={1}
                            max={99}
                            value={item.quantity}
                            onChange={(event) =>
                              setQuantity(item.id, Number(event.target.value))
                            }
                            aria-label={`Cantidad de ${item.product.name}`}
                            className="w-10 text-center bg-transparent font-label-lg text-label-lg font-black tabular-nums focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            aria-label="Agregar una unidad"
                            className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-xs active:scale-90 transition-all"
                          >
                            <span className="material-symbols-outlined text-[17px]">add</span>
                          </button>
                        </div>
                        <span className="font-label-md text-label-md text-outline">
                          × {formatPrice(item.price)}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="block font-label-sm text-label-sm text-outline uppercase font-bold">
                          Subtotal
                        </span>
                        <span className="font-price-integer text-xl text-primary font-black leading-none">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Plan Canje */}
          {canjeMax > 0 && (
            <Reveal from="up">
              <div className="p-space-md rounded-3xl bg-gradient-to-br from-secondary-fixed/50 to-surface-container-lowest border border-white clay-card">
                <div className="flex items-start gap-space-sm">
                  <span className="w-11 h-11 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[22px]">recycling</span>
                  </span>
                  <div className="flex-1">
                    <h3 className="font-headline-sm text-headline-sm text-primary font-extrabold">
                      Plan Canje de envases
                    </h3>
                    <p className="mt-0.5 font-body-sm text-body-sm text-on-surface-variant">
                      Declará cuántos envases vas a devolver y te acreditamos{' '}
                      <strong className="text-secondary">
                        {formatPrice(CANJE_CREDIT_PER_UNIT)}
                      </strong>{' '}
                      por cada uno. Hasta {canjeMax} en este pedido.
                    </p>

                    <div className="mt-space-md flex flex-wrap items-center gap-space-md">
                      <div className="flex items-center gap-0.5 bg-white rounded-full p-1 shadow-xs">
                        <button
                          onClick={() => setCanjeUnits(canjeUnits - 1)}
                          disabled={canjeUnits === 0}
                          aria-label="Menos envases"
                          className="w-9 h-9 rounded-full bg-surface-container-low text-on-surface-variant flex items-center justify-center active:scale-90 transition-all disabled:opacity-40"
                        >
                          <span className="material-symbols-outlined text-[18px]">remove</span>
                        </button>
                        <span className="w-10 text-center font-label-lg text-label-lg font-black tabular-nums">
                          {canjeUnits}
                        </span>
                        <button
                          onClick={() => setCanjeUnits(canjeUnits + 1)}
                          disabled={canjeUnits >= canjeMax}
                          aria-label="Más envases"
                          className="w-9 h-9 rounded-full bg-secondary text-on-secondary flex items-center justify-center active:scale-90 transition-all disabled:opacity-40"
                        >
                          <span className="material-symbols-outlined text-[18px]">add</span>
                        </button>
                      </div>

                      {totals.canjeDiscount > 0 && (
                        <span className="px-space-md py-1.5 rounded-full bg-secondary text-on-secondary font-label-md text-label-md font-black animate-pop">
                          −{formatPrice(totals.canjeDiscount)} acreditados
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          )}

          {/* Wholesale upsell */}
          {upsell && (
            <Reveal from="up">
              <div className="p-space-md rounded-3xl bg-tertiary-fixed/40 border border-white flex items-start gap-space-sm">
                <span className="w-11 h-11 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">inventory</span>
                </span>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-tertiary-fixed-variant font-extrabold">
                    Estás a {upsell.minUnits - totals.totalUnits} unidades del{' '}
                    {Math.round(upsell.rate * 100)}% OFF
                  </h3>
                  <p className="mt-0.5 font-body-sm text-body-sm text-on-surface-variant">
                    El descuento mayorista se aplica sobre el total del pedido, no sólo sobre
                    las unidades extra.
                  </p>
                  <button
                    onClick={() => navigate({ view: 'catalog' })}
                    className="mt-space-sm px-space-md py-2 rounded-full bg-tertiary text-on-tertiary font-label-md text-label-md font-bold hover:scale-105 active:scale-95 transition-all"
                  >
                    Sumar productos
                  </button>
                </div>
              </div>
            </Reveal>
          )}
        </div>

        {/* ---------------------- summary ---------------------- */}
        <div className="lg:col-span-4">
          <Reveal from="up">
            <div className="lg:sticky lg:top-32 p-space-lg rounded-3xl bg-surface-container-lowest clay-card border border-slate-100">
              <h2 className="font-headline-md text-headline-md text-on-surface font-extrabold mb-space-md">
                Resumen del pedido
              </h2>

              <div className="space-y-space-sm font-body-md text-body-md">
                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant">
                    Subtotal ({cartCount} art.)
                  </span>
                  <span className="font-bold text-on-surface">
                    {formatPrice(totals.subtotal)}
                  </span>
                </div>

                {totals.wholesaleDiscount > 0 && (
                  <div className="flex items-center justify-between text-tertiary font-semibold animate-fade-in">
                    <span className="inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">inventory</span>
                      Mayorista {Math.round((totals.wholesaleTier?.rate ?? 0) * 100)}%
                    </span>
                    <span>−{formatPrice(totals.wholesaleDiscount)}</span>
                  </div>
                )}

                {totals.canjeDiscount > 0 && (
                  <div className="flex items-center justify-between text-secondary font-semibold animate-fade-in">
                    <span className="inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">recycling</span>
                      Plan Canje ({canjeUnits})
                    </span>
                    <span>−{formatPrice(totals.canjeDiscount)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant">Envío estimado</span>
                  <span
                    className={
                      totals.shippingCost === 0
                        ? 'text-secondary font-extrabold uppercase'
                        : 'font-bold text-on-surface'
                    }
                  >
                    {totals.shippingCost === 0 ? 'Gratis' : formatPrice(totals.shippingCost)}
                  </span>
                </div>

                <div className="pt-space-sm border-t border-surface-container flex items-end justify-between">
                  <span className="font-label-lg text-label-lg text-on-surface font-bold">
                    Total
                  </span>
                  <div className="text-right">
                    <span className="font-price-integer text-3xl text-primary font-black leading-none block">
                      {formatPrice(totals.total)}
                    </span>
                    <span className="font-label-sm text-label-sm text-outline">
                      IVA incluido: {formatPrice(totals.taxIncluded)}
                    </span>
                  </div>
                </div>

                {totals.savings > 0 && (
                  <div className="p-space-sm rounded-2xl bg-secondary-fixed/40 text-center">
                    <span className="font-label-lg text-label-lg text-on-secondary-fixed-variant font-extrabold">
                      Ahorrás {formatPrice(totals.savings)} 🎉
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => navigate({ view: 'checkout' })}
                className="shine w-full mt-space-md py-4 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-bold clay-button-primary hover:bg-primary-container hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-space-xs"
              >
                <span className="relative z-[2]">Iniciar compra</span>
                <span className="material-symbols-outlined text-[20px] relative z-[2]">
                  arrow_forward
                </span>
              </button>

              <p className="mt-space-sm font-label-sm text-label-sm text-outline text-center">
                Pagando por transferencia o efectivo tenés un 10% extra de descuento.
              </p>

              <div className="mt-space-md pt-space-md border-t border-surface-container space-y-space-xs">
                {[
                  { icon: 'lock', text: 'Pago protegido con Mercado Pago' },
                  { icon: 'receipt_long', text: 'Factura A o B en el acto' },
                  { icon: 'local_shipping', text: 'Despacho en 24 hs hábiles' },
                ].map((item) => (
                  <p
                    key={item.text}
                    className="flex items-center gap-space-xs font-label-md text-label-md text-on-surface-variant"
                  >
                    <span className="material-symbols-outlined text-[16px] text-secondary">
                      {item.icon}
                    </span>
                    {item.text}
                  </p>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Cross-sell */}
      <section>
        <ScrollCarousel
          label="Completá tu pedido"
          header={
            <Reveal from="up">
              <h2 className="font-headline-md text-headline-md md:text-headline-lg text-primary font-extrabold">
                Completá tu pedido
              </h2>
            </Reveal>
          }
        >
          {BEST_SELLERS.filter(
            (product) => !cart.some((item) => item.product.id === product.id)
          ).map((product) => (
            <div key={product.id} className="snap-item min-w-[250px] w-[250px] shrink-0">
              <ProductCard product={product} variant="compact" className="h-full" />
            </div>
          ))}
        </ScrollCarousel>
      </section>
    </div>
  );
};
