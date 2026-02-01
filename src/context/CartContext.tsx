import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { MenuItem, CartItem, Order } from '@/types';
import { apiService } from '@/services/api';
import { toast } from 'sonner';

interface CartContextType {
  items: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  currentOrder: Order | null;
  placeOrder: (customerDetails: { name: string; address: string; phone: string }) => Promise<void>;
  fetchOrderStatus: (orderId: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [orderPollingInterval, setOrderPollingInterval] = useState<ReturnType<
    typeof setInterval
  > | null>(null);

  const startOrderPolling = (orderId: string) => {
    // Clear any existing polling
    if (orderPollingInterval) {
      clearInterval(orderPollingInterval);
    }

    // Poll every 5 seconds for order status updates
    const interval = setInterval(async () => {
      try {
        const orderResponse = await apiService.getOrderById(orderId);
        const order: Order = {
          id: orderResponse.id,
          items: orderResponse.items.map(item => ({
            ...item.menuItem,
            quantity: item.quantity,
          })),
          customerName: orderResponse.customerName,
          address: orderResponse.address,
          phone: orderResponse.phone,
          status: orderResponse.status,
          total: orderResponse.total,
          createdAt: orderResponse.createdAt,
        };

        setCurrentOrder(order);

        // Stop polling if order is delivered
        if (order.status === 'DELIVERED') {
          clearInterval(interval);
          setOrderPollingInterval(null);
        }
      } catch (error) {
        console.error('Failed to fetch order status:', error);
      }
    }, 5000);

    setOrderPollingInterval(interval);
  };

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('foodhub_cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      }
    }

    // Load current order from localStorage
    const savedOrder = localStorage.getItem('foodhub_current_order');
    if (savedOrder) {
      try {
        const order = JSON.parse(savedOrder);
        setCurrentOrder(order);
        // Start polling for order status updates
        startOrderPolling(order.id);
      } catch (error) {
        console.error('Failed to load order from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('foodhub_cart', JSON.stringify(items));
  }, [items]);

  // Save current order to localStorage whenever it changes
  useEffect(() => {
    if (currentOrder) {
      localStorage.setItem('foodhub_current_order', JSON.stringify(currentOrder));
    } else {
      localStorage.removeItem('foodhub_current_order');
    }
  }, [currentOrder]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (orderPollingInterval) {
        clearInterval(orderPollingInterval);
      }
    };
  }, [orderPollingInterval]);

  const addToCart = (item: MenuItem) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem) {
        return prevItems.map(i => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems(prevItems =>
      prevItems.map(item => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const placeOrder = async (customerDetails: { name: string; address: string; phone: string }) => {
    try {
      const orderData = {
        items: items.map(item => ({
          menuItemId: item.id,
          quantity: item.quantity,
        })),
        customerName: customerDetails.name,
        address: customerDetails.address,
        phone: customerDetails.phone,
      };

      const orderResponse = await apiService.createOrder(orderData);

      const order: Order = {
        id: orderResponse.id,
        items: orderResponse.items.map(item => ({
          ...item.menuItem,
          quantity: item.quantity,
        })),
        customerName: orderResponse.customerName,
        address: orderResponse.address,
        phone: orderResponse.phone,
        status: orderResponse.status,
        total: orderResponse.total,
        createdAt: orderResponse.createdAt,
      };

      setCurrentOrder(order);
      clearCart();
      setIsCartOpen(false);

      // Start polling for order status updates
      startOrderPolling(order.id);

      toast.success('Order placed successfully!');
    } catch (error) {
      console.error('Failed to place order:', error);
      toast.error('Failed to place order. Please try again.');
      throw error;
    }
  };

  const fetchOrderStatus = async (orderId: string) => {
    try {
      const orderResponse = await apiService.getOrderById(orderId);
      const order: Order = {
        id: orderResponse.id,
        items: orderResponse.items.map(item => ({
          ...item.menuItem,
          quantity: item.quantity,
        })),
        customerName: orderResponse.customerName,
        address: orderResponse.address,
        phone: orderResponse.phone,
        status: orderResponse.status,
        total: orderResponse.total,
        createdAt: orderResponse.createdAt,
      };

      setCurrentOrder(order);
    } catch (error) {
      console.error('Failed to fetch order status:', error);
      toast.error('Failed to fetch order status.');
    }
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        itemCount,
        currentOrder,
        placeOrder,
        fetchOrderStatus,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
