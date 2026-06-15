import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { UIProvider } from './context/UIContext';
import authService from './services/authService';
import orderService from './services/orderService';
import paymentService from './services/paymentService';

vi.mock('./services/authService', () => ({
  default: {
    getMe: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
  },
}));

vi.mock('./services/orderService', () => ({
  default: {
    createOrder: vi.fn(),
  },
}));

vi.mock('./services/paymentService', () => ({
  default: {
    createPaymentIntent: vi.fn(),
    confirmPayment: vi.fn(),
  },
}));

vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn(() => Promise.resolve({})),
}));

vi.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }) => <div>{children}</div>,
}));

vi.mock('./components/checkout/PaymentForm', () => ({
  default: ({ amount }) => (
    <section>
      <h3>Payment Details</h3>
      <p>Pay ${amount.toFixed(2)}</p>
    </section>
  ),
}));

const renderApp = (initialRoute) => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <UIProvider>
              <App />
            </UIProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </MemoryRouter>
  );
};

const setLoggedInCustomer = () => {
  localStorage.setItem('alfa_auth', 'true');
  localStorage.setItem('alfa_user', JSON.stringify({
    name: 'Test Customer',
    email: 'customer@example.com',
    role: 'customer',
  }));
  authService.getMe.mockResolvedValue({
    success: true,
    data: {
      name: 'Test Customer',
      email: 'customer@example.com',
      role: 'customer',
    },
  });
};

describe('customer shopping journey', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    authService.getMe.mockResolvedValue({ success: true, data: null });
  });

  it('returns a customer to the product page after the add-to-cart login guard', async () => {
    const user = userEvent.setup();
    authService.login.mockResolvedValue({
      success: true,
      user: {
        name: 'Test Customer',
        email: 'customer@example.com',
        role: 'customer',
      },
      token: 'token',
    });

    const { container } = renderApp('/product/1');

    await user.click(screen.getByRole('button', { name: /add to cart/i }));

    expect(await screen.findByText('Please sign in to add items to your cart.')).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText('john@example.com'), 'customer@example.com');
    await user.type(container.querySelector('input[type="password"]'), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByRole('heading', { name: 'Classic Suit 1' })).toBeInTheDocument();
  });

  it('keeps different selected sizes as separate cart items through the drawer', async () => {
    const user = userEvent.setup();
    setLoggedInCustomer();

    renderApp('/product/1');

    expect(await screen.findByRole('heading', { name: 'Classic Suit 1' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /add to cart/i }));
    await user.click(screen.getByText('40R'));
    await user.click(screen.getByRole('button', { name: /add to cart/i }));
    await user.click(screen.getByRole('button', { name: /open cart/i }));

    expect(await screen.findByRole('heading', { name: /your cart/i })).toBeInTheDocument();
    expect(screen.getByText('Size: 38R')).toBeInTheDocument();
    expect(screen.getByText('Size: 40R')).toBeInTheDocument();
    expect(screen.getByText('$500')).toBeInTheDocument();
  });

  it('creates an order from the cart and continues to payment with the full order payload', async () => {
    const user = userEvent.setup();
    setLoggedInCustomer();
    localStorage.setItem('alfa_cart', JSON.stringify([
      {
        id: 1,
        name: 'Classic Suit 1',
        price: 250,
        image: '/images/s1.jpg',
        selectedSize: '40R',
        quantity: 2,
      },
    ]));
    orderService.createOrder.mockResolvedValue({ success: true, data: { _id: 'order-1' } });
    paymentService.createPaymentIntent.mockResolvedValue({
      success: true,
      data: { clientSecret: 'client-secret' },
    });

    renderApp('/checkout');

    const inputs = screen.getAllByRole('textbox');
    await user.type(inputs[0], 'Test Customer');
    await user.type(inputs[1], '555-0100');
    await user.type(inputs[2], '1 Tailor Street');
    await user.type(inputs[3], 'Nairobi');
    await user.type(inputs[4], 'Nairobi');
    await user.type(inputs[5], '00100');

    await user.click(screen.getByRole('button', { name: /continue to payment/i }));

    await waitFor(() => {
      expect(orderService.createOrder).toHaveBeenCalledWith({
        items: [
          {
            product: 1,
            quantity: 2,
            variant: { sku: '40R', name: '40R' },
          },
        ],
        shippingAddress: {
          name: 'Test Customer',
          phone: '555-0100',
          street: '1 Tailor Street',
          city: 'Nairobi',
          state: 'Nairobi',
          zipcode: '00100',
          country: 'USA',
        },
        billingAddress: { sameAsShipping: true },
        paymentMethod: 'card',
        shippingCost: 10,
      });
    });
    expect(paymentService.createPaymentIntent).toHaveBeenCalledWith('order-1', 550);
    expect(await screen.findByText('Payment Details')).toBeInTheDocument();
    expect(screen.getByText('Pay $550.00')).toBeInTheDocument();
  });

  it('gives empty-cart customers a path back to shopping', async () => {
    const user = userEvent.setup();

    renderApp('/checkout');

    expect(await screen.findByText('Your cart is empty')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /continue shopping/i }));

    expect(await screen.findByRole('heading', { name: /our collections/i })).toBeInTheDocument();
  });
});
