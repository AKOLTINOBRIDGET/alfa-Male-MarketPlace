import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaEnvelope, FaLock, FaGoogle, FaApple } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect message if they were blocked (e.g., from cart guard)
  const message = location.state?.message || null;
  // Redirect back to where they came from (or home)
  const from = location.state?.from || '/';

  const handleSubmit = (e) => {
    e.preventDefault();
    const isAdmin = email.toLowerCase().includes('admin');
    
    // Mock auth
    login({ 
      name: email.split('@')[0], 
      email,
      role: isAdmin ? 'admin' : 'customer'
    });
    
    if (isAdmin) {
      navigate('/admin', { replace: true });
    } else {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex bg-dark">
      
      {/* Left Side - Image Panel */}
      <div className="hidden lg:block w-1/2 relative">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img 
          src="/images/m2.jpg" 
          alt="Login Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center px-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-serif text-white mb-6 leading-tight">
              Welcome Back To <br/>
              <span className="text-gold-500">Excellence.</span>
            </h2>
            <p className="text-gray-300 text-lg max-w-md">
              Sign in to access your curated wardrobe, track orders, and experience personalized styling recommendations.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-dark-100 p-8 sm:p-10 rounded-2xl border border-white/5 shadow-2xl"
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-serif text-white mb-2">Sign In</h3>
            <p className="text-gray-400">Enter your details to access your account</p>
          </div>

          {/* Message from cart guard */}
          {message && (
            <div className="mb-6 p-4 bg-gold-500/10 border border-gold-500/30 rounded-lg text-sm text-gold-500 text-center">
              {message}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <FaEnvelope />
                </div>
                <input 
                  type="email" 
                  placeholder="john@example.com"
                  className="input-field pl-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <FaLock />
                </div>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="input-field pl-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end mt-1">
                <a href="#" className="text-xs text-gold-500 hover:underline">Forgot password?</a>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full mt-4 py-3.5">
              Sign In
            </button>

            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">or continue with</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button type="button" className="flex items-center justify-center gap-2 bg-dark-200 border border-white/5 hover:bg-dark-200/80 text-white py-2.5 rounded-lg transition">
                <FaGoogle className="text-red-500" /> Google
              </button>
              <button type="button" className="flex items-center justify-center gap-2 bg-dark-200 border border-white/5 hover:bg-dark-200/80 text-white py-2.5 rounded-lg transition">
                <FaApple /> Apple
              </button>
            </div>

          </form>

          <p className="text-center text-gray-400 mt-8 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-gold-500 hover:underline font-medium">
              Create one now
            </Link>
          </p>
        </motion.div>
      </div>

    </div>
  );
};

export default LoginPage;
