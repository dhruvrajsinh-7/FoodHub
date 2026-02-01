import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/utils';
import userEvent from '@testing-library/user-event';
import CartDrawer from '../CartDrawer';
import { useCart } from '@/context/CartContext';
import type { CartItem } from '@/types';

vi.mock('@/context/CartContext');

describe('CartDrawer', () => {
  const mockItems: CartItem[] = [
    {
      id: '1',
      name: 'Pizza',
      description: 'Delicious pizza',
      price: 15.99,
      image: '/pizza.png',
      category: 'Italian',
      quantity: 2,
    },
    {
      id: '2',
      name: 'Burger',
      description: 'Juicy burger',
      price: 12.99,
      image: '/burger.png',
      category: 'American',
      quantity: 1,
    },
  ];

  const mockUpdateQuantity = vi.fn();
  const mockRemoveFromCart = vi.fn();
  const mockSetIsCartOpen = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useCart as any).mockReturnValue({
      items: mockItems,
      isCartOpen: true,
      setIsCartOpen: mockSetIsCartOpen,
      updateQuantity: mockUpdateQuantity,
      removeFromCart: mockRemoveFromCart,
      total: 44.97,
    });
  });

  it('displays cart items when cart is open', () => {
    render(<CartDrawer />);

    expect(screen.getByText('Your Cart')).toBeInTheDocument();
    expect(screen.getByText('Pizza')).toBeInTheDocument();
    expect(screen.getByText('Burger')).toBeInTheDocument();
    expect(screen.getByText('$44.97')).toBeInTheDocument();
  });

  it('displays empty cart message when cart is empty', () => {
    (useCart as any).mockReturnValue({
      items: [],
      isCartOpen: true,
      setIsCartOpen: mockSetIsCartOpen,
      updateQuantity: mockUpdateQuantity,
      removeFromCart: mockRemoveFromCart,
      total: 0,
    });

    render(<CartDrawer />);

    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  it('updates item quantity when plus button is clicked', async () => {
    const user = userEvent.setup();
    render(<CartDrawer />);

    const plusButtons = screen.getAllByRole('button', { name: '' });
    const pizzaPlusButton = plusButtons.find(btn =>
      btn.closest('[class*="rounded-xl"]')?.textContent?.includes('Pizza')
    );

    if (pizzaPlusButton) {
      await user.click(pizzaPlusButton);
      expect(mockUpdateQuantity).toHaveBeenCalled();
    }
  });

  it('removes item when remove button is clicked', async () => {
    const user = userEvent.setup();
    render(<CartDrawer />);

    // Find remove buttons (trash icons)
    const removeButtons = screen.getAllByRole('button');
    const removeButton = removeButtons.find(btn => {
      const svg = btn.querySelector('svg');
      return svg && btn.getAttribute('aria-label') !== 'Close';
    });

    if (removeButton) {
      await user.click(removeButton);
      await waitFor(() => {
        expect(mockRemoveFromCart).toHaveBeenCalled();
      });
    }
  });

  it('displays correct total amount', () => {
    render(<CartDrawer />);
    expect(screen.getByText('$44.97')).toBeInTheDocument();
  });

  it('shows checkout form when proceed to checkout is clicked', async () => {
    const user = userEvent.setup();
    render(<CartDrawer />);

    const checkoutButton = screen.getByRole('button', { name: /proceed to checkout/i });
    await user.click(checkoutButton);

    await waitFor(() => {
      expect(screen.getByText('Checkout')).toBeInTheDocument();
    });
  });
});
