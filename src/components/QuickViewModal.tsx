import React, { useEffect, useState } from 'react';
import { SmartImage } from './SmartImage';
import { useStore } from '../context/StoreContext';
import { useEscapeKey, useLockBodyScroll } from '../hooks';
import { discountPercent, formatPrice, formatUnitPrice, unitFromVolume } from '../lib/format';
import { ProductPresentation } from '../types';
import { Stars } from './ProductCard';

/** Lightweight product preview so the catalog grid never loses its scroll. */
export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, closeQuickView, addToCart, navigate, toggleWishlist, isWishlisted } =
    useStore();

  const [presentation, setPresentation] = useState<ProductPresentation | undefined>();
  const [quantity, setQuantity] = useState(1);

  const product = quickViewProduct;

  // Reset the selection every time a different product opens.
  useEffect(() => {
    if (!product) return;
    setPresentation(
      product.presentations?.find((p) => p.isPopular) ?? product.presentations?.[0]
    );
    setQuantity(1);
  }, [product]);

  useLockBodyScroll(Boolean(product));
  useEscapeKey(closeQuickView, Boolean(product));

  if (!product) return null;

  const unitPrice = presentation?.price ?? product.price;
  const total = unitPrice * quantity;
  const discount = product.listPrice ? discountPercent(product.listPrice, product.price) : 0;
  const wishlisted = isWishlisted(product.id);
  const stock = presentation?.stock ?? product.stock;

  return (
    <div className="fixed inset-0 z-[65] flex items-end sm:items-center justify-center p-0 sm:p-space-md">
      <div
        onClick={closeQuickView}
        className="absolute inset-0 bg-[#091b38]/50 backdrop-blur-sm animate-fade-in"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Vista rápida: ${product.name}`}
        className="relative w-full sm:max-w-3xl max-h-[92vh] overflow-y-auto pretty-scroll bg-surface-container-lowest rounded-t-3xl sm:rounded-3xl shadow-[0_40px_80px_-20px_rgba(9,27,56,0.4)] animate-slide-in-bottom sm:animate-zoom-in"
      >
        <button
          onClick={closeQuickView}
          aria-label="Cerrar vista rápida"
          className="absolute top-space-sm right-space-sm z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-on-surface flex items-center justify-center shadow-md hover:bg-white active:scale-90 transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
          {/* Visual */}
          <div className="relative bg-gradient-to-br from-secondary-fixed/40 via-surface-container-low to-primary-fixed/30 p-space-lg flex items-center justify-center min-h-[240px] sm:min-h-full overflow-hidden">
            <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/40 blur-3xl animate-drift" />
            <SmartImage
              src={product.image}
              alt={product.name}
              className="relative w-40 h-40 sm:w-52 sm:h-52 object-contain drop-shadow-2xl animate-float"
            />
            {discount > 0 && (
              <span className="absolute top-space-md left-space-md px-space-sm py-1 rounded-full bg-error text-on-error font-label-md text-label-md font-black shadow-lg animate-pop">
                -{discount}% OFF
              </span>
            )}
          </div>

          {/* Details */}
          <div className="p-space-lg flex flex-col">
            <span className="font-label-sm text-label-sm text-secondary font-extrabold uppercase tracking-wider">
              {product.brand}
            </span>
            <h2 className="mt-1 font-headline-md text-headline-md text-on-surface font-extrabold leading-tight">
              {product.name}
            </h2>

            {product.rating && (
              <div className="mt-space-xs flex items-center gap-1.5">
                <Stars rating={product.rating} />
                <span className="font-label-md text-label-md text-on-surface-variant font-semibold">
                  {product.rating} · {product.reviewsCount} opiniones
                </span>
              </div>
            )}

            <p className="mt-space-sm font-body-sm text-body-sm text-on-surface-variant line-clamp-4">
              {product.description}
            </p>

            {/* Presentations */}
            {product.presentations && product.presentations.length > 1 && (
              <div className="mt-space-md">
                <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-bold mb-space-xs">
                  Presentación
                </p>
                <div className="flex flex-wrap gap-space-xs">
                  {product.presentations.map((option) => {
                    const active = presentation?.id === option.id;
                    return (
                      <button
                        key={option.id}
                        onClick={() => setPresentation(option)}
                        className={`px-space-md py-2 rounded-2xl font-label-md text-label-md font-bold border transition-all active:scale-95 ${
                          active
                            ? 'bg-primary-container text-on-primary border-primary-container clay-button-primary scale-[1.03]'
                            : 'bg-surface-container-low text-on-surface-variant border-slate-200 hover:border-primary-fixed-dim'
                        }`}
                      >
                        <span className="block">{option.volume}</span>
                        <span
                          className={`block font-label-sm text-label-sm ${active ? 'text-on-primary/80' : 'text-outline'}`}
                        >
                          {formatPrice(option.price)}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {presentation && (
                  <p className="mt-space-xs font-label-md text-label-md text-secondary font-bold">
                    {formatUnitPrice(presentation.unitPrice, unitFromVolume(presentation.volume))}
                  </p>
                )}
              </div>
            )}

            {/* Price + stepper */}
            <div className="mt-auto pt-space-md">
              <div className="flex items-end justify-between gap-space-md mb-space-sm">
                <div>
                  <span className="block font-label-sm text-label-sm text-outline uppercase font-bold">
                    Total
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-price-currency text-price-currency text-primary font-bold">
                      $
                    </span>
                    <span className="font-price-integer text-3xl text-primary font-black leading-none">
                      {total.toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 bg-surface-container-low rounded-full p-1 clay-inset">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Quitar una unidad"
                    className="w-9 h-9 rounded-full bg-white text-on-surface-variant flex items-center justify-center shadow-xs active:scale-90 transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">remove</span>
                  </button>
                  <span className="w-9 text-center font-label-lg text-label-lg font-extrabold tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(stock, 99, q + 1))}
                    aria-label="Agregar una unidad"
                    className="w-9 h-9 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-xs active:scale-90 transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                  </button>
                </div>
              </div>

              <div className="flex gap-space-sm">
                <button
                  onClick={() => {
                    addToCart(product, presentation, quantity);
                    closeQuickView();
                  }}
                  className="flex-1 py-3 rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg font-bold clay-button-primary hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-space-xs"
                >
                  <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                  Agregar al carrito
                </button>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  aria-label={wishlisted ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                  className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all active:scale-90 ${
                    wishlisted
                      ? 'bg-error-container text-on-error-container'
                      : 'bg-surface-container-low text-outline hover:text-error'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[22px] ${wishlisted ? 'fill-icon' : ''}`}
                  >
                    favorite
                  </span>
                </button>
              </div>

              <button
                onClick={() => {
                  closeQuickView();
                  navigate({ view: 'product-detail', productId: product.id });
                }}
                className="w-full mt-space-sm py-2 font-label-md text-label-md text-primary font-bold hover:underline inline-flex items-center justify-center gap-1"
              >
                Ver ficha técnica completa
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
