import {
  BrandLogo,
  CategoryId,
  CategoryTile,
  Faq,
  HeroSlide,
  StoreBranch,
  Testimonial,
  WholesaleTier,
} from '../types';
import { LOGO_3D_URL, PRODUCTS } from './products';

const IMG = (id: string) => PRODUCTS.find((p) => p.id === id)?.image ?? LOGO_3D_URL;

/* ------------------------------------------------------------------ */
/* Hero carousel                                                       */
/* ------------------------------------------------------------------ */
export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'hero-directo',
    eyebrow: 'Química directa & Fraccionadora Mayorista',
    title: 'Todo para la limpieza de tu casa y',
    highlight: 'tu negocio',
    description:
      'Comprá directo de fábrica: químicos sueltos, bidones por mayor y las primeras marcas de higiene institucional al mejor precio de Zona Sur. Fraccionado exacto y seguro.',
    image: LOGO_3D_URL,
    ctaLabel: 'Ver ofertas de la semana',
    ctaTarget: { view: 'catalog' },
    secondaryLabel: 'Calculá tu bidón suelto',
    secondaryTarget: { view: 'product-detail', productId: 'lavandina-55g' },
    accent: 'primary',
    stat: { value: '+250', label: 'Fórmulas activas certificadas' },
  },
  {
    id: 'hero-canje',
    eyebrow: 'Plan Canje & Economía Circular',
    title: 'Traé tu envase y ahorrá hasta un',
    highlight: '40%',
    description:
      'El 40% de lo que pagás en el súper es plástico, etiqueta y marketing. Vení con tu bidón limpio, lo llenamos con el mismo químico activo y pagás sólo el líquido.',
    image: IMG('lavandina-55g'),
    ctaLabel: 'Ver químicos recargables',
    ctaTarget: { view: 'catalog', category: 'sueltos' },
    secondaryLabel: 'Cómo funciona el canje',
    secondaryTarget: { view: 'home' },
    accent: 'secondary',
    stat: { value: '-40%', label: 'Ahorro real por recarga' },
  },
  {
    id: 'hero-mayorista',
    eyebrow: 'Consorcios, Colegios, Fábricas y Lavaderos',
    title: 'Canal mayorista con descuentos de hasta',
    highlight: '25% OFF',
    description:
      'Factura A y B con CUIT en el acto, flota propia y entregas programadas en tambores de 200 L o pallets de bidones de 5 L. Un asesor te arma la lista a medida.',
    image: IMG('jabon-liquido-matic'),
    ctaLabel: 'Ver precios por bulto',
    ctaTarget: { view: 'catalog' },
    secondaryLabel: 'Hablar con un asesor B2B',
    secondaryTarget: { view: 'checkout' },
    accent: 'tertiary',
    stat: { value: '24 hs', label: 'Despacho express garantizado' },
  },
  {
    id: 'hero-sanitario',
    eyebrow: 'Línea Sanitaria Grado Hospitalario',
    title: 'Amonio cuaternario de 5ª generación,',
    highlight: 'sin enjuague',
    description:
      'Bactericida, fungicida y virucida de amplio espectro con eficacia comprobada sobre el 99,99% de patógenos. Aprobado para clínicas, geriátricos y food service.',
    image: IMG('limpiador-amonio-cuaternario'),
    ctaLabel: 'Ver línea sanitaria',
    ctaTarget: { view: 'product-detail', productId: 'limpiador-amonio-cuaternario' },
    secondaryLabel: 'Descargar fichas técnicas',
    secondaryTarget: { view: 'catalog', category: 'sueltos' },
    accent: 'primary',
    stat: { value: '99,99%', label: 'Eficacia sobre patógenos' },
  },
];

/* ------------------------------------------------------------------ */
/* Category tiles                                                      */
/* ------------------------------------------------------------------ */
export const CATEGORY_TILES: CategoryTile[] = [
  { id: 'sueltos', label: 'Químicos Sueltos', count: '42 productos', icon: 'water_drop', gradient: 'from-secondary-fixed/60 to-primary-fixed/40', textColor: 'text-secondary' },
  { id: 'pisos', label: 'Pisos & Cerámicos', count: '28 productos', icon: 'mop', gradient: 'from-primary-fixed/60 to-surface-container-highest', textColor: 'text-primary' },
  { id: 'cocina', label: 'Cocina & Grasas', count: '19 productos', icon: 'countertops', gradient: 'from-tertiary-fixed/60 to-surface-container-high', textColor: 'text-tertiary' },
  { id: 'bano', label: 'Baño & Antisarro', count: '24 productos', icon: 'bathroom', gradient: 'from-secondary-fixed/50 to-surface-container-low', textColor: 'text-secondary' },
  { id: 'ropa', label: 'Lavado de Ropa', count: '35 productos', icon: 'local_laundry_service', gradient: 'from-primary-fixed/60 to-secondary-fixed/40', textColor: 'text-primary' },
  { id: 'piscinas', label: 'Cuidado Piscina', count: '16 productos', icon: 'pool', gradient: 'from-primary-fixed/80 to-surface-container-lowest', textColor: 'text-primary' },
  { id: 'accesorios', label: 'Escobas & Palas', count: '22 productos', icon: 'cleaning_services', gradient: 'from-surface-container-highest to-surface-container-low', textColor: 'text-primary' },
  { id: 'papeleria', label: 'Papel & Rollos', count: '31 productos', icon: 'inventory_2', gradient: 'from-tertiary-fixed/50 to-primary-fixed/40', textColor: 'text-tertiary' },
  { id: 'aromas', label: 'Aromas & Difusor', count: '27 productos', icon: 'air_freshener', gradient: 'from-secondary-fixed/50 to-surface-container-lowest', textColor: 'text-secondary' },
  { id: 'sueltos', label: 'Insecticidas', count: '14 productos', icon: 'pest_control', gradient: 'from-primary-fixed/50 to-surface-container-highest', textColor: 'text-primary' },
];

export const CATEGORY_LABELS: { id: CategoryId; label: string; icon: string }[] = [
  { id: 'ALL', label: 'Todos los productos', icon: 'apps' },
  { id: 'sueltos', label: 'Químicos Sueltos', icon: 'water_drop' },
  { id: 'ropa', label: 'Lavado de Ropa', icon: 'local_laundry_service' },
  { id: 'pisos', label: 'Pisos & Ceras', icon: 'mop' },
  { id: 'cocina', label: 'Cocina & Grasas', icon: 'countertops' },
  { id: 'bano', label: 'Baño & Antisarro', icon: 'bathroom' },
  { id: 'piscinas', label: 'Piscinas', icon: 'pool' },
  { id: 'aromas', label: 'Aromas', icon: 'air_freshener' },
  { id: 'papeleria', label: 'Papelería', icon: 'inventory_2' },
  { id: 'accesorios', label: 'Accesorios', icon: 'cleaning_services' },
];

/* ------------------------------------------------------------------ */
/* Brand marquee                                                       */
/* ------------------------------------------------------------------ */
export const BRAND_LOGOS: BrandLogo[] = [
  { id: 'detersur', name: 'Detersur', tagline: 'Fraccionado propio', icon: 'water_drop' },
  { id: 'romyl', name: 'ROMYL', tagline: 'Línea textil', icon: 'local_laundry_service' },
  { id: 'xper', name: 'XPER', tagline: 'Industrial', icon: 'engineering' },
  { id: 'sina', name: 'SINA', tagline: 'Aromas premium', icon: 'air_freshener' },
  { id: 'aquamar', name: 'AQUAMAR', tagline: 'Piscinas', icon: 'pool' },
  { id: 'blem', name: 'Blem', tagline: 'Muebles', icon: 'chair' },
  { id: 'ceramicol', name: 'Ceramicol', tagline: 'Ceras y pisos', icon: 'grid_on' },
  { id: 'detersur-papeles', name: 'Detersur Papeles', tagline: 'Institucional', icon: 'inventory_2' },
  { id: 'detersur-pro', name: 'Detersur Pro', tagline: 'Equipamiento', icon: 'cleaning_services' },
];

/* ------------------------------------------------------------------ */
/* Testimonials carousel                                               */
/* ------------------------------------------------------------------ */
export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Marcela Ferreyra',
    role: 'Restaurante Las Vías · Lanús',
    initials: 'MF',
    rating: 5,
    quote:
      'Pasamos de comprar en el mayorista a cargar los bidones directo en planta. Bajamos el gasto de limpieza casi un 35% al mes y el personal nota que rinde más por balde.',
    accent: 'primary',
  },
  {
    id: 't2',
    name: 'Administración Grupo Sur',
    role: 'Consorcios · 14 edificios',
    initials: 'GS',
    rating: 5,
    quote:
      'Nos entregan con flota propia los lunes a primera hora en los catorce edificios y la factura A llega el mismo día. No tuvimos un solo faltante en dos años.',
    accent: 'secondary',
  },
  {
    id: 't3',
    name: 'Diego Sosa',
    role: 'Cliente minorista · Quilmes',
    initials: 'DS',
    rating: 5,
    quote:
      'Llevo mi bidón de 5 litros cada tres semanas. Mismo producto que venía comprando envasado, pagando casi la mitad y tirando cero plástico.',
    accent: 'primary',
  },
  {
    id: 't4',
    name: 'Lavadero El Trébol',
    role: 'Lavandería industrial · Avellaneda',
    initials: 'LT',
    rating: 5,
    quote:
      'El jabón baja espuma en bidón de 20 litros nos cambió el costo por kilo lavado. Remueve bien en agua fría, que es donde nos íbamos en gas.',
    accent: 'tertiary',
  },
  {
    id: 't5',
    name: 'Dra. Paula Iriarte',
    role: 'Centro médico · Banfield',
    initials: 'PI',
    rating: 5,
    quote:
      'Necesitábamos amonio cuaternario con respaldo documental para la habilitación. Nos dieron fichas técnicas y certificados sin tener que pedirlos dos veces.',
    accent: 'secondary',
  },
  {
    id: 't6',
    name: 'Escuela San Cayetano',
    role: 'Institución educativa · Lomas',
    initials: 'SC',
    rating: 4,
    quote:
      'Compramos papelería institucional y desinfectantes por bulto cerrado. El descuento por volumen se nota y la entrega es puntual. Sumaría más formas de pago.',
    accent: 'primary',
  },
];

/* ------------------------------------------------------------------ */
/* Value comparison (price per litre vs. supermarket)                  */
/* ------------------------------------------------------------------ */
export const PRICE_COMPARISON: {
  product: string;
  detersur: number;
  retail: number;
  productId?: string;
}[] = [
  { product: 'Lavandina Concentrada 55g', detersur: 690, retail: 1250, productId: 'lavandina-55g' },
  { product: 'Jabón Ropa Baja Espuma', detersur: 1190, retail: 2300, productId: 'jabon-liquido-matic' },
  { product: 'Desodorante de Pisos Lavanda', detersur: 450, retail: 890, productId: 'desodorante-pisos-lavanda' },
  { product: 'Detergente Lavavajillas 20%', detersur: 978, retail: 1600, productId: 'detergente-sina-concentrado' },
  { product: 'Jabón de Manos Nacarado', detersur: 796, retail: 1490, productId: 'jabon-liquido-manos-nacarado' },
];

/* ------------------------------------------------------------------ */
/* Commercial rules                                                    */
/* ------------------------------------------------------------------ */
export const WHOLESALE_TIERS: WholesaleTier[] = [
  { minUnits: 10, rate: 0.15, label: '+10 unidades: 15% OFF' },
  { minUnits: 30, rate: 0.25, label: '+30 unidades: 25% OFF' },
];

export const FREE_SHIPPING_THRESHOLD = 25000;
export const SHIPPING_RATES = { express: 3200, scheduled: 1900, pickup: 0 };
/** Discount applied when paying by bank transfer or cash. */
export const PAYMENT_DISCOUNT_RATE = 0.1;
/** Credit granted per returned container under the "plan canje". */
export const CANJE_CREDIT_PER_UNIT = 430;
export const IVA_RATE = 0.21;

/* ------------------------------------------------------------------ */
/* FAQ accordion                                                       */
/* ------------------------------------------------------------------ */
export const FAQS: Faq[] = [
  {
    id: 'f1',
    question: '¿Cómo funciona exactamente el Plan Canje de envases?',
    answer:
      'Traés cualquier bidón o botella limpia y en buen estado al mostrador. Lo pesamos, lo llenamos con el químico que elijas y pagás sólo el líquido, sin el costo del envase. Si no tenés envase, te vendemos uno reforzado de primer uso que después podés recargar todas las veces que quieras. En el carrito podés declarar cuántos envases devolvés y el descuento se aplica solo.',
    icon: 'recycling',
  },
  {
    id: 'f2',
    question: '¿Qué zonas cubre el envío y cuánto demora?',
    answer:
      'Hacemos envío express en el día para CABA y GBA Sur (Lanús, Avellaneda, Quilmes, Lomas de Zamora, Banfield y alrededores) si el pedido entra antes de las 14 hs. Para el resto de GBA el envío es programado a 48/72 hs. Las compras superiores a $25.000 tienen el envío bonificado. También podés retirar sin cargo en cualquiera de nuestras tres sucursales.',
    icon: 'local_shipping',
  },
  {
    id: 'f3',
    question: '¿Emiten factura A? Necesito descargar IVA.',
    answer:
      'Sí. Emitimos Factura A y B con CUIT en el acto. En el checkout elegís el tipo de comprobante y cargás los datos fiscales; la factura electrónica se envía por mail junto con la confirmación del pedido. Para cuentas corrientes mayoristas con pago a 30 días, un asesor B2B te abre la cuenta con una verificación simple.',
    icon: 'receipt_long',
  },
  {
    id: 'f4',
    question: '¿Los productos están certificados? ¿Entregan fichas técnicas?',
    answer:
      'Toda la línea de desinfectantes y productos de contacto cuenta con registro ANMAT y RNPA, y los insecticidas con registro SENASA. Cada producto tiene disponible su ficha técnica y hoja de seguridad (MSDS) descargable desde la página de detalle, que es lo que suelen pedir las habilitaciones municipales y los servicios de bromatología.',
    icon: 'verified_user',
  },
  {
    id: 'f5',
    question: '¿Desde qué cantidad accedo al precio mayorista?',
    answer:
      'El descuento escalonado se aplica automáticamente en el carrito: a partir de 10 unidades tenés 15% OFF y a partir de 30 unidades 25% OFF sobre todo el pedido. Para tambores de 200 litros o pallets completos trabajamos con cotización especial, porque el precio depende del flete y de la frecuencia de reposición.',
    icon: 'inventory',
  },
  {
    id: 'f6',
    question: '¿Qué medios de pago aceptan?',
    answer:
      'Mercado Pago con todas las tarjetas de crédito y débito, con 3 cuotas sin interés en bancos seleccionados. Si pagás por transferencia bancaria o en efectivo al retirar, se aplica un 10% de descuento sobre el total del pedido. Las cuentas mayoristas habilitadas pueden operar con pago a 30 días contra factura.',
    icon: 'credit_card',
  },
];

/* ------------------------------------------------------------------ */
/* Branches                                                            */
/* ------------------------------------------------------------------ */
export const STORE_BRANCHES: StoreBranch[] = [
  {
    id: 'lanus',
    name: 'Casa Central Lanús Oeste',
    address: 'Av. Hipólito Yrigoyen 4200, Lanús Oeste',
    hours: 'Lun a Vie 8:30–18:30 · Sáb 9:00–13:30',
    phone: '11 4567-8900',
    features: ['Planta de fraccionado', 'Carga de bidones', 'Retiro express', 'Factura A y B'],
  },
  {
    id: 'quilmes',
    name: 'Sucursal Quilmes Centro',
    address: 'Av. Calchaquí 1850, Quilmes',
    hours: 'Lun a Vie 9:00–18:00 · Sáb 9:00–13:00',
    phone: '11 4567-8901',
    features: ['Retiro express', 'Carga de bidones', 'Mostrador mayorista'],
  },
  {
    id: 'avellaneda',
    name: 'Sucursal Avellaneda',
    address: 'Av. Mitre 2240, Avellaneda',
    hours: 'Lun a Vie 9:00–18:00',
    phone: '11 4567-8902',
    features: ['Retiro express', 'Depósito mayorista', 'Carga de tambores'],
  },
];

/* ------------------------------------------------------------------ */
/* Static marketing blocks                                             */
/* ------------------------------------------------------------------ */
export const TRUST_BADGES = [
  {
    id: 'pago',
    icon: 'credit_card',
    title: 'Pago Seguro',
    body: 'Mercado Pago, 3 cuotas sin interés y 10% OFF pagando en efectivo o por transferencia.',
    tone: 'secondary' as const,
  },
  {
    id: 'retiro',
    icon: 'storefront',
    title: 'Puntos de Retiro',
    body: 'Sucursales con carga rápida en Lanús, Quilmes y Avellaneda, siempre sin costo adicional.',
    tone: 'primary' as const,
  },
  {
    id: 'anmat',
    icon: 'verified_user',
    title: 'Garantía ANMAT',
    body: 'Desinfectantes y fórmulas con certificación, RNPA y trazabilidad de lote documentada.',
    tone: 'tertiary' as const,
  },
];

export const CANJE_STEPS = [
  {
    step: 1,
    icon: 'science',
    title: 'Elegí tu fórmula',
    body: 'Seleccioná la densidad, fragancia o poder antibacterial según la superficie que tengas que resolver.',
    tone: 'primary' as const,
  },
  {
    step: 2,
    icon: 'recycling',
    title: 'Traé tu bidón',
    body: 'Vení con cualquier bidón o botella limpia. Si no tenés, te proveemos uno reforzado de primer uso.',
    tone: 'secondary' as const,
  },
  {
    step: 3,
    icon: 'savings',
    title: 'Pagás sólo el líquido',
    body: 'Ahorrás hasta un 40% por recarga, reducís plástico de un solo uso y te llevás calidad testeada.',
    tone: 'tertiary' as const,
  },
];

export const QUICK_SEARCHES: { label: string; icon: string; productId?: string; query?: string }[] = [
  { label: 'Lavandina concentrada 55g', icon: 'water_drop', productId: 'lavandina-55g' },
  { label: 'Jabón líquido baja espuma', icon: 'local_laundry_service', productId: 'jabon-liquido-matic' },
  { label: 'Pastillas triple acción', icon: 'pool', productId: 'pastillas-cloro-aquamar' },
  { label: 'Recargas y bidones', icon: 'eco', query: 'recarga' },
  { label: 'Amonio cuaternario', icon: 'sanitizer', productId: 'limpiador-amonio-cuaternario' },
];

export const CONTACT = {
  phone: '+54 11 4567-8900',
  phoneHref: 'tel:+541145678900',
  whatsapp: 'https://wa.me/5491145678900?text=Hola%20Detersur!%20Quiero%20hacer%20una%20consulta',
  whatsappB2B:
    'https://wa.me/5491145678900?text=Hola%20Detersur!%20Quiero%20asesoramiento%20mayorista%20B2B',
  email: 'contacto@detersur.com.ar',
  address: 'Av. Hipólito Yrigoyen 4200, Lanús Oeste, Buenos Aires',
};
