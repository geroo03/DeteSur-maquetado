import React, { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';
import { BrandId, CategoryId, Product } from '../types';

interface CatalogViewProps {
  initialCategory?: CategoryId;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  initialCategory = 'ALL',
  searchQuery = '',
  setSearchQuery,
}) => {
  const { addToCart, navigateTo, openDrawer, cartCount } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState<BrandId>('ALL');
  const [sortBy, setSortBy] = useState<string>('relevant');
  const [localSearch, setLocalSearch] = useState<string>(searchQuery);

  const categories: { id: CategoryId; label: string }[] = [
    { id: 'ALL', label: 'Todos (10)' },
    { id: 'sueltos', label: 'Químicos Sueltos (Bidones)' },
    { id: 'ropa', label: 'Cuidado de Ropa' },
    { id: 'pisos', label: 'Desinfectantes & Pisos' },
    { id: 'cocina', label: 'Desengrasantes Cocina' },
    { id: 'piscinas', label: 'Línea Piscinas' },
    { id: 'papeleria', label: 'Papelería & Rollos' },
    { id: 'accesorios', label: 'Accesorios & Mopas' },
  ];

  const filteredProducts = useMemo(() => {
    let list = PRODUCTS.filter((p) => {
      const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
      const matchesBrand = selectedBrand === 'ALL' || p.brand === selectedBrand;
      const term = localSearch.toLowerCase().trim();
      const matchesSearch =
        !term ||
        p.name.toLowerCase().includes(term) ||
        p.brand.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term);

      return matchesCategory && matchesBrand && matchesSearch;
    });

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'alphabetical') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'bulk-save') {
      list.sort((a, b) => (b.isBulk ? 1 : 0) - (a.isBulk ? 1 : 0));
    }

    return list;
  }, [selectedCategory, selectedBrand, localSearch, sortBy]);

  const resetAllFilters = () => {
    setSelectedCategory('ALL');
    setSelectedBrand('ALL');
    setSortBy('relevant');
    setLocalSearch('');
    if (setSearchQuery) setSearchQuery('');
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Banner (Claymorphic Pill) */}
      <div className="w-full mb-space-md">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-secondary-fixed/40 via-surface-container-low to-primary-fixed/50 p-space-md shadow-[0_12px_28px_-8px_rgba(0,119,182,0.12),inset_0_2px_4px_rgba(255,255,255,0.9)] flex flex-col md:flex-row items-start md:items-center justify-between gap-space-sm border border-white/60">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0 shadow-[0_8px_16px_-4px_rgba(0,106,98,0.35),inset_0_2px_4px_rgba(255,255,255,0.4)]">
              <span className="material-symbols-outlined text-[20px]">local_drink</span>
            </div>
            <div>
              <p className="font-headline-sm text-headline-sm text-on-background leading-snug font-bold">
                Plan Canje Detersur: Traé tu bidón vacío y ahorrá un 25%
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Disponible para Lavandina 55g/L, Jabón Líquido Matic y Desengrasantes sueltos.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-space-xs shrink-0 self-end md:self-auto">
            <span className="px-space-sm py-1 rounded-full bg-surface-container-lowest/80 text-primary font-label-sm text-label-sm shadow-sm font-semibold">
              IVA Incluido (Final)
            </span>
            <span className="px-space-sm py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold shadow-sm">
              3 Cuotas Sin Interés
            </span>
          </div>
        </div>
      </div>

      {/* STICKY FLOATING LIQUID GLASS FILTER & CONTROL BAR */}
      <div className="sticky top-20 z-30 mb-space-lg -mx-margin md:-mx-margin-desktop px-margin md:px-margin-desktop py-space-sm backdrop-blur-2xl bg-surface-container-lowest/70 shadow-[0_16px_32px_-10px_rgba(9,27,56,0.08)] border-y border-white/50">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-space-sm">
          {/* Upper row: Search, Brand dropdown, Sort dropdown, and Cart drawer trigger */}
          <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-space-sm">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <span className="absolute inset-y-0 left-space-md flex items-center pointer-events-none text-primary">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </span>
              <input
                type="text"
                value={localSearch}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  if (setSearchQuery) setSearchQuery(e.target.value);
                }}
                placeholder="Buscar por marca, bidón, amonio, cloro..."
                className="w-full pl-11 pr-space-md py-2.5 rounded-full bg-surface-container-low/90 text-on-surface font-body-sm text-body-sm placeholder:text-outline shadow-[inset_0_2px_4px_rgba(9,27,56,0.05)] focus:bg-white focus:shadow-[0_0_0_2px_#0077b6] transition-all outline-none"
              />
              {localSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setLocalSearch('');
                    if (setSearchQuery) setSearchQuery('');
                  }}
                  className="absolute inset-y-0 right-space-sm px-2 text-outline hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>

            {/* Dropdowns & Cart Drawer Button */}
            <div className="flex items-center gap-space-xs sm:gap-space-sm overflow-x-auto w-full lg:w-auto shrink-0 pb-1 lg:pb-0">
              {/* Brand Selector Dropdown */}
              <div className="relative">
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value as BrandId)}
                  className="appearance-none h-10 pl-space-md pr-9 rounded-full bg-white/90 text-on-surface font-label-md text-label-md shadow-[0_8px_16px_-4px_rgba(9,27,56,0.08),inset_0_2px_4px_rgba(255,255,255,0.9)] cursor-pointer focus:outline-none focus:shadow-[0_0_0_2px_#0077b6] transition-all font-semibold"
                >
                  <option value="ALL">Todas las marcas</option>
                  <option value="Detersur">Detersur Propio</option>
                  <option value="ROMYL">ROMYL</option>
                  <option value="XPER">XPER</option>
                  <option value="SINA">SINA</option>
                  <option value="AQUAMAR">AQUAMAR</option>
                  <option value="Blem">Blem</option>
                  <option value="Ceramicol">Ceramicol</option>
                  <option value="Detersur Papeles">Detersur Papelería</option>
                  <option value="Detersur Pro">Detersur Pro</option>
                </select>
                <span className="material-symbols-outlined absolute right-space-sm top-2.5 pointer-events-none text-outline text-[18px]">
                  expand_more
                </span>
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none h-10 pl-space-md pr-9 rounded-full bg-white/90 text-on-surface font-label-md text-label-md shadow-[0_8px_16px_-4px_rgba(9,27,56,0.08),inset_0_2px_4px_rgba(255,255,255,0.9)] cursor-pointer focus:outline-none focus:shadow-[0_0_0_2px_#0077b6] transition-all font-semibold"
                >
                  <option value="relevant">Más relevantes</option>
                  <option value="price-asc">Menor precio</option>
                  <option value="price-desc">Mayor precio</option>
                  <option value="bulk-save">Mayor ahorro químico</option>
                  <option value="alphabetical">A - Z</option>
                </select>
                <span className="material-symbols-outlined absolute right-space-sm top-2.5 pointer-events-none text-outline text-[18px]">
                  sort
                </span>
              </div>

              {/* Cart Drawer Opener Button */}
              <button
                onClick={openDrawer}
                className="h-10 px-space-md rounded-full bg-primary-container text-on-primary font-label-md text-label-md flex items-center gap-space-xs shadow-[0_12px_24px_-6px_rgba(0,119,182,0.35),inset_0_2px_4px_rgba(255,255,255,0.45)] hover:scale-[1.02] active:scale-95 transition-all font-bold"
              >
                <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                <span className="hidden sm:inline">Tu Carrito</span>
                <span className="w-5 h-5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              </button>
            </div>
          </div>

          {/* Lower row: Category Chips (Horizontal Scroll) */}
          <div className="flex items-center gap-space-xs overflow-x-auto no-scrollbar py-1 text-nowrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-space-md py-1.5 rounded-full font-label-md text-label-md transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-on-primary shadow-[0_8px_16px_-4px_rgba(0,93,144,0.3),inset_0_2px_3px_rgba(255,255,255,0.35)] font-bold'
                    : 'bg-white/80 hover:bg-slate-100 text-on-surface-variant shadow-sm'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN CATALOG CONTENT WRAPPER */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop">
        {/* LEFT SIDEBAR: Bulk Wholesale Promo + Refill Gauge (3 cols on desktop) */}
        <aside className="hidden lg:flex lg:col-span-3 flex-col gap-space-md">
          {/* Refill Eco-Station Card (Claymorphic) */}
          <div className="rounded-3xl bg-surface-container-lowest p-space-lg shadow-[0_16px_32px_-8px_rgba(0,119,182,0.12),inset_0_3px_6px_rgba(255,255,255,0.95)] border border-slate-100">
            <div className="flex items-center gap-space-sm mb-space-sm">
              <div className="w-10 h-10 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-[20px]">recycling</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Punto de Recarga
                </h3>
                <span className="font-label-sm text-label-sm text-secondary font-bold">
                  Química a Granel
                </span>
              </div>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
              Ahorrá hasta un 25% trayendo tu envase limpio a Lanús, Avellaneda o Quilmes Centro.
            </p>
            {/* Inline SVG Refill Metric Donut */}
            <div className="p-space-sm rounded-2xl bg-surface-container-low flex items-center gap-space-md">
              <svg className="w-14 h-14 shrink-0 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                />
                <path
                  className="text-secondary"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="75, 100"
                  strokeLinecap="round"
                  strokeWidth="3.5"
                />
              </svg>
              <div>
                <span className="font-headline-md text-headline-md text-primary font-bold">
                  75%
                </span>
                <p className="font-label-sm text-label-sm text-on-surface-variant leading-none">
                  Plástico evitado este mes
                </p>
              </div>
            </div>
          </div>

          {/* Wholesale Escalation Scale Card */}
          <div className="rounded-3xl bg-gradient-to-br from-tertiary-fixed/30 via-surface-container-lowest to-secondary-fixed/20 p-space-lg shadow-[0_16px_32px_-8px_rgba(101,79,126,0.12),inset_0_3px_6px_rgba(255,255,255,0.95)] border border-slate-100">
            <div className="flex items-center justify-between mb-space-sm">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-tertiary font-bold">
                Escala Mayorista
              </span>
              <span className="material-symbols-outlined text-tertiary text-[20px]">layers</span>
            </div>
            <h4 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs font-bold">
              Precios por Bulto Cerrado
            </h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
              Aplica automáticamente en carrito al superar las unidades base.
            </p>
            <div className="space-y-space-xs font-body-sm text-body-sm">
              <div className="p-space-sm rounded-xl bg-white/80 flex items-center justify-between shadow-xs">
                <span className="text-on-surface font-label-md text-label-md font-semibold">
                  Desde 5 Bidones (5L)
                </span>
                <span className="font-label-md text-label-md text-secondary font-bold">
                  -10% OFF
                </span>
              </div>
              <div className="p-space-sm rounded-xl bg-white/80 flex items-center justify-between shadow-xs">
                <span className="text-on-surface font-label-md text-label-md font-semibold">
                  Desde 12 Bidones (5L)
                </span>
                <span className="font-label-md text-label-md text-secondary font-bold">
                  -18% OFF
                </span>
              </div>
              <div className="p-space-sm rounded-xl bg-white/80 flex items-center justify-between shadow-xs">
                <span className="text-on-surface font-label-md text-label-md font-semibold">
                  Tambor 200L Ind.
                </span>
                <span className="font-label-md text-label-md text-primary font-bold">
                  Cotización
                </span>
              </div>
            </div>
            <a
              href="https://wa.me/5491145678900?text=Hola%20Detersur!%20Solicito%20Lista%20Mayorista%20PDF"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-space-md block w-full py-2.5 rounded-full bg-tertiary text-on-tertiary font-label-md text-label-md shadow-[0_8px_16px_-4px_rgba(101,79,126,0.35),inset_0_2px_4px_rgba(255,255,255,0.3)] hover:scale-[1.01] active:scale-95 transition-all text-center font-bold"
            >
              Descargar Lista Mayorista en PDF
            </a>
          </div>

          {/* Quick Delivery Coverage Chip */}
          <div className="rounded-2xl bg-surface-container-low p-space-md flex items-center gap-space-sm border border-slate-200/50">
            <span className="material-symbols-outlined text-secondary text-[24px]">verified</span>
            <div className="font-body-sm text-body-sm text-on-surface-variant">
              <span className="font-label-md text-label-md text-on-surface block font-bold">
                Certificación ANMAT
              </span>
              Lotes rotulados con fecha y concentración garantizada.
            </div>
          </div>
        </aside>

        {/* RIGHT/CENTER: Catalog Grid (9 cols on desktop) */}
        <section className="col-span-1 lg:col-span-9 flex flex-col gap-space-lg">
          {/* Live Counter & Active Filter Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
              <span>Mostrando</span>
              <span className="font-label-lg text-label-lg text-primary font-bold">
                {filteredProducts.length}
              </span>
              <span>productos en catálogo</span>
            </div>
            <div className="flex items-center gap-space-xs">
              <span className="text-[12px] font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                Precios Finales ARS
              </span>
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-gutter">
              {filteredProducts.map((product) => (
                <article
                  key={product.id}
                  className="product-item group relative flex flex-col rounded-3xl bg-surface-container-lowest p-space-sm sm:p-space-md shadow-[0_16px_32px_-8px_rgba(0,119,182,0.12),inset_0_3px_6px_rgba(255,255,255,0.95),inset_0_-3px_6px_rgba(0,70,120,0.04)] hover:-translate-y-1 transition-all duration-300 border border-slate-100"
                >
                  {/* Image Stage */}
                  <div
                    onClick={() => navigateTo('product-detail', product.id)}
                    className="relative w-full aspect-square rounded-2xl bg-gradient-to-b from-primary-fixed/30 to-secondary-fixed/20 p-space-sm flex items-center justify-center overflow-hidden mb-space-sm cursor-pointer"
                  >
                    {product.badge && (
                      <span className="absolute top-2 left-2 px-space-xs py-0.5 rounded-full bg-white/90 text-primary font-label-sm text-label-sm font-bold shadow-xs">
                        {product.badge}
                      </span>
                    )}

                    <div className="w-32 h-32 rounded-full bg-white/70 backdrop-blur-sm shadow-[0_8px_20px_-6px_rgba(0,119,182,0.25),inset_0_4px_8px_rgba(255,255,255,0.9)] flex items-center justify-center group-hover:scale-105 transition-transform p-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {product.isBulk && (
                      <span className="absolute bottom-2 right-2 px-space-xs py-0.5 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm font-bold">
                        -25% recarga
                      </span>
                    )}
                  </div>

                  {/* Brand & Package */}
                  <div className="flex items-center justify-between mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm font-bold">
                      {product.brand}
                    </span>
                    <span className="font-label-sm text-label-sm text-outline">
                      {product.packageType}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => navigateTo('product-detail', product.id)}
                    className="font-headline-sm text-headline-sm text-on-background line-clamp-2 min-h-[48px] mb-space-xs leading-snug cursor-pointer hover:text-primary transition-colors font-bold"
                  >
                    {product.name}
                  </h3>

                  {/* Price & Action */}
                  <div className="mt-auto pt-space-xs flex items-end justify-between gap-space-xs border-t border-slate-100">
                    <div>
                      <span className="block font-label-sm text-label-sm text-outline leading-none">
                        Precio final
                      </span>
                      <div className="flex items-baseline text-on-background">
                        <span className="font-price-currency text-price-currency font-bold text-primary mr-0.5">
                          $
                        </span>
                        <span className="font-price-integer text-price-integer tracking-tight font-extrabold text-primary">
                          {product.price.toLocaleString('es-AR')}
                        </span>
                      </div>
                    </div>

                    {/* Clay Action Button */}
                    <button
                      onClick={() => addToCart(product, product.presentations?.[0], 1)}
                      className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-[0_10px_20px_-4px_rgba(0,119,182,0.4),inset_0_2px_4px_rgba(255,255,255,0.6)] hover:scale-105 active:scale-90 transition-all shrink-0 cursor-pointer"
                      title="Agregar al carrito"
                    >
                      <span className="material-symbols-outlined text-[22px]">add</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="w-full p-space-xl rounded-3xl bg-surface-container-lowest text-center flex flex-col items-center justify-center shadow-[0_16px_32px_-8px_rgba(0,119,182,0.08),inset_0_3px_6px_rgba(255,255,255,0.9)] border border-slate-100">
              <div className="w-20 h-20 rounded-full bg-surface-container-low text-outline flex items-center justify-center mb-space-md shadow-inner">
                <span className="material-symbols-outlined text-[40px]">search_off</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-space-xs font-bold">
                No encontramos resultados para tu búsqueda
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto mb-space-lg">
                ¿Buscás preparar un pedido especial de química suelta, dilución técnica o tambor cerrado? Nuestro químico de guardia en Lanús te asesora por WhatsApp.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-space-sm">
                <button
                  onClick={resetAllFilters}
                  className="px-space-lg py-2.5 rounded-full bg-surface-container-low text-on-surface font-label-md text-label-md hover:bg-surface-container transition-all cursor-pointer font-bold"
                >
                  Limpiar filtros
                </button>
                <a
                  className="px-space-lg py-2.5 rounded-full bg-secondary text-on-secondary font-label-md text-label-md shadow-[0_8px_16px_-4px_rgba(0,106,98,0.35),inset_0_2px_4px_rgba(255,255,255,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-space-xs font-bold"
                  href="https://wa.me/5491145678900?text=Hola%20Detersur!%20Busco%20un%20producto%20especifico"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  Consultar por Pedido Especial
                </a>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
