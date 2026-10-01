import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SmartImage } from './SmartImage';
import { PRODUCTS } from '../data/products';
import { QUICK_SEARCHES } from '../data/content';
import { useStore } from '../context/StoreContext';
import { useClickOutside, useDebounced } from '../hooks';
import { formatPrice, normalize } from '../lib/format';
import { Product } from '../types';

const MAX_SUGGESTIONS = 6;

/** Ranked product search: name hits beat brand hits beat tag/description hits. */
const searchProducts = (query: string): Product[] => {
  const q = normalize(query);
  if (q.length < 2) return [];

  const scored = PRODUCTS.map((product) => {
    const name = normalize(product.name);
    const brand = normalize(product.brand);
    const haystack = normalize(
      `${product.description} ${product.tags?.join(' ') ?? ''} ${product.packageType} ${product.category}`
    );

    let score = 0;
    if (name.startsWith(q)) score += 100;
    else if (name.includes(q)) score += 60;
    if (brand.includes(q)) score += 30;
    if (haystack.includes(q)) score += 15;
    if (product.presentations?.some((p) => normalize(p.title).includes(q))) score += 10;

    return { product, score };
  })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || (b.product.rating ?? 0) - (a.product.rating ?? 0));

  return scored.slice(0, MAX_SUGGESTIONS).map((entry) => entry.product);
};

interface SearchBoxProps {
  /** `inline` renders inside the header bar; `panel` inside the mobile drawer. */
  layout?: 'inline' | 'panel';
  autoFocus?: boolean;
  onNavigate?: () => void;
  className?: string;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  layout = 'inline',
  autoFocus = false,
  onNavigate,
  className = '',
}) => {
  const {
    searchQuery,
    setSearchQuery,
    navigate,
    recentSearches,
    pushRecentSearch,
    clearRecentSearches,
  } = useStore();

  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounced = useDebounced(searchQuery, 180);

  const containerRef = useClickOutside<HTMLDivElement>(() => setOpen(false), open);
  const suggestions = useMemo(() => searchProducts(debounced), [debounced]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => setHighlight(-1), [debounced]);

  // Cmd/Ctrl+K focuses the search box from anywhere.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const goToProduct = (product: Product) => {
    pushRecentSearch(product.name);
    setOpen(false);
    inputRef.current?.blur();
    onNavigate?.();
    navigate({ view: 'product-detail', productId: product.id });
  };

  const submitSearch = (query = searchQuery) => {
    const trimmed = query.trim();
    pushRecentSearch(trimmed);
    setOpen(false);
    inputRef.current?.blur();
    onNavigate?.();
    navigate({ view: 'catalog', query: trimmed, category: 'ALL' });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
      setHighlight((current) => Math.min(current + 1, suggestions.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlight((current) => Math.max(current - 1, -1));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (highlight >= 0 && suggestions[highlight]) goToProduct(suggestions[highlight]);
      else submitSearch();
    } else if (event.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const showPanel = open && (suggestions.length > 0 || searchQuery.trim().length < 2);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submitSearch();
        }}
        role="search"
      >
        <div
          className={`w-full flex items-center gap-space-xs transition-all duration-300 ${
            layout === 'inline'
              ? 'px-space-md py-2 rounded-full bg-surface-container-low focus-within:bg-white focus-within:shadow-[0_0_0_2px_var(--color-primary-container)]'
              : 'px-space-md py-3 rounded-2xl bg-surface-container-low focus-within:bg-white focus-within:shadow-[0_0_0_2px_var(--color-primary-container)]'
          }`}
        >
          <span className="material-symbols-outlined text-outline text-[20px] shrink-0">
            search
          </span>
          <input
            ref={inputRef}
            type="search"
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder="Buscar lavandina, jabón, bidón, desinfectante…"
            aria-label="Buscar productos"
            aria-expanded={showPanel}
            aria-autocomplete="list"
            className="w-full bg-transparent font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                inputRef.current?.focus();
              }}
              aria-label="Limpiar búsqueda"
              className="text-outline hover:text-on-surface shrink-0 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          ) : (
            layout === 'inline' && (
              <kbd className="hidden lg:flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-surface-container-high text-outline font-label-sm text-[10px] font-bold shrink-0">
                ⌘K
              </kbd>
            )
          )}
        </div>
      </form>

      {/* Suggestions dropdown */}
      {showPanel && (
        <div
          role="listbox"
          className={`absolute left-0 right-0 z-50 mt-2 p-space-sm rounded-3xl glass-panel shadow-[0_28px_56px_-12px_rgba(9,27,56,0.28)] animate-fade-down max-h-[70vh] overflow-y-auto pretty-scroll ${
            layout === 'panel' ? 'relative mt-space-sm max-h-none' : ''
          }`}
        >
          {suggestions.length > 0 ? (
            <>
              <p className="px-space-sm py-1 font-label-sm text-[10px] uppercase tracking-wider text-outline font-bold">
                {suggestions.length} resultado{suggestions.length > 1 ? 's' : ''}
              </p>
              {suggestions.map((product, index) => (
                <button
                  key={product.id}
                  role="option"
                  aria-selected={highlight === index}
                  onMouseEnter={() => setHighlight(index)}
                  onClick={() => goToProduct(product)}
                  className={`w-full flex items-center gap-space-sm p-space-sm rounded-2xl text-left transition-colors ${
                    highlight === index ? 'bg-primary-fixed/60' : 'hover:bg-surface-container-low'
                  }`}
                >
                  <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
                    <SmartImage src={product.image} alt="" className="w-9 h-9 object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-label-md text-label-md text-on-surface font-bold truncate">
                      {product.name}
                    </p>
                    <p className="font-label-sm text-label-sm text-outline truncate">
                      {product.brand} · {product.packageType}
                    </p>
                  </div>
                  <span className="font-label-md text-label-md text-primary font-extrabold shrink-0">
                    {formatPrice(product.price)}
                  </span>
                </button>
              ))}
              <button
                onClick={() => submitSearch()}
                className="w-full mt-1 py-2.5 rounded-2xl bg-primary-container text-on-primary font-label-md text-label-md font-bold hover:bg-primary transition-colors flex items-center justify-center gap-1"
              >
                Ver todos los resultados
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </>
          ) : (
            <>
              {recentSearches.length > 0 && (
                <div className="mb-space-sm">
                  <div className="flex items-center justify-between px-space-sm py-1">
                    <p className="font-label-sm text-[10px] uppercase tracking-wider text-outline font-bold">
                      Búsquedas recientes
                    </p>
                    <button
                      onClick={clearRecentSearches}
                      className="font-label-sm text-label-sm text-primary font-bold hover:underline"
                    >
                      Limpiar
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 px-space-sm">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => {
                          setSearchQuery(term);
                          submitSearch(term);
                        }}
                        className="px-space-sm py-1 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm font-semibold hover:bg-surface-container inline-flex items-center gap-1 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[13px]">history</span>
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <p className="px-space-sm py-1 font-label-sm text-[10px] uppercase tracking-wider text-outline font-bold">
                Búsquedas del día
              </p>
              <div className="flex flex-wrap gap-1.5 px-space-sm pb-1">
                {QUICK_SEARCHES.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      if (item.productId) {
                        pushRecentSearch(item.label);
                        setOpen(false);
                        onNavigate?.();
                        navigate({ view: 'product-detail', productId: item.productId });
                      } else {
                        setSearchQuery(item.query ?? item.label);
                        submitSearch(item.query ?? item.label);
                      }
                    }}
                    className="px-space-sm py-1.5 rounded-full bg-secondary-fixed/40 text-on-secondary-fixed-variant font-label-sm text-label-sm font-bold hover:bg-secondary-fixed inline-flex items-center gap-1 transition-all hover:scale-105"
                  >
                    <span className="material-symbols-outlined text-[14px]">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
