import React, { useState } from 'react';
import { SmartImage } from './SmartImage';
import { LOGO_URL } from '../data/products';
import { CONTACT, STORE_BRANCHES } from '../data/content';
import { useStore } from '../context/StoreContext';
import { CategoryId } from '../types';
import { useIsDesktop } from '../hooks';
import { Reveal } from './Reveal';

interface FooterLink {
  label: string;
  category?: CategoryId;
  query?: string;
  view?: 'home' | 'catalog' | 'checkout' | 'cart';
}

const FOOTER_COLUMNS: { title: string; icon: string; links: FooterLink[] }[] = [
  {
    title: 'Líneas Directas Químicas',
    icon: 'science',
    links: [
      { label: 'Lavandinas & Cloro Activo', category: 'sueltos', query: 'lavandina' },
      { label: 'Jabones Líquidos Textiles', category: 'ropa', query: 'jabon' },
      { label: 'Desinfectantes y Amonios', category: 'sueltos', query: 'amonio' },
      { label: 'Bidones 5L / Tambores 200L', category: 'sueltos' },
      { label: 'Aromas y Difusores', category: 'aromas' },
    ],
  },
  {
    title: 'Atención & Envíos',
    icon: 'local_shipping',
    links: [
      { label: 'Zonas de Entrega GBA y CABA', view: 'checkout' },
      { label: 'Venta Mayorista B2B', view: 'catalog' },
      { label: 'Facturación A / B', view: 'checkout' },
      { label: 'Puntos de Retiro Express', view: 'catalog' },
      { label: 'Seguimiento de pedido', view: 'cart' },
    ],
  },
];

const SOCIALS = [
  { id: 'whatsapp', label: 'WhatsApp', icon: 'chat', href: CONTACT.whatsapp },
  { id: 'instagram', label: 'Instagram', icon: 'photo_camera', href: 'https://instagram.com' },
  { id: 'facebook', label: 'Facebook', icon: 'thumb_up', href: 'https://facebook.com' },
  { id: 'mail', label: 'Email', icon: 'mail', href: `mailto:${CONTACT.email}` },
];

const PAYMENT_BADGES = [
  { label: 'Mercado Pago', icon: 'account_balance_wallet' },
  { label: 'Visa / Mastercard', icon: 'credit_card' },
  { label: 'Transferencia', icon: 'account_balance' },
  { label: 'Efectivo', icon: 'payments' },
];

/* ------------------------------------------------------------------ */
/* Newsletter                                                          */
/* ------------------------------------------------------------------ */
const Newsletter: React.FC = () => {
  const { pushToast } = useStore();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle');
  const [error, setError] = useState('');

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const value = email.trim();

    if (!value) {
      setError('Ingresá tu email para suscribirte.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(value)) {
      setError('Revisá el formato del email (ej: nombre@correo.com).');
      return;
    }

    setError('');
    setStatus('sending');

    // Simulated network round-trip — no backend in this demo.
    window.setTimeout(() => {
      setStatus('done');
      pushToast({
        variant: 'success',
        title: '¡Suscripción confirmada!',
        message: 'Te vamos a avisar de las ofertas antes que al resto.',
      });
    }, 900);
  };

  if (status === 'done') {
    return (
      <div className="p-space-lg rounded-3xl bg-gradient-to-br from-secondary-fixed/50 to-primary-fixed/40 border border-white text-center animate-zoom-in">
        <div className="w-14 h-14 mx-auto rounded-full bg-secondary text-on-secondary flex items-center justify-center clay-button-secondary animate-pop">
          <span className="material-symbols-outlined text-[28px]">mark_email_read</span>
        </div>
        <h3 className="mt-space-sm font-headline-md text-headline-md text-primary font-extrabold">
          ¡Listo, ya estás adentro!
        </h3>
        <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant max-w-sm mx-auto">
          Vas a recibir las ofertas de química suelta y los avisos de reposición de bidones
          en <strong className="text-on-surface">{email}</strong>.
        </p>
        <button
          onClick={() => {
            setStatus('idle');
            setEmail('');
          }}
          className="mt-space-sm font-label-md text-label-md text-primary font-bold hover:underline"
        >
          Suscribir otro email
        </button>
      </div>
    );
  }

  return (
    <div className="p-space-lg rounded-3xl bg-gradient-to-br from-primary-fixed/50 via-surface-container-lowest to-secondary-fixed/40 border border-white clay-card">
      <div className="flex flex-col lg:flex-row lg:items-center gap-space-lg">
        <div className="lg:flex-1">
          <div className="inline-flex items-center gap-space-xs px-space-md py-1 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm font-bold uppercase tracking-wider shadow-sm mb-space-sm">
            <span className="material-symbols-outlined text-[15px]">campaign</span>
            Lista de ofertas
          </div>
          <h3 className="font-headline-lg text-xl md:text-headline-lg text-primary font-extrabold tracking-tight">
            Enterate de las bajas de precio antes que nadie
          </h3>
          <p className="mt-1 font-body-md text-body-md text-on-surface-variant max-w-xl">
            Una sola vez por semana: ofertas de química suelta, reposición de bidones y
            descuentos por bulto cerrado. Sin spam, te das de baja cuando quieras.
          </p>
        </div>

        <form onSubmit={submit} className="lg:w-[380px] shrink-0 space-y-space-sm">
          <div
            className={`flex items-center gap-space-xs px-space-md py-1 rounded-full bg-surface-container-lowest transition-all ${
              error
                ? 'shadow-[0_0_0_2px_var(--color-error)]'
                : 'focus-within:shadow-[0_0_0_2px_var(--color-primary-container)]'
            }`}
          >
            <span className="material-symbols-outlined text-outline text-[20px] shrink-0">
              alternate_email
            </span>
            <input
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (error) setError('');
              }}
              placeholder="tucorreo@ejemplo.com"
              aria-label="Tu dirección de email"
              aria-invalid={Boolean(error)}
              className="w-full bg-transparent py-2.5 font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none"
            />
            <button
              type="submit"
              disabled={status === 'sending'}
              className="shrink-0 h-10 px-space-md rounded-full bg-primary-container text-on-primary font-label-md text-label-md font-bold clay-button-primary hover:scale-105 active:scale-95 transition-all disabled:opacity-70 disabled:scale-100 flex items-center gap-1"
            >
              {status === 'sending' ? (
                <>
                  <span className="material-symbols-outlined text-[16px] animate-spin-slow">
                    progress_activity
                  </span>
                  Enviando
                </>
              ) : (
                <>
                  Suscribirme
                  <span className="material-symbols-outlined text-[16px]">send</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <p className="px-space-md font-label-md text-label-md text-error font-semibold flex items-center gap-1 animate-fade-down">
              <span className="material-symbols-outlined text-[15px]">error</span>
              {error}
            </p>
          )}
          <p className="px-space-md font-label-sm text-label-sm text-on-surface-variant">
            Al suscribirte aceptás recibir comunicaciones comerciales de Detersur.
          </p>
        </form>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Collapsible column (accordion on mobile, open on desktop)           */
/* ------------------------------------------------------------------ */
const FooterColumn: React.FC<{
  title: string;
  icon: string;
  children: React.ReactNode;
}> = ({ title, icon, children }) => {
  const isDesktop = useIsDesktop();
  const [open, setOpen] = useState(false);
  const expanded = isDesktop || open;

  return (
    <div className="border-b border-slate-200/60 md:border-none pb-space-sm md:pb-0">
      <button
        onClick={() => setOpen((value) => !value)}
        aria-expanded={expanded}
        className="w-full flex items-center justify-between gap-space-sm py-space-sm md:py-0 md:cursor-default md:pointer-events-none"
      >
        <h4 className="flex items-center gap-1.5 font-label-lg text-label-lg text-on-surface font-bold">
          <span className="material-symbols-outlined text-[18px] text-secondary md:hidden">
            {icon}
          </span>
          {title}
        </h4>
        <span
          className={`material-symbols-outlined text-[20px] text-outline md:hidden transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
        >
          expand_more
        </span>
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out md:!grid-rows-[1fr]"
        style={{ gridTemplateRows: expanded ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden md:mt-space-sm">{children}</div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */
export const Footer: React.FC = () => {
  const { navigate } = useStore();

  return (
    <footer className="relative z-10 w-full mt-space-2xl bg-surface-container-low/70 backdrop-blur-md border-t border-slate-200/60 pb-28 md:pb-space-xl">
      {/* Newsletter sits half-overlapping the footer edge */}
      <div className="max-w-[1280px] mx-auto px-margin md:px-margin-desktop -mt-space-xl md:-mt-space-2xl mb-space-xl">
        <Reveal from="up">
          <Newsletter />
        </Reveal>
      </div>

      <div className="max-w-[1280px] mx-auto px-margin md:px-margin-desktop grid grid-cols-1 md:grid-cols-12 gap-space-lg md:gap-gutter-desktop">
        {/* Brand block */}
        <Reveal from="up" className="md:col-span-4 space-y-space-md" delay={60}>
          <>
            <div className="flex items-center gap-space-sm">
              <div className="w-11 h-11 rounded-full bg-primary-container flex items-center justify-center overflow-hidden shrink-0 clay-button-primary">
                <SmartImage alt="" className="w-8 h-8 object-contain" src={LOGO_URL} />
              </div>
              <div>
                <span className="block font-headline-md text-headline-md text-primary font-extrabold leading-none">
                  Detersur
                </span>
                <span className="font-label-sm text-[10px] text-secondary tracking-widest uppercase font-bold">
                  Química &amp; Limpieza
                </span>
              </div>
            </div>

            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm">
              Distribuidora directa de insumos químicos, artículos de higiene institucional y
              fraccionado de productos de limpieza para el hogar y comercios de Zona Sur.
            </p>

            <div className="space-y-1.5 font-body-sm text-body-sm text-on-surface-variant">
              <a
                href={CONTACT.phoneHref}
                className="flex items-center gap-space-xs hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[17px] text-primary">call</span>
                {CONTACT.phone}
              </a>
              <a
                href={`mailto:${CONTACT.email}`}
                className="flex items-center gap-space-xs hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[17px] text-primary">mail</span>
                {CONTACT.email}
              </a>
              <p className="flex items-start gap-space-xs">
                <span className="material-symbols-outlined text-[17px] text-primary shrink-0">
                  location_on
                </span>
                {CONTACT.address}
              </p>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-space-sm pt-space-xs">
              {SOCIALS.map((social, index) => (
                <a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  title={social.label}
                  className="w-10 h-10 rounded-full bg-surface-container-lowest text-on-surface-variant flex items-center justify-center shadow-sm border border-slate-100 hover:text-on-primary hover:bg-primary-container hover:-translate-y-1 transition-all duration-300"
                  style={{ transitionDelay: `${index * 30}ms` }}
                >
                  <span className="material-symbols-outlined text-[20px]">{social.icon}</span>
                </a>
              ))}
            </div>
          </>
        </Reveal>

        {/* Link columns */}
        {FOOTER_COLUMNS.map((column, columnIndex) => (
          <Reveal
            key={column.title}
            from="up"
            delay={120 + columnIndex * 70}
            className="md:col-span-2"
          >
            <FooterColumn title={column.title} icon={column.icon}>
              <ul className="space-y-space-xs font-body-sm text-body-sm text-on-surface-variant">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() =>
                        navigate({
                          view: link.view ?? 'catalog',
                          category: link.category,
                          query: link.query,
                        })
                      }
                      className="group text-left hover:text-primary transition-colors flex items-center gap-1"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 rounded-full bg-primary transition-all duration-300" />
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </FooterColumn>
          </Reveal>
        ))}

        {/* Branches */}
        <Reveal from="up" delay={260} className="md:col-span-4">
          <FooterColumn title="Sucursales & Retiro" icon="storefront">
            <div className="space-y-space-sm">
              {STORE_BRANCHES.map((branch) => (
                <div
                  key={branch.id}
                  className="p-space-sm rounded-2xl bg-surface-container-lowest/80 border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                >
                  <p className="font-label-md text-label-md text-primary font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-secondary">
                      store
                    </span>
                    {branch.name}
                  </p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                    {branch.address}
                  </p>
                  <p className="font-label-sm text-label-sm text-outline">{branch.hours}</p>
                </div>
              ))}
            </div>
          </FooterColumn>
        </Reveal>
      </div>

      {/* Payment + trust strip */}
      <div className="max-w-[1280px] mx-auto px-margin md:px-margin-desktop mt-space-xl">
        <div className="p-space-md rounded-3xl bg-surface-container-lowest/70 border border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-space-md">
          <div className="flex flex-wrap items-center justify-center gap-space-sm">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-bold">
              Medios de pago
            </span>
            {PAYMENT_BADGES.map((badge) => (
              <span
                key={badge.label}
                className="inline-flex items-center gap-1 px-space-sm py-1.5 rounded-xl bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm font-semibold border border-slate-100"
              >
                <span className="material-symbols-outlined text-[16px] text-primary">
                  {badge.icon}
                </span>
                {badge.label}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-space-md">
            <span className="inline-flex items-center gap-1 font-label-md text-label-md text-secondary font-bold">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              Certificación ANMAT
            </span>
            <span className="inline-flex items-center gap-1 font-label-md text-label-md text-primary font-bold">
              <span className="material-symbols-outlined text-[18px]">lock</span>
              Pago protegido
            </span>
            <span className="inline-flex items-center gap-1 font-label-md text-label-md text-tertiary font-bold">
              <span className="material-symbols-outlined text-[18px]">recycling</span>
              Plan Canje de envases
            </span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-[1280px] mx-auto px-margin md:px-margin-desktop mt-space-md pt-space-md flex flex-col sm:flex-row items-center justify-between gap-space-xs border-t border-slate-200/50 font-label-sm text-label-sm text-on-surface-variant text-center sm:text-left">
        <span>
          © {new Date().getFullYear()} Detersur Química Argentina. Precios finales con IVA
          incluido.
        </span>
        <div className="flex items-center gap-space-md">
          <button className="hover:text-primary transition-colors">Términos</button>
          <button className="hover:text-primary transition-colors">Privacidad</button>
          <button
            onClick={() => navigate({ view: 'home' })}
            className="hover:text-primary transition-colors"
          >
            Defensa al consumidor
          </button>
        </div>
      </div>
    </footer>
  );
};
