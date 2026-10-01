import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  CartItem,
  CategoryId,
  InvoiceType,
  OrderTotals,
  PaymentMethod,
  Product,
  ProductPresentation,
  Route,
  ShippingAddress,
  ShippingMethod,
  Toast,
  ToastVariant,
  ViewType,
} from '../types';
import { PRODUCTS, getProductById } from '../data/products';
import { calculateTotals, maxCanjeUnits } from '../lib/pricing';
import { STORAGE_KEYS, readJSON, writeJSON } from '../lib/storage';
import { formatOrderNumber } from '../lib/format';
import { useHashRoute } from '../hooks';

/** Shape persisted to localStorage — products are re-hydrated by id so that
 *  catalog edits (price, stock, copy) always win over a stale saved cart. */
interface PersistedLine {
  productId: string;
  presentationId?: string;
  quantity: number;
}

interface PlacedOrder {
  orderNumber: string;
  placedAt: string;
  totals: OrderTotals;
  items: PersistedLine[];
  itemCount: number;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  invoiceType: InvoiceType;
  address: ShippingAddress;
}

const EMPTY_ADDRESS: ShippingAddress = {
  fullName: '',
  email: '',
  phone: '',
  street: '',
  apartment: '',
  locality: '',
  postalCode: '',
  notes: '',
  cuit: '',
  businessName: '',
};

/** Prefilled sample used by the "cargar pedido de ejemplo" demo shortcut. */
const DEMO_ADDRESS: ShippingAddress = {
  fullName: 'Federico Gómez',
  email: 'federico.gomez@gmail.com',
  phone: '11 4589-2210',
  street: 'Av. Hipólito Yrigoyen 4200',
  apartment: '4° B - Frente',
  locality: 'Lanús Oeste',
  postalCode: '1824',
  notes:
    'Timbre blanco junto al portón. Si no respondo, dejar con el encargado de portería (Carlos).',
  cuit: '',
  businessName: '',
};

const DEMO_LINES: PersistedLine[] = [
  { productId: 'lavandina-55g', presentationId: '5L', quantity: 2 },
  { productId: 'jabon-liquido-matic', presentationId: '5L', quantity: 1 },
  { productId: 'desengrasante-cocina-express', presentationId: '750ml', quantity: 1 },
  { productId: 'desodorante-pisos-lavanda', presentationId: 'recarga-5L', quantity: 3 },
];

interface StoreContextValue {
  /* routing */
  route: Route;
  activeView: ViewType;
  navigate: (route: Route) => void;
  navigateTo: (view: ViewType, productId?: string) => void;
  selectedProduct: Product;

  /* cart */
  cart: CartItem[];
  cartCount: number;
  totals: OrderTotals;
  addToCart: (
    product: Product,
    presentation?: ProductPresentation,
    quantity?: number
  ) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void
  setQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  loadDemoCart: () => void;
  isInCart: (productId: string) => boolean;

  /* drawer */
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;

  /* plan canje */
  canjeUnits: number;
  canjeMax: number;
  setCanjeUnits: (units: number) => void;

  /* checkout */
  shippingMethod: ShippingMethod;
  setShippingMethod: (method: ShippingMethod) => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  invoiceType: InvoiceType;
  setInvoiceType: (type: InvoiceType) => void;
  shippingAddress: ShippingAddress;
  updateAddress: (field: keyof ShippingAddress, value: string) => void;
  fillDemoAddress: () => void;
  placeOrder: () => void;
  lastOrder: PlacedOrder | null;

  /* wishlist */
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  /* search */
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  recentSearches: string[];
  pushRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;

  /* catalog filters shared with the header */
  catalogCategory: CategoryId;
  setCatalogCategory: (category: CategoryId) => void;

  /* quick view modal */
  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;

  /* toasts */
  toasts: Toast[];
  pushToast: (toast: Omit<Toast, 'id'>) => void;
  dismissToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

const lineId = (product: Product, presentation?: ProductPresentation) =>
  presentation ? `${product.id}--${presentation.id}` : product.id;

const hydrate = (lines: PersistedLine[]): CartItem[] =>
  lines.flatMap((line) => {
    const product = getProductById(line.productId);
    if (!product) return [];

    const presentation = line.presentationId
      ? product.presentations?.find((p) => p.id === line.presentationId)
      : undefined;

    // A saved presentation that no longer exists falls back to the base price.
    const price = presentation ? presentation.price : product.price;
    const quantity = Math.max(1, Math.min(99, Math.round(line.quantity)));

    return [{ id: lineId(product, presentation), product, presentation, quantity, price }];
  });

const dehydrate = (cart: CartItem[]): PersistedLine[] =>
  cart.map((item) => ({
    productId: item.product.id,
    presentationId: item.presentation?.id,
    quantity: item.quantity,
  }));

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { route, navigate: navigateHash } = useHashRoute();

  const [cart, setCart] = useState<CartItem[]>(() =>
    hydrate(readJSON<PersistedLine[]>(STORAGE_KEYS.cart, []))
  );
  const [wishlist, setWishlist] = useState<string[]>(() =>
    readJSON<string[]>(STORAGE_KEYS.wishlist, [])
  );
  const [recentSearches, setRecentSearches] = useState<string[]>(() =>
    readJSON<string[]>(STORAGE_KEYS.recentSearches, [])
  );
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>(() =>
    readJSON<ShippingAddress>(STORAGE_KEYS.address, EMPTY_ADDRESS)
  );
  const [lastOrder, setLastOrder] = useState<PlacedOrder | null>(() =>
    readJSON<PlacedOrder | null>(STORAGE_KEYS.lastOrder, null)
  );

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [canjeUnits, setCanjeUnitsState] = useState(0);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('express');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mercadopago');
  const [invoiceType, setInvoiceType] = useState<InvoiceType>('B');
  const [searchQuery, setSearchQuery] = useState(route.query ?? '');
  const [catalogCategory, setCatalogCategory] = useState<CategoryId>(
    route.category ?? 'ALL'
  );
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toastTimers = useRef(new Map<string, number>());

  /* ---------------- persistence ---------------- */
  useEffect(() => writeJSON(STORAGE_KEYS.cart, dehydrate(cart)), [cart]);
  useEffect(() => writeJSON(STORAGE_KEYS.wishlist, wishlist), [wishlist]);
  useEffect(() => writeJSON(STORAGE_KEYS.recentSearches, recentSearches), [recentSearches]);
  useEffect(() => writeJSON(STORAGE_KEYS.address, shippingAddress), [shippingAddress]);

  useEffect(() => {
    return () => {
      toastTimers.current.forEach((timer) => window.clearTimeout(timer));
      toastTimers.current.clear();
    };
  }, []);

  /* ---------------- derived cart values ---------------- */
  const canjeMax = useMemo(() => maxCanjeUnits(cart), [cart]);

  // Returning fewer containers than declared must not keep crediting them.
  useEffect(() => {
    setCanjeUnitsState((current) => Math.min(current, canjeMax));
  }, [canjeMax]);

  const totals = useMemo(
    () => calculateTotals({ cart, shippingMethod, paymentMethod, canjeUnits }),
    [cart, shippingMethod, paymentMethod, canjeUnits]
  );

  const cartCount = totals.totalUnits;

  /* ---------------- toasts ---------------- */
  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    const timer = toastTimers.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      toastTimers.current.delete(id);
    }
  }, []);

  const pushToast = useCallback(
    (toast: Omit<Toast, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      // Cap the stack so a burst of adds cannot cover the screen.
      setToasts((prev) => [...prev.slice(-2), { ...toast, id }]);
      const timer = window.setTimeout(() => dismissToast(id), 4200);
      toastTimers.current.set(id, timer);
    },
    [dismissToast]
  );

  /* ---------------- routing ---------------- */
  const navigate = useCallback(
    (next: Route) => {
      if (next.view === 'catalog') {
        if (next.category) setCatalogCategory(next.category);
        if (typeof next.query === 'string') setSearchQuery(next.query);
      }
      setIsDrawerOpen(false);
      setQuickViewProduct(null);
      navigateHash(next);
    },
    [navigateHash]
  );

  const navigateTo = useCallback(
    (view: ViewType, productId?: string) => navigate({ view, productId }),
    [navigate]
  );

  // Scroll to the top whenever the view changes, but keep the position when
  // only the query string moved (catalog filtering).
  const lastViewKey = useRef('');
  useEffect(() => {
    const key = `${route.view}:${route.productId ?? ''}`;
    if (key === lastViewKey.current) return;
    lastViewKey.current = key;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [route.view, route.productId]);

  // Keep catalog state in sync when the user navigates with back/forward.
  useEffect(() => {
    if (route.view !== 'catalog') return;
    if (route.category) setCatalogCategory(route.category);
    if (typeof route.query === 'string') setSearchQuery(route.query);
  }, [route.view, route.category, route.query]);

  const selectedProduct = useMemo(
    () => (route.productId ? getProductById(route.productId) : undefined) ?? PRODUCTS[0],
    [route.productId]
  );

  /* ---------------- cart actions ---------------- */
  const addToCart = useCallback(
    (product: Product, presentation?: ProductPresentation, quantity = 1) => {
      const id = lineId(product, presentation);
      const price = presentation ? presentation.price : product.price;
      const stock = presentation?.stock ?? product.stock;

      setCart((prev) => {
        const existing = prev.find((item) => item.id === id);
        if (existing) {
          const capped = Math.min(existing.quantity + quantity, Math.max(1, stock), 99);
          return prev.map((item) =>
            item.id === id ? { ...item, quantity: capped, price } : item
          );
        }
        return [
          ...prev,
          {
            id,
            product,
            presentation,
            quantity: Math.min(quantity, Math.max(1, stock), 99),
            price,
          },
        ];
      });

      pushToast({
        variant: 'cart',
        title: 'Agregado al carrito',
        message: `${product.name}${presentation ? ` · ${presentation.volume}` : ''}`,
        image: product.image,
        actionLabel: 'Ver carrito',
        onAction: () => setIsDrawerOpen(true),
      });
    },
    [pushToast]
  );

  const removeFromCart = useCallback((itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const setQuantity = useCallback((itemId: string, quantity: number) => {
    setCart((prev) =>
      prev.flatMap((item) => {
        if (item.id !== itemId) return [item];
        const stock = item.presentation?.stock ?? item.product.stock;
        const next = Math.min(Math.max(0, Math.round(quantity)), Math.max(1, stock), 99);
        return next <= 0 ? [] : [{ ...item, quantity: next }];
      })
    );
  }, []);

  const updateQuantity = useCallback(
    (itemId: string, delta: number) => {
      setCart((prev) => {
        const item = prev.find((line) => line.id === itemId);
        if (!item) return prev;
        const stock = item.presentation?.stock ?? item.product.stock;
        const next = Math.min(item.quantity + delta, Math.max(1, stock), 99);
        if (next <= 0) return prev.filter((line) => line.id !== itemId);
        return prev.map((line) => (line.id === itemId ? { ...line, quantity: next } : line));
      });
    },
    []
  );

  const clearCart = useCallback(() => {
    setCart([]);
    setCanjeUnitsState(0);
    pushToast({ variant: 'info', title: 'Carrito vaciado' });
  }, [pushToast]);

  const loadDemoCart = useCallback(() => {
    const hydrated = hydrate(DEMO_LINES);
    setCart(hydrated);
    setCanjeUnitsState(Math.min(2, maxCanjeUnits(hydrated)));
    pushToast({
      variant: 'success',
      title: 'Pedido de ejemplo cargado',
      message: `${hydrated.length} productos listos para probar el checkout`,
    });
  }, [pushToast]);

  const isInCart = useCallback(
    (productId: string) => cart.some((item) => item.product.id === productId),
    [cart]
  );

  const setCanjeUnits = useCallback(
    (units: number) => setCanjeUnitsState(Math.min(Math.max(0, units), canjeMax)),
    [canjeMax]
  );

  /* ---------------- wishlist ---------------- */
  const toggleWishlist = useCallback(
    (productId: string) => {
      setWishlist((prev) => {
        const exists = prev.includes(productId);
        const product = getProductById(productId);
        pushToast({
          variant: exists ? 'info' : 'success',
          title: exists ? 'Quitado de favoritos' : 'Guardado en favoritos',
          message: product?.name,
        });
        return exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      });
    },
    [pushToast]
  );

  const isWishlisted = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist]
  );

  /* ---------------- search history ---------------- */
  const pushRecentSearch = useCallback((query: string) => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return;
    setRecentSearches((prev) =>
      [trimmed, ...prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())].slice(0, 6)
    );
  }, []);

  const clearRecentSearches = useCallback(() => setRecentSearches([]), []);

  /* ---------------- checkout ---------------- */
  const updateAddress = useCallback((field: keyof ShippingAddress, value: string) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  }, []);

  const fillDemoAddress = useCallback(() => {
    setShippingAddress(DEMO_ADDRESS);
    pushToast({ variant: 'info', title: 'Datos de ejemplo completados' });
  }, [pushToast]);

  const placeOrder = useCallback(() => {
    const order: PlacedOrder = {
      orderNumber: formatOrderNumber(),
      placedAt: new Date().toISOString(),
      totals,
      items: dehydrate(cart),
      itemCount: totals.totalUnits,
      shippingMethod,
      paymentMethod,
      invoiceType,
      address: shippingAddress,
    };

    setLastOrder(order);
    writeJSON(STORAGE_KEYS.lastOrder, order);
    setCart([]);
    setCanjeUnitsState(0);
    navigate({ view: 'confirmation' });
  }, [cart, totals, shippingMethod, paymentMethod, invoiceType, shippingAddress, navigate]);

  /* ---------------- quick view ---------------- */
  const openQuickView = useCallback((product: Product) => setQuickViewProduct(product), []);
  const closeQuickView = useCallback(() => setQuickViewProduct(null), []);

  const value = useMemo<StoreContextValue>(
    () => ({
      route,
      activeView: route.view,
      navigate,
      navigateTo,
      selectedProduct,
      cart,
      cartCount,
      totals,
      addToCart,
      removeFromCart,
      updateQuantity,
      setQuantity,
      clearCart,
      loadDemoCart,
      isInCart,
      isDrawerOpen,
      openDrawer: () => setIsDrawerOpen(true),
      closeDrawer: () => setIsDrawerOpen(false),
      canjeUnits,
      canjeMax,
      setCanjeUnits,
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
      lastOrder,
      wishlist,
      toggleWishlist,
      isWishlisted,
      searchQuery,
      setSearchQuery,
      recentSearches,
      pushRecentSearch,
      clearRecentSearches,
      catalogCategory,
      setCatalogCategory,
      quickViewProduct,
      openQuickView,
      closeQuickView,
      toasts,
      pushToast,
      dismissToast,
    }),
    [
      route, navigate, navigateTo, selectedProduct, cart, cartCount, totals, addToCart,
      removeFromCart, updateQuantity, setQuantity, clearCart, loadDemoCart, isInCart,
      isDrawerOpen, canjeUnits, canjeMax, setCanjeUnits, shippingMethod, paymentMethod,
      invoiceType, shippingAddress, updateAddress, fillDemoAddress, placeOrder, lastOrder,
      wishlist, toggleWishlist, isWishlisted, searchQuery, recentSearches, pushRecentSearch,
      clearRecentSearches, catalogCategory, quickViewProduct, openQuickView, closeQuickView,
      toasts, pushToast, dismissToast,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = (): StoreContextValue => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore debe usarse dentro de <StoreProvider>');
  return context;
};

export type { ToastVariant };
