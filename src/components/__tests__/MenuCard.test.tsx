import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test/utils';
import userEvent from '@testing-library/user-event';
import MenuCard from '../MenuCard';
import { useCart } from '@/context/CartContext';
import type { MenuItem } from '@/types';

vi.mock('@/context/CartContext');
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
  },
}));

describe('MenuCard', () => {
  const mockMenuItem: MenuItem = {
    id: '1',
    name: 'Pepperoni Pizza',
    description: 'Classic pepperoni pizza',
    price: 16.99,
    image: '/pizza.png',
    category: 'Pizza',
  };

  const mockAddToCart = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useCart as any).mockReturnValue({
      addToCart: mockAddToCart,
    });
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
    const image = screen.getByAltText('Pepperoni Pizza');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/pizza.png');
  });
});
