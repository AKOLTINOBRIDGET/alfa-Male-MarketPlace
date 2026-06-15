import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('alfa_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('alfa_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1, variant = null) => {
    setCartItems(prev => {
      const itemKey = getCartItemKey(product, variant);
      const existing = prev.find(item => {
        const existingKey = getCartItemKey(item, item.variant);
        return existingKey === itemKey;
      });

      if (existing) {
        return prev.map(item => {
          const existingKey = getCartItemKey(item, item.variant);
          return existingKey === itemKey
            ? { ...item, quantity: item.quantity + quantity }
            : item;
        });
      }

      return [...prev, { ...product, quantity, variant }];
    });
  };

  const removeFromCart = (id, variantSku = null) => {
    setCartItems(prev => prev.filter(item => {
      if (variantSku) {
        return !(item.id === id && item.variant?.sku === variantSku);
      }
      return item.id !== id;
    }));
  };

  const updateQuantity = (id, delta, variantSku = null) => {
    setCartItems(prev => prev.map(item => {
      const isMatch = variantSku
        ? item.id === id && item.variant?.sku === variantSku
        : item.id === id;

      if (isMatch) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const setQuantity = (id, quantity, variantSku = null) => {
    if (quantity <= 0) {
      removeFromCart(id, variantSku);
      return;
    }

    setCartItems(prev => prev.map(item => {
      const isMatch = variantSku
        ? item.id === id && item.variant?.sku === variantSku
        : item.id === id;

      return isMatch ? { ...item, quantity } : item;
    }));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getItemQuantity = (id, variantSku = null) => {
    const item = cartItems.find(item => {
      if (variantSku) {
        return item.id === id && item.variant?.sku === variantSku;
      }
      return item.id === id;
    });
    return item?.quantity || 0;
  };

  const cartTotal = cartItems.reduce((sum, item) => {
    const price = item.variant?.price || item.price;
    return sum + (price * item.quantity);
  }, 0);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      setQuantity,
      clearCart,
      getItemQuantity,
      cartTotal,
      cartCount,
      isCartOpen,
      setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};

const getCartItemKey = (product, variant = null) => {
  const selectedVariant = variant || product.variant;
  const selectedSize = selectedVariant?.sku || product.selectedSize;
  return selectedSize ? `${product.id}-${selectedSize}` : `${product.id}`;
};
