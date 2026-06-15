import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaBars, FaTimes, FaSearch, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    const timer = setTimeout(() => setMobileMenuOpen(false), 0);
    return () => clearTimeout(timer);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Bespoke Tailoring', path: '/custom-tailoring' },
    { name: 'FAQ', path: '/faq' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/dashboard';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'tailor') return '/tailor';
    return '/dashboard';
  };

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'glass py-3 shadow-lg' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-serif font-bold text-white tracking-wider flex items-center gap-2">
          <span className="text-gold-500 text-3xl">A</span>lfa Male
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm tracking-widest uppercase transition-colors hover:text-gold-500 ${
                location.pathname === link.path ? 'text-gold-500 font-semibold' : 'text-gray-300'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-5">
          {/* Search */}
          <div className="relative flex items-center">
            <AnimatePresence>
              {searchOpen && (
                <motion.input
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 150, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  type="text"
                  placeholder="Search..."
                  className="absolute right-8 bg-dark-200 border border-white/20 rounded-full px-3 py-1 text-sm text-white focus:outline-none focus:border-gold-500"
                />
              )}
            </AnimatePresence>
            <button 
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label={searchOpen ? 'Close search' : 'Open search'}
              className="text-gray-300 hover:text-gold-500 transition"
            >
              <FaSearch size={18} />
            </button>
          </div>

          {/* Cart */}
          <button 
            onClick={() => setIsCartOpen(true)}
            aria-label="Open cart"
            className="relative text-gray-300 hover:text-gold-500 transition"
          >
            <FaShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold-500 text-dark text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          {/* Auth: Dashboard or Sign In */}
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-3">
              <Link 
                to={getDashboardPath()}
                className="text-gray-300 hover:text-gold-500 transition"
                title="My Account"
              >
                <FaUser size={18} />
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-red-400 transition"
                title="Sign Out"
              >
                <FaSignOutAlt size={18} />
              </button>
            </div>
          ) : (
            <Link 
              to="/login"
              className="hidden md:inline-flex text-sm btn-outline py-2 px-4"
            >
              Sign In
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-gray-300 hover:text-gold-500"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden glass overflow-hidden border-t border-white/10"
          >
            <div className="flex flex-col items-center py-6 gap-5">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-lg tracking-widest uppercase ${
                    location.pathname === link.path ? 'text-gold-500 font-semibold' : 'text-gray-300'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="border-t border-white/10 w-full pt-4 mt-2 flex flex-col items-center gap-4">
                {isAuthenticated ? (
                  <>
                    <Link to={getDashboardPath()} className="text-gray-300 hover:text-gold-500 transition">My Account</Link>
                    <button onClick={handleLogout} className="text-red-400">Sign Out</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="btn-primary py-2 px-8">Sign In</Link>
                    <Link to="/register" className="text-gray-400 hover:text-gold-500 text-sm">Create Account</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
