import React, { useState } from 'react';
import { SmartImage } from '../components/SmartImage';
import { useStore } from '../context/StoreContext';
import {
  BEST_SELLERS,
  NEW_ARRIVALS,
  ON_SALE,
  REFILLABLE,
} from '../data/products';
import {
  BRAND_LOGOS,
  CANJE_STEPS,
  CATEGORY_TILES,
  CONTACT,
  FAQS,
  HERO_SLIDES,
  PRICE_COMPARISON,
  STORE_BRANCHES,
  TESTIMONIALS,
  TRUST_BADGES,
  WHOLESALE_TIERS,
} from '../data/content';
import { HeroSlide, Testimonial } from '../types';
import { Marquee, ScrollCarousel, SlideCarousel } from '../components/Carousel';
import { ProductCard, Stars } from '../components/ProductCard';
import { Reveal } from '../components/Reveal';
import { Counter } from '../components/Counter';
import { formatPrice, formatUnitPrice } from '../lib/format';

/* ------------------------------------------------------------------ */
/* Section heading                                                     */
/* ------------------------------------------------------------------ */
const SectionHead: React.FC<{
  eyebrow: string;
  eyebrowIcon?: string;
  title: string;
  aside?: React.ReactNode;
}> = ({ eyebrow, eyebrowIcon, title, aside }) => (
  <div>
    <div className="inline-flex items-center gap-1 font-label-sm text-label-sm text-secondary uppercase font-extrabold tracking-widest">
      {eyebrowIcon && (
        <span className="material-symbols-outlined text-[16px]">{eyebrowIcon}</span>
      )}
      {eyebrow}
    </div>
    <h2 className="font-headline-lg text-2xl md:text-headline-lg text-primary tracking-tight font-extrabold">
      {title}
    </h2>
    {aside}
  </div>
);

/* ------------------------------------------------------------------ */
/* Hero slide                                                          */
/* ------------------------------------------------------------------ */
const ACCENT_BG: Record<HeroSlide['accent'], string> = {
  primary: 'from-primary-fixed/60 via-surface-container-lowest to-secondary-fixed/40',
  secondary: 'from-secondary-fixed/60 via-surface-container-lowest to-primary-fixed/40',
  tertiary: 'from-tertiary-fixed/60 via-surface-container-lowest to-primary-fixed/35',
};

const HeroSlideCard: React.FC<{ slide: HeroSlide; active: boolean }> = ({
  slide,
  active,
}) => {
  const { navigate } = useStore();

  // Inner content animates in each time the slide becomes active.
  const step = (index: number): React.CSSProperties => ({
    opacity: active ? 1 : 0,
    transform: active ? 'none' : 'translateY(18px)',
    transition: `opacity 600ms cubic-bezier(0.22,1,0.36,1) ${120 + index * 90}ms, transform 600ms cubic-bezier(0.22,1,0.36,1) ${120 + index * 90}ms`,
  });

  return (
    <section
      className={`relative w-full rounded-3xl bg-gradient-to-br ${ACCENT_BG[slide.accent]} p-space-lg md:p-space-xl border border-white clay-card overflow-hidden`}
    >
      {/* Ambient orbs */}
      <div
        aria-hidden="true"
        className="absolute -top-24 -left-16 w-72 h-72 rounded-full bg-white/50 blur-3xl animate-drift pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-20 right-10 w-80 h-80 rounded-full bg-secondary-fixed/30 blur-3xl animate-float-slow pointer-events-none"
      />

      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-center">
        {/* Copy */}
        <div className="lg:col-span-7 space-y-space-md">
          <div
            style={step(0)}
            className="inline-flex items-center gap-space-xs px-space-md py-1 rounded-full bg-white/80 text-on-primary-fixed-variant font-label-md text-label-md shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)] font-bold"
          >
            <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
            {slide.eyebrow}
          </div>

          <h1
            style={step(1)}
            className="font-display-hero text-3xl sm:text-4xl md:text-5xl lg:text-[46px] text-primary tracking-tight font-extrabold leading-[1.12]"
          >
            {slide.title}{' '}
            <span className="text-gradient-brand">{slide.highlight}</span>
          </h1>

          <p
            style={step(2)}
            className="font-body-lg text-body-lg text-on-surface-variant max-w-xl"
          >
            {slide.description}
          </p>

          <div style={step(3)} className="flex flex-wrap items-center gap-space-md pt-space-xs">
            <button
              onClick={() => navigate(slide.ctaTarget)}
              className="group shine px-space-xl py-space-md rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg font-bold clay-button-primary hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center gap-space-xs"
            >
              <span className="relative z-[2]">{slide.ctaLabel}</span>
              <span className="material-symbols-outlined text-[20px] relative z-[2] transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </button>
            <button
              onClick={() => navigate(slide.secondaryTarget)}
              className="px-space-xl py-space-md rounded-full bg-surface-container-lowest/90 text-on-secondary-fixed-variant font-label-lg text-label-lg font-bold clay-button-secondary hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center gap-space-xs"
            >
              <span className="material-symbols-outlined text-[20px] text-secondary">
                calculate
              </span>
              {slide.secondaryLabel}
            </button>
          </div>

          {/* Animated stats */}
          <div
            style={step(4)}
            className="pt-space-md grid grid-cols-3 gap-space-sm text-center md:text-left"
          >
            <div>
              <div className="font-price-integer text-2xl md:text-3xl text-primary font-black leading-none">
                <Counter value={250} prefix="+" />
              </div>
              <div className="font-body-sm text-xs md:text-body-sm text-on-surface-variant mt-1">
                Fórmulas activas certificadas
              </div>
            </div>
            <div>
              <div className="font-price-integer text-2xl md:text-3xl text-secondary font-black leading-none">
                <Counter value={40} prefix="−" suffix="%" />
              </div>
              <div className="font-body-sm text-xs md:text-body-sm text-on-surface-variant mt-1">
                Ahorro en recarga de envase
              </div>
            </div>
            <div>
              <div className="font-price-integer text-2xl md:text-3xl text-tertiary font-black leading-none">
                <Counter value={24} suffix=" hs" />
              </div>
              <div className="font-body-sm text-xs md:text-body-sm text-on-surface-variant mt-1">
                Despacho express garantizado
              </div>
            </div>
          </div>
        </div>

        {/* Visual */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          <div
            style={{
              ...step(2),
              transform: active ? 'scale(1)' : 'scale(0.94)',
            }}
            className="relative w-full max-w-[400px] aspect-square rounded-3xl bg-gradient-to-tr from-white/70 via-surface-container-lowest to-primary-fixed/40 p-space-md clay-card flex items-center justify-center border border-white"
          >
            {/* Rising bubbles */}
            <div aria-hidden="true" className="absolute inset-0 overflow-hidden rounded-3xl">
              {[18, 38, 58, 76].map((left, index) => (
                <span
                  key={left}
                  className="absolute bottom-6 rounded-full bg-white/60 animate-bubble"
                  style={{
                    left: `${left}%`,
                    width: 8 + index * 3,
                    height: 8 + index * 3,
                    animationDelay: `${index * 1.1}s`,
                  }}
                />
              ))}
            </div>

            <SmartImage
              alt=""
              className="relative w-52 h-52 md:w-56 md:h-56 object-contain drop-shadow-[0_20px_30px_rgba(0,119,182,0.25)] animate-float z-10"
              src={slide.image}
            />

            <div className="absolute -top-3 right-2 glass-pill px-space-md py-space-xs rounded-full flex items-center gap-space-xs z-20 animate-bob">
              <span className="material-symbols-outlined text-secondary text-[19px]">
                verified
              </span>
              <span className="font-label-md text-label-md text-on-surface font-bold">
                Fórmula biodegradable
              </span>
            </div>

            <div
              className="absolute -bottom-4 left-4 glass-pill px-space-md py-space-sm rounded-2xl flex items-center gap-space-sm z-20 animate-bob"
              style={{ animationDelay: '1.4s' }}
            >
              <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-container shrink-0">
                <span className="material-symbols-outlined text-[20px]">science</span>
              </div>
              <div className="text-left">
                <div className="font-price-integer text-lg text-primary font-black leading-none">
                  {slide.stat.value}
                </div>
                <div className="font-label-sm text-label-sm text-secondary font-bold">
                  {slide.stat.label}
                </div>
              </div>
            </div>

            <div className="absolute top-1/2 -left-4 -translate-y-1/2 px-space-sm py-space-xs rounded-full bg-primary-fixed/80 backdrop-blur-lg shadow-md flex items-center gap-1 text-on-primary-fixed-variant font-label-sm text-label-sm font-bold border border-white/50 z-20">
              <span className="material-symbols-outlined text-[16px]">bubble_chart</span>
              Ultra Espuma
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Testimonial card                                                    */
/* ------------------------------------------------------------------ */
const ACCENT_AVATAR: Record<Testimonial['accent'], string> = {
  primary: 'bg-primary-fixed text-on-primary-fixed-variant',
  secondary: 'bg-secondary-fixed text-on-secondary-fixed-variant',
  tertiary: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
};

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => (
  <div className="h-full p-space-lg rounded-3xl bg-surface-container-lowest clay-card border border-slate-100 flex flex-col">
    <span
      aria-hidden="true"
      className="material-symbols-outlined text-[40px] text-primary-fixed-dim leading-none"
    >
      format_quote
    </span>
    <p className="mt-space-sm font-body-lg text-body-md md:text-body-lg text-on-surface flex-1">
      {testimonial.quote}
    </p>
    <div className="mt-space-md pt-space-md border-t border-slate-100 flex items-center gap-space-sm">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center font-label-lg font-black shrink-0 shadow-sm ${ACCENT_AVATAR[testimonial.accent]}`}
      >
        {testimonial.initials}
      </div>
      <div className="min-w-0">
        <p className="font-label-lg text-label-lg text-on-surface font-bold truncate">
          {testimonial.name}
        </p>
        <p className="font-label-sm text-label-sm text-on-surface-variant truncate">
          {testimonial.role}
        </p>
        <Stars rating={testimonial.rating} size={13} />
      </div>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* FAQ accordion                                                       */
/* ------------------------------------------------------------------ */
const FaqAccordion: React.FC = () => {
  const [open, setOpen] = useState<string | null>(FAQS[0].id);

  return (
    <div className="space-y-space-sm">
      {FAQS.map((faq, index) => {
        const expanded = open === faq.id;
        return (
          <Reveal key={faq.id} from="up" delay={index * 60}>
            <div
              className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
                expanded
                  ? 'bg-surface-container-lowest border-primary-fixed-dim clay-card'
                  : 'bg-surface-container-lowest/70 border-slate-100 hover:border-primary-fixed'
              }`}
            >
              <button
                onClick={() => setOpen(expanded ? null : faq.id)}
                aria-expanded={expanded}
                className="w-full flex items-center gap-space-md p-space-md text-left"
              >
                <span
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                    expanded
                      ? 'bg-primary-container text-on-primary scale-110'
                      : 'bg-surface-container-low text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{faq.icon}</span>
                </span>
                <span className="flex-1 font-label-lg text-label-lg md:text-headline-sm text-on-surface font-bold">
                  {faq.question}
                </span>
                <span
                  className={`material-symbols-outlined text-[22px] text-outline shrink-0 transition-transform duration-300 ${
                    expanded ? 'rotate-180 text-primary' : ''
                  }`}
                >
                  expand_more
                </span>
              </button>

              <div
                className="grid transition-[grid-template-rows] duration-400 ease-out"
                style={{ gridTemplateRows: expanded ? '1fr' : '0fr' }}
              >
                <div className="overflow-hidden">
                  <p className="px-space-md pb-space-md pl-[4.25rem] font-body-md text-body-md text-on-surface-variant">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Home                                                                */
/* ------------------------------------------------------------------ */
export const HomeView: React.FC = () => {
  const { navigate, cartCount, totals, openDrawer } = useStore();
  const [comparisonHover, setComparisonHover] = useState<string | null>(null);

  return (
    <div className="flex flex-col w-full gap-space-2xl">
      {/* ------------------------------ HERO ------------------------------ */}
      <section>
        {/* Ticker */}
        <Reveal from="down" className="mb-space-md">
          <div className="relative w-full rounded-2xl bg-gradient-to-r from-secondary-fixed/40 via-white/90 to-primary-fixed/40 p-space-sm clay-card backdrop-blur-xl border border-white/60 overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-space-xs px-space-sm text-center sm:text-left">
              <div className="flex items-center gap-space-xs">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-on-secondary shadow-sm shrink-0 animate-pulse-ring">
                  <span className="material-symbols-outlined text-[17px]">local_shipping</span>
                </span>
                <p className="font-body-md text-body-md text-on-surface">
                  <span className="font-bold text-primary">Envíos gratis</span> en compras
                  mayores a <span className="font-bold">$25.000</span> en el día en CABA y GBA
                  Sur.
                </p>
              </div>
              <div className="flex items-center gap-space-xs text-on-secondary-fixed-variant font-label-md text-label-md bg-secondary-container/60 px-space-md py-1 rounded-full shrink-0">
                <span className="material-symbols-outlined text-[16px] text-secondary">
                  recycling
                </span>
                Traé tu envase y ahorrá hasta un <strong>40%</strong>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Hero carousel */}
        <SlideCarousel
          items={HERO_SLIDES}
          label="Promociones destacadas"
          autoPlayMs={7000}
          renderSlide={(slide, _index, active) => (
            <HeroSlideCard slide={slide} active={active} />
          )}
        />
      </section>

      {/* --------------------------- CATEGORIES --------------------------- */}
      <section>
        <Reveal from="up">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-sm mb-space-md">
            <SectionHead
              eyebrow="Explorá por sector"
              eyebrowIcon="category"
              title="Categorías principales"
            />
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Precios directos para el hogar, oficinas y grandes superficies
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-space-md">
          {CATEGORY_TILES.map((tile, index) => (
            <Reveal key={`${tile.id}-${tile.label}`} from="up" delay={index * 45}>
              <button
                onClick={() => navigate({ view: 'catalog', category: tile.id })}
                className="group w-full h-full flex flex-col items-center text-center p-space-md rounded-3xl bg-surface-container-lowest clay-card border border-slate-100 hover:clay-card-lifted hover:-translate-y-2 active:translate-y-0 transition-all duration-300"
              >
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-br ${tile.gradient} flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)] mb-space-sm transition-transform duration-400 group-hover:scale-110 group-hover:rotate-6`}
                >
                  <span className={`material-symbols-outlined text-[32px] ${tile.textColor}`}>
                    {tile.icon}
                  </span>
                </div>
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold leading-tight mb-1 group-hover:text-primary transition-colors">
                  {tile.label}
                </span>
                <span className="font-label-sm text-label-sm px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-semibold">
                  {tile.count}
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      {/* -------------------------- BEST SELLERS -------------------------- */}
      <section>
        <ScrollCarousel
          label="Más vendidos de la semana"
          showDots
          header={
            <Reveal from="up">
              <SectionHead
                eyebrow="Los favoritos de la gente"
                eyebrowIcon="local_fire_department"
                title="Más vendidos de la semana"
              />
            </Reveal>
          }
        >
          {BEST_SELLERS.map((product) => (
            <div
              key={product.id}
              className="snap-item min-w-[250px] w-[250px] sm:min-w-[260px] sm:w-[260px] shrink-0"
            >
              <ProductCard product={product} variant="compact" className="h-full" />
            </div>
          ))}
        </ScrollCarousel>
      </section>

      {/* --------------------------- BRAND MARQUEE ------------------------ */}
      <section>
        <Reveal from="up">
          <p className="text-center font-label-sm text-label-sm text-outline uppercase tracking-[0.2em] font-bold mb-space-md">
            Trabajamos con las primeras marcas del rubro
          </p>
        </Reveal>
        <Marquee speed={34}>
          {BRAND_LOGOS.map((brand) => (
            <div
              key={brand.id}
              className="mx-space-sm px-space-lg py-space-md rounded-2xl bg-surface-container-lowest/80 border border-slate-100 flex items-center gap-space-sm shrink-0 hover:border-primary-fixed-dim hover:-translate-y-1 transition-all duration-300"
            >
              <span className="w-10 h-10 rounded-full bg-primary-fixed/60 flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[20px]">{brand.icon}</span>
              </span>
              <div className="whitespace-nowrap">
                <p className="font-label-lg text-label-lg text-on-surface font-extrabold leading-none">
                  {brand.name}
                </p>
                <p className="font-label-sm text-label-sm text-outline">{brand.tagline}</p>
              </div>
            </div>
          ))}
        </Marquee>
      </section>

      {/* ----------------------------- OFFERS ----------------------------- */}
      {ON_SALE.length > 0 && (
        <section>
          <ScrollCarousel
            label="Ofertas de la semana"
            header={
              <Reveal from="up">
                <SectionHead
                  eyebrow="Precios rebajados"
                  eyebrowIcon="sell"
                  title="Ofertas de la semana"
                />
              </Reveal>
            }
          >
            {ON_SALE.map((product) => (
              <div
                key={product.id}
                className="snap-item min-w-[250px] w-[250px] sm:min-w-[260px] sm:w-[260px] shrink-0"
              >
                <ProductCard product={product} variant="compact" className="h-full" />
              </div>
            ))}
          </ScrollCarousel>
        </section>
      )}

      {/* ------------------------- CANJE / REFILL ------------------------- */}
      <section
        id="plan-canje"
        className="relative w-full rounded-3xl bg-gradient-to-r from-secondary-fixed/30 via-surface-container-lowest/90 to-primary-fixed/30 p-space-lg md:p-space-xl backdrop-blur-2xl clay-card border border-white overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="absolute -top-20 right-1/4 w-72 h-72 rounded-full bg-white/40 blur-3xl animate-drift pointer-events-none"
        />

        <div className="relative max-w-4xl mx-auto space-y-space-lg">
          <Reveal from="up" className="text-center space-y-space-xs">
            <>
              <div className="inline-flex items-center gap-space-xs px-space-md py-1 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm font-bold uppercase tracking-wider shadow-sm">
                <span className="material-symbols-outlined text-[16px]">compost</span>
                Economía circular & ahorro real
              </div>
              <h2 className="font-headline-lg text-2xl md:text-headline-lg text-primary tracking-tight font-extrabold">
                Líquidos sueltos: traé tu envase o llevate bidón nuevo
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
                El 40% del costo de un producto de limpieza envasado de supermercado
                corresponde al plástico, etiquetado y marketing. En Detersur pagás el químico
                activo puro.
              </p>
            </>
          </Reveal>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
            {CANJE_STEPS.map((step, index) => (
              <Reveal key={step.step} from="up" delay={index * 110}>
                <div className="group h-full p-space-md rounded-2xl bg-surface-container-lowest/90 clay-card flex flex-col items-center text-center border border-white hover:-translate-y-1.5 transition-transform duration-300">
                  <div
                    className={`relative w-14 h-14 rounded-full flex items-center justify-center font-headline-md font-black mb-space-sm shadow-sm ${
                      step.tone === 'primary'
                        ? 'bg-primary-fixed text-primary'
                        : step.tone === 'secondary'
                          ? 'bg-secondary-fixed text-on-secondary-container'
                          : 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[26px] transition-transform duration-400 group-hover:scale-0 group-hover:rotate-90">
                      {step.icon}
                    </span>
                    <span className="absolute inset-0 flex items-center justify-center text-xl scale-0 rotate-[-90deg] transition-transform duration-400 group-hover:scale-100 group-hover:rotate-0">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1 font-bold">
                    {step.title}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Price comparison with animated bars */}
          <Reveal from="up">
            <div className="rounded-2xl bg-surface-container-lowest/90 clay-card border border-slate-100 overflow-hidden">
              <div className="p-space-sm px-space-md bg-surface-container-low flex flex-wrap items-center justify-between gap-space-xs border-b border-slate-200/60">
                <span className="font-label-md text-label-md text-primary font-bold">
                  Comparativa de valor por litro (ARS)
                </span>
                <span className="font-label-sm text-label-sm text-secondary font-extrabold">
                  Ahorro promedio: 44%
                </span>
              </div>

              <div className="divide-y divide-surface-container-low">
                {PRICE_COMPARISON.map((row, index) => {
                  const saving = Math.round(((row.retail - row.detersur) / row.retail) * 100);
                  const ratio = (row.detersur / row.retail) * 100;
                  const active = comparisonHover === row.product;

                  return (
                    <div
                      key={row.product}
                      onMouseEnter={() => setComparisonHover(row.product)}
                      onMouseLeave={() => setComparisonHover(null)}
                      onClick={() =>
                        row.productId &&
                        navigate({ view: 'product-detail', productId: row.productId })
                      }
                      className={`p-space-md transition-colors ${
                        row.productId ? 'cursor-pointer' : ''
                      } ${active ? 'bg-surface-container-low/60' : ''}`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-space-xs mb-space-xs">
                        <span className="font-label-lg text-label-lg text-on-surface font-bold">
                          {row.product}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-secondary-fixed/50 text-on-secondary-fixed-variant font-label-sm text-label-sm font-black">
                          {saving}% OFF
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-space-sm">
                          <span className="w-20 shrink-0 font-label-sm text-label-sm text-primary font-bold">
                            Detersur
                          </span>
                          <div className="flex-1 h-5 rounded-full bg-surface-container-low overflow-hidden">
                            <Reveal from="none" delay={index * 80}>
                              <div
                                className="h-5 rounded-full bg-gradient-to-r from-primary to-primary-container flex items-center justify-end px-2 transition-[width] duration-1000 ease-out"
                                style={{ width: `${ratio}%` }}
                              >
                                <span className="font-label-sm text-label-sm text-white font-black whitespace-nowrap">
                                  {formatUnitPrice(row.detersur)}
                                </span>
                              </div>
                            </Reveal>
                          </div>
                        </div>

                        <div className="flex items-center gap-space-sm">
                          <span className="w-20 shrink-0 font-label-sm text-label-sm text-outline font-semibold">
                            Supermercado
                          </span>
                          <div className="flex-1 h-5 rounded-full bg-surface-container-low overflow-hidden">
                            <div className="h-5 w-full rounded-full bg-outline-variant/70 flex items-center justify-end px-2">
                              <span className="font-label-sm text-label-sm text-on-surface-variant font-bold whitespace-nowrap">
                                {formatUnitPrice(row.retail)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>

          <Reveal from="up" className="flex justify-center">
            <button
              onClick={() => navigate({ view: 'catalog', category: 'sueltos' })}
              className="shine px-space-xl py-space-md rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-bold clay-button-primary hover:scale-105 active:scale-95 transition-all flex items-center gap-space-xs"
            >
              <span className="material-symbols-outlined text-[20px] relative z-[2]">
                calculate
              </span>
              <span className="relative z-[2]">Armar pedido de recarga suelta</span>
            </button>
          </Reveal>
        </div>
      </section>

      {/* ------------------------- REFILLABLE RAIL ------------------------ */}
      <section>
        <ScrollCarousel
          label="Productos recargables"
          header={
            <Reveal from="up">
              <SectionHead
                eyebrow="Traé tu envase"
                eyebrowIcon="recycling"
                title="Línea recargable suelta"
              />
            </Reveal>
          }
        >
          {REFILLABLE.map((product) => (
            <div
              key={product.id}
              className="snap-item min-w-[250px] w-[250px] sm:min-w-[260px] sm:w-[260px] shrink-0"
            >
              <ProductCard product={product} variant="compact" className="h-full" />
            </div>
          ))}
        </ScrollCarousel>
      </section>

      {/* --------------------------- WHOLESALE ---------------------------- */}
      <Reveal from="up">
        <section className="w-full rounded-3xl bg-gradient-to-r from-tertiary-fixed/60 via-surface-container-lowest to-secondary-fixed/50 p-space-lg md:p-space-xl clay-card border border-white">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-space-lg items-center">
            <div className="md:col-span-8 space-y-space-sm">
              <div className="inline-flex items-center gap-1 text-tertiary font-label-sm text-label-sm uppercase font-extrabold tracking-wider">
                <span className="material-symbols-outlined text-[18px]">apartment</span>
                Consorcios, colegios, fábricas y lavaderos
              </div>
              <h2 className="font-headline-lg text-2xl md:text-headline-lg text-on-surface tracking-tight font-extrabold">
                Canal mayorista directo: descuentos escalonados por bulto cerrado
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Emitimos factura A y B con CUIT en el acto. Envíos programados con flota propia
                en tambores de 200 L o pallets de bidones de 5 L.
              </p>
              <div className="flex flex-wrap gap-space-sm pt-space-xs">
                {WHOLESALE_TIERS.map((tier) => (
                  <span
                    key={tier.minUnits}
                    className="px-space-md py-1.5 rounded-full bg-surface-container-lowest text-primary font-label-md text-label-md font-bold shadow-sm hover:scale-105 transition-transform"
                  >
                    {tier.label}
                  </span>
                ))}
                <span className="px-space-md py-1.5 rounded-full bg-surface-container-lowest text-secondary font-label-md text-label-md font-bold shadow-sm">
                  Tambor 200L: cotización especial
                </span>
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col items-center md:items-end">
              <a
                href={CONTACT.whatsappB2B}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-space-xl py-space-md rounded-full bg-tertiary text-on-tertiary font-label-lg text-label-lg font-bold shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_12px_24px_rgba(101,79,126,0.35)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-space-xs"
              >
                <span className="material-symbols-outlined text-[20px]">support_agent</span>
                Hablar con un asesor B2B
              </a>
              <span className="font-label-sm text-label-sm text-on-surface-variant mt-2">
                Respuesta promedio: 15 minutos
              </span>
            </div>
          </div>
        </section>
      </Reveal>

      {/* --------------------------- NEW ARRIVALS ------------------------- */}
      {NEW_ARRIVALS.length > 0 && (
        <section>
          <Reveal from="up" className="mb-space-md">
            <SectionHead
              eyebrow="Recién llegados"
              eyebrowIcon="auto_awesome"
              title="Novedades en el catálogo"
            />
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
            {NEW_ARRIVALS.map((product, index) => (
              <Reveal key={product.id} from="up" delay={index * 80}>
                <ProductCard product={product} className="h-full" />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* -------------------------- TESTIMONIALS -------------------------- */}
      <section>
        <Reveal from="up" className="text-center mb-space-lg">
          <>
            <div className="inline-flex items-center gap-1 font-label-sm text-label-sm text-secondary uppercase font-extrabold tracking-widest">
              <span className="material-symbols-outlined text-[16px]">reviews</span>
              Lo que dicen nuestros clientes
            </div>
            <h2 className="font-headline-lg text-2xl md:text-headline-lg text-primary tracking-tight font-extrabold">
              +4.800 pedidos entregados en Zona Sur
            </h2>
          </>
        </Reveal>

        <div className="max-w-3xl mx-auto">
          <SlideCarousel
            items={TESTIMONIALS}
            label="Testimonios de clientes"
            variant="fade"
            autoPlayMs={6000}
            renderSlide={(testimonial) => <TestimonialCard testimonial={testimonial} />}
          />
        </div>
      </section>

      {/* ------------------------------ FAQ ------------------------------ */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        <div className="lg:col-span-4">
          <Reveal from="up">
            <div className="lg:sticky lg:top-32 space-y-space-sm">
              <SectionHead
                eyebrow="Dudas frecuentes"
                eyebrowIcon="help"
                title="Todo lo que suelen preguntarnos"
              />
              <p className="font-body-md text-body-md text-on-surface-variant">
                Si tu caso no está acá, escribinos por WhatsApp y te contesta una persona del
                mostrador, no un bot.
              </p>
              <a
                href={CONTACT.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-space-xs px-space-lg py-space-sm rounded-full bg-secondary text-on-secondary font-label-md text-label-md font-bold clay-button-secondary hover:scale-105 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                Escribir por WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
        <div className="lg:col-span-8">
          <FaqAccordion />
        </div>
      </section>

      {/* ---------------------------- BRANCHES --------------------------- */}
      <section>
        <Reveal from="up" className="mb-space-md">
          <SectionHead
            eyebrow="Retiro sin cargo"
            eyebrowIcon="storefront"
            title="Tres sucursales en Zona Sur"
          />
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
          {STORE_BRANCHES.map((branch, index) => (
            <Reveal key={branch.id} from="up" delay={index * 90}>
              <div className="group h-full p-space-lg rounded-3xl bg-surface-container-lowest clay-card border border-slate-100 hover:clay-card-lifted hover:-translate-y-1.5 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary mb-space-sm transition-transform duration-400 group-hover:scale-110 group-hover:rotate-6">
                  <span className="material-symbols-outlined text-[24px]">store</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  {branch.name}
                </h3>
                <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                  {branch.address}
                </p>
                <p className="mt-space-xs font-label-md text-label-md text-primary font-bold">
                  {branch.hours}
                </p>
                <a
                  href={`tel:${branch.phone.replace(/\s|-/g, '')}`}
                  className="mt-space-xs inline-flex items-center gap-1 font-label-md text-label-md text-secondary font-bold hover:underline"
                >
                  <span className="material-symbols-outlined text-[16px]">call</span>
                  {branch.phone}
                </a>
                <div className="mt-space-sm flex flex-wrap gap-1.5">
                  {branch.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* --------------------------- TRUST BADGES ------------------------ */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
        {TRUST_BADGES.map((badge, index) => (
          <Reveal key={badge.id} from="up" delay={index * 80}>
            <div className="h-full p-space-md rounded-2xl bg-surface-container-lowest/80 backdrop-blur-md clay-card flex items-center gap-space-sm border border-slate-100">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                  badge.tone === 'secondary'
                    ? 'bg-secondary-fixed text-on-secondary-container'
                    : badge.tone === 'primary'
                      ? 'bg-primary-fixed text-primary'
                      : 'bg-tertiary-fixed text-tertiary'
                }`}
              >
                <span className="material-symbols-outlined text-[24px]">{badge.icon}</span>
              </div>
              <div>
                <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  {badge.title}
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{badge.body}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </section>

      {/* ---------------------- FLOATING MINI CART ----------------------- */}
      {cartCount > 0 && (
        <aside className="fixed bottom-24 md:bottom-6 right-space-md md:right-margin-desktop z-40 animate-slide-in-right">
          <div className="px-space-md py-space-sm rounded-full glass-panel shadow-[0_20px_40px_-10px_rgba(9,27,56,0.25)] flex items-center gap-space-md">
            <div className="flex items-center gap-space-sm">
              <div className="relative w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm flex items-center justify-center font-black shadow-sm">
                  {cartCount}
                </span>
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="font-label-sm text-label-sm text-outline uppercase font-semibold leading-none">
                  Total
                </span>
                <span className="font-label-lg text-label-lg text-primary font-black leading-tight">
                  {formatPrice(totals.total)}
                </span>
              </div>
            </div>
            <button
              onClick={openDrawer}
              className="px-space-md py-2 rounded-full bg-secondary-container text-on-secondary-container font-label-md text-label-md font-bold clay-button-secondary hover:scale-105 active:scale-95 transition-all flex items-center gap-1"
            >
              Ver carrito
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </aside>
      )}
    </div>
  );
};
