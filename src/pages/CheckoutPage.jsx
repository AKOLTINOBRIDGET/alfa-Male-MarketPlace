import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { FaShoppingCart, FaUser, FaCreditCard, FaCheckCircle } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToastContext } from '../context/ToastContext';
import useAsync from '../hooks/useAsync';
import orderService from '../services/orderService';
import paymentService from '../services/paymentService';
import PaymentForm from '../components/checkout/PaymentForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutPage = () => {
  const [step, setStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: 'USA'
  });
  const [clientSecret, setClientSecret] = useState('');
  const [orderId, setOrderId] = useState('');

  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const toast = useToastContext();
  const navigate = useNavigate();
  const { loading, execute } = useAsync();

  const TAX_RATE = 0.08;
  const SHIPPING_COST = 10;
  const subtotal = cartTotal;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax + SHIPPING_COST;

  const handleShippingSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create order
      const orderData = {
        items: cartItems.map(item => ({
          product: item._id || item.id,
          quantity: item.quantity,
          variant: item.variant
        })),
        shippingAddress: shippingInfo,
        billingAddress: { sameAsShipping: true },
        paymentMethod: 'card',
        shippingCost: SHIPPING_COST
      };

      const orderResponse = await execute(() => orderService.createOrder(orderData));
      const createdOrder = orderResponse.data;
      setOrderId(createdOrder._id);

      // Create payment intent
      const paymentResponse = await execute(() => 
        paymentService.createPaymentIntent(createdOrder._id, total)
      );

      setClientSecret(paymentResponse.data.clientSecret);
      setStep(2);
      toast.success('Proceeding to payment...');
    } catch (error) {
      toast.error(error.message || 'Failed to create order');
    }
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      await execute(() => paymentService.confirmPayment(paymentIntent.id, orderId));
      
      setStep(3);
      clearCart();
      toast.success('Payment successful! Order confirmed.');
      
      setTimeout(() => {
        navigate(`/orders/${orderId}`);
      }, 3000);
    } catch (error) {
      toast.error(error.message || 'Failed to confirm payment');
    }
  };

  const handlePaymentError = (error) => {
    toast.error(error);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-dark pt-8">
        <div className="container mx-auto px-4">
          <EmptyState
            icon={<FaShoppingCart size={64} />}
            title="Your cart is empty"
            message="Add some items to your cart to proceed with checkout"
            actionLabel="Continue Shopping"
            onAction={() => navigate('/products')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4">
            {[
              { num: 1, label: 'Shipping', icon: FaUser },
              { num: 2, label: 'Payment', icon: FaCreditCard },
              { num: 3, label: 'Confirmation', icon: FaCheckCircle }
            ].map((s, index) => (
              <div key={s.num} className="flex items-center">
                <div
                  className={`flex items-center gap-3 ${
                    step >= s.num ? 'text-gold-500' : 'text-gray-500'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                      step >= s.num
                        ? 'border-gold-500 bg-gold-500/10'
                        : 'border-gray-600'
                    }`}
                  >
                    <s.icon />
                  </div>
                  <span className="font-medium hidden sm:inline">{s.label}</span>
                </div>
                {index < 2 && (
                  <div
                    className={`w-16 h-0.5 mx-4 ${
                      step > s.num ? 'bg-gold-500' : 'bg-gray-600'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            
            {/* Step 1: Shipping Information */}
            {step === 1 && (
              <div className="bg-dark-100 p-8 rounded-lg">
                <h2 className="text-2xl font-serif text-white mb-6">Shipping Information</h2>
                
                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={shippingInfo.name}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                      required
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                      required
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Street Address *</label>
                    <input
                      type="text"
                      value={shippingInfo.street}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, street: e.target.value })}
                      required
                      className="input-field"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">City *</label>
                      <input
                        type="text"
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                        required
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">State *</label>
                      <input
                        type="text"
                        value={shippingInfo.state}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                        required
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Zip Code *</label>
                      <input
                        type="text"
                        value={shippingInfo.zipcode}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, zipcode: e.target.value })}
                        required
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Country *</label>
                      <input
                        type="text"
                        value={shippingInfo.country}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                        required
                        className="input-field"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary w-full mt-6"
                    disabled={loading}
                  >
                    {loading ? <LoadingSpinner size="sm" /> : 'Continue to Payment'}
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && clientSecret && (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentForm
                  clientSecret={clientSecret}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  amount={total}
                />
              </Elements>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <div className="bg-dark-100 p-8 rounded-lg text-center">
                <div className="text-green-500 mb-6">
                  <FaCheckCircle size={64} className="mx-auto" />
                </div>
                <h2 className="text-3xl font-serif text-white mb-4">Order Confirmed!</h2>
                <p className="text-gray-400 mb-6">
                  Thank you for your order. You will receive a confirmation email shortly.
                </p>
                <p className="text-sm text-gray-500">
                  Redirecting to order details...
                </p>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-dark-100 p-6 rounded-lg sticky top-24">
              <h3 className="text-xl font-serif text-white mb-4">Order Summary</h3>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.image || item.images?.[0]?.url}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="text-white text-sm">{item.name}</p>
                      <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-white">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div className="border-t border-white/10 pt-4 space-y-2">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span>${SHIPPING_COST.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white text-xl font-bold pt-2 border-t border-white/10">
                  <span>Total</span>
                  <span className="text-gold-500">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
