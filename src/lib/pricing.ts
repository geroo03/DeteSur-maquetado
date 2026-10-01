import {
  CANJE_CREDIT_PER_UNIT,
  FREE_SHIPPING_THRESHOLD,
  IVA_RATE,
  PAYMENT_DISCOUNT_RATE,
  SHIPPING_RATES,
  WHOLESALE_TIERS,
} from '../data/content';
import {
  CartItem,
  OrderTotals,
  PaymentMethod,
  ShippingMethod,
  WholesaleTier,
} from '../types';

/** Highest staggered tier unlocked by the current unit count. */
export const resolveWholesaleTier = (totalUnits: number): WholesaleTier | null =>
  WHOLESALE_TIERS.reduce<WholesaleTier | null>(
    (best, tier) => (totalUnits >= tier.minUnits ? tier : best),
    null
  );

export const countUnits = (cart: CartItem[]): number =>
  cart.reduce((sum, item) => sum + item.quantity, 0);

export const cartSubtotal = (cart: CartItem[]): number =>
  cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

/** How many returnable containers the cart could credit at most. */
export const maxCanjeUnits = (cart: CartItem[]): number =>
  cart.reduce(
    (sum, item) =>
      sum + (item.product.isBulk || item.presentation?.isEco ? item.quantity : 0),
    0
  );

interface TotalsInput {
  cart: CartItem[];
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  canjeUnits: number;
}

/**
 * Single source of truth for every money figure shown in the cart, the drawer,
 * the checkout summary and the confirmation screen.
 *
 * Discounts stack in this order: wholesale tier off the subtotal, then the
 * bottle-return credit, then the cash/transfer discount on what is left.
 */
export const calculateTotals = ({
  cart,
  shippingMethod,
  paymentMethod,
  canjeUnits,
}: TotalsInput): OrderTotals => {
  const subtotal = cartSubtotal(cart);
  const totalUnits = countUnits(cart);

  const wholesaleTier = resolveWholesaleTier(totalUnits);
  const wholesaleDiscount = wholesaleTier ? Math.round(subtotal * wholesaleTier.rate) : 0;

  const appliedCanjeUnits = Math.min(canjeUnits, maxCanjeUnits(cart));
  const afterWholesale = subtotal - wholesaleDiscount;
  const canjeDiscount = Math.min(
    appliedCanjeUnits * CANJE_CREDIT_PER_UNIT,
    Math.max(0, afterWholesale)
  );

  const afterCanje = Math.max(0, afterWholesale - canjeDiscount);
  const paymentDiscount =
    paymentMethod === 'mercadopago' ? 0 : Math.round(afterCanje * PAYMENT_DISCOUNT_RATE);

  const goodsTotal = Math.max(0, afterCanje - paymentDiscount);

  const qualifiesForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingCost =
    shippingMethod === 'pickup' || qualifiesForFreeShipping || cart.length === 0
      ? 0
      : SHIPPING_RATES[shippingMethod];

  const total = goodsTotal + shippingCost;
  const taxIncluded = Math.round((total * IVA_RATE) / (1 + IVA_RATE));

  return {
    subtotal,
    wholesaleDiscount,
    wholesaleTier,
    canjeDiscount,
    paymentDiscount,
    shippingCost,
    total,
    taxIncluded,
    totalUnits,
    freeShippingGap: Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal),
    savings: wholesaleDiscount + canjeDiscount + paymentDiscount,
  };
};

/** Progress toward the free-shipping threshold, 0 → 1. */
export const freeShippingProgress = (subtotal: number): number =>
  Math.min(1, subtotal / FREE_SHIPPING_THRESHOLD);

/** Next tier the customer has not reached yet, for the upsell nudge. */
export const nextWholesaleTier = (totalUnits: number): WholesaleTier | null =>
  WHOLESALE_TIERS.find((tier) => totalUnits < tier.minUnits) ?? null;
