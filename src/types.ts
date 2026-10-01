export type CategoryId =
  | 'ALL'
  | 'sueltos'
  | 'ropa'
  | 'pisos'
  | 'cocina'
  | 'bano'
  | 'piscinas'
  | 'papeleria'
  | 'aromas'
  | 'accesorios';

export type BrandId = string;

export interface ProductPresentation {
  id: string;
  title: string;
  volume: string;
  price: number;
  /** Price per litre / kilo / unit, used for the value comparison UI. */
  unitPrice: number;
  badge?: string;
  isPopular?: boolean;
  isEco?: boolean;
  stock?: number;
}

export interface Review {
  id: string;
  author: string;
  initials: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  verified?: boolean;
  helpful?: number;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: CategoryId;
  price: number;
  /** Optional struck-through reference price; drives the "% OFF" badge. */
  listPrice?: number;
  image: string;
  /** Extra angles for the detail-page gallery carousel. */
  gallery?: string[];
  badge?: string;
  packageType: string;
  description: string;
  details?: string;
  isBulk?: boolean;
  isNew?: boolean;
  dilution?: string;
  density?: string;
  ph?: string;
  origin?: string;
  rating?: number;
  reviewsCount?: number;
  salesCount?: string;
  sku?: string;
  rnpa?: string;
  stock: number;
  tags?: string[];
  usage?: string[];
  presentations?: ProductPresentation[];
  reviews?: Review[];
}

export interface CartItem {
  id: string;
  product: Product;
  presentation?: ProductPresentation;
  quantity: number;
  price: number;
}

export type ShippingMethod = 'express' | 'scheduled' | 'pickup';
export type PaymentMethod = 'mercadopago' | 'transfer' | 'cash';
export type InvoiceType = 'B' | 'A';

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  apartment: string;
  locality: string;
  postalCode: string;
  notes: string;
  cuit?: string;
  businessName?: string;
}

export interface OrderTotals {
  subtotal: number;
  /** Staggered wholesale discount earned by unit count. */
  wholesaleDiscount: number;
  wholesaleTier: WholesaleTier | null;
  /** Bottle-return ("plan canje") credit. */
  canjeDiscount: number;
  /** 10% off when paying by transfer or cash. */
  paymentDiscount: number;
  shippingCost: number;
  total: number;
  /** VAT already contained in the total (Argentine prices are gross). */
  taxIncluded: number;
  totalUnits: number;
  /** Pesos still missing to unlock free shipping. */
  freeShippingGap: number;
  savings: number;
}

export interface WholesaleTier {
  minUnits: number;
  rate: number;
  label: string;
}

export type ViewType =
  | 'home'
  | 'catalog'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'confirmation';

export interface Route {
  view: ViewType;
  productId?: string;
  category?: CategoryId;
  query?: string;
}

export type ToastVariant = 'success' | 'info' | 'error' | 'cart';

export interface Toast {
  id: string;
  variant: ToastVariant;
  title: string;
  message?: string;
  image?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  image: string;
  ctaLabel: string;
  ctaTarget: Route;
  secondaryLabel: string;
  secondaryTarget: Route;
  accent: 'primary' | 'secondary' | 'tertiary';
  stat: { value: string; label: string };
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  initials: string;
  rating: number;
  quote: string;
  accent: 'primary' | 'secondary' | 'tertiary';
}

export interface BrandLogo {
  id: string;
  name: string;
  tagline: string;
  icon: string;
}

export interface CategoryTile {
  id: CategoryId;
  label: string;
  count: string;
  icon: string;
  gradient: string;
  textColor: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  icon: string;
}

export interface StoreBranch {
  id: string;
  name: string;
  address: string;
  hours: string;
  phone: string;
  features: string[];
}

export type SortKey =
  | 'relevant'
  | 'price-asc'
  | 'price-desc'
  | 'rating'
  | 'name'
  | 'newest';

export type ViewMode = 'grid' | 'list';
