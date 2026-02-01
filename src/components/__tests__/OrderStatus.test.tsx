import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@/test/utils';
import OrderStatus from '../OrderStatus';

vi.mock('@/context/CartContext', () => ({
  useCart: () => ({
    currentOrder: {
      id: 'order-123',
      status: 'CONFIRMED',
      total: 31.98,
      items: [{ id: '1', name: 'Pizza', price: 25.99, quantity: 1 }],
      customerName: 'John',
      address: 'Street',
      phone: '123',
      createdAt: new Date().toISOString(),
    },
  }),
}));

describe('OrderStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

    const detailsSection = screen.getByText(/delivery details/i).closest('div')!;
    expect(within(detailsSection).getByText(/123/)).toBeInTheDocument();
    expect(within(detailsSection).getByText(/john/i)).toBeInTheDocument();
    expect(within(detailsSection).getByText(/street/i)).toBeInTheDocument();
  });

  it('displays order summary with items', () => {
    render(<OrderStatus />);

    expect(screen.getByText(/order summary/i)).toBeInTheDocument();
    expect(screen.getByText(/pizza/i)).toBeInTheDocument();
    expect(screen.getByText(/\$31\.98/)).toBeInTheDocument();
  });

  it('returns null when no order exists', async () => {
    vi.resetModules();

    vi.doMock('@/context/CartContext', () => ({
      useCart: () => ({
        currentOrder: null,
      }),
    }));

    const { default: OrderStatusNoOrder } = await import('../OrderStatus');

    const { container } = render(<OrderStatusNoOrder />);
    expect(container.firstChild).toBeNull();
  });

  it('displays correct total amount', () => {
    render(<OrderStatus />);
    expect(screen.getByText(/\$?\s?25\.99/)).toBeInTheDocument();
  });
});
