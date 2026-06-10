import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { FaCreditCard, FaLock } from 'react-icons/fa';
import LoadingSpinner from '../common/LoadingSpinner';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#fff',
      fontFamily: 'Inter, sans-serif',
      fontSize: '16px',
      '::placeholder': {
        color: '#9ca3af'
      }
    },
    invalid: {
      color: '#ef4444',
      iconColor: '#ef4444'
    }
  },
  hidePostalCode: false
};

const PaymentForm = ({ clientSecret, onSuccess, onError, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!cardComplete) {
      onError('Please complete card details');
      return;
    }

    setProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent);
      }
    } catch (err) {
      onError(err.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-dark-100 p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <FaCreditCard className="text-gold-500" />
          <h3 className="text-lg font-serif text-white">Payment Details</h3>
        </div>

        <div className="bg-dark-200 border border-white/10 rounded-lg p-4 focus-within:border-gold-500 transition-colors">
          <CardElement
            options={CARD_ELEMENT_OPTIONS}
            onChange={(e) => setCardComplete(e.complete)}
          />
        </div>

        <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
          <FaLock className="text-gold-500" />
          <span>Your payment information is encrypted and secure</span>
        </div>
      </div>

      <div className="bg-dark-100 p-6 rounded-lg">
        <h3 className="text-lg font-serif text-white mb-4">Order Summary</h3>
        <div className="flex justify-between items-center text-2xl font-bold text-white">
          <span>Total:</span>
          <span className="text-gold-500">${amount.toFixed(2)}</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={processing || !stripe || !cardComplete}
        className="btn-primary w-full py-4 text-lg"
      >
        {processing ? (
          <LoadingSpinner size="sm" />
        ) : (
          `Pay $${amount.toFixed(2)}`
        )}
      </button>

      <p className="text-center text-xs text-gray-500">
        Powered by <span className="text-white">Stripe</span>
      </p>
    </form>
  );
};

export default PaymentForm;
