import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { categories } from '../data/products';

const ProductsPage = () => {
  return (
    <div className="min-h-screen bg-dark py-12">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif text-white mb-6"
          >
            Our Collections
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "6rem" }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="h-1 bg-gold-500 mx-auto mb-6"
          />
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-400 text-lg"
          >
            Discover our meticulously curated collections, designed to elevate every aspect of the modern gentleman's wardrobe.
          </motion.p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link 
                to={`/products/${category.id}`}
                className="group block relative h-[400px] rounded-2xl overflow-hidden border border-white/5 bg-dark-100"
              >
                {/* Background Image */}
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 w-full p-8 text-center transition-transform duration-500">
                  <h2 className="text-3xl font-serif text-white mb-3">{category.name}</h2>
                  <span className="inline-flex items-center gap-2 text-gold-500 font-medium tracking-widest uppercase text-sm border-b border-transparent group-hover:border-gold-500 pb-1 transition-all">
                    Explore <span className="transform group-hover:translate-x-2 transition-transform">→</span>
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
