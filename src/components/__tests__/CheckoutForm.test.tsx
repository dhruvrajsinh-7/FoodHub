import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/utils';
import userEvent from '@testing-library/user-event';
import CheckoutForm from '../CheckoutForm';

const mockPlaceOrder = vi.fn();
vi.mock('@/context/CartContext', () => ({
  useCart: () => ({
    items: [{ id: '1', name: 'Pizza', price: 25.99, quantity: 1 }],
    isCartOpen: true,
    setIsCartOpen: vi.fn(),
    addToCart: vi.fn(),
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
    placeOrder: mockPlaceOrder,
    fetchOrderStatus: vi.fn(),
  }),
}));

describe('CheckoutForm', () => {
  const mockOnBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(<CheckoutForm onBack={mockOnBack} />);

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/delivery address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /place order/i })).toBeInTheDocument();
  });

  it('displays validation errors for empty fields', async () => {
    const user = userEvent.setup();
    render(<CheckoutForm onBack={mockOnBack} />);

    const submitButton = screen.getByRole('button', { name: /place order/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/address is required/i)).toBeInTheDocument();
      expect(screen.getByText(/phone is required/i)).toBeInTheDocument();
    });

    expect(mockPlaceOrder).not.toHaveBeenCalled();
  });

  it('validates phone number format', async () => {
    const user = userEvent.setup();
    render(<CheckoutForm onBack={mockOnBack} />);

    const nameInput = screen.getByLabelText(/full name/i);
    const addressInput = screen.getByLabelText(/delivery address/i);
    const phoneInput = screen.getByLabelText(/phone number/i);

    await user.type(nameInput, 'John Doe');
    await user.type(addressInput, '123 Main St');
    await user.type(phoneInput, '123'); // Invalid: too short

    const submitButton = screen.getByRole('button', { name: /place order/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/enter a valid phone number/i)).toBeInTheDocument();
    });

    expect(mockPlaceOrder).not.toHaveBeenCalled();
  });

  it('accepts valid phone number with formatting', async () => {
    const user = userEvent.setup();
    render(<CheckoutForm onBack={mockOnBack} />);

    const nameInput = screen.getByLabelText(/full name/i);
    const addressInput = screen.getByLabelText(/delivery address/i);
    const phoneInput = screen.getByLabelText(/phone number/i);

    await user.type(nameInput, 'John Doe');
    await user.type(addressInput, '123 Main St, City, ZIP');
    await user.type(phoneInput, '(555) 123-4567'); // Valid: formatted but has 10+ digits

    const submitButton = screen.getByRole('button', { name: /place order/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockPlaceOrder).toHaveBeenCalledWith({
        name: 'John Doe',
        address: '123 Main St, City, ZIP',
        phone: '(555) 123-4567',
      });
    });
  });

  it('calls placeOrder with correct data on valid submission', async () => {
    const user = userEvent.setup();
    render(<CheckoutForm onBack={mockOnBack} />);

    const nameInput = screen.getByLabelText(/full name/i);
    const addressInput = screen.getByLabelText(/delivery address/i);
    const phoneInput = screen.getByLabelText(/phone number/i);

    await user.type(nameInput, 'Jane Smith');
    await user.type(addressInput, '456 Oak Avenue');
    await user.type(phoneInput, '5551234567');

    const submitButton = screen.getByRole('button', { name: /place order/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockPlaceOrder).toHaveBeenCalledWith({
        name: 'Jane Smith',
        address: '456 Oak Avenue',
        phone: '5551234567',
      });
    });
  });

  it('displays total amount', () => {
    render(<CheckoutForm onBack={mockOnBack} />);
    expect(screen.getByText(/\$25\.99/)).toBeInTheDocument();
  });

  it('calls onBack when back button is clicked', async () => {
    const user = userEvent.setup();
    render(<CheckoutForm onBack={mockOnBack} />);

    const backButton = screen.getByRole('button', { name: /back to cart/i });
    await user.click(backButton);

    expect(mockOnBack).toHaveBeenCalled();
  });

  it('shows error styling on invalid fields', async () => {
    const user = userEvent.setup();
    render(<CheckoutForm onBack={mockOnBack} />);

    const submitButton = screen.getByRole('button', { name: /place order/i });
    await user.click(submitButton);

    await waitFor(() => {
      const nameInput = screen.getByLabelText(/full name/i);
      expect(nameInput).toHaveClass('border-destructive');
    });
  });
});
