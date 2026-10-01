import React from 'react';
import { useScrollPosition } from '../hooks';

/** Floating scroll-to-top button with a circular reading-progress ring. */
export const BackToTop: React.FC = () => {
  const { progress, scrolled } = useScrollPosition(600);
  const radius = 20;
  const circumference = 2 * Math.PI * radius;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Volver arriba"
      className={`fixed bottom-24 md:bottom-6 left-space-md z-40 w-12 h-12 rounded-full glass-panel shadow-[0_16px_32px_-8px_rgba(9,27,56,0.25)] flex items-center justify-center text-primary transition-all duration-400 hover:scale-110 active:scale-95 ${
        scrolled
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <svg
        className="absolute inset-0 w-full h-full -rotate-90"
        viewBox="0 0 48 48"
        aria-hidden="true"
      >
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeOpacity="0.15"
        />
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          style={{ transition: 'stroke-dashoffset 120ms linear' }}
        />
      </svg>
      <span className="material-symbols-outlined text-[22px] relative">arrow_upward</span>
    </button>
  );
};
