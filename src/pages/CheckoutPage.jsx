import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { FaCreditCard, FaMobileAlt, FaShieldAlt, FaCheckCircle } from 'react-icons/fa';

const CheckoutPage = () => {
  const { cartItems, cartTotal, cartCount } = useCart();

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // If cart is empty, redirect back or show message
  if (cartItems.length === 0 && !isSuccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-dark text-white p-4">
        <h2 className="text-3xl font-serif mb-4">Your cart is empty</h2>
        <p className="text-gray-400 mb-6">Add some premium items before checking out.</p>
        <Link to="/products" className="btn-primary">Browse Collections</Link>
      </div>
    );
  }

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    // Mock processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      // In a real app, clear cart here
    }, 2500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-dark text-white p-4">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="text-green-500 mb-6"
        >
          <FaCheckCircle size={80} />
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-serif text-gold-500 mb-4 text-center"
        >
          Payment Successful
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-gray-400 text-lg mb-8 text-center max-w-md"
        >
          Thank you for choosing Alfa Male. Your premium order is currently being processed.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Link to="/" className="btn-outline">Return to Home</Link>
        </motion.div>
      </div>
    );
  }

  // Calculate taxes and shipping mock
  const shippingFee = cartTotal > 500 ? 0 : 25;
  const tax = Math.round(cartTotal * 0.18); // 18% VAT mock
  const finalTotal = cartTotal + shippingFee + tax;

  return (
    <div className="min-h-screen bg-dark py-12">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-serif text-white mb-10 text-center md:text-left">Secure Checkout</h1>
        
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Left Column - Forms */}
          <div className="w-full lg:w-2/3 space-y-8">
            
            {/* Contact & Shipping */}
            <div className="bg-dark-100 p-6 md:p-8 rounded-2xl border border-white/5">
              <h2 className="text-2xl font-serif text-gold-500 mb-6">1. Shipping Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input type="text" placeholder="First Name" className="input-field" />
                <input type="text" placeholder="Last Name" className="input-field" />
                <input type="email" placeholder="Email Address" className="input-field md:col-span-2" />
                <input type="text" placeholder="Phone Number" className="input-field md:col-span-2" />
                <input type="text" placeholder="Street Address" className="input-field md:col-span-2" />
                <input type="text" placeholder="City / District" className="input-field" />
                <input type="text" placeholder="Postal Code (Optional)" className="input-field" />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-dark-100 p-6 md:p-8 rounded-2xl border border-white/5">
              <h2 className="text-2xl font-serif text-gold-500 mb-6 flex items-center gap-3">
                2. Payment Method
                <span className="text-sm bg-green-500/10 text-green-500 px-3 py-1 rounded-full flex items-center gap-1 font-sans">
                  <FaShieldAlt /> Secure Encrypted
                </span>
              </h2>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'card' 
                      ? 'border-gold-500 bg-gold-500/5 text-white' 
                      : 'border-white/10 text-gray-400 hover:border-white/30'
                  }`}
                >
                  <FaCreditCard size={20} className={paymentMethod === 'card' ? 'text-gold-500' : ''} />
                  <span className="font-medium tracking-wide">Bank Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('momo')}
                  className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'momo' 
                      ? 'border-gold-500 bg-gold-500/5 text-white' 
                      : 'border-white/10 text-gray-400 hover:border-white/30'
                  }`}
                >
                  <FaMobileAlt size={20} className={paymentMethod === 'momo' ? 'text-gold-500' : ''} />
                  <span className="font-medium tracking-wide">Mobile Money</span>
                </button>
              </div>

              {/* Dynamic Payment Forms */}
              <AnimatePresence mode="wait">
                {paymentMethod === 'card' ? (
                  <motion.form 
                    key="card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onSubmit={handlePayment}
                    className="space-y-5"
                  >
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Cardholder Name</label>
                      <input type="text" placeholder="John Doe" className="input-field" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Card Number</label>
                      <input type="text" placeholder="XXXX XXXX XXXX XXXX" className="input-field" maxLength="19" required />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm text-gray-400">Expiry Date</label>
                        <input type="text" placeholder="MM/YY" className="input-field" maxLength="5" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-400">CVV</label>
                        <input type="text" placeholder="123" className="input-field" maxLength="4" required />
                      </div>
                    </div>
                  </motion.form>
                ) : (
                  <motion.form 
                    key="momo"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onSubmit={handlePayment}
                    className="space-y-5"
                  >
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Network Provider</label>
                      <select className="input-field appearance-none bg-dark-200" required>
                        <option value="">Select Network...</option>
                        <option value="mtn">MTN Mobile Money</option>
                        <option value="airtel">Airtel Money</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Mobile Money Number</label>
                      <div className="flex">
                        <span className="bg-dark-200 border border-r-0 border-white/10 rounded-l-lg px-4 py-3 text-gray-400 flex items-center justify-center">
                          +256
                        </span>
                        <input type="tel" placeholder="7XX XXX XXX" className="input-field rounded-l-none" maxLength="10" required />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">A prompt will be sent to your phone to confirm the PIN.</p>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
            
            {/* Action Button */}
            <button 
              onClick={handlePayment}
              disabled={isProcessing}
              className={`w-full btn-primary py-4 text-lg flex items-center justify-center gap-3 ${
                isProcessing ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Payment...
                </>
              ) : (
                `Pay $${finalTotal}`
              )}
            </button>

          </div>

          {/* Right Column - Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-dark-100 p-6 md:p-8 rounded-2xl border border-white/5 sticky top-24">
              <h3 className="text-xl font-serif text-white mb-6 border-b border-white/10 pb-4">
                Order Summary <span className="text-gray-400 text-sm ml-2">({cartCount} items)</span>
              </h3>
              
              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
                {cartItems.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded border border-white/5" />
                    <div className="flex-1">
                      <h4 className="text-sm text-gray-300 font-serif leading-tight">{item.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                      <p className="text-gold-500 text-sm mt-2 font-medium">${item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm border-t border-white/10 pt-6">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white">${cartTotal}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-white">{shippingFee === 0 ? 'Free' : `$${shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax (Estimated)</span>
                  <span className="text-white">${tax}</span>
                </div>
                
                <div className="flex justify-between items-center text-lg font-serif border-t border-white/10 pt-4 mt-4 text-gold-500">
                  <span>Total</span>
                  <span className="text-2xl">${finalTotal}</span>
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
