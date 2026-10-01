import React from 'react';
import { useCountUp, useInViewOnce } from '../hooks';

interface CounterProps {
  /** Numeric part to animate. */
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  duration?: number;
}

/** Counts up from zero the first time it scrolls into view. */
export const Counter: React.FC<CounterProps> = ({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
  duration = 1600,
}) => {
  const { ref, inView } = useInViewOnce<HTMLSpanElement>({ threshold: 0.4 });
  const current = useCountUp(value, inView, duration);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {current.toLocaleString('es-AR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
};
