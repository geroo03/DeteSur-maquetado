import React, { createContext, useContext, useState, useMemo } from 'react';
import { Product, CartItem, ProductPresentation, ViewType } from '../types';
import { PRODUCTS } from '../data/products';

interface ShippingAddress {
  fullName: string;
  phone: string;
  street: string;
  apartment: string;
  locality: string;
  notes: string;
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  canjeDiscount: number;
  total: number;
  isCanjeActive: boolean;
  canjeUnits: number;
  activeView: ViewType;
  selectedProduct: Product;
  isDrawerOpen: boolean;
  cartViewMode: 'filled' | 'empty';
  shippingMethod: 'express' | 'pickup';
  paymentMethod: 'mercadopago' | 'transfer' | 'cash';
  invoiceType: 'B' | 'A';
  shippingAddress: ShippingAddress;
  orderNumber: string;
  addToCart: (product: Product, presentation?: ProductPresentation, qty?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  toggleCanje: () => void;
  setCanjeUnits: (units: number) => void;
  navigateTo: (view: ViewType, productId?: string) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  setCartViewMode: (mode: 'filled' | 'empty') => void;
  setShippingMethod: (method: 'express' | 'pickup') => void;
  setPaymentMethod: (method: 'mercadopago' | 'transfer' | 'cash') => void;
  setInvoiceType: (type: 'B' | 'A') => void;
  setShippingAddress: React.Dispatch<React.SetStateAction<ShippingAddress>>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with the exact 3 items from user screens (Lavandina 55g x 2, Jabón Matic x 1, Desengrasante x 1)
  const initialCart: CartItem[] = [
    {
      id: 'cart-1',
      product: PRODUCTS[0], // Lavandina 55g
      presentation: PRODUCTS[0].presentations?.[1], // 5L
      quantity: 2,
      price: 3450,
    },
    {
      id: 'cart-2',
      product: PRODUCTS[1], // Jabón Matic
      presentation: PRODUCTS[1].presentations?.[0], // 5L
      quantity: 1,
      price: 5950,
    },
    {
      id: 'cart-3',
      product: PRODUCTS[2], // Desengrasante
      presentation: PRODUCTS[2].presentations?.[0], // 750ml
      quantity: 1,
      price: 2180,
    },
  ];

  const [cart, setCart] = useState<CartItem[]>(initialCart);
  const [activeView, setActiveView] = useState<ViewType>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>('lavandina-55g');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [cartViewMode, setCartViewMode] = useState<'filled' | 'empty'>('filled');
  const [isCanjeActive, setIsCanjeActive] = useState<boolean>(true);
  const [canjeUnits, setCanjeUnits] = useState<number>(1);
  const [shippingMethod, setShippingMethod] = useState<'express' | 'pickup'>('express');
  const [paymentMethod, setPaymentMethod] = useState<'mercadopago' | 'transfer' | 'cash'>('mercadopago');
  const [invoiceType, setInvoiceType] = useState<'B' | 'A'>('B');

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: 'Federico Gómez',
    phone: '11 4589-2210',
    street: 'Av. Hipólito Yrigoyen 4200',
    apartment: '4° B - Frente',
    locality: 'Lanús Oeste (CP 1824)',
    notes: 'Timbre blanco junto al portón. Si no respondo de inmediato, dejar con encargado de portería (Carlos).',
  });

  const orderNumber = '#DET-84920';

  const selectedProduct = useMemo(() => {
    return PRODUCTS.find((p) => p.id === selectedProductId) || PRODUCTS[0];
  }, [selectedProductId]);

  const cartCount = useMemo(() => {
    if (cartViewMode === 'empty') return 0;
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart, cartViewMode]);

  const subtotal = useMemo(() => {
    if (cartViewMode === 'empty') return 0;
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart, cartViewMode]);

  const canjeDiscount = useMemo(() => {
    if (cartViewMode === 'empty' || !isCanjeActive) return 0;
    return 860;
  }, [cartViewMode, isCanjeActive]);

  const total = useMemo(() => {
    if (cartViewMode === 'empty') return 0;
    const t = subtotal - canjeDiscount;
    return Math.max(0, t);
  }, [subtotal, canjeDiscount, cartViewMode]);

  const addToCart = (product: Product, presentation?: ProductPresentation, qty = 1) => {
    setCartViewMode('filled');
    setCart((prev) => {
      const pPrice = presentation ? presentation.price : product.price;
      const itemId = presentation ? `${product.id}-${presentation.id}` : product.id;
      const existing = prev.find((item) => item.id === itemId);

      if (existing) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + qty } : item
        );
      }

      return [
        ...prev,
        {
          id: itemId,
          product,
          presentation,
          quantity: qty,
          price: pPrice,
        },
      ];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
    setCartViewMode('empty');
  };

  const toggleCanje = () => {
    setIsCanjeActive((prev) => !prev);
  };

  const navigateTo = (view: ViewType, productId?: string) => {
    if (productId) {
      setSelectedProductId(productId);
    }
    setActiveView(view);
    setIsDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <CartContext.Provider
      value={{
        cart: cartViewMode === 'empty' ? [] : cart,
        cartCount,
        subtotal,
        canjeDiscount,
        total,
        isCanjeActive,
        canjeUnits,
        activeView,
        selectedProduct,
        isDrawerOpen,
        cartViewMode,
        shippingMethod,
        paymentMethod,
        invoiceType,
        shippingAddress,
        orderNumber,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleCanje,
        setCanjeUnits,
        navigateTo,
        openDrawer,
        closeDrawer,
        setCartViewMode,
        setShippingMethod,
        setPaymentMethod,
        setInvoiceType,
        setShippingAddress,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
