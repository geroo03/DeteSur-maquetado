import React, { useState } from 'react';
import { SmartImage } from './SmartImage';
import { useStore } from '../context/StoreContext';
import { LOGO_URL, BEST_SELLERS } from '../data/products';
import { CONTACT } from '../data/content';
import { CategoryId } from '../types';
import {
  useClickOutside,
  useEscapeKey,
  useLockBodyScroll,
  useScrollPosition,
} from '../hooks';
import { SearchBox } from './SearchBox';
import { formatPrice } from '../lib/format';

/* ------------------------------------------------------------------ */
/* Mega menu                                                           */
/* ------------------------------------------------------------------ */
const MEGA_COLUMNS: {
  title: string;
  icon: string;
  links: { label: string; category: CategoryId; query?: string }[];
}[] = [
  {
    title: 'Química Suelta',
    icon: 'water_drop',
    links: [
      { label: 'Lavandinas y cloro activo', category: 'sueltos', query: 'lavandina' },
      { label: 'Detergentes concentrados', category: 'sueltos', query: 'detergente' },
      { label: 'Desinfectantes y amonios', category: 'sueltos', query: 'amonio' },
      { label: 'Insecticidas profesionales', category: 'sueltos', query: 'insecticida' },
    ],
  },
  {
    title: 'Hogar & Superficies',
    icon: 'home',
    links: [
      { label: 'Pisos, ceras y brillo', category: 'pisos' },
      { label: 'Cocina y desengrasantes', category: 'cocina' },
      { label: 'Baño y antisarro', category: 'bano' },
      { label: 'Aromas y difusores', category: 'aromas' },
    ],
  },
  {
    title: 'Ropa & Lavandería',
    icon: 'local_laundry_service',
    links: [
      { label: 'Jabones líquidos matic', category: 'ropa', query: 'jabon' },
      { label: 'Suavizantes concentrados', category: 'ropa', query: 'suavizante' },
      { label: 'Quitamanchas sin cloro', category: 'ropa', query: 'quitamanchas' },
      { label: 'Línea lavaderos 20L', category: 'ropa' },
    ],
  },
  {
    title: 'Institucional',
    icon: 'apartment',
    links: [
      { label: 'Papelería y dispensers', category: 'papeleria' },
      { label: 'Accesorios y equipamiento', category: 'accesorios' },
      { label: 'Piscinas y tratamiento de agua', category: 'piscinas' },
      { label: 'Bolsas de consorcio', category: 'papeleria', query: 'bolsas' },
    ],
  },
];

const MegaMenu: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { navigate } = useStore();
  const featured = BEST_SELLERS.slice(0, 2);

  const go = (category: CategoryId, query?: string) => {
    onClose();
    navigate({ view: 'catalog', category, query });
  };

  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-[min(94vw,1060px)] p-space-lg rounded-3xl glass-panel shadow-[0_36px_72px_-16px_rgba(9,27,56,0.3)] animate-fade-down z-50">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-space-lg">
        {MEGA_COLUMNS.map((column, columnIndex) => (
          <div
            key={column.title}
            className="animate-fade-up"
            style={{ animationDelay: `${columnIndex * 55}ms` }}
          >
            <h4 className="flex items-center gap-1.5 font-label-lg text-label-lg text-primary font-extrabold mb-space-sm">
              <span className="material-symbols-outlined text-[18px] text-secondary">
                {column.icon}
              </span>
              {column.title}
            </h4>
            <ul className="space-y-1">
              {column.links.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => go(link.category, link.query)}
                    className="group w-full text-left font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors py-1 flex items-center gap-1"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 rounded-full bg-primary transition-all duration-300" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Featured products inside the mega menu */}
        <div className="md:col-span-2 p-space-md rounded-2xl bg-gradient-to-br from-secondary-fixed/40 to-primary-fixed/30 border border-white animate-fade-up" style={{ animationDelay: '220ms' }}>
          <p className="font-label-sm text-label-sm text-secondary font-extrabold uppercase tracking-wider mb-space-sm">
            Los más pedidos
          </p>
          <div className="space-y-space-sm">
            {featured.map((product) => (
              <button
                key={product.id}
                onClick={() => {
                  onClose();
                  navigate({ view: 'product-detail', productId: product.id });
                }}
                className="w-full flex items-center gap-space-sm p-space-sm rounded-xl bg-white/80 hover:bg-white transition-all hover:-translate-y-0.5 text-left shadow-xs"
              >
                <SmartImage
                  src={product.image}
                  alt=""
                  className="w-10 h-10 object-contain shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-label-md text-label-md text-on-surface font-bold truncate">
                    {product.name}
                  </p>
                  <p className="font-label-sm text-label-sm text-primary font-extrabold">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={() => go('ALL')}
            className="w-full mt-space-sm py-2 rounded-full bg-primary-container text-on-primary font-label-md text-label-md font-bold clay-button-primary hover:scale-[1.02] transition-transform"
          >
            Ver catálogo completo
          </button>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Mobile navigation drawer                                            */
/* ------------------------------------------------------------------ */
const MobileMenu: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const { navigate, wishlist, cartCount } = useStore();
  const [expanded, setExpanded] = useState<string | null>('Química Suelta');

  useLockBodyScroll(open);
  useEscapeKey(onClose, open);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] xl:hidden">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#091b38]/45 backdrop-blur-sm animate-fade-in"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        className="absolute inset-y-0 left-0 w-[min(90vw,380px)] bg-surface-container-lowest shadow-[20px_0_60px_rgba(9,27,56,0.3)] flex flex-col animate-slide-in-left"
      >
        {/* Drawer header */}
        <div className="p-space-md flex items-center justify-between border-b border-surface-container shrink-0">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center overflow-hidden shrink-0 clay-button-primary">
              <SmartImage src={LOGO_URL} alt="" className="w-7 h-7 object-contain" />
            </div>
            <div>
              <p className="font-headline-sm text-headline-sm text-primary font-extrabold leading-none">
                Detersur
              </p>
              <p className="font-label-sm text-[10px] text-secondary uppercase tracking-widest font-bold">
                Química & Limpieza
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar menú"
            className="w-9 h-9 rounded-full bg-surface-container-low text-on-surface flex items-center justify-center active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Search */}
        <div className="p-space-md shrink-0">
          <SearchBox layout="panel" onNavigate={onClose} />
        </div>

        {/* Scrollable nav */}
        <nav className="flex-1 overflow-y-auto pretty-scroll px-space-md pb-space-md">
          <button
            onClick={() => {
              onClose();
              navigate({ view: 'home' });
            }}
            className="w-full flex items-center gap-space-sm py-3 px-space-sm rounded-2xl hover:bg-surface-container-low font-label-lg text-label-lg text-on-surface font-bold transition-colors"
          >
            <span className="material-symbols-outlined text-[20px] text-primary">home</span>
            Inicio
          </button>

          {MEGA_COLUMNS.map((column) => {
            const isOpen = expanded === column.title;
            return (
              <div key={column.title} className="border-b border-surface-container/70">
                <button
                  onClick={() => setExpanded(isOpen ? null : column.title)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-space-sm py-3 px-space-sm rounded-2xl hover:bg-surface-container-low transition-colors"
                >
                  <span className="flex items-center gap-space-sm font-label-lg text-label-lg text-on-surface font-bold">
                    <span className="material-symbols-outlined text-[20px] text-secondary">
                      {column.icon}
                    </span>
                    {column.title}
                  </span>
                  <span
                    className={`material-symbols-outlined text-[20px] text-outline transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  >
                    expand_more
                  </span>
                </button>

                <div
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                >
                  <ul className="overflow-hidden pl-space-xl pr-space-sm">
                    {column.links.map((link, linkIndex) => (
                      <li key={link.label}>
                        <button
                          onClick={() => {
                            onClose();
                            navigate({
                              view: 'catalog',
                              category: link.category,
                              query: link.query,
                            });
                          }}
                          className="w-full text-left py-2 font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-all"
                          style={{
                            opacity: isOpen ? 1 : 0,
                            transform: isOpen ? 'none' : 'translateX(-8px)',
                            transition: `opacity 260ms ease ${linkIndex * 40}ms, transform 260ms ease ${linkIndex * 40}ms`,
                          }}
                        >
                          {link.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}

          <div className="mt-space-md grid grid-cols-2 gap-space-sm">
            <button
              onClick={() => {
                onClose();
                navigate({ view: 'cart' });
              }}
              className="relative p-space-md rounded-2xl bg-surface-container-low flex flex-col items-center gap-1 font-label-md text-label-md font-bold text-on-surface hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[22px] text-primary">
                shopping_bag
              </span>
              Carrito
              {cartCount > 0 && (
                <span className="absolute top-2 right-2 min-w-[20px] h-5 px-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-extrabold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                onClose();
                navigate({ view: 'catalog' });
              }}
              className="relative p-space-md rounded-2xl bg-surface-container-low flex flex-col items-center gap-1 font-label-md text-label-md font-bold text-on-surface hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[22px] text-error">
                favorite
              </span>
              Favoritos
              {wishlist.length > 0 && (
                <span className="absolute top-2 right-2 min-w-[20px] h-5 px-1 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-extrabold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>
          </div>
        </nav>

        {/* Drawer footer: direct contact */}
        <div className="p-space-md border-t border-surface-container shrink-0 space-y-space-sm">
          <a
            href={CONTACT.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-full bg-secondary text-on-secondary font-label-lg text-label-lg font-bold clay-button-secondary flex items-center justify-center gap-space-xs active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[20px]">chat</span>
            Consultar por WhatsApp
          </a>
          <a
            href={CONTACT.phoneHref}
            className="block text-center font-label-md text-label-md text-primary font-bold"
          >
            {CONTACT.phone}
          </a>
        </div>
      </aside>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */
export const Header: React.FC = () => {
  const { activeView, navigate, cartCount, openDrawer, wishlist, totals } = useStore();
  const { scrolled, progress } = useScrollPosition(40);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const megaRef = useClickOutside<HTMLDivElement>(() => setMegaOpen(false), megaOpen);
  useEscapeKey(() => setMegaOpen(false), megaOpen);

  const navItems: { label: string; view: 'home' | 'catalog'; category?: CategoryId }[] = [
    { label: 'Inicio', view: 'home' },
    { label: 'Química Suelta', view: 'catalog', category: 'sueltos' },
    { label: 'Mayorista', view: 'catalog' },
  ];

  return (
    <>
      {/* Reading progress line */}
      <div
        aria-hidden="true"
        className="fixed top-0 inset-x-0 h-0.5 z-[55] bg-primary-container origin-left transition-transform duration-150"
        style={{ transform: `scaleX(${progress})` }}
      />

      <header className="fixed top-0 inset-x-0 z-50 p-space-xs sm:p-space-sm md:p-space-md">
        {/* Announcement strip — collapses away on scroll */}
        <div
          className="max-w-[1280px] mx-auto px-2 overflow-hidden transition-all duration-400 ease-out"
          style={{
            maxHeight: scrolled ? 0 : 32,
            opacity: scrolled ? 0 : 1,
            marginBottom: scrolled ? 0 : 4,
          }}
        >
          <div className="flex items-center justify-between text-[11px] font-semibold text-on-background/70 py-1">
            <div className="flex items-center gap-2 min-w-0">
              <span className="inline-flex items-center gap-1 bg-primary-fixed text-on-primary-fixed-variant px-2 py-0.5 rounded-full font-bold shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
                Detersur Oficial
              </span>
              <span className="hidden sm:inline truncate">
                Venta minorista y mayorista · Fórmulas certificadas ANMAT
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="hidden md:inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-secondary">
                  local_shipping
                </span>
                Envío gratis desde $25.000
              </span>
              <a
                href={CONTACT.phoneHref}
                className="inline-flex items-center gap-1 text-primary font-bold hover:underline"
              >
                <span className="material-symbols-outlined text-[14px]">call</span>
                <span className="hidden sm:inline">{CONTACT.phone}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Main glass bar */}
        <div
          ref={megaRef}
          className={`relative max-w-[1280px] mx-auto px-space-sm sm:px-space-md md:px-gutter-desktop rounded-full glass-panel flex items-center justify-between gap-space-sm md:gap-space-md transition-all duration-400 ease-out ${
            scrolled
              ? 'h-14 md:h-16 shadow-[0_18px_38px_-10px_rgba(9,27,56,0.2)]'
              : 'h-16 md:h-20 shadow-[0_20px_40px_-10px_rgba(9,27,56,0.1)]'
          }`}
        >
          {/* Hamburger (mobile / tablet) */}
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menú"
            className="xl:hidden w-10 h-10 rounded-full bg-surface-container-low text-on-surface-variant flex items-center justify-center shrink-0 hover:bg-surface-container active:scale-90 transition-all"
          >
            <span className="material-symbols-outlined text-[22px]">menu</span>
          </button>

          {/* Brand */}
          <button
            onClick={() => navigate({ view: 'home' })}
            className="flex items-center gap-space-sm shrink-0 text-left group"
          >
            <div
              className={`rounded-full bg-primary-container flex items-center justify-center text-on-primary clay-button-primary overflow-hidden shrink-0 transition-all duration-400 group-hover:scale-105 group-hover:rotate-6 ${
                scrolled ? 'w-9 h-9 md:w-10 md:h-10' : 'w-10 h-10 md:w-11 md:h-11'
              }`}
            >
              <SmartImage
                alt="Detersur"
                src={LOGO_URL}
                className="w-7 h-7 md:w-8 md:h-8 object-contain drop-shadow"
              />
            </div>
            <div className="hidden sm:flex flex-col">
              <span
                className={`font-headline-md tracking-tight text-primary leading-none font-extrabold transition-all duration-400 ${
                  scrolled ? 'text-headline-sm md:text-[19px]' : 'text-headline-sm md:text-headline-md'
                }`}
              >
                Detersur
              </span>
              <span className="font-label-sm text-[9px] md:text-[10px] text-secondary tracking-widest uppercase font-bold">
                Química &amp; Limpieza
              </span>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden xl:flex items-center gap-space-lg shrink-0">
            <button
              onClick={() => navigate({ view: 'home' })}
              data-active={activeView === 'home'}
              className={`nav-link font-label-lg text-label-lg transition-colors ${
                activeView === 'home'
                  ? 'text-primary font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Inicio
            </button>

            <button
              onClick={() => setMegaOpen((open) => !open)}
              onMouseEnter={() => setMegaOpen(true)}
              aria-expanded={megaOpen}
              data-active={activeView === 'catalog'}
              className={`nav-link font-label-lg text-label-lg flex items-center gap-1 transition-colors ${
                activeView === 'catalog' || megaOpen
                  ? 'text-primary font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Categorías
              <span
                className={`material-symbols-outlined text-[18px] transition-transform duration-300 ${
                  megaOpen ? 'rotate-180' : ''
                }`}
              >
                expand_more
              </span>
            </button>

            {navItems.slice(1).map((item) => (
              <button
                key={item.label}
                onClick={() => navigate({ view: item.view, category: item.category })}
                className="nav-link font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Search */}
          <SearchBox className="hidden md:block flex-1 max-w-sm lg:max-w-md" />

          {/* Actions */}
          <div className="flex items-center gap-space-xs sm:gap-space-sm shrink-0">
            {/* Wishlist */}
            <button
              onClick={() => navigate({ view: 'catalog' })}
              aria-label={`Favoritos (${wishlist.length})`}
              className="relative hidden sm:flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-error transition-all active:scale-90 shadow-sm"
            >
              <span className="material-symbols-outlined text-[22px]">favorite</span>
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm flex items-center justify-center font-bold shadow-sm animate-pop">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={openDrawer}
              aria-label={`Ver carrito (${cartCount} artículos)`}
              className="relative flex items-center gap-space-xs h-10 md:h-11 px-space-sm md:px-space-md rounded-full bg-primary-container text-on-primary clay-button-primary hover:scale-[1.03] active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
              {cartCount > 0 && (
                <span className="hidden lg:inline font-label-md text-label-md font-extrabold whitespace-nowrap">
                  {formatPrice(totals.total)}
                </span>
              )}
              {cartCount > 0 && (
                <span
                  key={cartCount}
                  className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm flex items-center justify-center font-black shadow-sm animate-pop"
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {megaOpen && <MegaMenu onClose={() => setMegaOpen(false)} />}
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
};
