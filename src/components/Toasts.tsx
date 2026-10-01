import React from 'react';
import { SmartImage } from './SmartImage';
import { useStore } from '../context/StoreContext';
import { Toast } from '../types';

const VARIANT_STYLES: Record<
  Toast['variant'],
  { icon: string; ring: string; iconBg: string }
> = {
  success: {
    icon: 'check_circle',
    ring: 'border-secondary-fixed-dim',
    iconBg: 'bg-secondary text-on-secondary',
  },
  cart: {
    icon: 'shopping_bag',
    ring: 'border-primary-fixed-dim',
    iconBg: 'bg-primary-container text-on-primary',
  },
  info: {
    icon: 'info',
    ring: 'border-outline-variant',
    iconBg: 'bg-surface-container-high text-on-surface-variant',
  },
  error: {
    icon: 'error',
    ring: 'border-error-container',
    iconBg: 'bg-error text-on-error',
  },
};

const ToastCard: React.FC<{ toast: Toast; onDismiss: () => void }> = ({
  toast,
  onDismiss,
}) => {
  const style = VARIANT_STYLES[toast.variant];

  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-auto relative w-[min(92vw,360px)] p-space-sm rounded-2xl glass-panel border ${style.ring} shadow-[0_20px_40px_-12px_rgba(9,27,56,0.25)] flex items-start gap-space-sm animate-slide-in-right`}
    >
      {toast.image ? (
        <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
          <SmartImage src={toast.image} alt="" className="w-9 h-9 object-contain" />
        </div>
      ) : (
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${style.iconBg}`}
        >
          <span className="material-symbols-outlined text-[20px]">{style.icon}</span>
        </div>
      )}

      <div className="flex-1 min-w-0 pt-0.5">
        <p className="font-label-lg text-label-lg text-on-surface font-bold leading-tight">
          {toast.title}
        </p>
        {toast.message && (
          <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-0.5">
            {toast.message}
          </p>
        )}
        {toast.actionLabel && toast.onAction && (
          <button
            onClick={() => {
              toast.onAction?.();
              onDismiss();
            }}
            className="mt-1.5 font-label-md text-label-md text-primary font-bold hover:underline inline-flex items-center gap-1"
          >
            {toast.actionLabel}
            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
          </button>
        )}
      </div>

      <button
        onClick={onDismiss}
        aria-label="Cerrar notificación"
        className="w-7 h-7 rounded-full text-outline hover:text-on-surface hover:bg-surface-container flex items-center justify-center shrink-0 transition-colors"
      >
        <span className="material-symbols-outlined text-[16px]">close</span>
      </button>

      {/* Auto-dismiss countdown */}
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary-container/30 overflow-hidden"
      >
        <span
          className="block h-full bg-primary-container origin-left"
          style={{ animation: 'count-down 4.2s linear forwards' }}
        />
      </span>
    </div>
  );
};

export const Toasts: React.FC = () => {
  const { toasts, dismissToast } = useStore();

  return (
    <>
      <style>{`@keyframes count-down { from { transform: scaleX(1); } to { transform: scaleX(0); } }`}</style>
      <div className="fixed top-24 md:top-28 right-space-sm md:right-space-md z-[70] flex flex-col items-end gap-space-sm pointer-events-none">
        {toasts.map((toast) => (
          <ToastCard
            key={toast.id}
            toast={toast}
            onDismiss={() => dismissToast(toast.id)}
          />
        ))}
      </div>
    </>
  );
};
