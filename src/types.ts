export type CategoryId =
  | 'ALL'
  | 'sueltos'
  | 'ropa'
  | 'pisos'
  | 'cocina'
  | 'piscinas'
  | 'papeleria'
  | 'accesorios';

export type BrandId =
  | 'ALL'
  | 'Detersur'
  | 'ROMYL'
  | 'XPER'
  | 'SINA'
  | 'AQUAMAR'
  | 'Blem'
  | 'Ceramicol'
  | 'Detersur Papeles'
  | 'Detersur Pro';

export interface ProductPresentation {
  id: string;
  title: string;
  volume: string;
  price: number;
  unitPrice: number;
  badge?: string;
  isPopular?: boolean;
  isEco?: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: CategoryId;
  price: number;
  image: string;
  badge?: string;
  packageType: string;
  description: string;
  details?: string;
  isBulk?: boolean;
  dilution?: string;
  density?: string;
  origin?: string;
  rating?: number;
  reviewsCount?: number;
  salesCount?: string;
  sku?: string;
  rnpa?: string;
  presentations?: ProductPresentation[];
}

export interface CartItem {
  id: string;
  product: Product;
  presentation?: ProductPresentation;
  quantity: number;
  price: number;
}

export type ViewType =
  | 'home'
  | 'catalog'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'confirmation';
