import React, { useState } from 'react';
import { SmartImage } from './SmartImage';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { discountPercent, formatPrice, formatUnitPrice, unitFromVolume } from '../lib/format';

interface ProductCardProps {
  product: Product;
  /** `compact` is used inside carousels, `list` on the catalog list view. */
  variant?: 'default' | 'compact' | 'list';
  className?: string;
  showQuickView?: boolean;
}

const Stars: React.FC<{ rating: number; size?: number }> = ({ rating, size = 14 }) => (
  <span className="inline-flex items-center" aria-label={`${rating} de 5 estrellas`}>
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        aria-hidden="true"
        className={`material-symbols-outlined ${star <= Math.round(rating) ? 'fill-icon text-amber-500' : 'text-outline-variant'}`}
        style={{ fontSize: size }}
      >
        star
      </span>
    ))}
  </span>
);

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  variant = 'default',
  className = '',
  showQuickView = true,
}) => {
  const { addToCart, navigate, toggleWishlist, isWishlisted, openQuickView, isInCart } =
    useStore();
  const [justAdded, setJustAdded] = useState(false);

  const wishlisted = isWishlisted(product.id);
  const inCart = isInCart(product.id);
  const discount = product.listPrice ? discountPercent(product.listPrice, product.price) : 0;
  const defaultPresentation =
    product.presentations?.find((p) => p.isPopular) ?? product.presentations?.[0];
  const lowStock = product.stock > 0 && product.stock <= 30;

  const open = () => navigate({ view: 'product-detail', productId: product.id });

  const handleAdd = (event: React.MouseEvent) => {
    event.stopPropagation();
    addToCart(product, defaultPresentation, 1);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  };

  const handleWishlist = (event: React.MouseEvent) => {
    event.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickView = (event: React.MouseEvent) => {
    event.stopPropagation();
    openQuickView(product);
  };

  /* -------------------------------- list row -------------------------------- */
  if (variant === 'list') {
    return (
      <article
        onClick={open}
        className={`group relative flex gap-space-md p-space-md rounded-3xl bg-surface-container-lowest clay-card border border-slate-100 cursor-pointer transition-all duration-300 hover:clay-card-lifted hover:-translate-y-0.5 ${className}`}
      >
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 shrink-0 rounded-2xl bg-gradient-to-b from-surface-container-low to-secondary-fixed/20 flex items-center justify-center overflow-hidden">
          <SmartImage
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3"
          />
          {discount > 0 && (
            <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-full bg-error text-on-error text-[10px] font-black">
              -{discount}%
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-start justify-between gap-space-sm">
            <div className="min-w-0">
              <span className="font-label-sm text-label-sm text-secondary font-extrabold uppercase tracking-wide">
                {product.brand}
              </span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                {product.name}
              </h3>
            </div>
            <button
              onClick={handleWishlist}
              aria-label={wishlisted ? 'Quitar de favoritos' : 'Guardar en favoritos'}
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all active:scale-90 ${
                wishlisted
                  ? 'bg-error-container text-on-error-container'
                  : 'bg-surface-container-low text-outline hover:text-error'
              }`}
            >
              <span className={`material-symbols-outlined text-[18px] ${wishlisted ? 'fill-icon' : ''}`}>
                favorite
              </span>
            </button>
          </div>

          <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-1">
            {product.description}
          </p>

          <div className="flex flex-wrap items-center gap-space-xs mt-space-sm">
            {product.rating && (
              <span className="inline-flex items-center gap-1">
                <Stars rating={product.rating} />
                <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                  {product.rating} ({product.reviewsCount})
                </span>
              </span>
            )}
            <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold">
              {product.packageType}
            </span>
            {product.presentations?.some((p) => p.isEco) && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-fixed/50 text-on-secondary-fixed-variant font-label-sm text-label-sm font-bold">
                <span className="material-symbols-outlined text-[13px]">recycling</span>
                Recargable
              </span>
            )}
          </div>

          <div className="mt-auto pt-space-sm flex flex-wrap items-end justify-between gap-space-sm">
            <div>
              {product.listPrice && (
                <span className="block font-label-sm text-label-sm text-outline line-through">
                  {formatPrice(product.listPrice)}
                </span>
              )}
              <div className="flex items-baseline gap-1">
                <span className="font-price-currency text-price-currency text-primary font-bold">$</span>
                <span className="font-price-integer text-price-integer text-primary font-extrabold leading-none">
                  {product.price.toLocaleString('es-AR')}
                </span>
              </div>
              {defaultPresentation && (
                <span className="font-label-sm text-label-sm text-secondary font-bold">
                  {formatUnitPrice(defaultPresentation.unitPrice, unitFromVolume(defaultPresentation.volume))}
                </span>
              )}
            </div>

            <div className="flex items-center gap-space-xs">
              {showQuickView && (
                <button
                  onClick={handleQuickView}
                  className="px-space-md py-2 rounded-full bg-surface-container-low text-on-surface-variant font-label-md text-label-md font-bold hover:bg-surface-container transition-all active:scale-95"
                >
                  Vista rápida
                </button>
              )}
              <button
                onClick={handleAdd}
                className="px-space-md py-2 rounded-full bg-primary-container text-on-primary font-label-md text-label-md font-bold clay-button-primary hover:scale-[1.03] active:scale-95 transition-all flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[17px]">
                  {justAdded ? 'check' : 'add_shopping_cart'}
                </span>
                {justAdded ? 'Agregado' : 'Agregar'}
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  }

  /* ------------------------------- grid card ------------------------------- */
  const compact = variant === 'compact';

  return (
    <article
      onClick={open}
      className={`group relative flex flex-col rounded-3xl bg-surface-container-lowest clay-card border border-slate-100 cursor-pointer overflow-hidden transition-all duration-300 hover:clay-card-lifted hover:-translate-y-1.5 ${className}`}
    >
      {/* Badges */}
      <div className="absolute top-space-sm left-space-sm z-20 flex flex-col items-start gap-1">
        {discount > 0 && (
          <span className="px-2 py-0.5 rounded-full bg-error text-on-error font-label-sm text-label-sm font-black shadow-sm animate-pop">
            -{discount}% OFF
          </span>
        )}
        {product.isNew && (
          <span className="px-2 py-0.5 rounded-full bg-tertiary text-on-tertiary font-label-sm text-label-sm font-bold shadow-sm">
            Nuevo
          </span>
        )}
        {product.badge && !discount && !product.isNew && (
          <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-bold shadow-sm">
            {product.badge}
          </span>
        )}
      </div>

      {/* Wishlist + quick view, revealed on hover */}
      <div className="absolute top-space-sm right-space-sm z-20 flex flex-col gap-1.5">
        <button
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Quitar de favoritos' : 'Guardar en favoritos'}
          className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md shadow-sm transition-all duration-300 active:scale-90 ${
            wishlisted
              ? 'bg-error-container text-on-error-container opacity-100'
              : 'bg-white/85 text-outline hover:text-error opacity-0 group-hover:opacity-100 focus-visible:opacity-100 translate-x-2 group-hover:translate-x-0'
          }`}
        >
          <span className={`material-symbols-outlined text-[18px] ${wishlisted ? 'fill-icon' : ''}`}>
            favorite
          </span>
        </button>

        {showQuickView && !compact && (
          <button
            onClick={handleQuickView}
            aria-label="Vista rápida"
            className="w-9 h-9 rounded-full bg-white/85 backdrop-blur-md text-outline hover:text-primary shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 focus-visible:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 delay-75 active:scale-90"
          >
            <span className="material-symbols-outlined text-[18px]">visibility</span>
          </button>
        )}
      </div>

      {/* Image stage */}
      <div
        className={`relative w-full ${compact ? 'h-36' : 'h-44'} bg-gradient-to-b from-surface-container-low to-secondary-fixed/20 flex items-center justify-center overflow-hidden shrink-0`}
      >
        <div className="absolute -bottom-8 w-28 h-10 rounded-full bg-primary/10 blur-2xl" />
        <SmartImage
          src={product.image}
          alt={product.name}
          loading="lazy"
          className={`${compact ? 'w-24 h-24' : 'w-28 h-28'} object-contain drop-shadow-lg transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-1.5 group-hover:-rotate-3`}
        />
        {lowStock && (
          <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-warning-container text-warning font-label-sm text-label-sm font-bold">
            Últimas {product.stock} u.
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-space-md pt-space-sm">
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="font-label-sm text-label-sm text-secondary font-extrabold uppercase tracking-wide truncate">
            {product.brand}
          </span>
          <span className="font-label-sm text-label-sm text-outline font-semibold truncate shrink-0">
            {product.packageType}
          </span>
        </div>

        <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {!compact && (
          <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-1">
            {product.details || product.description}
          </p>
        )}

        {product.rating && (
          <div className="flex items-center gap-1 mt-space-sm">
            <Stars rating={product.rating} size={13} />
            <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
              {product.rating}
            </span>
            <span className="font-label-sm text-label-sm text-outline">
              ({product.reviewsCount})
            </span>
          </div>
        )}

        <div className="mt-auto pt-space-sm flex items-end justify-between gap-space-xs border-t border-slate-100">
          <div className="min-w-0">
            {product.listPrice ? (
              <span className="block font-label-sm text-label-sm text-outline line-through leading-none">
                {formatPrice(product.listPrice)}
              </span>
            ) : (
              <span className="block font-label-sm text-label-sm text-secondary font-bold uppercase leading-none">
                Precio final
              </span>
            )}
            <div className="flex items-baseline gap-0.5">
              <span className="font-price-currency text-price-currency text-primary font-bold">$</span>
              <span className="font-price-integer text-price-integer text-primary font-extrabold leading-none">
                {product.price.toLocaleString('es-AR')}
              </span>
            </div>
          </div>

          <button
            onClick={handleAdd}
            aria-label={`Agregar ${product.name} al carrito`}
            className={`relative w-11 h-11 rounded-full flex items-center justify-center shrink-0 clay-button-primary transition-all duration-300 active:scale-90 hover:scale-110 ${
              justAdded
                ? 'bg-secondary text-on-secondary'
                : 'bg-primary-container text-on-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">
              {justAdded ? 'check' : 'add'}
            </span>
            {inCart && !justAdded && (
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-secondary border-2 border-white" />
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

export { Stars };
