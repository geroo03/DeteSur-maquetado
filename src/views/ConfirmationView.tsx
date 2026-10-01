import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export const ConfirmationView: React.FC = () => {
  const { orderNumber, total, shippingAddress, navigateTo } = useCart();
  const [activeStep, setActiveStep] = useState<number>(1); // 0: Recibido, 1: En preparación, 2: En camino, 3: Entregado
  const [showInvoiceModal, setShowInvoiceModal] = useState<boolean>(false);

  const steps = [
    { label: 'Recibido', time: '14:15 hs', icon: 'done', sub: 'Confirmado' },
    { label: 'En preparación', time: 'Sucursal Lanús', icon: 'science', sub: 'Fraccionando' },
    { label: 'En camino', time: '16:30 hs aprox', icon: 'directions_car', sub: 'Fletero en ruta' },
    { label: 'Entregado', time: 'Hasta 19:00 hs', icon: 'home_pin', sub: 'En puerta' },
  ];

  return (
    <div className="flex flex-col w-full">
      <div className="relative w-full max-w-4xl mx-auto py-space-md md:py-space-xl px-space-xs">
        {/* Glow Effects */}
        <div className="absolute -top-12 -left-8 w-44 h-44 rounded-full bg-secondary-fixed/40 blur-2xl pointer-events-none"></div>
        <div className="absolute top-1/3 -right-16 w-56 h-56 rounded-full bg-primary-fixed/50 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 left-1/4 w-48 h-48 rounded-full bg-secondary-fixed-dim/30 blur-2xl pointer-events-none"></div>

        {/* Card Stage */}
        <div className="relative bg-surface-container-lowest rounded-3xl shadow-[0_24px_50px_-12px_rgba(0,119,182,0.16)] p-space-md sm:p-space-lg md:p-space-xl flex flex-col items-center text-center overflow-hidden border border-white">
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-surface-container-low via-surface-container-lowest/60 to-transparent pointer-events-none"></div>

          {/* Central 3D Check Bubble */}
          <div className="relative mb-space-md">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-secondary-fixed via-secondary-fixed-dim to-primary-fixed-dim p-2 shadow-[0_20px_35px_-8px_rgba(0,113,104,0.32)] flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-surface-container-lowest via-surface-container-low to-secondary-fixed/20 flex items-center justify-center relative shadow-[inset_0_4px_10px_rgba(255,255,255,0.95),inset_0_-4px_8px_rgba(0,106,98,0.12)]">
                <span
                  className="material-symbols-outlined text-secondary text-5xl sm:text-6xl drop-shadow-sm select-none"
                  style={{ fontVariationSettings: "'FILL' 1, 'wght' 700" }}
                >
                  check_circle
                </span>
                <div className="absolute top-3 left-4 w-3.5 h-2 rounded-full bg-surface-container-lowest rotate-[-35deg] opacity-90 blur-[0.4px]"></div>
              </div>
            </div>

            {/* Little bouncing clean emblems */}
            <div className="absolute -top-1 -right-2 w-9 h-9 rounded-full bg-gradient-to-br from-surface-container-lowest to-secondary-fixed shadow-[0_8px_16px_rgba(0,119,182,0.2)] flex items-center justify-center animate-bounce">
              <span className="material-symbols-outlined text-primary text-[18px]">clean_hands</span>
            </div>
            <div className="absolute bottom-1 -left-3 w-8 h-8 rounded-full bg-gradient-to-br from-surface-container-lowest to-primary-fixed shadow-[0_6px_14px_rgba(0,119,182,0.18)] flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary text-[16px]">
                arrow_back_ios_new
              </span>
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-space-xs px-space-md py-1 rounded-full bg-secondary-fixed/50 text-on-secondary-fixed font-label-sm text-label-sm mb-space-sm uppercase tracking-wider shadow-sm font-bold">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            Pedido Confirmado • Pago Acreditado
          </div>

          {/* Heading */}
          <h1 className="font-display-hero text-2xl sm:text-4xl md:text-5xl text-on-surface tracking-tight max-w-xl font-extrabold">
            ¡Gracias por tu compra,{' '}
            <span className="text-primary font-black">
              {shippingAddress.fullName.split(' ')[0] || 'Federico'}
            </span>
            !
          </h1>

          <p className="font-body-lg text-base sm:text-body-lg text-on-surface-variant max-w-lg mt-space-xs">
            Tu pedido <span className="font-label-lg text-primary font-bold">{orderNumber}</span> fue
            procesado exitosamente. Ya nos encontramos fraccionando y empaquetando tus insumos de
            limpieza.
          </p>

          {/* Live Order Tracker Section */}
          <div className="w-full mt-space-lg p-space-md sm:p-space-lg rounded-2xl bg-surface-container-low/90 shadow-[0_16px_30px_-10px_rgba(9,27,56,0.06)] text-left border border-slate-100">
            <div className="flex items-center justify-between pb-space-sm border-b border-slate-200/50">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[22px]">
                  local_shipping
                </span>
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Seguimiento en Vivo
                </span>
              </div>
              <span className="font-label-sm text-label-sm px-space-sm py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold">
                Tiempo real
              </span>
            </div>

            <div className="relative mt-space-sm pt-2">
              <div className="hidden sm:block absolute top-7 left-6 right-6 h-1 bg-surface-container-highest rounded-full z-0">
                <div
                  className="h-full bg-secondary rounded-full transition-all duration-700"
                  style={{ width: `${(activeStep / 3) * 100}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-space-sm sm:gap-2 relative z-10">
                {steps.map((st, i) => {
                  const isPassed = i <= activeStep;
                  const isCurrent = i === activeStep;

                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveStep(i)}
                      className={`flex sm:flex-col items-center gap-space-sm sm:gap-space-xs text-left sm:text-center p-space-xs sm:p-0 transition-opacity rounded-xl ${
                        isCurrent
                          ? 'opacity-100 font-bold'
                          : isPassed
                          ? 'opacity-90'
                          : 'opacity-40'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-label-sm shadow-md shrink-0 transition-all ${
                          isCurrent
                            ? 'bg-primary-container text-on-primary shadow-[0_0_0_4px_rgba(0,119,182,0.2)] animate-pulse'
                            : isPassed
                            ? 'bg-secondary text-on-secondary'
                            : 'bg-surface-container-highest text-on-surface-variant'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">{st.icon}</span>
                      </div>
                      <div>
                        <p
                          className={`font-label-md text-label-md ${
                            isCurrent ? 'text-primary font-bold' : 'text-on-surface'
                          }`}
                        >
                          {st.label}
                        </p>
                        <p className="font-body-sm text-xs text-on-surface-variant">{st.time}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Summary Cards: 2 Columns */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-space-md mt-space-md text-left">
            {/* Shipping Info Card */}
            <div className="p-space-md rounded-2xl bg-surface-container/70 shadow-[0_8px_20px_-6px_rgba(9,27,56,0.05)] flex flex-col justify-between border border-slate-100">
              <div className="space-y-space-sm">
                <div className="flex items-center gap-space-xs text-primary">
                  <span className="material-symbols-outlined text-[20px]">package_2</span>
                  <span className="font-label-lg text-label-lg text-on-surface font-bold">
                    Resumen de Envío Express
                  </span>
                </div>
                <div className="space-y-space-xs font-body-sm text-body-sm text-on-surface-variant">
                  <div className="flex justify-between">
                    <span>Orden:</span>
                    <span className="font-label-md text-label-md text-on-surface font-semibold">
                      {orderNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Destino:</span>
                    <span className="font-label-md text-label-md text-on-surface text-right max-w-[210px] font-semibold truncate">
                      {shippingAddress.street}, {shippingAddress.apartment}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Zona / Localidad:</span>
                    <span className="font-label-md text-label-md text-on-surface font-semibold">
                      {shippingAddress.locality}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ventana Horaria:</span>
                    <span className="font-label-md text-label-md text-secondary font-bold">
                      Hoy 15:00 - 19:00 hs
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-space-md pt-space-xs flex items-center justify-between text-on-surface border-t border-slate-200/40">
                <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">
                  Total abonado:
                </span>
                <div className="flex items-baseline gap-1 text-primary">
                  <span className="font-price-currency text-price-currency font-bold">$</span>
                  <span className="font-price-integer text-price-integer font-black text-2xl">
                    {total > 0 ? total.toLocaleString('es-AR') : '14.170'}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment & Canje Info Card */}
            <div className="flex flex-col gap-space-sm">
              <div className="p-space-md rounded-2xl bg-surface-container/70 shadow-[0_8px_20px_-6px_rgba(9,27,56,0.05)] border border-slate-100">
                <div className="flex items-center gap-space-xs text-primary mb-space-xs">
                  <span className="material-symbols-outlined text-[20px]">
                    account_balance_wallet
                  </span>
                  <span className="font-label-lg text-label-lg text-on-surface font-bold">
                    Detalle de Pago
                  </span>
                </div>
                <div className="flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant">
                  <span>Mercado Pago:</span>
                  <span className="inline-flex items-center gap-1 font-label-md text-label-md text-secondary font-bold">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    Aprobado
                  </span>
                </div>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-1 font-medium">
                  Operación N° 8940217582 • Tarjeta Débito
                </p>
              </div>

              <div className="p-space-md rounded-2xl bg-secondary-fixed/30 shadow-[0_8px_20px_-6px_rgba(0,113,104,0.08)] flex items-start gap-space-sm border border-secondary/20">
                <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">recycling</span>
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-space-xs">
                    <span className="font-label-md text-label-md text-on-secondary-container uppercase tracking-wider font-bold">
                      Plan Canje Activado
                    </span>
                    <span className="px-1.5 py-0.5 rounded-full bg-surface-container-lowest text-secondary font-label-sm text-label-sm font-bold shadow-xs">
                      -$860
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                    Recordá tener listo <strong className="text-on-surface">1 bidón vacío limpio de 5L</strong>{' '}
                    para entregar al chofer al momento de la entrega para validar tu bonificación.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="w-full mt-space-lg flex flex-col sm:flex-row items-center justify-center gap-space-sm">
            <a
              className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-space-lg py-3.5 rounded-full bg-secondary text-on-secondary font-label-lg text-label-lg shadow-[0_12px_24px_-6px_rgba(0,106,98,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all font-bold"
              href="https://wa.me/5491145678900?text=Hola%20Detersur!%20Quiero%20seguir%20el%20pedido%20DET-84920"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="material-symbols-outlined text-[20px]">chat</span>
              Seguir pedido por WhatsApp
            </a>

            <button
              onClick={() => navigateTo('catalog')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-space-lg py-3.5 rounded-full bg-white text-primary font-label-lg text-label-lg shadow-[0_8px_20px_-4px_rgba(9,27,56,0.10)] hover:bg-slate-50 active:scale-[0.98] transition-all font-bold border border-slate-200"
            >
              <span className="material-symbols-outlined text-[20px]">storefront</span>
              Volver a la tienda
            </button>

            <button
              onClick={() => setShowInvoiceModal(true)}
              type="button"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-space-md py-3 rounded-full text-on-surface-variant hover:text-primary font-label-md text-label-md transition-colors font-semibold"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Descargar Factura B (PDF)
            </button>
          </div>

          {/* Seals */}
          <div className="mt-space-lg pt-space-md flex flex-wrap items-center justify-center gap-space-md text-on-surface-variant font-label-sm text-label-sm opacity-80 border-t border-slate-100">
            <span className="flex items-center gap-1 font-semibold text-secondary">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              Productos con precinto de seguridad
            </span>
            <span className="flex items-center gap-1 font-semibold text-primary">
              <span className="material-symbols-outlined text-[16px]">support_agent</span>
              Atención al cliente 0800-444-SUR
            </span>
            <span className="flex items-center gap-1 font-semibold text-tertiary">
              <span className="material-symbols-outlined text-[16px]">sync_saved_locally</span>
              Eco-química retornable
            </span>
          </div>
        </div>
      </div>

      {/* Invoice Modal Simulation */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative text-left">
            <div className="flex items-center justify-between pb-3 border-b">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-2xl">receipt_long</span>
                <h3 className="font-bold text-lg text-slate-800">Factura B Electrónica AFIP</h3>
              </div>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-black font-bold"
              >
                ✕
              </button>
            </div>

            <div className="py-4 text-xs text-slate-700 space-y-2 font-mono">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <p>
                  <strong>Razón Social:</strong> DETERSUR QUÍMICA S.A.
                </p>
                <p>
                  <strong>CUIT:</strong> 30-71649281-9 • IVA Responsable Inscripto
                </p>
                <p>
                  <strong>Punto de Venta:</strong> 0004 • Comp. Nro: 00084920
                </p>
                <p>
                  <strong>Fecha de Emisión:</strong> 30/09/2026
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <p>
                  <strong>Cliente:</strong> {shippingAddress.fullName}
                </p>
                <p>
                  <strong>Condición IVA:</strong> Consumidor Final
                </p>
                <p>
                  <strong>Domicilio:</strong> {shippingAddress.street}, {shippingAddress.locality}
                </p>
              </div>

              <div className="border-t border-slate-200 pt-2 space-y-1">
                <div className="flex justify-between font-bold text-slate-900 text-sm">
                  <span>TOTAL FACTURADO:</span>
                  <span>$ {total > 0 ? total.toLocaleString('es-AR') : '14.170'} ARS</span>
                </div>
                <p className="text-[10px] text-slate-500">
                  CAE N°: 74920481920491 • Vto. CAE: 10/10/2026
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                alert('Descarga completada: Factura_B_DET-84920.pdf');
                setShowInvoiceModal(false);
              }}
              className="w-full py-3 rounded-full bg-primary text-white font-bold text-sm shadow-md hover:bg-primary-container transition-colors"
            >
              Guardar Archivo PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
