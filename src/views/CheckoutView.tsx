import React, { useMemo, useState } from 'react';
import { SmartImage } from '../components/SmartImage';
import { useStore } from '../context/StoreContext';
import { CONTACT, SHIPPING_RATES, STORE_BRANCHES } from '../data/content';
import {
  InvoiceType,
  PaymentMethod,
  ShippingAddress,
  ShippingMethod,
} from '../types';
import { Reveal } from '../components/Reveal';
import { estimatedDelivery, formatPrice } from '../lib/format';

const STEPS = [
  { id: 1, label: 'Carrito', icon: 'shopping_bag' },
  { id: 2, label: 'Envío', icon: 'local_shipping' },
  { id: 3, label: 'Pago', icon: 'credit_card' },
  { id: 4, label: 'Confirmación', icon: 'check_circle' },
];

const SHIPPING_OPTIONS: {
  id: ShippingMethod;
  title: string;
  body: string;
  icon: string;
  eta: string;
}[] = [
  {
    id: 'express',
    title: 'Envío express en el día',
    body: 'CABA y GBA Sur. Pedidos confirmados antes de las 14 hs.',
    icon: 'bolt',
    eta: 'Hoy',
  },
  {
    id: 'scheduled',
    title: 'Envío programado',
    body: 'Elegís el día. Resto de GBA en 48/72 hs con flota propia.',
    icon: 'event',
    eta: '48/72 hs',
  },
  {
    id: 'pickup',
    title: 'Retiro en sucursal',
    body: 'Sin cargo en Lanús Oeste, Quilmes o Avellaneda.',
    icon: 'storefront',
    eta: 'Desde 2 hs',
  },
];

const PAYMENT_OPTIONS: {
  id: PaymentMethod;
  title: string;
  body: string;
  icon: string;
  badge?: string;
}[] = [
  {
    id: 'mercadopago',
    title: 'Mercado Pago',
    body: 'Tarjetas de crédito y débito. 3 cuotas sin interés en bancos seleccionados.',
    icon: 'account_balance_wallet',
  },
  {
    id: 'transfer',
    title: 'Transferencia bancaria',
    body: 'Te enviamos el CBU al confirmar. Acreditación inmediata.',
    icon: 'account_balance',
    badge: '10% OFF',
  },
  {
    id: 'cash',
    title: 'Efectivo al retirar',
    body: 'Abonás en mostrador al retirar el pedido en sucursal.',
    icon: 'payments',
    badge: '10% OFF',
  },
];

/** Required fields per shipping mode, plus the fiscal fields for factura A. */
const validate = (
  address: ShippingAddress,
  shippingMethod: ShippingMethod,
  invoiceType: InvoiceType
): Partial<Record<keyof ShippingAddress, string>> => {
  const errors: Partial<Record<keyof ShippingAddress, string>> = {};

  if (address.fullName.trim().length < 3) errors.fullName = 'Ingresá nombre y apellido.';
  if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(address.email.trim()))
    errors.email = 'Revisá el email (ej: nombre@correo.com).';
  if (address.phone.replace(/\D/g, '').length < 8)
    errors.phone = 'Ingresá un teléfono de contacto válido.';

  if (shippingMethod !== 'pickup') {
    if (address.street.trim().length < 5) errors.street = 'Ingresá calle y altura.';
    if (address.locality.trim().length < 3) errors.locality = 'Ingresá la localidad.';
    if (!/^\d{4}$/.test(address.postalCode.trim()))
      errors.postalCode = 'El código postal son 4 dígitos.';
  }

  if (invoiceType === 'A') {
    if (!/^\d{11}$/.test((address.cuit ?? '').replace(/\D/g, '')))
      errors.cuit = 'El CUIT son 11 dígitos.';
    if ((address.businessName ?? '').trim().length < 3)
      errors.businessName = 'Ingresá la razón social.';
  }

  return errors;
};

/* ------------------------------------------------------------------ */
/* Field                                                               */
/* ------------------------------------------------------------------ */
const Field: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  icon?: string;
  className?: string;
  optional?: boolean;
  multiline?: boolean;
}> = ({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = 'text',
  icon,
  className = '',
  optional,
  multiline,
}) => (
  <div className={className}>
    <label className="block font-label-md text-label-md text-on-surface-variant font-semibold mb-1">
      {label}
      {optional && <span className="text-outline font-normal"> (opcional)</span>}
    </label>
    <div
      className={`flex items-start gap-space-xs px-space-md rounded-2xl bg-surface-container-low transition-all ${
        error
          ? 'shadow-[0_0_0_2px_var(--color-error)]'
          : 'focus-within:bg-white focus-within:shadow-[0_0_0_2px_var(--color-primary-container)]'
      }`}
    >
      {icon && (
        <span className="material-symbols-outlined text-[19px] text-outline shrink-0 mt-3">
          {icon}
        </span>
      )}
      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={3}
          aria-invalid={Boolean(error)}
          className="w-full bg-transparent py-3 font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none resize-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          className="w-full bg-transparent py-3 font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none"
        />
      )}
    </div>
    {error && (
      <p className="mt-1 font-label-md text-label-md text-error font-semibold flex items-center gap-1 animate-fade-down">
        <span className="material-symbols-outlined text-[14px]">error</span>
        {error}
      </p>
    )}
  </div>
);

/* ------------------------------------------------------------------ */
/* Checkout                                                            */
/* ------------------------------------------------------------------ */
export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartCount,
    totals,
    navigate,
    shippingMethod,
    setShippingMethod,
    paymentMethod,
    setPaymentMethod,
    invoiceType,
    setInvoiceType,
    shippingAddress,
    updateAddress,
    fillDemoAddress,
    placeOrder,
    pushToast,
    canjeUnits,
  } = useStore();

  const [submitted, setSubmitted] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(STORE_BRANCHES[0].id);

  const errors = useMemo(
    () => validate(shippingAddress, shippingMethod, invoiceType),
    [shippingAddress, shippingMethod, invoiceType]
  );
  const errorCount = Object.keys(errors).length;
  const showError = (field: keyof ShippingAddress) =>
    submitted ? errors[field] : undefined;

  const confirm = () => {
    setSubmitted(true);

    if (errorCount > 0) {
      pushToast({
        variant: 'error',
        title: 'Faltan datos para confirmar',
        message: `Revisá ${errorCount} campo${errorCount > 1 ? 's' : ''} marcado${errorCount > 1 ? 's' : ''} en rojo.`,
      });
      document
        .querySelector('[aria-invalid="true"]')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setProcessing(true);
    // Simulated payment authorization.
    window.setTimeout(() => {
      setProcessing(false);
      placeOrder();
    }, 1500);
  };

  /* -------------------------- empty cart -------------------------- */
  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center text-center py-space-2xl gap-space-md">
        <span className="material-symbols-outlined text-[72px] text-primary-fixed-dim animate-bob">
          shopping_cart_off
        </span>
        <h1 className="font-headline-lg text-2xl text-primary font-extrabold">
          No hay nada para pagar todavía
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
          Agregá productos al carrito y volvé para completar el envío y el pago.
        </p>
        <button
          onClick={() => navigate({ view: 'catalog' })}
          className="px-space-xl py-3.5 rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg font-bold clay-button-primary hover:scale-105 active:scale-95 transition-all"
        >
          Ir al catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-space-lg">
      {/* Step tracker */}
      <Reveal from="down">
        <div className="p-space-md rounded-3xl glass-panel">
          <div className="flex items-center justify-between gap-space-xs">
            {STEPS.map((step, index) => {
              const state = step.id < 3 ? 'done' : step.id === 3 ? 'current' : 'todo';
              return (
                <React.Fragment key={step.id}>
                  <button
                    onClick={() => {
                      if (step.id === 1) navigate({ view: 'cart' });
                    }}
                    className="flex flex-col sm:flex-row items-center gap-1 sm:gap-space-xs shrink-0"
                  >
                    <span
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-400 ${
                        state === 'done'
                          ? 'bg-secondary text-on-secondary'
                          : state === 'current'
                            ? 'bg-primary-container text-on-primary scale-110 animate-pulse-ring'
                            : 'bg-surface-container-high text-outline'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {state === 'done' ? 'check' : step.icon}
                      </span>
                    </span>
                    <span
                      className={`font-label-md text-label-md whitespace-nowrap ${
                        state === 'current'
                          ? 'text-primary font-extrabold'
                          : state === 'done'
                            ? 'text-secondary font-bold'
                            : 'text-outline font-semibold'
                      }`}
                    >
                      {step.label}
                    </span>
                  </button>

                  {index < STEPS.length - 1 && (
                    <span className="flex-1 h-0.5 rounded-full bg-surface-container-high overflow-hidden min-w-[12px]">
                      <span
                        className="block h-full bg-secondary origin-left transition-transform duration-700"
                        style={{ transform: `scaleX(${step.id < 3 ? 1 : 0})` }}
                      />
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        {/* ------------------------- form ------------------------- */}
        <div className="lg:col-span-8 space-y-space-lg">
          {/* Shipping */}
          <Reveal from="up">
            <section className="p-space-lg rounded-3xl bg-surface-container-lowest clay-card border border-slate-100">
              <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-md">
                <h2 className="font-headline-md text-headline-md text-on-surface font-extrabold flex items-center gap-space-xs">
                  <span className="w-9 h-9 rounded-full bg-primary-fixed text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[19px]">local_shipping</span>
                  </span>
                  Entrega
                </h2>
                <button
                  onClick={fillDemoAddress}
                  className="px-space-md py-1.5 rounded-full bg-surface-container-low text-primary font-label-md text-label-md font-bold hover:bg-surface-container transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">bolt</span>
                  Completar con datos de ejemplo
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm mb-space-lg">
                {SHIPPING_OPTIONS.map((option) => {
                  const active = shippingMethod === option.id;
                  const cost = SHIPPING_RATES[option.id];
                  const free = cost === 0 || totals.freeShippingGap === 0;

                  return (
                    <button
                      key={option.id}
                      onClick={() => setShippingMethod(option.id)}
                      className={`p-space-md rounded-2xl border text-left transition-all duration-300 ${
                        active
                          ? 'bg-primary-fixed/50 border-primary-container clay-card scale-[1.02]'
                          : 'bg-surface-container-low/60 border-slate-200 hover:border-primary-fixed-dim'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-space-xs">
                        <span
                          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                            active
                              ? 'bg-primary-container text-on-primary'
                              : 'bg-surface-container text-outline'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {option.icon}
                          </span>
                        </span>
                        <span
                          className={`material-symbols-outlined text-[20px] ${
                            active ? 'text-primary fill-icon' : 'text-outline-variant'
                          }`}
                        >
                          {active ? 'radio_button_checked' : 'radio_button_unchecked'}
                        </span>
                      </div>

                      <p className="mt-space-sm font-label-lg text-label-lg text-on-surface font-bold leading-tight">
                        {option.title}
                      </p>
                      <p className="mt-0.5 font-body-sm text-body-sm text-on-surface-variant">
                        {option.body}
                      </p>
                      <div className="mt-space-sm flex items-center justify-between">
                        <span className="font-label-sm text-label-sm text-outline font-bold uppercase">
                          {option.eta}
                        </span>
                        <span
                          className={`font-label-md text-label-md font-black ${
                            free ? 'text-secondary' : 'text-primary'
                          }`}
                        >
                          {free ? 'Gratis' : formatPrice(cost)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Branch picker or address form */}
              {shippingMethod === 'pickup' ? (
                <div className="space-y-space-sm animate-fade-up">
                  <p className="font-label-md text-label-md text-on-surface-variant font-semibold">
                    Elegí la sucursal donde vas a retirar
                  </p>
                  {STORE_BRANCHES.map((branch) => {
                    const active = selectedBranch === branch.id;
                    return (
                      <button
                        key={branch.id}
                        onClick={() => setSelectedBranch(branch.id)}
                        className={`w-full p-space-md rounded-2xl border text-left flex items-start gap-space-sm transition-all ${
                          active
                            ? 'bg-secondary-fixed/40 border-secondary clay-card'
                            : 'bg-surface-container-low/60 border-slate-200 hover:border-secondary-fixed-dim'
                        }`}
                      >
                        <span
                          className={`material-symbols-outlined text-[20px] shrink-0 mt-0.5 ${
                            active ? 'text-secondary fill-icon' : 'text-outline-variant'
                          }`}
                        >
                          {active ? 'radio_button_checked' : 'radio_button_unchecked'}
                        </span>
                        <div>
                          <p className="font-label-lg text-label-lg text-on-surface font-bold">
                            {branch.name}
                          </p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            {branch.address}
                          </p>
                          <p className="font-label-sm text-label-sm text-outline">
                            {branch.hours}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md animate-fade-up">
                  <Field
                    label="Nombre y apellido"
                    icon="person"
                    value={shippingAddress.fullName}
                    onChange={(value) => updateAddress('fullName', value)}
                    error={showError('fullName')}
                    placeholder="Federico Gómez"
                  />
                  <Field
                    label="Teléfono"
                    icon="call"
                    type="tel"
                    value={shippingAddress.phone}
                    onChange={(value) => updateAddress('phone', value)}
                    error={showError('phone')}
                    placeholder="11 4589-2210"
                  />
                  <Field
                    label="Email"
                    icon="mail"
                    type="email"
                    className="sm:col-span-2"
                    value={shippingAddress.email}
                    onChange={(value) => updateAddress('email', value)}
                    error={showError('email')}
                    placeholder="nombre@correo.com"
                  />
                  <Field
                    label="Calle y altura"
                    icon="home"
                    className="sm:col-span-2"
                    value={shippingAddress.street}
                    onChange={(value) => updateAddress('street', value)}
                    error={showError('street')}
                    placeholder="Av. Hipólito Yrigoyen 4200"
                  />
                  <Field
                    label="Piso / Depto"
                    icon="apartment"
                    optional
                    value={shippingAddress.apartment}
                    onChange={(value) => updateAddress('apartment', value)}
                    placeholder="4° B - Frente"
                  />
                  <Field
                    label="Localidad"
                    icon="location_city"
                    value={shippingAddress.locality}
                    onChange={(value) => updateAddress('locality', value)}
                    error={showError('locality')}
                    placeholder="Lanús Oeste"
                  />
                  <Field
                    label="Código postal"
                    icon="markunread_mailbox"
                    value={shippingAddress.postalCode}
                    onChange={(value) => updateAddress('postalCode', value)}
                    error={showError('postalCode')}
                    placeholder="1824"
                  />
                  <Field
                    label="Indicaciones para el repartidor"
                    icon="sticky_note_2"
                    optional
                    multiline
                    className="sm:col-span-2"
                    value={shippingAddress.notes}
                    onChange={(value) => updateAddress('notes', value)}
                    placeholder="Timbre, portería, horarios preferidos…"
                  />
                </div>
              )}
            </section>
          </Reveal>

          {/* Payment */}
          <Reveal from="up" delay={80}>
            <section className="p-space-lg rounded-3xl bg-surface-container-lowest clay-card border border-slate-100">
              <h2 className="font-headline-md text-headline-md text-on-surface font-extrabold flex items-center gap-space-xs mb-space-md">
                <span className="w-9 h-9 rounded-full bg-secondary-fixed text-on-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-[19px]">credit_card</span>
                </span>
                Medio de pago
              </h2>

              <div className="space-y-space-sm">
                {PAYMENT_OPTIONS.map((option) => {
                  const active = paymentMethod === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => setPaymentMethod(option.id)}
                      className={`w-full p-space-md rounded-2xl border text-left flex items-start gap-space-sm transition-all duration-300 ${
                        active
                          ? 'bg-primary-fixed/50 border-primary-container clay-card scale-[1.01]'
                          : 'bg-surface-container-low/60 border-slate-200 hover:border-primary-fixed-dim'
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-[20px] shrink-0 mt-0.5 ${
                          active ? 'text-primary fill-icon' : 'text-outline-variant'
                        }`}
                      >
                        {active ? 'radio_button_checked' : 'radio_button_unchecked'}
                      </span>

                      <span
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          active
                            ? 'bg-primary-container text-on-primary'
                            : 'bg-surface-container text-outline'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {option.icon}
                        </span>
                      </span>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-space-xs">
                          <span className="font-label-lg text-label-lg text-on-surface font-bold">
                            {option.title}
                          </span>
                          {option.badge && (
                            <span className="px-2 py-0.5 rounded-full bg-secondary text-on-secondary font-label-sm text-[10px] font-black">
                              {option.badge}
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 font-body-sm text-body-sm text-on-surface-variant">
                          {option.body}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Invoice type */}
              <div className="mt-space-lg pt-space-md border-t border-surface-container">
                <p className="font-label-md text-label-md text-on-surface-variant font-semibold mb-space-sm">
                  Tipo de comprobante
                </p>
                <div className="flex gap-space-sm">
                  {(['B', 'A'] as InvoiceType[]).map((type) => {
                    const active = invoiceType === type;
                    return (
                      <button
                        key={type}
                        onClick={() => setInvoiceType(type)}
                        className={`flex-1 p-space-md rounded-2xl border text-left transition-all duration-300 ${
                          active
                            ? 'bg-tertiary-fixed/50 border-tertiary clay-card'
                            : 'bg-surface-container-low/60 border-slate-200 hover:border-tertiary-fixed-dim'
                        }`}
                      >
                        <p className="font-label-lg text-label-lg text-on-surface font-bold">
                          Factura {type}
                        </p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          {type === 'B'
                            ? 'Consumidor final, sin discriminar IVA.'
                            : 'Responsable inscripto, discrimina IVA.'}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {invoiceType === 'A' && (
                  <div className="mt-space-md grid grid-cols-1 sm:grid-cols-2 gap-space-md animate-fade-up">
                    <Field
                      label="CUIT"
                      icon="badge"
                      value={shippingAddress.cuit ?? ''}
                      onChange={(value) => updateAddress('cuit', value)}
                      error={showError('cuit')}
                      placeholder="30712345678"
                    />
                    <Field
                      label="Razón social"
                      icon="business"
                      value={shippingAddress.businessName ?? ''}
                      onChange={(value) => updateAddress('businessName', value)}
                      error={showError('businessName')}
                      placeholder="Consorcio Edificio Sur SA"
                    />
                  </div>
                )}
              </div>
            </section>
          </Reveal>

          {/* Assistance */}
          <Reveal from="up" delay={140}>
            <div className="p-space-md rounded-3xl bg-gradient-to-r from-secondary-fixed/40 to-primary-fixed/30 border border-white flex flex-wrap items-center justify-between gap-space-md">
              <div className="flex items-center gap-space-sm">
                <span className="w-11 h-11 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">support_agent</span>
                </span>
                <div>
                  <p className="font-label-lg text-label-lg text-on-surface font-bold">
                    ¿Dudas con el pedido o la facturación?
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Te responde una persona del mostrador en menos de 15 minutos.
                  </p>
                </div>
              </div>
              <a
                href={CONTACT.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="px-space-lg py-2.5 rounded-full bg-secondary text-on-secondary font-label-md text-label-md font-bold clay-button-secondary hover:scale-105 active:scale-95 transition-all flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                Escribir por WhatsApp
              </a>
            </div>
          </Reveal>
        </div>

        {/* ------------------------ summary ------------------------ */}
        <div className="lg:col-span-4">
          <Reveal from="up">
            <div className="lg:sticky lg:top-32 p-space-lg rounded-3xl bg-surface-container-lowest clay-card border border-slate-100">
              <h2 className="font-headline-md text-headline-md text-on-surface font-extrabold mb-space-md">
                Tu pedido
              </h2>

              {/* Items */}
              <div className="space-y-space-xs max-h-56 overflow-y-auto pretty-scroll pr-1 mb-space-md">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-space-sm">
                    <div className="relative w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center shrink-0 overflow-hidden">
                      <SmartImage
                        src={item.product.image}
                        alt=""
                        className="w-9 h-9 object-contain"
                      />
                      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-primary-container text-on-primary font-label-sm text-[10px] font-black flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-label-md text-label-md text-on-surface font-semibold truncate">
                        {item.product.name}
                      </p>
                      <p className="font-label-sm text-label-sm text-outline truncate">
                        {item.presentation?.volume ?? item.product.packageType}
                      </p>
                    </div>
                    <span className="font-label-md text-label-md text-primary font-bold shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div className="space-y-space-xs font-body-md text-body-md pt-space-md border-t border-surface-container">
                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant">Subtotal ({cartCount} art.)</span>
                  <span className="font-bold">{formatPrice(totals.subtotal)}</span>
                </div>

                {totals.wholesaleDiscount > 0 && (
                  <div className="flex items-center justify-between text-tertiary font-semibold">
                    <span>Mayorista {Math.round((totals.wholesaleTier?.rate ?? 0) * 100)}%</span>
                    <span>−{formatPrice(totals.wholesaleDiscount)}</span>
                  </div>
                )}

                {totals.canjeDiscount > 0 && (
                  <div className="flex items-center justify-between text-secondary font-semibold">
                    <span>Plan Canje ({canjeUnits} env.)</span>
                    <span>−{formatPrice(totals.canjeDiscount)}</span>
                  </div>
                )}

                {totals.paymentDiscount > 0 && (
                  <div className="flex items-center justify-between text-secondary font-semibold animate-fade-in">
                    <span>
                      {paymentMethod === 'transfer' ? 'Transferencia' : 'Efectivo'} 10%
                    </span>
                    <span>−{formatPrice(totals.paymentDiscount)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant">
                    Envío {shippingMethod === 'pickup' ? '(retiro)' : ''}
                  </span>
                  <span
                    className={
                      totals.shippingCost === 0
                        ? 'text-secondary font-extrabold uppercase'
                        : 'font-bold'
                    }
                  >
                    {totals.shippingCost === 0 ? 'Gratis' : formatPrice(totals.shippingCost)}
                  </span>
                </div>

                <div className="pt-space-sm border-t border-surface-container flex items-end justify-between">
                  <span className="font-label-lg text-label-lg text-on-surface font-bold">
                    Total
                  </span>
                  <div className="text-right">
                    <span className="block font-price-integer text-3xl text-primary font-black leading-none">
                      {formatPrice(totals.total)}
                    </span>
                    <span className="font-label-sm text-label-sm text-outline">
                      IVA incluido {formatPrice(totals.taxIncluded)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery estimate */}
              <div className="mt-space-md p-space-sm rounded-2xl bg-primary-fixed/40 text-center">
                <p className="font-label-md text-label-md text-on-primary-fixed-variant font-bold">
                  <span className="material-symbols-outlined text-[16px] align-middle mr-1">
                    event_available
                  </span>
                  {shippingMethod === 'pickup'
                    ? 'Listo para retirar en 2 hs'
                    : `Llega ${estimatedDelivery(shippingMethod === 'express' ? 0 : 2)}`}
                </p>
              </div>

              {submitted && errorCount > 0 && (
                <p className="mt-space-sm p-space-sm rounded-2xl bg-error-container text-on-error-container font-label-md text-label-md font-bold text-center animate-fade-down">
                  Revisá {errorCount} campo{errorCount > 1 ? 's' : ''} antes de confirmar
                </p>
              )}

              <button
                onClick={confirm}
                disabled={processing}
                className="shine w-full mt-space-md py-4 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-bold clay-button-primary hover:bg-primary-container hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-space-xs disabled:opacity-80 disabled:scale-100"
              >
                {processing ? (
                  <>
                    <span className="material-symbols-outlined text-[20px] animate-spin-slow relative z-[2]">
                      progress_activity
                    </span>
                    <span className="relative z-[2]">Procesando pago…</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px] relative z-[2]">
                      lock
                    </span>
                    <span className="relative z-[2]">
                      Confirmar pedido · {formatPrice(totals.total)}
                    </span>
                  </>
                )}
              </button>

              <button
                onClick={() => navigate({ view: 'cart' })}
                className="w-full mt-space-sm py-2 font-label-md text-label-md text-primary font-bold hover:underline"
              >
                Volver al carrito
              </button>

              <p className="mt-space-sm font-label-sm text-label-sm text-outline text-center">
                Al confirmar aceptás los términos de venta. Operación protegida y datos
                cifrados.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
};
