import React, { useEffect, useMemo, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { BRANDS, PRODUCTS } from '../data/products';
import { CATEGORY_LABELS, WHOLESALE_TIERS } from '../data/content';
import { CategoryId, Product, SortKey, ViewMode } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Reveal } from '../components/Reveal';
import { Marquee } from '../components/Carousel';
import { useClickOutside, useDebounced } from '../hooks';
import { formatPrice, normalize } from '../lib/format';

const SORT_OPTIONS: { id: SortKey; label: string; icon: string }[] = [
  { id: 'relevant', label: 'Más relevantes', icon: 'auto_awesome' },
  { id: 'price-asc', label: 'Menor precio', icon: 'trending_down' },
  { id: 'price-desc', label: 'Mayor precio', icon: 'trending_up' },
  { id: 'rating', label: 'Mejor puntuados', icon: 'star' },
  { id: 'newest', label: 'Novedades', icon: 'fiber_new' },
  { id: 'name', label: 'Nombre A-Z', icon: 'sort_by_alpha' },
];

const PRICE_CEILING = Math.max(...PRODUCTS.map((p) => p.price));

interface Filters {
  category: CategoryId;
  brand: string;
  sort: SortKey;
  maxPrice: number;
  onlyRefillable: boolean;
  onlyBulk: boolean;
  onlyOffers: boolean;
  onlyWishlist: boolean;
}

const DEFAULT_FILTERS: Filters = {
  category: 'ALL',
  brand: 'ALL',
  sort: 'relevant',
  maxPrice: PRICE_CEILING,
  onlyRefillable: false,
  onlyBulk: false,
  onlyOffers: false,
  onlyWishlist: false,
};

/* ------------------------------------------------------------------ */
/* Dropdown                                                            */
/* ------------------------------------------------------------------ */
const Dropdown: React.FC<{
  label: string;
  value: string;
  icon: string;
  children: (close: () => void) => React.ReactNode;
}> = ({ label, value, icon, children }) => {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false), open);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="h-11 px-space-sm sm:px-space-md rounded-full bg-surface-container-low text-on-surface-variant font-label-md text-label-md font-bold flex items-center gap-1.5 hover:bg-surface-container transition-colors whitespace-nowrap"
      >
        <span className="material-symbols-outlined text-[18px] text-primary">{icon}</span>
        <span className="hidden sm:inline text-outline">{label}:</span>
        <span className="text-on-surface max-w-[120px] truncate">{value}</span>
        <span
          className={`material-symbols-outlined text-[18px] transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        >
          expand_more
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-60 max-h-80 overflow-y-auto pretty-scroll p-space-xs rounded-2xl glass-panel shadow-[0_28px_56px_-12px_rgba(9,27,56,0.28)] z-40 animate-fade-down">
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
};

const DropdownItem: React.FC<{
  active: boolean;
  onClick: () => void;
  icon?: string;
  children: React.ReactNode;
}> = ({ active, onClick, icon, children }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-space-sm py-2 rounded-xl font-label-md text-label-md flex items-center gap-2 transition-colors ${
      active
        ? 'bg-primary-container text-on-primary font-bold'
        : 'text-on-surface-variant hover:bg-surface-container-low'
    }`}
  >
    {icon && <span className="material-symbols-outlined text-[17px]">{icon}</span>}
    {children}
  </button>
);

/* ------------------------------------------------------------------ */
/* Skeleton card                                                       */
/* ------------------------------------------------------------------ */
const SkeletonCard: React.FC = () => (
  <div className="rounded-3xl bg-surface-container-lowest border border-slate-100 overflow-hidden">
    <div className="h-44 skeleton" />
    <div className="p-space-md space-y-space-sm">
      <div className="h-3 w-1/3 rounded-full skeleton" />
      <div className="h-4 w-full rounded-full skeleton" />
      <div className="h-4 w-2/3 rounded-full skeleton" />
      <div className="h-8 w-1/2 rounded-full skeleton mt-space-md" />
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Catalog                                                             */
/* ------------------------------------------------------------------ */
export const CatalogView: React.FC = () => {
  const {
    navigate,
    searchQuery,
    setSearchQuery,
    catalogCategory,
    setCatalogCategory,
    wishlist,
    totals,
    openDrawer,
    cartCount,
  } = useStore();

  const [filters, setFilters] = useState<Filters>({
    ...DEFAULT_FILTERS,
    category: catalogCategory,
  });
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [visibleCount, setVisibleCount] = useState(12);
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useDebounced(searchQuery, 200);

  // The header and the mega menu both drive the category, so mirror it in.
  useEffect(() => {
    setFilters((prev) =>
      prev.category === catalogCategory ? prev : { ...prev, category: catalogCategory }
    );
  }, [catalogCategory]);

  // Brief skeleton pass whenever the result set changes, so the grid swap reads
  // as a load rather than a flicker.
  useEffect(() => {
    setLoading(true);
    setVisibleCount(12);
    const timer = window.setTimeout(() => setLoading(false), 280);
    return () => window.clearTimeout(timer);
  }, [debouncedQuery, filters]);

  const setFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    if (key === 'category') setCatalogCategory(value as CategoryId);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setCatalogCategory('ALL');
    setSearchQuery('');
    navigate({ view: 'catalog', category: 'ALL' });
  };

  const results = useMemo(() => {
    const q = normalize(debouncedQuery);

    const filtered = PRODUCTS.filter((product) => {
      if (filters.category !== 'ALL' && product.category !== filters.category) return false;
      if (filters.brand !== 'ALL' && product.brand !== filters.brand) return false;
      if (product.price > filters.maxPrice) return false;
      if (filters.onlyBulk && !product.isBulk) return false;
      if (filters.onlyOffers && !product.listPrice) return false;
      if (filters.onlyWishlist && !wishlist.includes(product.id)) return false;
      if (filters.onlyRefillable && !product.presentations?.some((p) => p.isEco)) return false;

      if (q.length >= 2) {
        const haystack = normalize(
          `${product.name} ${product.brand} ${product.description} ${product.packageType} ${product.tags?.join(' ') ?? ''} ${product.presentations?.map((p) => p.title).join(' ') ?? ''}`
        );
        if (!haystack.includes(q)) return false;
      }

      return true;
    });

    const sorted = [...filtered];
    switch (filters.sort) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name, 'es'));
        break;
      case 'newest':
        sorted.sort((a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)));
        break;
      default:
        // Relevance: best sellers and discounted items first.
        sorted.sort(
          (a, b) =>
            (b.rating ?? 0) * 10 +
            (b.listPrice ? 5 : 0) -
            ((a.rating ?? 0) * 10 + (a.listPrice ? 5 : 0))
        );
    }

    return sorted;
  }, [debouncedQuery, filters, wishlist]);

  const visible = results.slice(0, visibleCount);
  const activeFilterCount =
    (filters.category !== 'ALL' ? 1 : 0) +
    (filters.brand !== 'ALL' ? 1 : 0) +
    (filters.maxPrice < PRICE_CEILING ? 1 : 0) +
    (filters.onlyRefillable ? 1 : 0) +
    (filters.onlyBulk ? 1 : 0) +
    (filters.onlyOffers ? 1 : 0) +
    (filters.onlyWishlist ? 1 : 0) +
    (debouncedQuery.trim() ? 1 : 0);

  const categoryLabel =
    CATEGORY_LABELS.find((c) => c.id === filters.category)?.label ?? 'Todos';

  return (
    <div className="flex flex-col w-full gap-space-lg">
      {/* Breadcrumb */}
      <Reveal from="down">
        <nav className="flex items-center gap-1 font-label-md text-label-md text-on-surface-variant">
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
          <span className="text-primary font-bold">Catálogo</span>
          {filters.category !== 'ALL' && (
            <>
              <span className="material-symbols-outlined text-[16px] text-outline-variant">
                chevron_right
              </span>
              <span className="text-on-surface font-semibold">{categoryLabel}</span>
            </>
          )}
        </nav>
      </Reveal>

      {/* Announcement marquee */}
      <Reveal from="down">
        <div className="rounded-2xl bg-gradient-to-r from-primary-fixed/50 via-surface-container-lowest to-secondary-fixed/40 border border-white py-space-sm overflow-hidden">
          <Marquee speed={28}>
            {[
              { icon: 'local_shipping', text: 'Envío gratis desde $25.000 en CABA y GBA Sur' },
              { icon: 'recycling', text: 'Plan Canje: traé tu envase y ahorrá hasta 40%' },
              { icon: 'inventory', text: '+10 unidades 15% OFF · +30 unidades 25% OFF' },
              { icon: 'receipt_long', text: 'Factura A y B con CUIT en el acto' },
              { icon: 'verified_user', text: 'Fórmulas certificadas ANMAT y RNPA' },
            ].map((item, index) => (
              <span
                key={index}
                className="mx-space-lg inline-flex items-center gap-space-xs font-label-md text-label-md text-on-primary-fixed-variant font-bold whitespace-nowrap shrink-0"
              >
                <span className="material-symbols-outlined text-[17px] text-primary">
                  {item.icon}
                </span>
                {item.text}
              </span>
            ))}
          </Marquee>
        </div>
      </Reveal>

      {/* Sticky filter bar */}
      <div className="sticky top-[86px] md:top-[104px] z-30 -mx-space-xs px-space-xs py-space-sm rounded-3xl glass-panel shadow-[0_18px_36px_-12px_rgba(9,27,56,0.14)]">
        <div className="flex flex-col gap-space-sm">
          {/* Row 1: search + dropdowns */}
          <div className="flex flex-wrap items-center gap-space-sm px-space-sm">
            <div className="w-full sm:flex-1 order-1 min-w-0 flex items-center gap-space-xs px-space-md h-11 rounded-full bg-surface-container-low focus-within:bg-white focus-within:shadow-[0_0_0_2px_var(--color-primary-container)] transition-all">
              <span className="material-symbols-outlined text-outline text-[20px] shrink-0">
                search
              </span>
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Filtrar dentro del catálogo…"
                aria-label="Filtrar productos"
                className="w-full bg-transparent font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none [&::-webkit-search-cancel-button]:hidden"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Limpiar"
                  className="text-outline hover:text-on-surface shrink-0"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>

            <div className="order-2 flex items-center gap-space-sm flex-1 sm:flex-initial min-w-0">
            <Dropdown
              label="Marca"
              icon="storefront"
              value={filters.brand === 'ALL' ? 'Todas' : filters.brand}
            >
              {(close) => (
                <>
                  <DropdownItem
                    active={filters.brand === 'ALL'}
                    onClick={() => {
                      setFilter('brand', 'ALL');
                      close();
                    }}
                  >
                    Todas las marcas
                  </DropdownItem>
                  {BRANDS.map((brand) => (
                    <DropdownItem
                      key={brand}
                      active={filters.brand === brand}
                      onClick={() => {
                        setFilter('brand', brand);
                        close();
                      }}
                    >
                      {brand}
                    </DropdownItem>
                  ))}
                </>
              )}
            </Dropdown>

            <Dropdown
              label="Orden"
              icon="sort"
              value={SORT_OPTIONS.find((o) => o.id === filters.sort)?.label ?? ''}
            >
              {(close) => (
                <>
                  {SORT_OPTIONS.map((option) => (
                    <DropdownItem
                      key={option.id}
                      icon={option.icon}
                      active={filters.sort === option.id}
                      onClick={() => {
                        setFilter('sort', option.id);
                        close();
                      }}
                    >
                      {option.label}
                    </DropdownItem>
                  ))}
                </>
              )}
            </Dropdown>

            </div>

            {/* Grid / list toggle */}
            <div className="order-3 hidden sm:flex items-center bg-surface-container-low rounded-full p-1 h-11 shrink-0">
              {(['grid', 'list'] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  aria-label={mode === 'grid' ? 'Vista en grilla' : 'Vista en lista'}
                  aria-pressed={viewMode === mode}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    viewMode === mode
                      ? 'bg-primary-container text-on-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[19px]">
                    {mode === 'grid' ? 'grid_view' : 'view_list'}
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={openDrawer}
              aria-label="Abrir carrito"
              className="order-4 relative h-11 w-11 shrink-0 rounded-full bg-primary-container text-on-primary flex items-center justify-center clay-button-primary active:scale-90 transition-transform"
            >
              <span className="material-symbols-outlined text-[21px]">shopping_bag</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[19px] h-[19px] px-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-[10px] flex items-center justify-center font-black">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Row 2: category chips */}
          <div className="flex items-center gap-space-xs overflow-x-auto no-scrollbar px-space-sm pb-0.5">
            {CATEGORY_LABELS.map((category) => {
              const active = filters.category === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setFilter('category', category.id)}
                  className={`shrink-0 px-space-md h-9 rounded-full font-label-md text-label-md font-bold flex items-center gap-1.5 transition-all duration-300 ${
                    active
                      ? 'bg-primary-container text-on-primary clay-button-primary scale-105'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px]">{category.icon}</span>
                  {category.label}
                </button>
              );
            })}
          </div>

          {/* Row 3: toggles + price */}
          <div className="flex flex-wrap items-center gap-space-sm px-space-sm">
            {(
              [
                { key: 'onlyRefillable' as const, label: 'Recargables', icon: 'recycling' },
                { key: 'onlyBulk' as const, label: 'Por mayor', icon: 'inventory' },
                { key: 'onlyOffers' as const, label: 'En oferta', icon: 'sell' },
                {
                  key: 'onlyWishlist' as const,
                  label: `Favoritos${wishlist.length ? ` (${wishlist.length})` : ''}`,
                  icon: 'favorite',
                },
              ]
            ).map((toggle) => {
              const active = filters[toggle.key];
              return (
                <button
                  key={toggle.key}
                  onClick={() => setFilter(toggle.key, !active)}
                  aria-pressed={active}
                  className={`px-space-md h-8 rounded-full font-label-md text-label-md font-bold flex items-center gap-1 transition-all ${
                    active
                      ? 'bg-secondary text-on-secondary shadow-sm'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">{toggle.icon}</span>
                  {toggle.label}
                </button>
              );
            })}

            {/* Price slider */}
            <div className="flex items-center gap-space-sm w-full sm:w-auto sm:ml-auto">
              <label
                htmlFor="price-range"
                className="font-label-md text-label-md text-on-surface-variant font-semibold whitespace-nowrap"
              >
                Hasta{' '}
                <span className="text-primary font-extrabold">
                  {formatPrice(filters.maxPrice)}
                </span>
              </label>
              <input
                id="price-range"
                type="range"
                min={1000}
                max={PRICE_CEILING}
                step={500}
                value={filters.maxPrice}
                onChange={(event) => setFilter('maxPrice', Number(event.target.value))}
                className="w-32 md:w-44 accent-[var(--color-primary-container)] cursor-pointer"
              />
            </div>

            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="px-space-md h-8 rounded-full bg-error-container text-on-error-container font-label-md text-label-md font-bold flex items-center gap-1 hover:scale-105 active:scale-95 transition-all animate-pop"
              >
                <span className="material-symbols-outlined text-[15px]">filter_alt_off</span>
                Limpiar ({activeFilterCount})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main grid + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        {/* Sidebar */}
        <aside className="lg:col-span-3 space-y-space-md order-2 lg:order-1">
          {/* Refill station */}
          <Reveal from="up">
            <div className="p-space-md rounded-3xl bg-gradient-to-br from-secondary-fixed/50 to-primary-fixed/30 clay-card border border-white">
              <div className="flex items-center gap-space-sm mb-space-sm">
                <span className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">recycling</span>
                </span>
                <h3 className="font-headline-sm text-headline-sm text-primary font-extrabold">
                  Eco-Estación de recarga
                </h3>
              </div>

              {/* SVG donut */}
              <div className="flex items-center gap-space-md">
                <svg viewBox="0 0 100 100" className="w-24 h-24 shrink-0 -rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="rgba(255,255,255,0.65)"
                    strokeWidth="13"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="var(--color-secondary)"
                    strokeWidth="13"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 38}
                    strokeDashoffset={2 * Math.PI * 38 * 0.59}
                    style={{ '--draw-length': 2 * Math.PI * 38 } as React.CSSProperties}
                    className="animate-draw"
                  />
                  <text
                    x="50"
                    y="50"
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="rotate-90 origin-center fill-primary font-black"
                    style={{ fontSize: 22 }}
                  >
                    41%
                  </text>
                </svg>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Es lo que ahorrás en promedio recargando tu envase en lugar de comprar
                  envasado de supermercado.
                </p>
              </div>

              <button
                onClick={() => setFilter('onlyRefillable', true)}
                className="w-full mt-space-sm py-2.5 rounded-full bg-secondary text-on-secondary font-label-md text-label-md font-bold clay-button-secondary hover:scale-[1.02] active:scale-95 transition-all"
              >
                Ver sólo recargables
              </button>
            </div>
          </Reveal>

          {/* Wholesale ladder */}
          <Reveal from="up" delay={80}>
            <div className="p-space-md rounded-3xl bg-surface-container-lowest clay-card border border-slate-100">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-space-sm flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[19px] text-tertiary">
                  inventory
                </span>
                Escala mayorista
              </h3>

              <div className="space-y-space-sm">
                {WHOLESALE_TIERS.map((tier) => {
                  const reached = totals.totalUnits >= tier.minUnits;
                  const progress = Math.min(1, totals.totalUnits / tier.minUnits);

                  return (
                    <div key={tier.minUnits}>
                      <div className="flex items-center justify-between font-label-md text-label-md mb-1">
                        <span
                          className={`font-bold ${reached ? 'text-secondary' : 'text-on-surface-variant'}`}
                        >
                          {reached && (
                            <span className="material-symbols-outlined text-[14px] mr-0.5 fill-icon">
                              check_circle
                            </span>
                          )}
                          +{tier.minUnits} unidades
                        </span>
                        <span className="text-primary font-extrabold">
                          {Math.round(tier.rate * 100)}% OFF
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-surface-container-high overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-[width] duration-700 ease-out ${
                            reached
                              ? 'bg-gradient-to-r from-secondary to-secondary-fixed-dim'
                              : 'bg-primary-container'
                          }`}
                          style={{ width: `${Math.max(3, progress * 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="mt-space-sm font-label-sm text-label-sm text-outline">
                Tenés {totals.totalUnits} unidad{totals.totalUnits === 1 ? '' : 'es'} en el
                carrito. El descuento se aplica solo al llegar al escalón.
              </p>
            </div>
          </Reveal>

          {/* Delivery note */}
          <Reveal from="up" delay={160}>
            <div className="p-space-md rounded-3xl bg-primary-fixed/40 border border-white">
              <p className="font-label-md text-label-md text-on-primary-fixed-variant font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-primary">
                  local_shipping
                </span>
                Cobertura de entrega
              </p>
              <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                Express en el día para CABA y GBA Sur con pedidos antes de las 14 hs. Resto de
                GBA a 48/72 hs. Retiro sin cargo en tres sucursales.
              </p>
            </div>
          </Reveal>
        </aside>

        {/* Results */}
        <div className="lg:col-span-9 order-1 lg:order-2">
          {/* Count header */}
          <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-md">
            <p className="font-body-md text-body-md text-on-surface-variant">
              <span className="font-headline-md text-headline-md text-primary font-extrabold">
                {results.length}
              </span>{' '}
              producto{results.length === 1 ? '' : 's'}
              {debouncedQuery.trim() && (
                <>
                  {' '}
                  para <strong className="text-on-surface">“{debouncedQuery.trim()}”</strong>
                </>
              )}
              {filters.category !== 'ALL' && (
                <>
                  {' '}
                  en <strong className="text-on-surface">{categoryLabel}</strong>
                </>
              )}
            </p>
            {visible.length < results.length && (
              <span className="font-label-md text-label-md text-outline">
                Mostrando {visible.length} de {results.length}
              </span>
            )}
          </div>

          {/* Grid */}
          {loading ? (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-space-md'
                  : 'space-y-space-md'
              }
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="py-space-2xl flex flex-col items-center text-center">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <span className="absolute inset-0 rounded-full bg-primary-fixed/40 animate-ripple" />
                <span className="material-symbols-outlined text-[60px] text-primary-fixed-dim animate-bob">
                  search_off
                </span>
              </div>
              <h3 className="mt-space-md font-headline-md text-headline-md text-on-surface font-extrabold">
                No encontramos productos con esos filtros
              </h3>
              <p className="mt-1 font-body-md text-body-md text-on-surface-variant max-w-md">
                Probá ampliar el rango de precio, quitar la marca o buscar con otra palabra.
              </p>
              <button
                onClick={resetFilters}
                className="mt-space-md px-space-xl py-3 rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg font-bold clay-button-primary hover:scale-105 active:scale-95 transition-all"
              >
                Limpiar todos los filtros
              </button>
            </div>
          ) : (
            <>
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-space-md'
                    : 'space-y-space-md'
                }
              >
                {visible.map((product: Product, index) => (
                  <Reveal
                    key={product.id}
                    from="up"
                    delay={Math.min(index, 8) * 55}
                    className="h-full"
                  >
                    <ProductCard
                      product={product}
                      variant={viewMode === 'list' ? 'list' : 'default'}
                      className="h-full"
                    />
                  </Reveal>
                ))}
              </div>

              {visible.length < results.length && (
                <div className="mt-space-xl flex justify-center">
                  <button
                    onClick={() => setVisibleCount((count) => count + 9)}
                    className="px-space-xl py-3 rounded-full bg-surface-container-lowest text-primary font-label-lg text-label-lg font-bold clay-card border border-slate-100 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-space-xs"
                  >
                    <span className="material-symbols-outlined text-[20px]">expand_more</span>
                    Ver más productos ({results.length - visible.length} restantes)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
