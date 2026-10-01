import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { CategoryId, Route, ViewType } from '../types';

/* ------------------------------------------------------------------ */
/* Media queries                                                       */
/* ------------------------------------------------------------------ */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
};

export const useIsDesktop = (): boolean => useMediaQuery('(min-width: 768px)');

/** Mirrors the OS "reduce motion" setting so animations can opt out. */
export const usePrefersReducedMotion = (): boolean =>
  useMediaQuery('(prefers-reduced-motion: reduce)');

/* ------------------------------------------------------------------ */
/* Scroll position                                                     */
/* ------------------------------------------------------------------ */
export const useScrollPosition = (threshold = 24) => {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  const lastY = useRef(0);

  useEffect(() => {
    let frame = 0;

    const read = () => {
      const y = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;

      setScrolled(y > threshold);
      setProgress(height > 0 ? Math.min(1, y / height) : 0);

      // Ignore sub-pixel jitter so the header does not flicker.
      if (Math.abs(y - lastY.current) > 6) {
        setDirection(y > lastY.current ? 'down' : 'up');
        lastY.current = y;
      }
      frame = 0;
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(read);
    };

    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return { scrolled, progress, direction };
};

/* ------------------------------------------------------------------ */
/* Scroll reveal                                                       */
/* ------------------------------------------------------------------ */
interface RevealOptions {
  threshold?: number;
  rootMargin?: string;
  /** Keep the element visible after it first enters the viewport. */
  once?: boolean;
}

export const useInViewOnce = <T extends HTMLElement = HTMLDivElement>({
  threshold = 0.15,
  rootMargin = '0px 0px -10% 0px',
  once = true,
}: RevealOptions = {}) => {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Without IntersectionObserver, show everything rather than nothing.
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, inView };
};

/* ------------------------------------------------------------------ */
/* Animated counter                                                    */
/* ------------------------------------------------------------------ */
export const useCountUp = (target: number, active: boolean, duration = 1400) => {
  const [value, setValue] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!active) return;
    if (reduced || duration <= 0) {
      setValue(target);
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      // easeOutExpo keeps the number lively at the start and settles softly.
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setValue(target * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active, duration, reduced]);

  return value;
};

/* ------------------------------------------------------------------ */
/* Body scroll lock (drawers, modals)                                  */
/* ------------------------------------------------------------------ */
export const useLockBodyScroll = (locked: boolean): void => {
  useLayoutEffect(() => {
    if (!locked) return;
    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    // Compensate for the vanishing scrollbar so the layout does not jump.
    const gap = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = 'hidden';
    if (gap > 0) body.style.paddingRight = `${gap}px`;

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, [locked]);
};

/* ------------------------------------------------------------------ */
/* Escape key / outside click                                          */
/* ------------------------------------------------------------------ */
export const useEscapeKey = (handler: () => void, active = true): void => {
  useEffect(() => {
    if (!active) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handler();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handler, active]);
};

export const useClickOutside = <T extends HTMLElement>(
  handler: () => void,
  active = true
) => {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!active) return;
    const onPointer = (event: PointerEvent) => {
      const node = ref.current;
      if (node && !node.contains(event.target as Node)) handler();
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [handler, active]);

  return ref;
};

/* ------------------------------------------------------------------ */
/* Hash routing                                                        */
/* ------------------------------------------------------------------ */
const VIEW_BY_SEGMENT: Record<string, ViewType> = {
  '': 'home',
  inicio: 'home',
  catalogo: 'catalog',
  producto: 'product-detail',
  carrito: 'cart',
  checkout: 'checkout',
  confirmacion: 'confirmation',
};

const SEGMENT_BY_VIEW: Record<ViewType, string> = {
  home: 'inicio',
  catalog: 'catalogo',
  'product-detail': 'producto',
  cart: 'carrito',
  checkout: 'checkout',
  confirmation: 'confirmacion',
};

export const routeToHash = (route: Route): string => {
  const segment = SEGMENT_BY_VIEW[route.view];
  const params = new URLSearchParams();

  if (route.view === 'product-detail' && route.productId) {
    return `#/${segment}/${route.productId}`;
  }
  if (route.view === 'catalog') {
    if (route.category && route.category !== 'ALL') params.set('cat', route.category);
    if (route.query) params.set('q', route.query);
  }

  const qs = params.toString();
  return `#/${segment}${qs ? `?${qs}` : ''}`;
};

export const parseHash = (hash: string): Route => {
  const clean = hash.replace(/^#\/?/, '');
  const [pathPart, queryPart] = clean.split('?');
  const [segment, param] = pathPart.split('/');
  const view = VIEW_BY_SEGMENT[segment ?? ''] ?? 'home';
  const params = new URLSearchParams(queryPart ?? '');

  return {
    view,
    productId: view === 'product-detail' ? param || undefined : undefined,
    category: (params.get('cat') as CategoryId | null) ?? undefined,
    query: params.get('q') ?? undefined,
  };
};

/**
 * Keeps the active view in the URL hash so the browser's back and forward
 * buttons work and any screen can be linked to directly.
 */
export const useHashRoute = () => {
  const [route, setRoute] = useState<Route>(() =>
    typeof window === 'undefined' ? { view: 'home' } : parseHash(window.location.hash)
  );

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = useCallback((next: Route, options?: { replace?: boolean }) => {
    const hash = routeToHash(next);
    if (window.location.hash === hash) {
      // Same target: just re-sync state and scroll back up.
      setRoute(next);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (options?.replace) {
      window.history.replaceState(null, '', hash);
      setRoute(next);
    } else {
      window.location.hash = hash;
    }
  }, []);

  return { route, navigate };
};

/* ------------------------------------------------------------------ */
/* Debounced value (search box)                                        */
/* ------------------------------------------------------------------ */
export const useDebounced = <T,>(value: T, delay = 220): T => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

/* ------------------------------------------------------------------ */
/* Interval that pauses (carousel autoplay)                            */
/* ------------------------------------------------------------------ */
export const useInterval = (callback: () => void, delay: number | null): void => {
  const saved = useRef(callback);

  useEffect(() => {
    saved.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;
    const id = window.setInterval(() => saved.current(), delay);
    return () => window.clearInterval(id);
  }, [delay]);
};
