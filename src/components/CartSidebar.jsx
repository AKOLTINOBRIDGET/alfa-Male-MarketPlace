import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaTimes, FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const CartSidebar = () => {
  const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Sidebar */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-dark-100 shadow-2xl z-[70] flex flex-col border-l border-white/10"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-dark">
              <h2 className="text-2xl font-serif text-gold-500">Your Cart</h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-gray-400 hover:text-white transition p-2"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                  <div className="w-24 h-24 rounded-full bg-dark-200 flex items-center justify-center border border-white/5">
                    <span className="text-4xl text-gray-600">🛍️</span>
                  </div>
                  <p>Your cart is empty.</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="text-gold-500 hover:underline"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 bg-dark-200/50 p-3 rounded-lg border border-white/5">
                    <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded-md" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between">
                        <h4 className="font-serif text-sm text-gray-200 pr-4">{item.name}</h4>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-400/70 hover:text-red-400 transition"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                      
                      <div className="flex justify-between items-end">
                        <p className="text-gold-500 font-semibold">${item.price}</p>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 bg-dark px-2 py-1 rounded">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="text-gray-400 hover:text-white"
                          >
                            <FaMinus size={10} />
                          </button>
                          <span className="text-sm w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="text-gray-400 hover:text-white"
                          >
                            <FaPlus size={10} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Checkout */}
            {cartItems.length > 0 && (
              <div className="p-6 bg-dark border-t border-white/10 space-y-4">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="font-bold text-white">${cartTotal}</span>
                </div>
                <p className="text-xs text-gray-500 text-center">Taxes and shipping calculated at checkout.</p>
                <Link 
                  to="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="btn-primary w-full py-4 text-lg text-center block"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
