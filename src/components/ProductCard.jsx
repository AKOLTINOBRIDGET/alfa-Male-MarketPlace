import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaEye } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent card navigation
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          message: 'Please sign in to add items to your cart.',
          from: `/product/${product.id}`
        }
      });
      return;
    }
    addToCart(product);
  };

  return (
    <Link to={`/product/${product.id}`}>
      <div className="group bg-dark-100 rounded-xl overflow-hidden border border-white/5 hover:border-gold-500/30 transition-all duration-500 hover:shadow-[0_10px_30px_rgba(201,168,76,0.1)]">
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-dark-200">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center gap-3 pb-6">
            <button 
              onClick={handleAddToCart}
              className="translate-y-4 group-hover:translate-y-0 transition-all duration-300 btn-primary flex items-center gap-2 text-sm"
            >
              <FaShoppingCart />
              <span>Add to Cart</span>
            </button>
            <div className="translate-y-4 group-hover:translate-y-0 transition-all duration-500 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 py-2 px-3 rounded-full flex items-center gap-1 text-sm">
              <FaEye /> View
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-5 text-center">
          <h3 className="text-lg font-serif mb-2 text-gray-200 group-hover:text-gold-500 transition-colors">
            {product.name}
          </h3>
          <p className="text-xl font-bold tracking-wider text-white">
            ${product.price}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
