import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiService } from '../api';
import type { MenuItem, OrderResponse, CreateOrderRequest, OrderStatus } from '@/types';

// Mock fetch globally
(globalThis as any).fetch = vi.fn();

describe('ApiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset environment variable
    import.meta.env.VITE_API_BASE_URL = 'http://localhost:8080/api';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getMenuItems', () => {
    it('should fetch menu items successfully', async () => {
      const mockMenuItems: MenuItem[] = [
        {
          id: 1,
          name: 'Pizza',
          description: 'Delicious pizza',
          price: 15.99,
          imageUrl: '/pizza.png',
          category: 'Italian',
        },
      ];

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockMenuItems,
      });

      const result = await apiService.getMenuItems();

      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/menu', {
        headers: { 'Content-Type': 'application/json' },
      });
      expect(result).toEqual(mockMenuItems);
    });

    it('should handle errors when fetching menu items', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Server error' }),
      });

      await expect(apiService.getMenuItems()).rejects.toThrow();
    });
  });

  describe('getMenuItemById', () => {
    it('should fetch a single menu item by ID', async () => {
      const mockMenuItem: MenuItem = {
        id: 1,
        name: 'Pizza',
        description: 'Delicious pizza',
        price: 15.99,
        imageUrl: '/pizza.png',
        category: 'Italian',
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockMenuItem,
      });

      const result = await apiService.getMenuItemById('1');

      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/menu/1', {
        headers: { 'Content-Type': 'application/json' },
      });
      expect(result).toEqual(mockMenuItem);
    });
  });

  describe('createOrder', () => {
    it('should create an order successfully', async () => {
      const orderData: CreateOrderRequest = {
        items: [{ menuItemId: 1, quantity: 2 }],
        name: 'John Doe',
        address: '123 Main St',
        phone: '5551234567',
      };

      const mockOrderResponse: OrderResponse = {
        meta: {
          message: 'Order created successfully',
          requestUuid: '1234567890',
          responseType: {
            context: 'Order created successfully',
            code: 200,
          },
          timestamp: new Date().toISOString(),
          status: 200,
        },
        data: {
          id: 1,
          user: {
            id: 1,
            name: 'John Doe',
            phone: '5551234567',
            address: '123 Main St',
          },
          status: 'RECEIVED',
          totalAmount: 31.98,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          orderItems: [
            {
              id: 1,
              item: {
                id: 1,
                name: 'Pizza',
                description: 'Delicious pizza',
                price: 15.99,
                imageUrl: '/pizza.png',
                category: 'Italian',
              },
              quantity: 2,
            },
          ],
        },
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockOrderResponse,
      });

      const result = await apiService.createOrder(orderData);

      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      expect(result).toEqual(mockOrderResponse);
    });

    it('should handle validation errors', async () => {
      const invalidOrderData: CreateOrderRequest = {
        items: [],
        name: '',
        address: '',
        phone: '',
      };

      (fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Validation failed' }),
      });

      await expect(apiService.createOrder(invalidOrderData)).rejects.toThrow();
    });
  });

  describe('getOrderById', () => {
    it('should fetch an order by ID', async () => {
      const mockOrder: OrderResponse = {
        meta: {
          message: 'Order created successfully',
          requestUuid: '1234567890',
          responseType: {
            context: 'Order created successfully',
            code: 200,
          },
          timestamp: new Date().toISOString(),
          status: 200,
        },
        data: {
          id: 1,
          user: {
            id: 1,
            name: 'John Doe',
            phone: '5551234567',
            address: '123 Main St',
          },
          status: 'RECEIVED',
          totalAmount: 25.99,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          orderItems: [],
        },
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockOrder,
      });

      const result = await apiService.getOrderById(1);

      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/orders/1', {
        headers: { 'Content-Type': 'application/json' },
      });
      expect(result).toEqual(mockOrder);
    });

    it('should handle order not found', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ message: 'Order not found' }),
      });

      await expect(apiService.getOrderById(1)).rejects.toThrow();
    });
  });

  describe('getAllOrders', () => {
    it('should fetch all orders', async () => {
      const mockOrders: OrderResponse[] = [
        {
          meta: {
            message: 'Order created successfully',
            requestUuid: '1234567890',
            responseType: {
              context: 'Order created successfully',
              code: 200,
            },
            timestamp: new Date().toISOString(),
            status: 200,
          },
          data: {
            id: 1,
            user: {
              id: 1,
              name: 'John Doe',
              phone: '5551234567',
              address: '123 Main St',
            },
            status: 'RECEIVED',
            totalAmount: 25.99,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            orderItems: [],
          },
        },
      ] as OrderResponse[];

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockOrders,
      });

      const result = await apiService.getAllOrders();

      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/orders', {
        headers: { 'Content-Type': 'application/json' },
      });
      expect(result).toEqual(mockOrders);
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status successfully', async () => {
      const status: OrderStatus = 'PREPARING';
      const mockUpdatedOrder: OrderResponse = {
        meta: {
          message: 'Order updated successfully',
          requestUuid: '1234567890',
          responseType: {
            context: 'Order updated successfully',
            code: 200,
          },
          timestamp: new Date().toISOString(),
          status: 200,
        },
        data: {
          id: 1,
          user: {
            id: 1,
            name: 'John Doe',
            phone: '5551234567',
            address: '123 Main St',
          },
          status: 'PREPARING',
          totalAmount: 25.99,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          orderItems: [],
        },
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUpdatedOrder,
      });

      const result = await apiService.updateOrderStatus(1, status);

      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/orders/1/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      expect(result.data.status).toBe('PREPARING');
    });

    it('should handle invalid status updates', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Invalid status transition' }),
      });

      await expect(
        apiService.updateOrderStatus(1, 'INVALID_STATUS' as OrderStatus)
      ).rejects.toThrow();
    });
  });

  describe('Error handling', () => {
    it('should handle network errors', async () => {
      (fetch as any).mockRejectedValueOnce(new Error('Network error'));

      await expect(apiService.getMenuItems()).rejects.toThrow('Network error');
    });

    it('should handle non-JSON error responses', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      await expect(apiService.getMenuItems()).rejects.toThrow();
    });
  });
});
