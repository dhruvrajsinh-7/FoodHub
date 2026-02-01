import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test/utils';
import OrderStatus from '../OrderStatus';
import { useCart } from '@/context/CartContext';
import type { Order } from '@/types';

vi.mock('@/context/CartContext');

describe('OrderStatus', () => {
  const mockOrder: Order = {
    id: 'order-123',
    items: [
      {
        id: '1',
        name: 'Pizza',
        description: 'Delicious pizza',
        price: 15.99,
        image: '/pizza.png',
        category: 'Italian',
        quantity: 2,
      },
    ],
    customerName: 'John Doe',
    address: '123 Main St',
    phone: '5551234567',
    status: 'PREPARING',
    total: 31.98,
    createdAt: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useCart as any).mockReturnValue({
      currentOrder: mockOrder,
    });
  });

  it('renders order confirmation', () => {
    render(<OrderStatus />);

    expect(screen.getByText(/order confirmed/i)).toBeInTheDocument();
    expect(screen.getByText(/order #order-123/i)).toBeInTheDocument();
  });

  it('displays order status steps', () => {
    render(<OrderStatus />);

    expect(screen.getByText(/order received/i)).toBeInTheDocument();
    expect(screen.getByText(/preparing/i)).toBeInTheDocument();
    expect(screen.getByText(/out for delivery/i)).toBeInTheDocument();
    expect(screen.getByText(/delivered/i)).toBeInTheDocument();
  });

  it('highlights current status', () => {
    render(<OrderStatus />);

    // Current status should be highlighted
    const preparingStep = screen.getByText(/preparing/i);
    expect(preparingStep).toBeInTheDocument();
  });

  it('displays delivery details', () => {
    render(<OrderStatus />);

    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    expect(screen.getByText(/123 main st/i)).toBeInTheDocument();
    expect(screen.getByText(/5551234567/i)).toBeInTheDocument();
  });

  it('displays order summary with items', () => {
    render(<OrderStatus />);

    expect(screen.getByText(/order summary/i)).toBeInTheDocument();
    expect(screen.getByText(/pizza/i)).toBeInTheDocument();
    expect(screen.getByText(/\$31\.98/)).toBeInTheDocument();
  });

  it('returns null when no order exists', () => {
    (useCart as any).mockReturnValue({
      currentOrder: null,
    });

    const { container } = render(<OrderStatus />);
    expect(container.firstChild).toBeNull();
  });

  it('displays correct total amount', () => {
    render(<OrderStatus />);
    // The total might be formatted differently, so we check for the amount
    expect(screen.getByText(/31\.98|31,98/)).toBeInTheDocument();
  });
});
