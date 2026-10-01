import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { CONTACT } from '../data/content';
import { BEST_SELLERS, getProductById } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { ScrollCarousel } from '../components/Carousel';
import { Reveal } from '../components/Reveal';
import { useEscapeKey, useLockBodyScroll, usePrefersReducedMotion } from '../hooks';
import { estimatedDelivery, formatPrice, formatPriceLong } from '../lib/format';

const TRACKING_STEPS = [
  {
    id: 0,
    label: 'Pedido recibido',
    icon: 'receipt_long',
    detail: 'Registramos tu compra y enviamos el comprobante por email.',
  },
  {
    id: 1,
    label: 'En preparación',
    icon: 'inventory_2',
    detail: 'Estamos fraccionando y embalando los bidones en planta.',
  },
  {
    id: 2,
    label: 'En camino',
    icon: 'local_shipping',
    detail: 'El pedido salió con nuestra flota propia hacia tu domicilio.',
  },
  {
    id: 3,
    label: 'Entregado',
    icon: 'task_alt',
    detail: 'Pedido entregado y conforme. ¡Gracias por elegirnos!',
  },
];

/* ------------------------------------------------------------------ */
/* Confetti burst                                                      */
/* ------------------------------------------------------------------ */
const Confetti: React.FC = () => {
  const reduced = usePrefersReducedMotion();
  if (reduced) return null;

  const pieces = Array.from({ length: 28 }, (_, index) => index);
  const colors = ['#0077b6', '#70f8e8', '#654f7e', '#94ccff', '#4fdbcc'];

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
      {pieces.map((piece) => {
        const left = (piece * 37) % 100;
        const delay = (piece % 7) * 0.14;
        const size = 6 + (piece % 4) * 3;
        return (
          <span
            key={piece}
            className="absolute rounded-sm"
            style={{
              left: `${left}%`,
              top: '-5%',
              width: size,
              height: size * 1.6,
              background: colors[piece % colors.length],
              animation: `confetti-fall 2.6s cubic-bezier(0.3,0.7,0.6,1) ${delay}s forwards`,
            }}
          />
        );
      })}
      <style>{`@keyframes confetti-fall {
        0% { transform: translate3d(0,0,0) rotate(0deg); opacity: 1; }
        100% { transform: translate3d(calc(var(--drift, 20px)), 420px, 0) rotate(540deg); opacity: 0; }
      }`}</style>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Invoice modal                                                       */
/* ------------------------------------------------------------------ */
const InvoiceModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { lastOrder } = useStore();
  useLockBodyScroll(true);
  useEscapeKey(onClose, true);

  if (!lastOrder) return null;

  const { totals, address, invoiceType, orderNumber, placedAt } = lastOrder;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-space-md">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#091b38]/55 backdrop-blur-sm animate-fade-in"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Comprobante del pedido"
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto pretty-scroll bg-white rounded-3xl shadow-[0_40px_80px_-20px_rgba(9,27,56,0.4)] animate-zoom-in"
      >
        <div className="p-space-lg border-b border-slate-200 flex items-start justify-between gap-space-md">
          <div>
            <p className="font-label-sm text-label-sm text-outline uppercase tracking-widest font-bold">
              Factura {invoiceType}
            </p>
            <h3 className="font-headline-md text-headline-md text-primary font-extrabold">
              Detersur Química Argentina
            </h3>
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              CUIT 30-71234567-8 · {CONTACT.address}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar comprobante"
            className="w-9 h-9 rounded-full bg-surface-container-low text-on-surface flex items-center justify-center shrink-0 active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined text-[19px]">close</span>
          </button>
        </div>

        <div className="p-space-lg space-y-space-md">
          <div className="grid grid-cols-2 gap-space-sm font-label-md text-label-md">
            <div>
              <p className="text-outline">Comprobante</p>
              <p className="text-on-surface font-bold">{orderNumber}</p>
            </div>
            <div>
              <p className="text-outline">Fecha</p>
              <p className="text-on-surface font-bold">
                {new Date(placedAt).toLocaleDateString('es-AR')}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-outline">Cliente</p>
              <p className="text-on-surface font-bold">
                {address.businessName || address.fullName}
              </p>
              {address.cuit && (
                <p className="text-on-surface-variant">CUIT {address.cuit}</p>
              )}
            </div>
          </div>

          <table className="w-full font-label-md text-label-md">
            <tbody className="divide-y divide-slate-100">
              {lastOrder.items.map((line) => {
                const product = getProductById(line.productId);
                if (!product) return null;
                const presentation = product.presentations?.find(
                  (p) => p.id === line.presentationId
                );
                const price = presentation?.price ?? product.price;
                return (
                  <tr key={`${line.productId}-${line.presentationId ?? ''}`}>
                    <td className="py-2 text-on-surface">
                      {product.name}
                      {presentation && (
                        <span className="text-outline"> · {presentation.volume}</span>
                      )}
                    </td>
                    <td className="py-2 text-center text-on-surface-variant tabular-nums">
                      ×{line.quantity}
                    </td>
                    <td className="py-2 text-right text-on-surface font-bold tabular-nums">
                      {formatPrice(price * line.quantity)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="pt-space-sm border-t border-slate-200 space-y-1 font-label-md text-label-md">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Subtotal</span>
              <span className="font-bold tabular-nums">{formatPrice(totals.subtotal)}</span>
            </div>
            {totals.wholesaleDiscount > 0 && (
              <div className="flex justify-between text-tertiary">
                <span>Descuento mayorista</span>
                <span className="tabular-nums">−{formatPrice(totals.wholesaleDiscount)}</span>
              </div>
            )}
            {totals.canjeDiscount > 0 && (
              <div className="flex justify-between text-secondary">
                <span>Plan Canje envases</span>
                <span className="tabular-nums">−{formatPrice(totals.canjeDiscount)}</span>
              </div>
            )}
            {totals.paymentDiscount > 0 && (
              <div className="flex justify-between text-secondary">
                <span>Descuento por medio de pago</span>
                <span className="tabular-nums">−{formatPrice(totals.paymentDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Envío</span>
              <span className="tabular-nums font-bold">
                {totals.shippingCost === 0 ? 'Bonificado' : formatPrice(totals.shippingCost)}
              </span>
            </div>
            {invoiceType === 'A' && (
              <div className="flex justify-between text-on-surface-variant">
                <span>IVA 21% contenido</span>
                <span className="tabular-nums">{formatPrice(totals.taxIncluded)}</span>
              </div>
            )}
            <div className="flex justify-between pt-space-sm border-t border-slate-200 font-headline-sm text-headline-sm">
              <span className="font-extrabold">Total</span>
              <span className="text-primary font-black tabular-nums">
                {formatPriceLong(totals.total)}
              </span>
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className="w-full py-3 rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg font-bold clay-button-primary hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-space-xs"
          >
            <span className="material-symbols-outlined text-[19px]">print</span>
            Imprimir o guardar PDF
          </button>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Confirmation                                                        */
/* ------------------------------------------------------------------ */
export const ConfirmationView: React.FC = () => {
  const { lastOrder, navigate } = useStore();
  const [activeStep, setActiveStep] = useState(0);
  const [showInvoice, setShowInvoice] = useState(false);
  const [copied, setCopied] = useState(false);

  // Walk the tracker forward so the demo shows the animation without waiting.
  useEffect(() => {
    const timers = [
      window.setTimeout(() => setActiveStep(1), 2600),
      window.setTimeout(() => setActiveStep(2), 6200),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, []);

  if (!lastOrder) {
    return (
      <div className="flex flex-col items-center text-center py-space-2xl gap-space-md">
        <span className="material-symbols-outlined text-[72px] text-primary-fixed-dim animate-bob">
          receipt_long
        </span>
        <h1 className="font-headline-lg text-2xl text-primary font-extrabold">
          Todavía no hay pedidos confirmados
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
          Cuando completes una compra vas a ver acá el seguimiento y el comprobante.
        </p>
        <button
          onClick={() => navigate({ view: 'catalog' })}
          className="px-space-xl py-3.5 rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg font-bold clay-button-primary hover:scale-105 active:scale-95 transition-all"
        >
          Empezar a comprar
        </button>
      </div>
    );
  }

  const { orderNumber, totals, address, shippingMethod, paymentMethod, invoiceType, itemCount } =
    lastOrder;

  const copyOrderNumber = async () => {
    try {
      await navigator.clipboard.writeText(orderNumber);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — the number is visible on screen anyway */
    }
  };

  return (
    <div className="flex flex-col w-full gap-space-xl">
      {/* Hero */}
      <section className="relative rounded-3xl bg-gradient-to-br from-secondary-fixed/50 via-surface-container-lowest to-primary-fixed/40 p-space-lg md:p-space-xl clay-card border border-white overflow-hidden text-center">
        <Confetti />

        <div className="relative">
          {/* Animated check */}
          <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-secondary/25 animate-ripple" />
            <span
              className="absolute inset-0 rounded-full bg-secondary/25 animate-ripple"
              style={{ animationDelay: '1.1s' }}
            />
            <div className="relative w-20 h-20 rounded-full bg-secondary text-on-secondary flex items-center justify-center clay-button-secondary animate-pop">
              <svg viewBox="0 0 52 52" className="w-11 h-11" aria-hidden="true">
                <path
                  d="M14 27 L22 35 L38 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="48"
                  style={{ '--draw-length': 48 } as React.CSSProperties}
                  className="animate-draw"
                />
              </svg>
            </div>
          </div>

          <Reveal from="up" delay={200}>
            <>
              <div className="mt-space-md inline-flex items-center gap-space-xs px-space-md py-1 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm font-bold uppercase tracking-wider shadow-sm">
                <span className="material-symbols-outlined text-[15px]">verified</span>
                Pago aprobado
              </div>

              <h1 className="mt-space-sm font-headline-lg text-2xl md:text-4xl text-primary font-extrabold tracking-tight">
                ¡Gracias por tu compra{address.fullName ? `, ${address.fullName.split(' ')[0]}` : ''}!
              </h1>

              <p className="mt-space-sm font-body-lg text-body-md md:text-body-lg text-on-surface-variant max-w-2xl mx-auto">
                Tu pedido quedó confirmado y ya está en preparación en nuestra planta de Lanús
                Oeste. Te enviamos el comprobante a{' '}
                <strong className="text-on-surface">{address.email || 'tu email'}</strong>.
              </p>

              {/* Order chips */}
              <div className="mt-space-lg flex flex-wrap items-center justify-center gap-space-sm">
                <button
                  onClick={copyOrderNumber}
                  className="group px-space-lg py-space-sm rounded-2xl bg-surface-container-lowest clay-card border border-white flex items-center gap-space-sm hover:-translate-y-0.5 transition-all"
                >
                  <div className="text-left">
                    <p className="font-label-sm text-label-sm text-outline uppercase font-bold tracking-wide">
                      N° de pedido
                    </p>
                    <p className="font-headline-sm text-headline-sm text-primary font-black">
                      {orderNumber}
                    </p>
                  </div>
                  <span
                    className={`material-symbols-outlined text-[19px] transition-colors ${
                      copied ? 'text-secondary' : 'text-outline group-hover:text-primary'
                    }`}
                  >
                    {copied ? 'check' : 'content_copy'}
                  </span>
                </button>

                <div className="px-space-lg py-space-sm rounded-2xl bg-surface-container-lowest clay-card border border-white text-left">
                  <p className="font-label-sm text-label-sm text-outline uppercase font-bold tracking-wide">
                    Total abonado
                  </p>
                  <p className="font-headline-sm text-headline-sm text-primary font-black">
                    {formatPrice(totals.total)}
                  </p>
                </div>

                <div className="px-space-lg py-space-sm rounded-2xl bg-surface-container-lowest clay-card border border-white text-left">
                  <p className="font-label-sm text-label-sm text-outline uppercase font-bold tracking-wide">
                    {shippingMethod === 'pickup' ? 'Retiro' : 'Entrega estimada'}
                  </p>
                  <p className="font-headline-sm text-headline-sm text-primary font-black first-letter:uppercase">
                    {shippingMethod === 'pickup'
                      ? 'Hoy, desde 2 hs'
                      : estimatedDelivery(shippingMethod === 'express' ? 0 : 2).replace(
                          /^el /,
                          ''
                        )}
                  </p>
                </div>
              </div>
            </>
          </Reveal>
        </div>
      </section>

      {/* Tracker */}
      <Reveal from="up">
        <section className="p-space-lg rounded-3xl bg-surface-container-lowest clay-card border border-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-lg">
            <h2 className="font-headline-md text-headline-md text-on-surface font-extrabold flex items-center gap-space-xs">
              <span className="w-9 h-9 rounded-full bg-primary-fixed text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[19px]">conveyor_belt</span>
              </span>
              Seguimiento en vivo
            </h2>
            <span className="inline-flex items-center gap-1.5 px-space-md py-1 rounded-full bg-secondary-fixed/50 text-on-secondary-fixed-variant font-label-md text-label-md font-bold">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              Actualizado hace instantes
            </span>
          </div>

          {/* Desktop horizontal / mobile vertical */}
          <div className="relative">
            <div className="hidden md:block absolute top-6 left-[12%] right-[12%] h-1 rounded-full bg-surface-container-high overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-secondary to-primary-container origin-left transition-transform duration-1000 ease-out"
                style={{ transform: `scaleX(${activeStep / (TRACKING_STEPS.length - 1)})` }}
              />
            </div>

            <ol className="relative grid grid-cols-1 md:grid-cols-4 gap-space-lg md:gap-space-sm">
              {TRACKING_STEPS.map((step) => {
                const done = step.id < activeStep;
                const current = step.id === activeStep;

                return (
                  <li
                    key={step.id}
                    className="flex md:flex-col items-start md:items-center gap-space-sm md:text-center"
                  >
                    <span
                      className={`relative w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${
                        done
                          ? 'bg-secondary text-on-secondary'
                          : current
                            ? 'bg-primary-container text-on-primary scale-110 animate-pulse-ring'
                            : 'bg-surface-container-high text-outline'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[22px]">
                        {done ? 'check' : step.icon}
                      </span>
                    </span>

                    <div className="md:mt-space-xs">
                      <p
                        className={`font-label-lg text-label-lg font-bold ${
                          current
                            ? 'text-primary'
                            : done
                              ? 'text-secondary'
                              : 'text-on-surface-variant'
                        }`}
                      >
                        {step.label}
                      </p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                        {step.detail}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      </Reveal>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        <Reveal from="up">
          <section className="h-full p-space-lg rounded-3xl bg-surface-container-lowest clay-card border border-slate-100">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-extrabold flex items-center gap-space-xs mb-space-md">
              <span className="material-symbols-outlined text-[20px] text-primary">
                {shippingMethod === 'pickup' ? 'storefront' : 'local_shipping'}
              </span>
              {shippingMethod === 'pickup' ? 'Retiro en sucursal' : 'Datos de entrega'}
            </h3>

            <dl className="space-y-space-sm font-body-md text-body-md">
              {[
                { label: 'Destinatario', value: address.fullName || '—' },
                { label: 'Teléfono', value: address.phone || '—' },
                ...(shippingMethod === 'pickup'
                  ? [{ label: 'Sucursal', value: 'Casa Central Lanús Oeste' }]
                  : [
                      {
                        label: 'Domicilio',
                        value: `${address.street}${address.apartment ? `, ${address.apartment}` : ''}`,
                      },
                      {
                        label: 'Localidad',
                        value: `${address.locality}${address.postalCode ? ` (CP ${address.postalCode})` : ''}`,
                      },
                    ]),
                {
                  label: 'Modalidad',
                  value:
                    shippingMethod === 'express'
                      ? 'Express en el día'
                      : shippingMethod === 'scheduled'
                        ? 'Programado 48/72 hs'
                        : 'Retiro en mostrador',
                },
              ].map((row) => (
                <div key={row.label} className="flex items-start justify-between gap-space-sm">
                  <dt className="text-on-surface-variant shrink-0">{row.label}</dt>
                  <dd className="text-on-surface font-bold text-right">{row.value}</dd>
                </div>
              ))}
            </dl>

            {address.notes && (
              <div className="mt-space-md p-space-sm rounded-2xl bg-surface-container-low/70">
                <p className="font-label-sm text-label-sm text-outline uppercase font-bold tracking-wide mb-1">
                  Indicaciones
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  {address.notes}
                </p>
              </div>
            )}
          </section>
        </Reveal>

        <Reveal from="up" delay={80}>
          <section className="h-full p-space-lg rounded-3xl bg-surface-container-lowest clay-card border border-slate-100">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-extrabold flex items-center gap-space-xs mb-space-md">
              <span className="material-symbols-outlined text-[20px] text-secondary">
                receipt_long
              </span>
              Pago y facturación
            </h3>

            <dl className="space-y-space-sm font-body-md text-body-md">
              <div className="flex items-center justify-between">
                <dt className="text-on-surface-variant">Medio de pago</dt>
                <dd className="text-on-surface font-bold">
                  {paymentMethod === 'mercadopago'
                    ? 'Mercado Pago'
                    : paymentMethod === 'transfer'
                      ? 'Transferencia bancaria'
                      : 'Efectivo al retirar'}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-on-surface-variant">Comprobante</dt>
                <dd className="text-on-surface font-bold">Factura {invoiceType}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-on-surface-variant">Artículos</dt>
                <dd className="text-on-surface font-bold">{itemCount} unidades</dd>
              </div>

              <div className="pt-space-sm border-t border-surface-container space-y-1">
                <div className="flex items-center justify-between">
                  <dt className="text-on-surface-variant">Subtotal</dt>
                  <dd className="font-bold">{formatPrice(totals.subtotal)}</dd>
                </div>
                {totals.savings > 0 && (
                  <div className="flex items-center justify-between text-secondary font-bold">
                    <dt>Descuentos aplicados</dt>
                    <dd>−{formatPrice(totals.savings)}</dd>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <dt className="text-on-surface-variant">Envío</dt>
                  <dd className="font-bold">
                    {totals.shippingCost === 0 ? 'Bonificado' : formatPrice(totals.shippingCost)}
                  </dd>
                </div>
                <div className="flex items-end justify-between pt-space-xs">
                  <dt className="font-label-lg text-label-lg font-extrabold">Total</dt>
                  <dd className="font-price-integer text-2xl text-primary font-black leading-none">
                    {formatPrice(totals.total)}
                  </dd>
                </div>
              </div>
            </dl>

            <button
              onClick={() => setShowInvoice(true)}
              className="w-full mt-space-md py-3 rounded-full bg-surface-container-low text-primary font-label-lg text-label-lg font-bold hover:bg-surface-container active:scale-95 transition-all flex items-center justify-center gap-space-xs"
            >
              <span className="material-symbols-outlined text-[19px]">description</span>
              Ver comprobante
            </button>
          </section>
        </Reveal>
      </div>

      {/* CTAs */}
      <Reveal from="up">
        <div className="flex flex-wrap items-center justify-center gap-space-sm">
          <button
            onClick={() => navigate({ view: 'catalog' })}
            className="px-space-xl py-3.5 rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg font-bold clay-button-primary hover:scale-105 active:scale-95 transition-all flex items-center gap-space-xs"
          >
            <span className="material-symbols-outlined text-[20px]">storefront</span>
            Seguir comprando
          </button>
          <a
            href={CONTACT.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="px-space-xl py-3.5 rounded-full bg-secondary text-on-secondary font-label-lg text-label-lg font-bold clay-button-secondary hover:scale-105 active:scale-95 transition-all flex items-center gap-space-xs"
          >
            <span className="material-symbols-outlined text-[20px]">chat</span>
            Consultar por el pedido
          </a>
          <button
            onClick={() => navigate({ view: 'home' })}
            className="px-space-xl py-3.5 rounded-full bg-surface-container-lowest text-primary font-label-lg text-label-lg font-bold clay-card border border-slate-100 hover:-translate-y-0.5 active:scale-95 transition-all"
          >
            Volver al inicio
          </button>
        </div>
      </Reveal>

      {/* Recommendations */}
      <section>
        <ScrollCarousel
          label="Para tu próximo pedido"
          header={
            <Reveal from="up">
              <div>
                <div className="inline-flex items-center gap-1 font-label-sm text-label-sm text-secondary uppercase font-extrabold tracking-widest">
                  <span className="material-symbols-outlined text-[16px]">redeem</span>
                  Te puede interesar
                </div>
                <h2 className="font-headline-lg text-2xl md:text-headline-lg text-primary font-extrabold tracking-tight">
                  Para tu próximo pedido
                </h2>
              </div>
            </Reveal>
          }
        >
          {BEST_SELLERS.map((product) => (
            <div key={product.id} className="snap-item min-w-[250px] w-[250px] shrink-0">
              <ProductCard product={product} variant="compact" className="h-full" />
            </div>
          ))}
        </ScrollCarousel>
      </section>

      {showInvoice && <InvoiceModal onClose={() => setShowInvoice(false)} />}
    </div>
  );
};
