export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  customerName: string;
  address: string;
  phone: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
}

export type OrderStatus = 'RECEIVED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED';

export interface CreateOrderRequest {
  items: Array<{
    menuItemId: string;
    quantity: number;
  }>;
  customerName: string;
  address: string;
  phone: string;
}

export interface OrderResponse {
  id: string;
  items: Array<{
    menuItem: MenuItem;
    quantity: number;
  }>;
  customerName: string;
  address: string;
  phone: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
}
