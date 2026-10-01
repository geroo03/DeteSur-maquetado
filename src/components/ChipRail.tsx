import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../hooks';

export interface ChipItem<T extends string> {
  id: T;
  label: string;
  icon?: string;
}

interface ChipRailProps<T extends string> {
  items: ChipItem<T>[];
  value: T;
  onChange: (id: T) => void;
  label: string;
  className?: string;
}

interface PillBox {
  left: number;
  width: number;
  /** Measured at least once; before that the pill must not animate in. */
  ready: boolean;
}

/**
 * Horizontal chip selector where a single glass pill travels to whichever chip
 * is active, instead of each chip swapping colour on its own.
 *
 * The pill is one absolutely positioned element behind the row: it reads the
 * active chip's offset and width, so it tracks font loading, resizes and
 * horizontal scrolling without any per-frame work.
 */
export function ChipRail<T extends string>({
  items,
  value,
  onChange,
  label,
  className = '',
}: ChipRailProps<T>) {
  const reduced = usePrefersReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef(new Map<string, HTMLButtonElement>());
  const [pill, setPill] = useState<PillBox>({ left: 0, width: 0, ready: false });
  const [travelling, setTravelling] = useState(false);

  const measure = useCallback(() => {
    const node = chipRefs.current.get(value);
    if (!node) return;
    setPill({ left: node.offsetLeft, width: node.offsetWidth, ready: true });
  }, [value]);

  // Re-measure on mount, on selection change, and whenever the row reflows
  // (window resize, font swap, a filter chip appearing).
  useLayoutEffect(() => {
    measure();
    const track = trackRef.current;
    if (!track || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(measure);
    observer.observe(track);
    chipRefs.current.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [measure, items.length]);

  // Web fonts land after first paint and change chip widths.
  useEffect(() => {
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    fonts?.ready.then(measure).catch(() => {});
  }, [measure]);

  // Squash the pill very slightly while it is in flight — the "liquid" tell.
  useEffect(() => {
    if (!pill.ready || reduced) return;
    setTravelling(true);
    const timer = window.setTimeout(() => setTravelling(false), 460);
    return () => window.clearTimeout(timer);
  }, [value, pill.ready, reduced]);

  // Scroll a half-hidden chip into view, moving only the rail — never the page,
  // which would fight the sticky filter bar.
  useEffect(() => {
    const track = trackRef.current;
    const node = chipRefs.current.get(value);
    if (!track || !node) return;

    const pad = 24;
    const start = node.offsetLeft - pad;
    const end = node.offsetLeft + node.offsetWidth + pad;
    const viewStart = track.scrollLeft;
    const viewEnd = track.scrollLeft + track.clientWidth;

    let target: number | null = null;
    if (start < viewStart) target = start;
    else if (end > viewEnd) target = end - track.clientWidth;
    if (target === null) return;

    track.scrollTo({
      left: Math.max(0, target),
      behavior: reduced ? 'auto' : 'smooth',
    });
  }, [value, reduced]);

  const transition = reduced
    ? 'none'
    : // Slight overshoot on travel, calmer on the width change so the pill
      // settles instead of wobbling.
      'transform 460ms cubic-bezier(0.34, 1.32, 0.46, 1),' +
      ' width 460ms cubic-bezier(0.22, 1, 0.36, 1)';

  return (
    <div
      ref={trackRef}
      role="tablist"
      aria-label={label}
      className={`relative flex items-center gap-space-xs overflow-x-auto no-scrollbar px-space-sm pb-0.5 ${className}`}
    >
      {/* Travelling glass pill */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 h-9 rounded-full z-0"
        style={{
          width: pill.width,
          transform: `translate3d(${pill.left}px, 0, 0) scaleY(${
            travelling ? 0.9 : 1
          })`,
          transition: pill.ready
            ? `${transition}, opacity 200ms ease`
            : 'none',
          opacity: pill.ready ? 1 : 0,
          background:
            'linear-gradient(135deg, var(--color-primary-container) 0%, var(--color-primary) 100%)',
          boxShadow:
            '0 10px 22px -6px rgba(0, 119, 182, 0.5),' +
            ' inset 0 2px 4px rgba(255, 255, 255, 0.5),' +
            ' inset 0 -3px 7px rgba(0, 70, 120, 0.22)',
        }}
      >
        {/* Specular sheen that sweeps once each time the pill arrives */}
        <span
          key={value}
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{ opacity: reduced ? 0 : 1 }}
        >
          <span className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/45 to-transparent animate-chip-sheen" />
        </span>
      </span>

      {items.map((item) => {
        const active = item.id === value;
        return (
          <button
            key={item.id}
            ref={(node) => {
              if (node) chipRefs.current.set(item.id, node);
              else chipRefs.current.delete(item.id);
            }}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.id)}
            className={`relative z-10 shrink-0 px-space-md h-9 rounded-full font-label-md text-label-md font-bold flex items-center gap-1.5 transition-colors duration-300 ${
              active
                ? 'text-on-primary'
                : 'text-on-surface-variant bg-white/55 backdrop-blur-sm border border-white/70 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_2px_6px_rgba(9,27,56,0.05)] hover:bg-white/85 hover:text-on-surface hover:-translate-y-px'
            }`}
          >
            {item.icon && (
              <span
                className={`material-symbols-outlined text-[17px] transition-transform duration-400 ${
                  active ? 'fill-icon scale-110' : ''
                }`}
              >
                {item.icon}
              </span>
            )}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
