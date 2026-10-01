import React from 'react';
import { LOGO_URL } from '../data/products';
import { useCart } from '../context/CartContext';

export const Footer: React.FC = () => {
  const { navigateTo } = useCart();

  return (
    <footer className="relative z-10 w-full bg-surface-container-low/70 backdrop-blur-md mt-space-xl pb-24 md:pb-space-xl border-t border-slate-200/50">
      <div className="max-w-[1280px] mx-auto px-margin md:px-margin-desktop py-space-xl grid grid-cols-1 md:grid-cols-4 gap-gutter-desktop">
        {/* Brand column */}
        <div className="space-y-space-sm">
          <div className="flex items-center gap-space-sm">
            <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center text-on-primary overflow-hidden shrink-0">
              <img alt="Detersur Logo 3D" className="w-6 h-6 object-contain" src={LOGO_URL} />
            </div>
            <span className="font-headline-sm text-headline-sm text-primary font-bold">
              Detersur
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Distribuidora directa de insumos químicos, artículos de higiene institucional y fraccionado de productos de limpieza para el hogar y comercios.
          </p>
          <div className="pt-space-xs font-body-sm text-body-sm text-on-surface-variant space-y-1">
            <p className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-[16px] text-primary">call</span>
              +54 11 4567-8900
            </p>
            <p className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-[16px] text-primary">mail</span>
              contacto@detersur.com.ar
            </p>
          </div>
        </div>

        {/* Column 2 */}
        <div>
          <h4 className="font-label-lg text-label-lg text-on-surface mb-space-sm font-bold">
            Líneas Directas Químicas
          </h4>
          <ul className="space-y-space-xs font-body-sm text-body-sm text-on-surface-variant">
            <li>
              <button
                onClick={() => navigateTo('catalog')}
                className="hover:text-primary transition-colors text-left"
              >
                Lavandinas &amp; Cloro Activo
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('catalog')}
                className="hover:text-primary transition-colors text-left"
              >
                Jabones Líquidos Textiles
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('catalog')}
                className="hover:text-primary transition-colors text-left"
              >
                Desinfectantes y Amonios
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('catalog')}
                className="hover:text-primary transition-colors text-left"
              >
                Bidones 5L / Tambores 200L
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h4 className="font-label-lg text-label-lg text-on-surface mb-space-sm font-bold">
            Atención &amp; Envíos
          </h4>
          <ul className="space-y-space-xs font-body-sm text-body-sm text-on-surface-variant">
            <li>
              <button
                onClick={() => navigateTo('checkout')}
                className="hover:text-primary transition-colors text-left"
              >
                Zonas de Entrega GBA y CABA
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('catalog')}
                className="hover:text-primary transition-colors text-left"
              >
                Venta Mayorista B2B
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('checkout')}
                className="hover:text-primary transition-colors text-left"
              >
                Facturación A / B en Checkout
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('catalog')}
                className="hover:text-primary transition-colors text-left"
              >
                Puntos de Retiro Express
              </button>
            </li>
          </ul>
        </div>

        {/* Column 4: B2B Card */}
        <div className="space-y-space-sm">
          <h4 className="font-label-lg text-label-lg text-on-surface font-bold">
            Compromiso &amp; B2B
          </h4>
          <div className="p-space-md rounded-2xl bg-surface-container-lowest/80 text-on-surface-variant font-body-sm text-body-sm shadow-sm border border-slate-100">
            <p className="text-primary font-label-md text-label-md mb-1 font-bold">
              Ahorro Mayorista B2B &amp; Granel
            </p>
            <p>
              Precios diferenciales por bulto cerrado y recarga de bidones en planta con hasta 25% de bonificación.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1280px] mx-auto px-margin md:px-margin-desktop py-space-sm flex flex-col sm:flex-row items-center justify-between text-on-surface-variant font-label-sm text-label-sm gap-space-xs border-t border-slate-200/40">
        <span>© 2025 Detersur Química Argentina. Precios finales con IVA incluido.</span>
        <span className="flex items-center gap-1 font-semibold text-secondary">
          <span className="material-symbols-outlined text-[16px]">verified_user</span>
          Calidad y pureza certificada ANMAT
        </span>
      </div>
    </footer>
  );
};
