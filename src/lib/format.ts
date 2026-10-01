/** Argentine peso formatting helpers used across the storefront. */

const nf = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 });
const nf2 = new Intl.NumberFormat('es-AR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatNumber = (value: number): string => nf.format(Math.round(value));

/** "$ 12.450" — the dominant price style in the mockups. */
export const formatPrice = (value: number): string => `$ ${nf.format(Math.round(value))}`;

/** "$ 12.450,00 ARS" — used on invoices and the order summary. */
export const formatPriceLong = (value: number): string => `$ ${nf2.format(value)} ARS`;

export const formatPercent = (rate: number): string => `${Math.round(rate * 100)}%`;

/** Discount percentage between a list price and the selling price. */
export const discountPercent = (listPrice: number, price: number): number =>
  listPrice <= price ? 0 : Math.round(((listPrice - price) / listPrice) * 100);

/**
 * Pulls the measuring unit out of a presentation volume, so "5L Suelto"
 * prices per "L" and "1 Kg" per "Kg" rather than per "LSuelto".
 */
export const unitFromVolume = (volume: string): string => {
  const match = volume.match(/\d[\d.,]*\s*(kg|g|ml|cm³|l|u)\b/i);
  if (match) {
    const unit = match[1].toLowerCase();
    return unit === 'l' ? 'L' : unit === 'kg' ? 'Kg' : unit;
  }
  return 'u';
};

export const formatUnitPrice = (value: number, unit = 'L'): string =>
  `$ ${nf.format(Math.round(value))} / ${unit}`;

/** Clamp helper shared by the quantity steppers and sliders. */
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

/** Accent- and case-insensitive text match for the search box. */
export const normalize = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();

export const formatOrderNumber = (seed = Date.now()): string =>
  `#DET-${String(seed).slice(-5)}`;

export const estimatedDelivery = (days: number): string => {
  if (days <= 0) return 'hoy';
  if (days === 1) return 'mañana';
  const target = new Date();
  target.setDate(target.getDate() + days);
  return `el ${target.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })}`;
};
