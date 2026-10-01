import React from 'react';
import { useCart } from '../context/CartContext';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartCount,
    subtotal,
    canjeDiscount,
    total,
    shippingMethod,
    setShippingMethod,
    paymentMethod,
    setPaymentMethod,
    invoiceType,
    setInvoiceType,
    shippingAddress,
    setShippingAddress,
    navigateTo,
  } = useCart();

  const handleInputChange = (field: keyof typeof shippingAddress, value: string) => {
    setShippingAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleConfirmOrder = () => {
    navigateTo('confirmation');
  };

  return (
    <div className="flex flex-col w-full">
      {/* Step Tracker Header */}
      <div className="w-full mb-space-lg">
        <div className="w-full p-space-sm rounded-full bg-surface-container-lowest/80 backdrop-blur-2xl shadow-[0_16px_32px_-8px_rgba(0,119,182,0.12)] flex items-center justify-between border border-white">
          <div className="flex items-center gap-space-sm px-space-md py-space-xs rounded-full bg-primary-container text-on-primary shadow-[inset_0_2px_4px_rgba(255,255,255,0.45),0_8px_16px_-4px_rgba(0,119,182,0.35)] font-bold">
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-label-sm text-label-sm">
              1
            </span>
            <span className="font-label-md text-label-md hidden sm:inline">
              Despacho &amp; Entrega
            </span>
            <span className="font-label-md text-label-md sm:hidden">Entrega</span>
          </div>

          <div className="h-1 flex-1 mx-space-sm rounded-full bg-secondary-fixed-dim/40 overflow-hidden">
            <div className="w-2/3 h-full bg-secondary rounded-full"></div>
          </div>

          <div className="flex items-center gap-space-sm px-space-md py-space-xs rounded-full bg-surface-container text-primary font-label-md text-label-md font-bold">
            <span className="w-6 h-6 rounded-full bg-surface-container-highest flex items-center justify-center font-label-sm text-label-sm text-primary">
              2
            </span>
            <span className="hidden sm:inline">Pago Seguro</span>
            <span className="sm:hidden">Pago</span>
          </div>

          <div className="h-1 flex-1 mx-space-sm rounded-full bg-surface-container"></div>

          <div className="flex items-center gap-space-sm px-space-md py-space-xs rounded-full bg-surface-container text-on-surface-variant font-label-md text-label-md opacity-70">
            <span className="w-6 h-6 rounded-full bg-surface-container-highest flex items-center justify-center font-label-sm text-label-sm text-on-surface-variant">
              3
            </span>
            <span className="hidden sm:inline">Confirmación</span>
            <span className="sm:hidden">Listo</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start">
        {/* LEFT COLUMN: Shipping & Payment Form (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-space-lg">
          {/* Section 1: Shipping */}
          <section className="rounded-3xl bg-surface-container-lowest p-space-lg shadow-[0_16px_32px_-8px_rgba(0,119,182,0.14)] relative overflow-hidden border border-white">
            <div className="flex items-center justify-between mb-space-md">
              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.7)]">
                  <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                </div>
                <div>
                  <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                    1. Método de Entrega
                  </h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Selecciona cómo deseas recibir tus insumos químicos
                  </p>
                </div>
              </div>
              <span className="px-space-sm py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
                Paso 1 de 2
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md mb-space-lg">
              {/* Express Home Delivery */}
              <label
                onClick={() => setShippingMethod('express')}
                className={`group relative flex flex-col p-space-md rounded-2xl cursor-pointer transition-all ${
                  shippingMethod === 'express'
                    ? 'bg-surface-container-low shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),0_10px_20px_-6px_rgba(0,119,182,0.16)] ring-2 ring-primary'
                    : 'bg-surface-container-lowest/90 hover:bg-surface-container-low shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span
                      className={`material-symbols-outlined text-[24px] ${
                        shippingMethod === 'express' ? 'text-primary' : 'text-outline-variant'
                      }`}
                      style={{ fontVariationSettings: shippingMethod === 'express' ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      {shippingMethod === 'express' ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    <span className="font-label-lg text-label-lg text-primary font-bold">
                      Envío a Domicilio Express
                    </span>
                  </div>
                  <span className="px-space-xs py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold">
                    GRATIS
                  </span>
                </div>
                <p className="mt-space-xs font-body-sm text-body-sm text-on-surface-variant">
                  Entrega hoy mismo o dentro de las 24hs hábiles en flota protegida.
                </p>
                <div className="mt-space-sm pt-space-xs flex items-center gap-space-xs text-secondary font-label-sm text-label-sm font-bold">
                  <span className="material-symbols-outlined text-[16px]">electric_bolt</span>
                  <span>CABA, Lanús, Quilmes, Avellaneda y Lomas</span>
                </div>
              </label>

              {/* Pickup in Store */}
              <label
                onClick={() => setShippingMethod('pickup')}
                className={`group relative flex flex-col p-space-md rounded-2xl cursor-pointer transition-all ${
                  shippingMethod === 'pickup'
                    ? 'bg-surface-container-low shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),0_10px_20px_-6px_rgba(0,119,182,0.16)] ring-2 ring-primary'
                    : 'bg-surface-container-lowest/90 hover:bg-surface-container-low shadow-[0_8px_16px_-4px_rgba(9,27,56,0.06)]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span
                      className={`material-symbols-outlined text-[24px] ${
                        shippingMethod === 'pickup' ? 'text-primary' : 'text-outline-variant'
                      }`}
                      style={{ fontVariationSettings: shippingMethod === 'pickup' ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      {shippingMethod === 'pickup' ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    <span className="font-label-lg text-label-lg text-on-surface font-bold">
                      Retiro Gratis en Sucursal
                    </span>
                  </div>
                  <span className="px-space-xs py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-semibold">
                    En 2 hs
                  </span>
                </div>
                <p className="mt-space-xs font-body-sm text-body-sm text-on-surface-variant">
                  Retirá con tu vehículo sin filas en nuestro centro de logística mayorista.
                </p>
                <div className="mt-space-sm pt-space-xs flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
                  <span className="material-symbols-outlined text-[16px]">store</span>
                  <span>Lanús Centro (Av. Pavón 3950)</span>
                </div>
              </label>
            </div>

            {/* Address Form */}
            <div className="rounded-2xl bg-surface-container-low/60 p-space-md shadow-[inset_0_2px_4px_rgba(9,27,56,0.04)] border border-slate-100">
              <div className="flex items-center justify-between mb-space-sm">
                <span className="font-label-md text-label-md text-primary tracking-wide uppercase font-bold">
                  Dirección de Entrega y Receptor
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-secondary">
                    shield
                  </span>{' '}
                  Datos cifrados
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                <div>
                  <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1 font-semibold">
                    Nombre Completo
                  </label>
                  <div className="w-full flex items-center px-space-md py-space-xs rounded-full bg-white shadow-[inset_0_2px_4px_rgba(9,27,56,0.05)] border border-slate-200">
                    <span className="material-symbols-outlined text-[18px] text-outline mr-2">
                      person
                    </span>
                    <input
                      type="text"
                      value={shippingAddress.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full bg-transparent font-body-md text-body-md text-on-surface focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1 font-semibold">
                    Teléfono Móvil / WhatsApp
                  </label>
                  <div className="w-full flex items-center px-space-md py-space-xs rounded-full bg-white shadow-[inset_0_2px_4px_rgba(9,27,56,0.05)] border border-slate-200">
                    <span className="material-symbols-outlined text-[18px] text-outline mr-2">
                      smartphone
                    </span>
                    <input
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full bg-transparent font-body-md text-body-md text-on-surface focus:outline-none"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1 font-semibold">
                    Calle y Altura
                  </label>
                  <div className="w-full flex items-center px-space-md py-space-xs rounded-full bg-white shadow-[inset_0_2px_4px_rgba(9,27,56,0.05)] border border-slate-200">
                    <span className="material-symbols-outlined text-[18px] text-outline mr-2">
                      home_pin
                    </span>
                    <input
                      type="text"
                      value={shippingAddress.street}
                      onChange={(e) => handleInputChange('street', e.target.value)}
                      className="w-full bg-transparent font-body-md text-body-md text-on-surface focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1 font-semibold">
                    Piso / Departamento (Opcional)
                  </label>
                  <div className="w-full flex items-center px-space-md py-space-xs rounded-full bg-white shadow-[inset_0_2px_4px_rgba(9,27,56,0.05)] border border-slate-200">
                    <span className="material-symbols-outlined text-[18px] text-outline mr-2">
                      apartment
                    </span>
                    <input
                      type="text"
                      value={shippingAddress.apartment}
                      onChange={(e) => handleInputChange('apartment', e.target.value)}
                      className="w-full bg-transparent font-body-md text-body-md text-on-surface focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1 font-semibold">
                    Localidad y CP
                  </label>
                  <div className="w-full flex items-center px-space-md py-space-xs rounded-full bg-white shadow-[inset_0_2px_4px_rgba(9,27,56,0.05)] border border-slate-200">
                    <span className="material-symbols-outlined text-[18px] text-outline mr-2">
                      location_city
                    </span>
                    <input
                      type="text"
                      value={shippingAddress.locality}
                      onChange={(e) => handleInputChange('locality', e.target.value)}
                      className="w-full bg-transparent font-body-md text-body-md text-on-surface focus:outline-none"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1 font-semibold">
                    Indicaciones para el fletero / chofer
                  </label>
                  <div className="w-full flex items-start px-space-md py-space-xs rounded-2xl bg-white shadow-[inset_0_2px_4px_rgba(9,27,56,0.05)] border border-slate-200">
                    <span className="material-symbols-outlined text-[18px] text-outline mr-2 mt-1">
                      notes
                    </span>
                    <textarea
                      value={shippingAddress.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      rows={2}
                      className="w-full bg-transparent font-body-md text-body-md text-on-surface focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Payment */}
          <section className="rounded-3xl bg-surface-container-lowest p-space-lg shadow-[0_16px_32px_-8px_rgba(0,119,182,0.14)] relative border border-white">
            <div className="flex items-center justify-between mb-space-md">
              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.7)]">
                  <span className="material-symbols-outlined text-[20px]">credit_card</span>
                </div>
                <div>
                  <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                    2. Método de Pago
                  </h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Opciones seguras y facturación fiscal inmediata
                  </p>
                </div>
              </div>
              <span className="px-space-sm py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm font-bold">
                Paso 2 de 2
              </span>
            </div>

            <div className="space-y-space-sm mb-space-lg">
              {/* Mercado Pago */}
              <label
                onClick={() => setPaymentMethod('mercadopago')}
                className={`group flex items-center justify-between p-space-md rounded-2xl cursor-pointer transition-all ${
                  paymentMethod === 'mercadopago'
                    ? 'bg-surface-container-low shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),0_10px_20px_-6px_rgba(0,119,182,0.16)] ring-2 ring-primary'
                    : 'bg-white/80 hover:bg-slate-50 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-space-md">
                  <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">
                      account_balance_wallet
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-space-xs">
                      <span className="font-label-lg text-label-lg text-on-surface font-bold">
                        Mercado Pago
                      </span>
                      <span className="px-space-xs py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm font-bold">
                        3 cuotas sin interés
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Tarjetas de Débito, Crédito Visa/Mastercard y Saldo en cuenta
                    </p>
                  </div>
                </div>
                <span
                  className="material-symbols-outlined text-primary text-[24px]"
                  style={{ fontVariationSettings: paymentMethod === 'mercadopago' ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {paymentMethod === 'mercadopago' ? 'check_circle' : 'radio_button_unchecked'}
                </span>
              </label>

              {/* Transferencia */}
              <label
                onClick={() => setPaymentMethod('transfer')}
                className={`group flex items-center justify-between p-space-md rounded-2xl cursor-pointer transition-all ${
                  paymentMethod === 'transfer'
                    ? 'bg-surface-container-low shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),0_10px_20px_-6px_rgba(0,119,182,0.16)] ring-2 ring-primary'
                    : 'bg-white/80 hover:bg-slate-50 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-space-md">
                  <div className="w-8 h-8 rounded-full bg-surface-container-high text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">
                      currency_exchange
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-space-xs">
                      <span className="font-label-lg text-label-lg text-on-surface font-bold">
                        Transferencia Bancaria Inmediata
                      </span>
                      <span className="px-space-xs py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold">
                        -10% Extra
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Acreditación vía CBU/Alias. Envío del comprobante automático
                    </p>
                  </div>
                </div>
                <span
                  className={`material-symbols-outlined text-[24px] ${
                    paymentMethod === 'transfer' ? 'text-primary' : 'text-outline-variant'
                  }`}
                  style={{ fontVariationSettings: paymentMethod === 'transfer' ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {paymentMethod === 'transfer' ? 'check_circle' : 'radio_button_unchecked'}
                </span>
              </label>

              {/* Efectivo */}
              <label
                onClick={() => setPaymentMethod('cash')}
                className={`group flex items-center justify-between p-space-md rounded-2xl cursor-pointer transition-all ${
                  paymentMethod === 'cash'
                    ? 'bg-surface-container-low shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),0_10px_20px_-6px_rgba(0,119,182,0.16)] ring-2 ring-primary'
                    : 'bg-white/80 hover:bg-slate-50 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-space-md">
                  <div className="w-8 h-8 rounded-full bg-surface-container-high text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">payments</span>
                  </div>
                  <div>
                    <span className="font-label-lg text-label-lg text-on-surface font-bold">
                      Efectivo contra entrega / Mostrador
                    </span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Abona en mano al recibir el pedido o al retirar por el local
                    </p>
                  </div>
                </div>
                <span
                  className={`material-symbols-outlined text-[24px] ${
                    paymentMethod === 'cash' ? 'text-primary' : 'text-outline-variant'
                  }`}
                  style={{ fontVariationSettings: paymentMethod === 'cash' ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {paymentMethod === 'cash' ? 'check_circle' : 'radio_button_unchecked'}
                </span>
              </label>
            </div>

            {/* Facturación */}
            <div className="pt-space-md border-t border-slate-100">
              <div className="flex items-center justify-between mb-space-sm">
                <span className="font-label-md text-label-md text-on-surface font-bold">
                  Tipo de Comprobante Fiscal
                </span>
                <span className="font-body-sm text-body-sm text-secondary flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  Emisión fiscal AFIP / ARCA
                </span>
              </div>
              <div className="grid grid-cols-2 gap-space-md">
                <button
                  type="button"
                  onClick={() => setInvoiceType('B')}
                  className={`flex items-center justify-center gap-space-xs p-space-sm rounded-full font-label-md text-label-md font-bold transition-all ${
                    invoiceType === 'B'
                      ? 'bg-primary-container text-on-primary shadow-[inset_0_2px_4px_rgba(255,255,255,0.45),0_8px_16px_-4px_rgba(0,119,182,0.3)]'
                      : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                  <span>Factura B (Consumidor Final)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInvoiceType('A')}
                  className={`flex items-center justify-center gap-space-xs p-space-sm rounded-full font-label-md text-label-md font-bold transition-all ${
                    invoiceType === 'A'
                      ? 'bg-primary-container text-on-primary shadow-[inset_0_2px_4px_rgba(255,255,255,0.45),0_8px_16px_-4px_rgba(0,119,182,0.3)]'
                      : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">domain</span>
                  <span>Factura A (Con CUIT)</span>
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Sticky Order Summary (4 cols) */}
        <div className="lg:col-span-4 sticky top-28 flex flex-col gap-space-md">
          <div className="rounded-3xl bg-surface-container-lowest/90 backdrop-blur-2xl p-space-lg shadow-[0_20px_40px_-10px_rgba(9,27,56,0.12)] border border-white">
            <div className="flex items-center justify-between pb-space-sm mb-space-sm border-b border-slate-100">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[22px]">
                  shopping_basket
                </span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Tu Pedido ({cartCount})
                </h3>
              </div>
              <button
                onClick={() => navigateTo('cart')}
                className="font-label-sm text-label-sm text-secondary hover:underline font-bold"
              >
                Modificar
              </button>
            </div>

            {/* Items Thumbnails */}
            <div className="space-y-space-md mb-space-lg">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-space-sm">
                  <div className="w-14 h-14 rounded-2xl bg-secondary-fixed/30 flex items-center justify-center p-2 shrink-0 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)] overflow-hidden">
                    <img
                      className="w-full h-full object-contain drop-shadow"
                      src={item.product.image}
                      alt={item.product.name}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-label-md text-label-md text-on-surface font-bold truncate">
                      {item.product.name}
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      {item.presentation?.title || item.product.packageType} × {item.quantity} unid.
                    </p>
                    <span className="font-label-sm text-label-sm text-secondary font-medium">
                      {item.product.details || 'Apto sanitización total'}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-label-lg text-label-lg text-on-surface font-bold">
                      $ {(item.price * item.quantity).toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="p-space-sm rounded-2xl bg-surface-container-low/70 mb-space-md space-y-space-xs font-body-sm text-body-sm border border-slate-100">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal productos:</span>
                <span className="text-on-surface font-semibold">
                  $ {subtotal.toLocaleString('es-AR')}
                </span>
              </div>
              {canjeDiscount > 0 && (
                <div className="flex justify-between text-secondary">
                  <span className="flex items-center gap-1 font-semibold">
                    <span className="material-symbols-outlined text-[16px]">recycling</span>
                    <span>Canje de Envases (bonificado):</span>
                  </span>
                  <span className="font-bold">-$ {canjeDiscount.toLocaleString('es-AR')}</span>
                </div>
              )}
              <div className="flex justify-between text-on-surface-variant">
                <span>Flete Domiciliario Express:</span>
                <span className="text-secondary font-bold uppercase tracking-wider text-[11px] bg-secondary-container px-2 py-0.5 rounded-full">
                  Gratis
                </span>
              </div>
            </div>

            <div className="pt-space-xs mb-space-md border-t border-slate-100">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block font-semibold">
                    Total con IVA incluido
                  </span>
                  <span className="font-body-sm text-body-sm text-secondary font-medium">
                    3 cuotas de $ {Math.round(total / 3).toLocaleString('es-AR')} sin interés
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-headline-lg text-headline-lg text-primary font-black tracking-tight text-3xl">
                    $ {total.toLocaleString('es-AR')}
                  </span>
                </div>
              </div>
            </div>

            {/* Confirm CTA */}
            <button
              type="button"
              onClick={handleConfirmOrder}
              className="w-full py-space-md px-space-lg rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg shadow-[inset_0_3px_6px_rgba(255,255,255,0.6),0_16px_32px_-6px_rgba(0,119,182,0.45)] hover:bg-primary hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-space-sm group font-bold"
            >
              <span className="material-symbols-outlined text-[20px] group-hover:rotate-12 transition-transform">
                lock
              </span>
              <span>Confirmar Pedido y Pagar</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>

            <div className="mt-space-md grid grid-cols-2 gap-space-xs pt-space-xs text-center text-on-surface-variant font-label-sm text-label-sm">
              <div className="flex items-center justify-center gap-1 font-semibold text-secondary">
                <span className="material-symbols-outlined text-[16px]">verified_user</span>
                <span>Certificado ANMAT</span>
              </div>
              <div className="flex items-center justify-center gap-1 font-semibold text-primary">
                <span className="material-symbols-outlined text-[16px]">lock</span>
                <span>Checkout Seguro SSL</span>
              </div>
            </div>
          </div>

          {/* Plan Recarga Card */}
          <div className="rounded-2xl bg-surface-container-high/60 p-space-md shadow-sm flex items-center gap-space-sm border border-slate-100">
            <div className="w-10 h-10 rounded-full bg-surface-container-lowest text-secondary flex items-center justify-center shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[22px]">eco</span>
            </div>
            <div className="min-w-0">
              <p className="font-label-md text-label-md text-on-surface font-bold">
                Plan Recarga &amp; Ahorro Detersur
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Entregá tus bidones vacíos al repartidor y acumulá $800 para tu próxima compra semanal.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Assistance Banner */}
      <div className="mt-space-xl p-space-lg rounded-2xl bg-surface-container-low flex flex-col md:flex-row items-center justify-between gap-space-md shadow-[0_12px_24px_-8px_rgba(0,119,182,0.08)] border border-slate-200/50">
        <div className="flex items-center gap-space-md">
          <div className="w-12 h-12 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[24px]">support_agent</span>
          </div>
          <div>
            <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              ¿Necesitas asesoramiento químico o cotización para empresas?
            </h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Podemos procesar tu compra con cuenta corriente comercial o Factura A al por mayor.
            </p>
          </div>
        </div>
        <a
          className="px-space-lg py-space-sm rounded-full bg-surface-container-lowest text-primary font-label-md text-label-md shadow-[0_6px_16px_rgba(9,27,56,0.06)] hover:bg-white transition-all shrink-0 font-bold"
          href="https://wa.me/5491145678900?text=Hola%20Detersur!%20Necesito%20asesoramiento%20quimico%20para%20empresas"
          target="_blank"
          rel="noopener noreferrer"
        >
          Contactar por WhatsApp
        </a>
      </div>
    </div>
  );
};
