import React, { useEffect, useMemo, useState } from 'react';
import { SmartImage } from '../components/SmartImage';
import { useStore } from '../context/StoreContext';
import { PRODUCTS } from '../data/products';
import {
  CANJE_CREDIT_PER_UNIT,
  CATEGORY_LABELS,
  PAYMENT_DISCOUNT_RATE,
} from '../data/content';
import { ProductPresentation } from '../types';
import { ProductCard, Stars } from '../components/ProductCard';
import { ScrollCarousel } from '../components/Carousel';
import { Reveal } from '../components/Reveal';
import { discountPercent, formatPrice, formatUnitPrice, unitFromVolume } from '../lib/format';

const TABS = [
  { id: 'description', label: 'Descripción', icon: 'description' },
  { id: 'specs', label: 'Ficha técnica', icon: 'science' },
  { id: 'usage', label: 'Modo de uso', icon: 'checklist' },
  { id: 'reviews', label: 'Opiniones', icon: 'reviews' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export const ProductDetailView: React.FC = () => {
  const { selectedProduct, addToCart, navigate, toggleWishlist, isWishlisted, openDrawer } =
    useStore();

  const [presentation, setPresentation] = useState<ProductPresentation | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<TabId>('description');
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 });

  const product = selectedProduct;

  // Reset the whole purchase panel when navigating to another product.
  useEffect(() => {
    setPresentation(
      product.presentations?.find((p) => p.isPopular) ?? product.presentations?.[0]
    );
    setQuantity(1);
    setActiveTab('description');
    setGalleryIndex(0);
  }, [product.id]);

  const gallery = useMemo(
    () => (product.gallery?.length ? product.gallery : [product.image]),
    [product]
  );

  const unitPrice = presentation?.price ?? product.price;
  const total = unitPrice * quantity;
  const transferPrice = Math.round(total * (1 - PAYMENT_DISCOUNT_RATE));
  const discount = product.listPrice ? discountPercent(product.listPrice, product.price) : 0;
  const wishlisted = isWishlisted(product.id);
  const stock = presentation?.stock ?? product.stock;
  const related = PRODUCTS.filter(
    (candidate) => candidate.id !== product.id && candidate.category === product.category
  )
    .concat(PRODUCTS.filter((candidate) => candidate.id !== product.id))
    .slice(0, 8);

  const ratingBreakdown = useMemo(() => {
    const reviews = product.reviews ?? [];
    return [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: reviews.filter((review) => review.rating === star).length,
      ratio: reviews.length
        ? reviews.filter((review) => review.rating === star).length / reviews.length
        : star === 5
          ? 0.8
          : star === 4
            ? 0.15
            : 0.02,
    }));
  }, [product]);

  const onZoomMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setZoom({
      active: true,
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div className="flex flex-col w-full gap-space-xl">
      {/* Breadcrumb */}
      <Reveal from="down">
        <nav className="flex flex-wrap items-center gap-1 font-label-md text-label-md text-on-surface-variant">
          <button
            onClick={() => navigate({ view: 'home' })}
            className="hover:text-primary transition-colors inline-flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">home</span>
            Inicio
          </button>
          <span className="material-symbols-outlined text-[16px] text-outline-variant">
            chevron_right
          </span>
          <button
            onClick={() => navigate({ view: 'catalog' })}
            className="hover:text-primary transition-colors"
          >
            Catálogo
          </button>
          <span className="material-symbols-outlined text-[16px] text-outline-variant">
            chevron_right
          </span>
          <button
            onClick={() => navigate({ view: 'catalog', category: product.category })}
            className="hover:text-primary transition-colors"
          >
            {CATEGORY_LABELS.find((c) => c.id === product.category)?.label ??
              product.category}
          </button>
          <span className="material-symbols-outlined text-[16px] text-outline-variant">
            chevron_right
          </span>
          <span className="text-primary font-bold truncate max-w-[220px]">{product.name}</span>
        </nav>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        {/* ----------------------- LEFT: gallery ----------------------- */}
        <div className="lg:col-span-7 space-y-space-md">
          <Reveal from="up">
            <div className="relative rounded-3xl bg-gradient-to-br from-secondary-fixed/40 via-surface-container-lowest to-primary-fixed/35 p-space-lg clay-card border border-white overflow-hidden">
              {/* Ambient */}
              <div
                aria-hidden="true"
                className="absolute -top-16 -left-10 w-56 h-56 rounded-full bg-white/50 blur-3xl animate-drift pointer-events-none"
              />

              {/* Floating badges */}
              <div className="relative z-20 flex flex-wrap items-start justify-between gap-space-sm">
                <div className="flex flex-col gap-1.5">
                  {discount > 0 && (
                    <span className="px-space-sm py-1 rounded-full bg-error text-on-error font-label-md text-label-md font-black shadow-md animate-pop">
                      -{discount}% OFF
                    </span>
                  )}
                  {product.badge && (
                    <span className="px-space-sm py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-md text-label-md font-bold shadow-sm">
                      {product.badge}
                    </span>
                  )}
                  {product.isBulk && (
                    <span className="inline-flex items-center gap-1 px-space-sm py-1 rounded-full bg-white/85 backdrop-blur text-on-secondary-fixed-variant font-label-md text-label-md font-bold shadow-sm">
                      <span className="material-symbols-outlined text-[15px] text-secondary">
                        recycling
                      </span>
                      Apto recarga suelta
                    </span>
                  )}
                </div>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  aria-label={wishlisted ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                  className={`w-11 h-11 rounded-full flex items-center justify-center shadow-md backdrop-blur-md transition-all active:scale-90 ${
                    wishlisted
                      ? 'bg-error text-on-error animate-wiggle'
                      : 'bg-white/85 text-outline hover:text-error'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[22px] ${wishlisted ? 'fill-icon' : ''}`}
                  >
                    favorite
                  </span>
                </button>
              </div>

              {/* Stage with hover zoom */}
              <div
                onMouseMove={onZoomMove}
                onMouseLeave={() => setZoom((z) => ({ ...z, active: false }))}
                className="relative my-space-md h-[280px] md:h-[360px] flex items-center justify-center cursor-zoom-in overflow-hidden rounded-2xl"
              >
                {/* Rising droplets */}
                <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
                  {[14, 32, 52, 70, 86].map((left, index) => (
                    <span
                      key={left}
                      className="absolute bottom-4 rounded-full bg-white/55 animate-bubble"
                      style={{
                        left: `${left}%`,
                        width: 7 + index * 2.5,
                        height: 7 + index * 2.5,
                        animationDelay: `${index * 0.95}s`,
                      }}
                    />
                  ))}
                </div>

                <SmartImage
                  key={gallery[galleryIndex]}
                  src={gallery[galleryIndex]}
                  alt={product.name}
                  className="relative w-56 h-56 md:w-72 md:h-72 object-contain drop-shadow-[0_24px_34px_rgba(0,119,182,0.28)] transition-transform duration-300 animate-zoom-in"
                  style={{
                    transform: zoom.active ? 'scale(1.55)' : 'scale(1)',
                    transformOrigin: `${zoom.x}% ${zoom.y}%`,
                  }}
                />

                {/* Active formula pill */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-space-md py-space-xs rounded-full glass-pill flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[17px] text-secondary">
                    science
                  </span>
                  <span className="font-label-md text-label-md text-on-surface font-bold whitespace-nowrap">
                    {presentation?.title ?? product.packageType}
                  </span>
                </div>
              </div>

              {/* Spec pills */}
              <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-space-sm">
                {[
                  { icon: 'science', label: 'Densidad', value: product.density ?? 'Estándar' },
                  { icon: 'water_drop', label: 'Dilución', value: product.dilution ?? 'Listo uso' },
                  { icon: 'speed', label: 'pH', value: product.ph ?? 'Neutro' },
                  { icon: 'inventory_2', label: 'Stock', value: `${stock} u.` },
                ].map((spec) => (
                  <div
                    key={spec.label}
                    className="p-space-sm rounded-2xl bg-white/80 backdrop-blur border border-white text-center"
                  >
                    <span className="material-symbols-outlined text-[19px] text-primary">
                      {spec.icon}
                    </span>
                    <p className="font-label-sm text-label-sm text-outline uppercase font-bold tracking-wide">
                      {spec.label}
                    </p>
                    <p className="font-label-md text-label-md text-on-surface font-extrabold leading-tight">
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Thumbnails */}
          {gallery.length > 1 && (
            <div className="flex items-center gap-space-sm">
              {gallery.map((image, index) => (
                <button
                  key={image}
                  onClick={() => setGalleryIndex(index)}
                  aria-label={`Ver imagen ${index + 1}`}
                  aria-current={galleryIndex === index}
                  className={`w-20 h-20 rounded-2xl bg-surface-container-low flex items-center justify-center overflow-hidden border-2 transition-all duration-300 ${
                    galleryIndex === index
                      ? 'border-primary-container scale-105 clay-card'
                      : 'border-transparent hover:border-primary-fixed-dim opacity-70 hover:opacity-100'
                  }`}
                >
                  <SmartImage src={image} alt="" className="w-14 h-14 object-contain" />
                </button>
              ))}
            </div>
          )}

          {/* Tabs */}
          <Reveal from="up">
            <div className="rounded-3xl bg-surface-container-lowest clay-card border border-slate-100 overflow-hidden">
              <div className="flex overflow-x-auto no-scrollbar border-b border-surface-container">
                {TABS.map((tab) => {
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      aria-selected={active}
                      className={`relative shrink-0 px-space-md py-space-md font-label-lg text-label-lg font-bold flex items-center gap-1.5 transition-colors ${
                        active ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                      {tab.label}
                      {tab.id === 'reviews' && product.reviewsCount && (
                        <span className="px-1.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-[10px] font-black">
                          {product.reviewsCount}
                        </span>
                      )}
                      <span
                        className={`absolute bottom-0 left-space-md right-space-md h-0.5 rounded-full bg-primary-container origin-left transition-transform duration-300 ${
                          active ? 'scale-x-100' : 'scale-x-0'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="p-space-lg" key={activeTab}>
                {activeTab === 'description' && (
                  <div className="space-y-space-md animate-fade-up">
                    <p className="font-body-lg text-body-md md:text-body-lg text-on-surface">
                      {product.description}
                    </p>
                    {product.details && (
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        {product.details}
                      </p>
                    )}
                    {product.tags && (
                      <div className="flex flex-wrap gap-space-xs pt-space-xs">
                        {product.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-space-md py-1 rounded-full bg-primary-fixed/60 text-on-primary-fixed-variant font-label-md text-label-md font-bold"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'specs' && (
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm animate-fade-up">
                    {[
                      { label: 'Marca', value: product.brand },
                      { label: 'Presentación base', value: product.packageType },
                      { label: 'SKU', value: product.sku ?? '—' },
                      { label: 'RNPA / Registro', value: product.rnpa ?? 'No aplica' },
                      { label: 'Densidad', value: product.density ?? 'Estándar' },
                      { label: 'pH', value: product.ph ?? 'Neutro' },
                      { label: 'Dilución recomendada', value: product.dilution ?? 'Listo para usar' },
                      { label: 'Origen del activo', value: product.origin ?? 'Nacional' },
                      { label: 'Stock disponible', value: `${product.stock} unidades` },
                      {
                        label: 'Venta mayorista',
                        value: product.isBulk ? 'Sí, por bulto y granel' : 'Por unidad',
                      },
                    ].map((row) => (
                      <div
                        key={row.label}
                        className="flex items-start justify-between gap-space-sm p-space-sm rounded-xl bg-surface-container-low/60"
                      >
                        <dt className="font-label-md text-label-md text-on-surface-variant">
                          {row.label}
                        </dt>
                        <dd className="font-label-md text-label-md text-on-surface font-bold text-right">
                          {row.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}

                {activeTab === 'usage' && (
                  <div className="animate-fade-up">
                    {product.usage?.length ? (
                      <ul className="space-y-space-sm">
                        {product.usage.map((item, index) => (
                          <li
                            key={item}
                            className="flex items-start gap-space-sm animate-fade-up"
                            style={{ animationDelay: `${index * 70}ms` }}
                          >
                            <span className="w-7 h-7 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant flex items-center justify-center font-label-md font-black shrink-0">
                              {index + 1}
                            </span>
                            <span className="font-body-md text-body-md text-on-surface pt-0.5">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        Consultá el rótulo del envase para las indicaciones de uso y seguridad.
                      </p>
                    )}

                    {product.dilution && (
                      <div className="mt-space-md p-space-md rounded-2xl bg-primary-fixed/40 border border-white">
                        <p className="font-label-lg text-label-lg text-primary font-bold flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[18px]">
                            water_drop
                          </span>
                          Dilución recomendada
                        </p>
                        <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
                          {product.dilution}. Usar guantes y no mezclar con otros químicos.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-space-lg animate-fade-up">
                    {/* Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-lg items-center">
                      <div className="text-center">
                        <p className="font-price-integer text-5xl text-primary font-black leading-none">
                          {product.rating ?? '—'}
                        </p>
                        <Stars rating={product.rating ?? 0} size={18} />
                        <p className="font-label-md text-label-md text-on-surface-variant mt-1">
                          {product.reviewsCount} opiniones
                        </p>
                      </div>

                      <div className="sm:col-span-2 space-y-1">
                        {ratingBreakdown.map((row) => (
                          <div key={row.star} className="flex items-center gap-space-sm">
                            <span className="w-8 font-label-md text-label-md text-on-surface-variant font-bold shrink-0">
                              {row.star}★
                            </span>
                            <div className="flex-1 h-2 rounded-full bg-surface-container-high overflow-hidden">
                              <div
                                className="h-full rounded-full bg-amber-400 transition-[width] duration-1000 ease-out"
                                style={{ width: `${Math.max(2, row.ratio * 100)}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Reviews */}
                    {product.reviews?.length ? (
                      <div className="space-y-space-md">
                        {product.reviews.map((review, index) => (
                          <div
                            key={review.id}
                            className="p-space-md rounded-2xl bg-surface-container-low/60 animate-fade-up"
                            style={{ animationDelay: `${index * 80}ms` }}
                          >
                            <div className="flex items-start gap-space-sm">
                              <div className="w-10 h-10 rounded-full bg-primary-fixed text-on-primary-fixed-variant flex items-center justify-center font-label-md font-black shrink-0">
                                {review.initials}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-space-xs">
                                  <span className="font-label-lg text-label-lg text-on-surface font-bold">
                                    {review.author}
                                  </span>
                                  {review.verified && (
                                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-secondary-fixed/60 text-on-secondary-fixed-variant font-label-sm text-[10px] font-bold">
                                      <span className="material-symbols-outlined text-[12px]">
                                        verified
                                      </span>
                                      Compra verificada
                                    </span>
                                  )}
                                  <span className="font-label-sm text-label-sm text-outline">
                                    {review.date}
                                  </span>
                                </div>
                                <Stars rating={review.rating} size={13} />
                                <p className="mt-1 font-label-lg text-label-lg text-on-surface font-bold">
                                  {review.title}
                                </p>
                                <p className="mt-0.5 font-body-md text-body-md text-on-surface-variant">
                                  {review.body}
                                </p>
                                {review.helpful && (
                                  <button className="mt-space-sm font-label-md text-label-md text-primary font-bold hover:underline inline-flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[15px]">
                                      thumb_up
                                    </span>
                                    Útil ({review.helpful})
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="font-body-md text-body-md text-on-surface-variant text-center py-space-md">
                        Este producto todavía no tiene opiniones publicadas.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        </div>

        {/* ----------------------- RIGHT: purchase ----------------------- */}
        <div className="lg:col-span-5">
          <Reveal from="up">
            <div className="lg:sticky lg:top-32 space-y-space-md">
              <div className="p-space-lg rounded-3xl bg-surface-container-lowest clay-card border border-slate-100">
                <div className="flex items-center justify-between gap-space-sm">
                  <span className="font-label-sm text-label-sm text-secondary font-extrabold uppercase tracking-widest">
                    {product.brand}
                  </span>
                  {product.sku && (
                    <span className="font-label-sm text-label-sm text-outline">
                      SKU {product.sku}
                    </span>
                  )}
                </div>

                <h1 className="mt-space-xs font-headline-lg text-xl md:text-2xl text-on-surface font-extrabold leading-tight tracking-tight">
                  {product.name}
                </h1>

                {/* Rating + sales */}
                <div className="mt-space-sm flex flex-wrap items-center gap-space-sm">
                  {product.rating && (
                    <button
                      onClick={() => setActiveTab('reviews')}
                      className="inline-flex items-center gap-1.5 hover:underline"
                    >
                      <Stars rating={product.rating} size={15} />
                      <span className="font-label-md text-label-md text-on-surface-variant font-semibold">
                        {product.rating} ({product.reviewsCount})
                      </span>
                    </button>
                  )}
                  {product.salesCount && (
                    <span className="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full bg-secondary-fixed/40 text-on-secondary-fixed-variant font-label-sm text-label-sm font-bold">
                      <span className="material-symbols-outlined text-[14px]">
                        local_fire_department
                      </span>
                      {product.salesCount}
                    </span>
                  )}
                </div>

                {/* Presentations */}
                {product.presentations && product.presentations.length > 0 && (
                  <div className="mt-space-md">
                    <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-bold mb-space-sm">
                      Elegí la presentación
                    </p>
                    <div className="space-y-space-xs">
                      {product.presentations.map((option) => {
                        const active = presentation?.id === option.id;
                        return (
                          <button
                            key={option.id}
                            onClick={() => {
                              setPresentation(option);
                              setQuantity(1);
                            }}
                            className={`w-full p-space-sm rounded-2xl border text-left flex items-center gap-space-sm transition-all duration-300 ${
                              active
                                ? 'bg-primary-fixed/50 border-primary-container clay-card scale-[1.015]'
                                : 'bg-surface-container-low/60 border-slate-200 hover:border-primary-fixed-dim'
                            }`}
                          >
                            <span
                              className={`material-symbols-outlined text-[22px] shrink-0 transition-colors ${
                                active ? 'text-primary fill-icon' : 'text-outline-variant'
                              }`}
                            >
                              {active ? 'radio_button_checked' : 'radio_button_unchecked'}
                            </span>

                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="font-label-lg text-label-lg text-on-surface font-bold">
                                  {option.title}
                                </span>
                                {option.isPopular && (
                                  <span className="px-1.5 py-0.5 rounded-full bg-primary-container text-on-primary font-label-sm text-[10px] font-black">
                                    Más elegido
                                  </span>
                                )}
                                {option.isEco && (
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-secondary text-on-secondary font-label-sm text-[10px] font-black">
                                    <span className="material-symbols-outlined text-[11px]">
                                      recycling
                                    </span>
                                    Eco
                                  </span>
                                )}
                              </div>
                              {option.badge && (
                                <span className="font-label-sm text-label-sm text-outline block">
                                  {option.badge}
                                </span>
                              )}
                              <span className="font-label-sm text-label-sm text-secondary font-bold">
                                {formatUnitPrice(option.unitPrice, unitFromVolume(option.volume))}
                              </span>
                            </div>

                            <span className="font-price-integer text-lg text-primary font-black shrink-0">
                              {formatPrice(option.price)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Price block */}
                <div className="mt-space-md p-space-md rounded-2xl bg-gradient-to-br from-primary-fixed/40 to-secondary-fixed/30 border border-white">
                  {product.listPrice && (
                    <div className="flex items-center gap-space-sm">
                      <span className="font-label-md text-label-md text-outline line-through">
                        {formatPrice(product.listPrice * quantity)}
                      </span>
                      <span className="px-1.5 py-0.5 rounded-full bg-error text-on-error font-label-sm text-[10px] font-black">
                        -{discount}%
                      </span>
                    </div>
                  )}
                  <div className="flex items-baseline gap-1">
                    <span className="font-price-currency text-price-currency text-primary font-bold">
                      $
                    </span>
                    <span className="font-price-integer text-4xl text-primary font-black leading-none">
                      {total.toLocaleString('es-AR')}
                    </span>
                    <span className="font-label-md text-label-md text-on-surface-variant ml-1">
                      ARS
                    </span>
                  </div>
                  <p className="mt-1 font-label-md text-label-md text-secondary font-bold">
                    {formatPrice(transferPrice)} con transferencia o efectivo (10% OFF)
                  </p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">
                    3 cuotas sin interés de {formatPrice(Math.round(total / 3))}
                  </p>
                  {product.isBulk && (
                    <p className="mt-1 font-label-sm text-label-sm text-on-secondary-fixed-variant inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-secondary">
                        recycling
                      </span>
                      Devolviendo el envase recuperás {formatPrice(CANJE_CREDIT_PER_UNIT)} por
                      unidad
                    </p>
                  )}
                </div>

                {/* Stepper + CTA */}
                <div className="mt-space-md flex items-center gap-space-sm">
                  <div className="flex items-center gap-0.5 bg-surface-container-low rounded-full p-1 clay-inset shrink-0">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      aria-label="Quitar una unidad"
                      className="w-10 h-10 rounded-full bg-white text-on-surface-variant flex items-center justify-center shadow-xs active:scale-90 transition-all"
                    >
                      <span className="material-symbols-outlined text-[19px]">remove</span>
                    </button>
                    <span className="w-10 text-center font-label-lg text-label-lg font-black tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(stock, 99, q + 1))}
                      aria-label="Agregar una unidad"
                      className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-xs active:scale-90 transition-all"
                    >
                      <span className="material-symbols-outlined text-[19px]">add</span>
                    </button>
                  </div>

                  <button
                    onClick={() => addToCart(product, presentation, quantity)}
                    className="shine flex-1 py-3.5 rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg font-bold clay-button-primary hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-space-xs"
                  >
                    <span className="material-symbols-outlined text-[20px] relative z-[2]">
                      add_shopping_cart
                    </span>
                    <span className="relative z-[2]">Agregar al carrito</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    addToCart(product, presentation, quantity);
                    navigate({ view: 'checkout' });
                  }}
                  className="w-full mt-space-sm py-3 rounded-full bg-secondary text-on-secondary font-label-lg text-label-lg font-bold clay-button-secondary hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-space-xs"
                >
                  <span className="material-symbols-outlined text-[20px]">bolt</span>
                  Comprar ahora
                </button>

                <button
                  onClick={openDrawer}
                  className="w-full mt-space-xs py-2 font-label-md text-label-md text-primary font-bold hover:underline"
                >
                  Ver mi carrito
                </button>

                {/* Stock bar */}
                <div className="mt-space-md">
                  <div className="flex items-center justify-between font-label-sm text-label-sm mb-1">
                    <span className="text-on-surface-variant font-semibold">
                      Disponibilidad
                    </span>
                    <span
                      className={`font-bold ${stock <= 30 ? 'text-warning' : 'text-secondary'}`}
                    >
                      {stock <= 30 ? `Últimas ${stock} unidades` : `${stock} en stock`}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-container-high overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-[width] duration-1000 ease-out ${
                        stock <= 30 ? 'bg-warning' : 'bg-secondary'
                      }`}
                      style={{ width: `${Math.min(100, (stock / 200) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Logistics card */}
              <div className="p-space-md rounded-3xl bg-surface-container-lowest clay-card border border-slate-100 space-y-space-sm">
                {[
                  {
                    icon: 'local_shipping',
                    title: 'Envío express en el día',
                    body: 'CABA y GBA Sur con pedidos antes de las 14 hs. Gratis desde $25.000.',
                  },
                  {
                    icon: 'storefront',
                    title: 'Retiro sin cargo',
                    body: 'Lanús Oeste, Quilmes y Avellaneda con carga rápida en mostrador.',
                  },
                  {
                    icon: 'receipt_long',
                    title: 'Factura A y B',
                    body: 'Comprobante fiscal electrónico con CUIT emitido en el acto.',
                  },
                  {
                    icon: 'verified_user',
                    title: 'Certificación ANMAT',
                    body: 'Ficha técnica y hoja de seguridad disponibles para habilitaciones.',
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-space-sm">
                    <span className="w-9 h-9 rounded-full bg-primary-fixed/60 text-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                    </span>
                    <div>
                      <p className="font-label-lg text-label-lg text-on-surface font-bold">
                        {item.title}
                      </p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        {item.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Related carousel */}
      <section>
        <ScrollCarousel
          label="Productos relacionados"
          header={
            <Reveal from="up">
              <div>
                <div className="inline-flex items-center gap-1 font-label-sm text-label-sm text-secondary uppercase font-extrabold tracking-widest">
                  <span className="material-symbols-outlined text-[16px]">category</span>
                  Suelen comprarse juntos
                </div>
                <h2 className="font-headline-lg text-2xl md:text-headline-lg text-primary tracking-tight font-extrabold">
                  Complementá tu pedido
                </h2>
              </div>
            </Reveal>
          }
        >
          {related.map((item) => (
            <div
              key={item.id}
              className="snap-item min-w-[250px] w-[250px] sm:min-w-[260px] sm:w-[260px] shrink-0"
            >
              <ProductCard product={item} variant="compact" className="h-full" />
            </div>
          ))}
        </ScrollCarousel>
      </section>
    </div>
  );
};
