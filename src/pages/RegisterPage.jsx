import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaPhone } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useToastContext } from '../context/ToastContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });

  const { register, loading } = useAuth();
  const toast = useToastContext();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      const response = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone
      });

      if (response.success) {
        toast.success('Registration successful! Welcome to Alfa Male.');
        navigate('/', { replace: true });
      }
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    }
  };
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-dark relative overflow-hidden">
      
      {/* Background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full bg-dark-100 p-8 sm:p-12 rounded-2xl border border-white/5 shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <h2 className="text-4xl font-serif text-white mb-3">Join The Elite</h2>
          <p className="text-gray-400">Create an account to elevate your style journey.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                <FaUser />
              </div>
              <input 
                type="text" 
                name="name"
                placeholder="John Doe" 
                className="input-field pl-11" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                <FaEnvelope />
              </div>
              <input 
                type="email" 
                name="email"
                placeholder="john@example.com" 
                className="input-field pl-11" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Phone Number (Optional)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                <FaPhone />
              </div>
              <input 
                type="tel" 
                name="phone"
                placeholder="+1 234 567 8900" 
                className="input-field pl-11" 
                value={formData.phone}
                onChange={handleChange}
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
                name="password"
                placeholder="••••••••" 
                className="input-field pl-11" 
                value={formData.password}
                onChange={handleChange}
                required 
              />
            </div>
            <p className="text-xs text-gray-500 ml-1">Must be at least 6 characters with uppercase, lowercase, and number</p>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                <FaLock />
              </div>
              <input 
                type="password" 
                name="confirmPassword"
                placeholder="••••••••" 
                className="input-field pl-11" 
                value={formData.confirmPassword}
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              className="btn-primary w-full py-4 text-lg"
              disabled={loading}
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Create Account'}
            </button>
          </div>

        </form>

        <p className="text-center text-gray-400 mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-gold-500 hover:underline font-medium">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
