import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/20/solid';
import { motion } from 'framer-motion';
import { products, categories } from '../data/products';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const reviews = { average: 4.5, totalCount: 117 };

const getSizesByCategory = (category) => {
  if (category === 'office' || category === 'snickers') {
    return [
      { name: '40', inStock: true },
      { name: '41', inStock: true },
      { name: '42', inStock: true },
      { name: '43', inStock: false },
      { name: '44', inStock: true },
      { name: '45', inStock: true },
    ];
  }
  if (category === 'suits') {
    return [
      { name: '38R', inStock: true },
      { name: '40R', inStock: true },
      { name: '42L', inStock: true },
      { name: '44R', inStock: false },
      { name: '46L', inStock: true },
    ];
  }
  return [
    { name: 'S', inStock: true },
    { name: 'M', inStock: true },
    { name: 'L', inStock: true },
    { name: 'XL', inStock: false },
    { name: 'XXL', inStock: true },
  ];
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  
  const product = products.find(p => p.id === parseInt(id));
  const sizes = product ? getSizesByCategory(product.category) : [];
  const [selectedSize, setSelectedSize] = useState(sizes[0] || null);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-dark text-white">
        <h2 className="text-3xl font-serif mb-4">Product Not Found</h2>
        <Link to="/products" className="text-gold-500 hover:underline">Return to Products</Link>
      </div>
    );
  }

  const categoryInfo = categories.find(c => c.id === product.category);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      // Redirect to login with state to indicate they tried to add to cart
      navigate('/login', {
        state: {
          message: 'Please sign in to add items to your cart.',
          from: `/product/${product.id}`
        }
      });
      return;
    }
    addToCart({ ...product, selectedSize: selectedSize?.name });
  };

  return (
    <div className="bg-dark min-h-screen text-white pt-10 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol role="list" className="flex items-center space-x-2">
            <li>
              <div className="flex items-center">
                <Link to="/products" className="mr-2 text-sm font-medium text-gray-400 hover:text-gold-500 transition">
                  Collections
                </Link>
                <svg fill="currentColor" width={16} height={20} viewBox="0 0 16 20" aria-hidden="true" className="h-5 w-4 text-gray-600">
                  <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                </svg>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <Link to={`/products/${product.category}`} className="mr-2 text-sm font-medium text-gray-400 hover:text-gold-500 transition">
                  {categoryInfo?.name || product.category}
                </Link>
                <svg fill="currentColor" width={16} height={20} viewBox="0 0 16 20" aria-hidden="true" className="h-5 w-4 text-gray-600">
                  <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                </svg>
              </div>
            </li>
            <li className="text-sm font-medium text-gold-500">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* Product Layout */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12">
          
          {/* Image */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="aspect-[4/5] rounded-2xl overflow-hidden bg-dark-100 border border-white/5 shadow-2xl lg:sticky lg:top-28"
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-110"
            />
          </motion.div>

          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mt-10 px-4 sm:px-0 lg:mt-0"
          >
            <h1 className="text-4xl font-serif tracking-tight text-white mb-4">{product.name}</h1>
            <p className="text-3xl tracking-tight text-gold-500 mb-6">${product.price}</p>

            {/* Reviews */}
            <div className="mb-8 flex items-center">
              <div className="flex items-center">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <StarIcon
                    key={rating}
                    aria-hidden="true"
                    className={classNames(
                      reviews.average > rating ? 'text-gold-500' : 'text-gray-600',
                      'size-5 shrink-0'
                    )}
                  />
                ))}
              </div>
              <span className="ml-3 text-sm font-medium text-gray-400">
                {reviews.totalCount} reviews
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleAddToCart} className="mb-10">
              
              {/* Sizes */}
              {product.category !== 'watches' && product.category !== 'others' && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-300">Size</h3>
                    <a href="#" className="text-sm font-medium text-gold-500 hover:underline">
                      Size guide
                    </a>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    {sizes.map((size) => (
                      <label
                        key={size.name}
                        className={classNames(
                          size.inStock ? 'cursor-pointer' : 'cursor-not-allowed opacity-40',
                          selectedSize?.name === size.name 
                            ? 'border-gold-500 bg-gold-500/10 text-white' 
                            : 'border-white/10 text-gray-400 hover:border-white/30',
                          'group relative flex items-center justify-center rounded-lg border p-3 text-sm font-medium transition-all'
                        )}
                        onClick={() => size.inStock && setSelectedSize(size)}
                      >
                        <input
                          type="radio"
                          name="size"
                          className="sr-only"
                          disabled={!size.inStock}
                        />
                        <span>{size.name}</span>
                        {/* Sold out diagonal line */}
                        {!size.inStock && (
                          <svg
                            className="absolute inset-0 h-full w-full stroke-2 text-gray-600"
                            viewBox="0 0 100 100"
                            preserveAspectRatio="none"
                            stroke="currentColor"
                          >
                            <line x1={0} y1={100} x2={100} y2={0} vectorEffect="non-scaling-stroke" />
                          </svg>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="btn-primary w-full py-4 text-lg"
              >
                Add to Cart
              </button>

              {!isAuthenticated && (
                <p className="mt-4 text-center text-sm text-gray-400">
                  <Link to="/login" className="text-gold-500 hover:underline">Sign in</Link> to checkout securely.
                </p>
              )}
            </form>

            {/* Description */}
            <div className="border-t border-white/10 pt-8 mb-8">
              <h3 className="text-lg font-serif text-white mb-4">Product Details</h3>
              <div className="space-y-4 text-gray-400 leading-relaxed">
                <p>
                  Experience the pinnacle of modern menswear with our premium {product.name.toLowerCase()}. 
                  Crafted with exceptional attention to detail, this piece is designed to elevate your personal style while ensuring maximum comfort.
                </p>
                <p>
                  Whether you're attending a formal gala or seeking to upgrade your everyday aesthetic, 
                  Alfa Male guarantees uncompromising quality and a perfect fit.
                </p>
              </div>
            </div>

            {/* Highlights */}
            <div className="border-t border-white/10 pt-8">
              <h3 className="text-lg font-serif text-white mb-4">Highlights</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-400">
                <li>Premium imported materials</li>
                <li>Expert craftsmanship and stitching</li>
                <li>Designed for long-lasting durability</li>
                <li>Exclusive to The Alfa Male Collection</li>
              </ul>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
