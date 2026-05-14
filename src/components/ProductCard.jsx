import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="group bg-dark-100 rounded-xl overflow-hidden border border-white/5 hover:border-gold-500/30 transition-all duration-500 hover:shadow-[0_10px_30px_rgba(201,168,76,0.1)]">
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-dark-200">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
          <button 
            onClick={() => addToCart(product)}
            className="translate-y-4 group-hover:translate-y-0 transition-all duration-300 btn-primary flex items-center gap-2"
          >
            <FaShoppingCart />
            <span>Add to Cart</span>
          </button>
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
  );
};

export default ProductCard;
