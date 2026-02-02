export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: number;
  items: CartItem[];
  name: string;
  address: string;
  phone: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
}

export type OrderStatus = 'RECEIVED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED';

export interface CreateOrderRequest {
  items: Array<{
    menuItemId: number;
    quantity: number;
  }>;
  name: string;
  address: string;
  phone: string;
}

export interface OrderResponse {
  meta: {
    message: string;
    requestUuid: string;
    responseType: {
      context: string;
      code: number;
    };
    timestamp: string;
    status: number;
  };
  data: {
    id: number;
    user: {
      id: number;
      name: string;
      phone: string;
      address: string;
    };
    status: OrderStatus;
    totalAmount: number;
    createdAt: string;
    updatedAt: string;
    orderItems: Array<{
      id: number;
      item: MenuItem;
      quantity: number;
    }>;
  };
}

export interface MenuItemResponse {
  meta: {
    message: string;
    requestUuid: string;
    responseType: {
      context: string;
      code: number;
    };
    timestamp: string;
    status: number;
  };
  data: MenuItem[];
}
