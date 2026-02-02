import type { MenuItem, OrderResponse, CreateOrderRequest, OrderStatus } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An error occurred' }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // Menu endpoints
  async getMenuItems(): Promise<MenuItem[]> {
    return this.request<MenuItem[]>('/menu');
  }

  async getMenuItemById(id: string): Promise<MenuItem> {
    return this.request<MenuItem>(`/menu/${id}`);
  }

  // Order endpoints
  async createOrder(orderData: CreateOrderRequest): Promise<OrderResponse> {
    return this.request<OrderResponse>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrderById(orderId: number): Promise<OrderResponse> {
    return this.request<OrderResponse>(`/orders/${orderId}`);
  }

  async getAllOrders(): Promise<OrderResponse[]> {
    return this.request<OrderResponse[]>('/orders');
  }

  async updateOrderStatus(orderId: number, status: OrderStatus): Promise<OrderResponse> {
    return this.request<OrderResponse>(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }
}

export const apiService = new ApiService();
