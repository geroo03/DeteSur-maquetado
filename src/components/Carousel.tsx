import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { usePrefersReducedMotion } from '../hooks';

/* ================================================================== */
/* Scroll-snap carousel: many items visible, arrows + drag + dots      */
/* ================================================================== */

interface ScrollCarouselProps {
  children: React.ReactNode;
  /** Accessible name for the scroll region. */
  label: string;
  className?: string;
  trackClassName?: string;
  /** Rendered in the header row, to the left of the arrows. */
  header?: React.ReactNode;
  showDots?: boolean;
  showProgress?: boolean;
  /** Hide arrows when everything already fits on screen. */
  autoHideControls?: boolean;
  gap?: number;
}

export const ScrollCarousel: React.FC<ScrollCarouselProps> = ({
  children,
  label,
  className = '',
  trackClassName = '',
  header,
  showDots = false,
  showProgress = true,
  autoHideControls = true,
  gap = 16,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [activePage, setActivePage] = useState(0);

  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: false });

  const measure = useCallback(() => {
    const node = trackRef.current;
    if (!node) return;

    const max = node.scrollWidth - node.clientWidth;
    const left = node.scrollLeft;

    setCanScrollLeft(left > 4);
    setCanScrollRight(left < max - 4);
    setProgress(max > 0 ? left / max : 0);

    const pages = max > 0 ? Math.ceil(node.scrollWidth / node.clientWidth) : 1;
    setPageCount(pages);
    setActivePage(
      max > 0 ? Math.round((left / max) * Math.max(1, pages - 1)) : 0
    );
  }, []);

  useLayoutEffect(() => {
    const node = trackRef.current;
    if (!node) return;

    measure();
    node.addEventListener('scroll', measure, { passive: true });

    const observer = new ResizeObserver(measure);
    observer.observe(node);
    Array.from(node.children).forEach((child) => observer.observe(child));

    return () => {
      node.removeEventListener('scroll', measure);
      observer.disconnect();
    };
  }, [measure, children]);

  const scrollByPage = useCallback((direction: -1 | 1) => {
    const node = trackRef.current;
    if (!node) return;
    // Advance by just under a full viewport so the next card peeks in.
    const amount = Math.max(240, node.clientWidth * 0.85);
    node.scrollBy({ left: direction * amount, behavior: 'smooth' });
  }, []);

  const scrollToPage = useCallback((page: number) => {
    const node = trackRef.current;
    if (!node) return;
    const max = node.scrollWidth - node.clientWidth;
    const ratio = pageCount > 1 ? page / (pageCount - 1) : 0;
    node.scrollTo({ left: max * ratio, behavior: 'smooth' });
  }, [pageCount]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      scrollByPage(1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      scrollByPage(-1);
    }
  };

  /* --- pointer drag-to-scroll (desktop mouse) --- */
  const onPointerDown = (event: React.PointerEvent) => {
    if (event.pointerType !== 'mouse') return;
    const node = trackRef.current;
    if (!node) return;
    drag.current = {
      active: true,
      startX: event.clientX,
      startScroll: node.scrollLeft,
      moved: false,
    };
  };

  const onPointerMove = (event: React.PointerEvent) => {
    const node = trackRef.current;
    if (!drag.current.active || !node) return;
    const delta = event.clientX - drag.current.startX;
    if (Math.abs(delta) > 4) drag.current.moved = true;
    node.scrollLeft = drag.current.startScroll - delta;
  };

  const endDrag = () => {
    drag.current.active = false;
  };

  // Suppress the click that follows a drag so cards do not navigate.
  const onClickCapture = (event: React.MouseEvent) => {
    if (drag.current.moved) {
      event.preventDefault();
      event.stopPropagation();
      drag.current.moved = false;
    }
  };

  const controlsVisible = !autoHideControls || canScrollLeft || canScrollRight;

  return (
    <div className={className}>
      {(header || controlsVisible) && (
        <div className="flex items-end justify-between gap-space-md mb-space-md">
          <div className="min-w-0">{header}</div>
          {controlsVisible && (
            <div className="flex items-center gap-space-xs shrink-0">
              <CarouselArrow
                direction="left"
                disabled={!canScrollLeft}
                onClick={() => scrollByPage(-1)}
              />
              <CarouselArrow
                direction="right"
                disabled={!canScrollRight}
                onClick={() => scrollByPage(1)}
              />
            </div>
          )}
        </div>
      )}

      <div className="relative">
        {/* Edge fades hint that the track continues */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 left-0 w-10 z-10 bg-gradient-to-r from-background to-transparent transition-opacity duration-300 ${
            canScrollLeft ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 right-0 w-10 z-10 bg-gradient-to-l from-background to-transparent transition-opacity duration-300 ${
            canScrollRight ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <div
          ref={trackRef}
          role="region"
          aria-label={label}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={onClickCapture}
          style={{ gap }}
          className={`flex overflow-x-auto no-scrollbar snap-track pb-space-sm -mx-1 px-1 ${trackClassName}`}
        >
          {children}
        </div>
      </div>

      {showProgress && (canScrollLeft || canScrollRight) && (
        <div className="mt-space-sm h-1 w-full max-w-[180px] mx-auto rounded-full bg-surface-container-high overflow-hidden">
          <div
            className="h-full rounded-full bg-primary-container transition-[width,transform] duration-200"
            style={{ width: `${Math.max(18, 100 / Math.max(1, pageCount))}%`, transform: `translateX(${progress * (100 * Math.max(1, pageCount) - 100)}%)` }}
          />
        </div>
      )}

      {showDots && pageCount > 1 && (
        <div className="mt-space-sm flex items-center justify-center gap-1.5">
          {Array.from({ length: pageCount }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToPage(index)}
              aria-label={`Ir al grupo ${index + 1}`}
              aria-current={activePage === index}
              className={`h-2 rounded-full transition-all duration-300 ${
                activePage === index
                  ? 'w-7 bg-primary-container'
                  : 'w-2 bg-outline-variant hover:bg-outline'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const CarouselArrow: React.FC<{
  direction: 'left' | 'right';
  onClick: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
}> = ({ direction, onClick, disabled, size = 'md' }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={direction === 'left' ? 'Anterior' : 'Siguiente'}
    className={`${
      size === 'sm' ? 'w-9 h-9' : 'w-11 h-11'
    } rounded-full bg-surface-container-lowest clay-card flex items-center justify-center text-on-surface-variant transition-all duration-200 border border-slate-100 ${
      disabled
        ? 'opacity-35 cursor-not-allowed'
        : 'hover:text-primary hover:-translate-y-0.5 active:scale-90'
    }`}
  >
    <span className="material-symbols-outlined text-[20px]">
      {direction === 'left' ? 'chevron_left' : 'chevron_right'}
    </span>
  </button>
);

/* ================================================================== */
/* Slide carousel: one slide at a time, autoplay, swipe, dots          */
/* ================================================================== */

interface SlideCarouselProps<T> {
  items: T[];
  label: string;
  /** `active` lets a slide animate its own inner content. */
  renderSlide: (item: T, index: number, active: boolean) => React.ReactNode;
  autoPlayMs?: number | null;
  className?: string;
  /** Rendered between the dots, e.g. a play/pause button. */
  controls?: 'dots' | 'dots-arrows' | 'none';
  dotTheme?: 'light' | 'dark';
  /** Crossfade instead of sliding horizontally. */
  variant?: 'slide' | 'fade';
}

export function SlideCarousel<T>({
  items,
  label,
  renderSlide,
  autoPlayMs = 6500,
  className = '',
  controls = 'dots-arrows',
  dotTheme = 'dark',
  variant = 'slide',
}: SlideCarouselProps<T>) {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  const touch = useRef({ startX: 0, startY: 0, tracking: false });
  const containerRef = useRef<HTMLDivElement>(null);

  const count = items.length;
  const effectiveDelay = useMemo(() => {
    if (reduced || autoPlayMs === null || count <= 1) return null;
    return paused || userPaused ? null : autoPlayMs;
  }, [reduced, autoPlayMs, count, paused, userPaused]);

  const go = useCallback(
    (next: number, dir: 1 | -1) => {
      setDirection(dir);
      setIndex(((next % count) + count) % count);
    },
    [count]
  );

  const next = useCallback(() => go(index + 1, 1), [go, index]);
  const prev = useCallback(() => go(index - 1, -1), [go, index]);

  useEffect(() => {
    if (effectiveDelay === null) return;
    const timer = window.setTimeout(next, effectiveDelay);
    return () => window.clearTimeout(timer);
  }, [effectiveDelay, next, index]);

  // Pause autoplay while the carousel is off screen or the tab is hidden.
  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => setPaused(!entry.isIntersecting),
      { threshold: 0.35 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const onTouchStart = (event: React.TouchEvent) => {
    const point = event.touches[0];
    touch.current = { startX: point.clientX, startY: point.clientY, tracking: true };
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    if (!touch.current.tracking) return;
    const point = event.changedTouches[0];
    const dx = point.clientX - touch.current.startX;
    const dy = point.clientY - touch.current.startY;
    touch.current.tracking = false;
    // Only treat clearly horizontal gestures as swipes.
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      dx < 0 ? next() : prev();
    }
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      next();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      prev();
    }
  };

  if (count === 0) return null;

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      role="region"
      aria-roledescription="carrusel"
      aria-label={label}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative overflow-hidden rounded-3xl">
        {items.map((item, slideIndex) => {
          const active = slideIndex === index;
          const offset = slideIndex - index;

          const style: React.CSSProperties =
            variant === 'fade'
              ? {
                  opacity: active ? 1 : 0,
                  transform: active ? 'scale(1)' : 'scale(0.98)',
                  transition: reduced
                    ? 'none'
                    : 'opacity 520ms cubic-bezier(0.22,1,0.36,1), transform 520ms cubic-bezier(0.22,1,0.36,1)',
                }
              : {
                  opacity: active ? 1 : 0,
                  transform: active
                    ? 'translate3d(0,0,0)'
                    : `translate3d(${(offset === 0 ? direction : Math.sign(offset)) * 7}%,0,0)`,
                  transition: reduced
                    ? 'none'
                    : 'opacity 560ms cubic-bezier(0.22,1,0.36,1), transform 560ms cubic-bezier(0.22,1,0.36,1)',
                };

          return (
            <div
              key={slideIndex}
              aria-hidden={!active}
              className={active ? 'relative' : 'absolute inset-0 pointer-events-none'}
              style={style}
            >
              {renderSlide(item, slideIndex, active)}
            </div>
          );
        })}
      </div>

      {controls !== 'none' && count > 1 && (
        <div className="mt-space-md flex items-center justify-center gap-space-md">
          {controls === 'dots-arrows' && (
            <CarouselArrow direction="left" size="sm" onClick={prev} />
          )}

          <div className="flex items-center gap-2">
            {items.map((_, dotIndex) => (
              <button
                key={dotIndex}
                onClick={() => go(dotIndex, dotIndex > index ? 1 : -1)}
                aria-label={`Ir al slide ${dotIndex + 1} de ${count}`}
                aria-current={dotIndex === index}
                className="group relative h-2.5 flex items-center"
              >
                <span
                  className={`block h-2.5 rounded-full transition-all duration-400 ${
                    dotIndex === index
                      ? 'w-8 ' + (dotTheme === 'light' ? 'bg-white' : 'bg-primary-container')
                      : 'w-2.5 ' +
                        (dotTheme === 'light'
                          ? 'bg-white/45 group-hover:bg-white/70'
                          : 'bg-outline-variant group-hover:bg-outline')
                  }`}
                />
              </button>
            ))}
          </div>

          {autoPlayMs !== null && !reduced && (
            <button
              onClick={() => setUserPaused((value) => !value)}
              aria-label={userPaused ? 'Reanudar reproducción' : 'Pausar reproducción'}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                dotTheme === 'light'
                  ? 'text-white/80 hover:text-white hover:bg-white/15'
                  : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {userPaused ? 'play_arrow' : 'pause'}
              </span>
            </button>
          )}

          {controls === 'dots-arrows' && (
            <CarouselArrow direction="right" size="sm" onClick={next} />
          )}
        </div>
      )}
    </div>
  );
}

/* ================================================================== */
/* Infinite marquee                                                    */
/* ================================================================== */

export const Marquee: React.FC<{
  children: React.ReactNode;
  /** Seconds for one full loop. */
  speed?: number;
  reverse?: boolean;
  className?: string;
}> = ({ children, speed = 38, reverse = false, className = '' }) => (
  <div className={`relative overflow-hidden marquee-paused ${className}`}>
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-0 w-20 z-10 bg-gradient-to-r from-background to-transparent"
    />
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 right-0 w-20 z-10 bg-gradient-to-l from-background to-transparent"
    />
    <div
      className="marquee-track"
      style={{
        animationDuration: `${speed}s`,
        animationDirection: reverse ? 'reverse' : 'normal',
      }}
    >
      {/* Duplicated once: the track translates -50% for a seamless loop. */}
      {children}
      {children}
    </div>
  </div>
);
