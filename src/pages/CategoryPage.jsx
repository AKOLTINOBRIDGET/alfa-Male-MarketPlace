import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { products, categories } from '../data/products';
import ProductCard from '../components/ProductCard';

const CategoryPage = () => {
  const { category } = useParams();
  
  // Find current category details
  const currentCategory = categories.find(c => c.id === category);
  
  // Filter products by category
  const categoryProducts = products.filter(p => p.category === category);

  if (!currentCategory) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-dark text-white">
        <h2 className="text-3xl font-serif mb-4">Category Not Found</h2>
        <Link to="/products" className="text-gold-500 hover:underline">Return to Products</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark pb-20">
      
      {/* Category Header */}
      <div className="relative h-[30vh] md:h-[40vh] overflow-hidden mb-12">
        <img 
          src={currentCategory.image} 
          alt={currentCategory.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-serif text-white mb-4"
            >
              {currentCategory.name}
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-3 text-gold-500 text-sm tracking-widest uppercase"
            >
              <Link to="/" className="hover:text-white transition">Home</Link>
              <span>/</span>
              <Link to="/products" className="hover:text-white transition">Products</Link>
              <span>/</span>
              <span className="text-white">{currentCategory.name}</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Filter / Sort Bar (Visual only for now) */}
      <div className="container mx-auto px-4 md:px-8 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-dark-100 p-4 rounded-xl border border-white/5">
          <p className="text-gray-400 text-sm">
            Showing <span className="text-white font-medium">{categoryProducts.length}</span> products
          </p>
          <div className="flex items-center gap-4">
            <select className="bg-dark border border-white/10 text-gray-300 text-sm rounded-lg px-4 py-2 focus:outline-none focus:border-gold-500">
              <option>Default Sorting</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest Arrivals</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 md:px-8">
        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categoryProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <p className="text-xl mb-4">No products found in this category.</p>
            <Link to="/products" className="text-gold-500 hover:underline">Browse all collections</Link>
          </div>
        )}
      </div>

    </div>
  );
};

export default CategoryPage;
