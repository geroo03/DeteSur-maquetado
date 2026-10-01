import React from 'react';
import { useInViewOnce, usePrefersReducedMotion } from '../hooks';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface RevealProps {
  children: React.ReactNode;
  /** Entrance offset direction. */
  from?: Direction;
  /** Stagger in milliseconds. */
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  as?: 'div' | 'section' | 'li' | 'article' | 'span' | 'aside';
  /** Replay the animation whenever the element re-enters the viewport. */
  repeat?: boolean;
}

const offsets: Record<Direction, (d: number) => string> = {
  up: (d) => `translate3d(0, ${d}px, 0)`,
  down: (d) => `translate3d(0, -${d}px, 0)`,
  left: (d) => `translate3d(${d}px, 0, 0)`,
  right: (d) => `translate3d(-${d}px, 0, 0)`,
  none: () => 'none',
};

/**
 * Scroll-triggered entrance animation. Uses IntersectionObserver plus a plain
 * CSS transition, so it costs nothing on the main thread while idle and it
 * degrades to "always visible" when motion is reduced.
 */
export const Reveal: React.FC<RevealProps> = ({
  children,
  from = 'up',
  delay = 0,
  duration = 620,
  distance = 26,
  className = '',
  as = 'div',
  repeat = false,
}) => {
  const reduced = usePrefersReducedMotion();
  const { ref, inView } = useInViewOnce<HTMLDivElement>({ once: !repeat });
  const Tag = as as React.ElementType;

  if (reduced) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : offsets[from](distance),
        transition: `opacity ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        willChange: inView ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </Tag>
  );
};

/** Convenience wrapper that staggers a list of children. */
export const RevealGroup: React.FC<{
  children: React.ReactNode[];
  step?: number;
  from?: Direction;
  className?: string;
  itemClassName?: string;
}> = ({ children, step = 70, from = 'up', className = '', itemClassName = '' }) => (
  <div className={className}>
    {children.map((child, index) => (
      <Reveal key={index} from={from} delay={index * step} className={itemClassName}>
        {child}
      </Reveal>
    ))}
  </div>
);
