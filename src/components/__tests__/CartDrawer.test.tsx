import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/utils';
import userEvent from '@testing-library/user-event';
import CartDrawer from '../CartDrawer';
import type { CartItem } from '@/types';

let mockItems: CartItem[] = [
  {
    id: 1,
    name: 'Pizza',
    description: 'Delicious pizza',
    imageUrl: '/pizza.png',
    category: 'Italian',
    price: 15.99,
    quantity: 2,
  },
  {
    id: 2,
    name: 'Burger',
    description: 'Juicy burger',
    imageUrl: '/burger.png',
    category: 'American',
    price: 12.99,
    quantity: 1,
  },
];
let mockTotal: number = 44.97;
const mockUpdateQuantity = vi.fn();
const mockRemoveFromCart = vi.fn();

vi.mock('@/context/CartContext', () => ({
  useCart: () => ({
    items: mockItems,
    total: mockTotal,
    updateQuantity: mockUpdateQuantity,
    removeFromCart: mockRemoveFromCart,
    isCartOpen: true,
    setIsCartOpen: vi.fn(),
    clearCart: vi.fn(),
    itemCount: 3,
    currentOrder: null,
    placeOrder: vi.fn(),
    fetchOrderStatus: vi.fn(),
  }),
}));

describe('CartDrawer', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockItems = [
      {
        id: 1,
        name: 'Pizza',
        description: 'Delicious pizza',
        imageUrl: '/pizza.png',
        category: 'Italian',
        price: 15.99,
        quantity: 2,
      },
      {
        id: 2,
        name: 'Burger',
        description: 'Juicy burger',
        imageUrl: '/burger.png',
        category: 'American',
        price: 12.99,
        quantity: 1,
      },
    ];
    mockTotal = 44.97;
  });

  it('displays cart items when cart is open', () => {
    render(<CartDrawer />);

    expect(screen.getByText('Your Cart')).toBeInTheDocument();
    expect(screen.getByText('Pizza')).toBeInTheDocument();
    expect(screen.getByText('Burger')).toBeInTheDocument();
    expect(screen.getByText('$44.97')).toBeInTheDocument();
  });

  it('displays empty cart message when cart is empty', () => {
    //reset modules
    mockItems = [];
    mockTotal = 0;
    render(<CartDrawer />);

    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  it('updates item quantity when plus button is clicked', async () => {
    const user = userEvent.setup();
    render(<CartDrawer />);

    const plusButton = screen.getAllByLabelText('Increase quantity')[0];
    await user.click(plusButton);

    expect(mockUpdateQuantity).toHaveBeenCalledWith(1, 3);
  });

  it('removes item when remove button is clicked', async () => {
    const user = userEvent.setup();
    render(<CartDrawer />);

    // Find remove buttons (trash icons)
    const removeButton = screen.getAllByLabelText('Remove item')[0];
    await user.click(removeButton);
    expect(mockRemoveFromCart).toHaveBeenCalledWith(1);
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
