import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test/utils';
import userEvent from '@testing-library/user-event';
import MenuCard from '../MenuCard';
import type { MenuItem } from '@/types';
const mockAddToCart = vi.fn();
vi.mock('@/context/CartContext', () => ({
  useCart: () => ({
    items: [{ id: '1', name: 'Pizza', price: 25.99, quantity: 1 }],
    isCartOpen: true,
    setIsCartOpen: vi.fn(),
    addToCart: mockAddToCart,
    removeFromCart: vi.fn(),
    updateQuantity: vi.fn(),
    clearCart: vi.fn(),
    total: 25.99,
    itemCount: 1,
    currentOrder: {
      id: 'order-123',
      status: 'CONFIRMED',
      total: 25.99,
      items: [],
      customerName: 'John',
      address: 'Street',
      phone: '123',
      createdAt: new Date().toISOString(),
    },
    placeOrder: vi.fn(),
    fetchOrderStatus: vi.fn(),
  }),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
  },
}));

describe('MenuCard', () => {
  const mockMenuItem: MenuItem = {
    id: 1,
    name: 'Pepperoni Pizza',
    description: 'Classic pepperoni pizza',
    price: 16.99,
    imageUrl: '/pizza.png',
    category: 'Pizza',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders menu item information', () => {
    render(<MenuCard item={mockMenuItem} index={0} />);

    expect(screen.getByText('Pepperoni Pizza')).toBeInTheDocument();
    expect(screen.getByText('Classic pepperoni pizza')).toBeInTheDocument();
    expect(screen.getByText('$16.99')).toBeInTheDocument();
    expect(screen.getByText('Pizza')).toBeInTheDocument();
  });

  it('calls addToCart when Add to Cart button is clicked', async () => {
    const user = userEvent.setup();
    render(<MenuCard item={mockMenuItem} index={0} />);

    const addButton = screen.getByRole('button', { name: /add to cart/i });
    await user.click(addButton);

    expect(mockAddToCart).toHaveBeenCalledWith(mockMenuItem);
  });

  it('displays item image with correct alt text', () => {
    render(<MenuCard item={mockMenuItem} index={0} />);
    const image = screen.getByAltText(mockMenuItem.name);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockMenuItem.imageUrl);
  });
});
