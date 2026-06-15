import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { categories } from '../data/products';

const heroImages = [
  '/images/s9.jpg',
  '/images/m3.jpg',
  '/images/casual.jpg',
  '/images/s7.jpg'
];

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="-mt-20"> {/* Offset navbar padding for full screen hero */}
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {heroImages.map((img, index) => (
          <motion.div
            key={img}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ 
              opacity: index === currentSlide ? 1 : 0,
              scale: index === currentSlide ? 1 : 1.1,
              zIndex: index === currentSlide ? 10 : 0
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-black/50 z-10" />
            <img 
              src={img} 
              alt="Hero" 
              className="w-full h-full object-cover object-center"
            />
          </motion.div>
        ))}

        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto mt-16 sm:mt-20">
          <motion.span 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gold-500 font-medium tracking-[0.2em] uppercase text-xs sm:text-sm mb-4 block"
          >
            The Alfa Male Collection
          </motion.span>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-4 sm:mb-6 leading-tight drop-shadow-2xl"
          >
            Style Redefined <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600">
              For The Modern Man
            </span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-base sm:text-lg md:text-xl text-gray-200 mb-6 sm:mb-10 max-w-2xl mx-auto font-light px-4"
          >
            Explore our premium collection of tailored suits, luxury timepieces, and sophisticated footwear.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <Link to="/products" className="btn-primary">
              Explore Collection
            </Link>
            <Link to="/login" className="btn-outline">
              Sign In
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-padding bg-dark">
        <div className="container">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-4">Curated Categories</h2>
            <div className="w-24 h-1 bg-gold-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {categories.map((category, index) => (
              <motion.div 
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link 
                  to={`/products/${category.id}`}
                  className="group block relative h-64 sm:h-80 lg:h-96 overflow-hidden rounded-xl sm:rounded-2xl border border-white/5"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 transition-opacity group-hover:opacity-90" />
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 w-full p-4 sm:p-6 lg:p-8 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-xl sm:text-2xl font-serif text-white mb-2">{category.name}</h3>
                    <span className="text-gold-500 font-medium uppercase tracking-widest text-xs sm:text-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      Shop Now <span className="text-lg">→</span>
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Strip */}
      <section className="section-padding bg-dark-100 border-t border-b border-white/5">
        <div className="container text-center max-w-4xl">
          <h2 className="text-2xl sm:text-3xl font-serif text-gold-500 mb-4 sm:mb-6">The Alfa Experience</h2>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed px-4">
            We believe that dressing well is a form of good manners. Our garments are crafted with precision, using only the finest materials. Whether you're stepping into the boardroom or attending a gala, Alfa Male ensures you command the room with effortless elegance.
          </p>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
