import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaBox, FaCheckCircle, FaTruck, FaClock, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import orderService from '../services/orderService';
import { useToastContext } from '../context/ToastContext';
import { getResponseList } from '../utils/apiResponse';

const statusConfig = {
  Delivered: { icon: FaCheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
  Processing: { icon: FaClock, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  Shipped: { icon: FaTruck, color: 'text-blue-400', bg: 'bg-blue-400/10' },
};

const OrderHistoryPage = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const toast = useToastContext();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await orderService.getMyOrders();
        setOrders(getResponseList(response));
      } catch (error) {
        toast.error(error.message || 'Unable to load your orders.');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [isAuthenticated, toast]);

  const getOrderId = (order) => order.orderNumber || order._id?.slice(-6) || order.id;
  const getOrderTotal = (order) => order.pricing?.total ?? order.total ?? 0;
  const getOrderItems = (order) => (
    order.items?.map((item) => item.name || item.product?.name || 'Item').join(', ') || 'No items'
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ message: 'Please sign in to view your order history.' }} replace />;
  }

  return (
    <div className="min-h-screen bg-dark py-12 text-white">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12">
          <div>
            <h1 className="text-4xl font-serif text-white mb-1">My Account</h1>
            <p className="text-gray-400">Welcome back, <span className="text-gold-500">{user?.name || 'Valued Customer'}</span></p>
            {location.state?.orderId && (
              <p className="text-sm text-green-400 mt-2">Your latest order was confirmed.</p>
            )}
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition border border-white/10 px-4 py-2 rounded-lg"
          >
            <FaSignOutAlt />
            Sign Out
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {[
            { icon: FaBox, label: 'Total Orders', value: orders.length },
            { icon: FaCheckCircle, label: 'Delivered', value: orders.filter(o => o.status === 'Delivered').length },
            { icon: FaTruck, label: 'In Transit', value: orders.filter(o => ['Shipped', 'Ready for Fitting'].includes(o.status)).length },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-dark-100 p-6 rounded-2xl border border-white/5 flex items-center gap-5"
            >
              <div className="w-14 h-14 bg-gold-500/10 rounded-xl flex items-center justify-center">
                <stat.icon className="text-gold-500" size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-3xl font-serif text-white">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* User Profile */}
        <div className="bg-dark-100 p-6 md:p-8 rounded-2xl border border-white/5 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-dark-200 border border-gold-500/30 flex items-center justify-center">
              <FaUser className="text-gold-500" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-serif text-white">{user?.name || 'Alfa Male Member'}</h2>
              <p className="text-gray-400 text-sm">{user?.email || 'member@alfamale.com'}</p>
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="bg-dark-100 p-6 md:p-8 rounded-2xl border border-white/5">
          <h2 className="text-2xl font-serif text-gold-500 mb-6 flex items-center gap-3">
            <FaBox /> Order History
          </h2>

          {isLoading ? (
            <div className="text-center py-12 text-gray-500">
              Loading your orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FaBox size={48} className="mx-auto mb-4 opacity-30" />
              <p>No orders yet.</p>
              <Link to="/products" className="btn-primary mt-4 inline-block">Shop Now</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, i) => {
                const { icon: StatusIcon, color, bg } = statusConfig[order.status] || statusConfig.Processing;
                return (
                  <motion.div 
                    key={order._id || order.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-dark-200 rounded-xl border border-white/5 gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-gold-500 font-bold">{getOrderId(order)}</span>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${bg} ${color}`}>
                          <StatusIcon size={10} /> {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">{getOrderItems(order)}</p>
                      <p className="text-xs text-gray-600 mt-1">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}</p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end sm:flex-col sm:items-end gap-2">
                      <p className="text-gold-500 text-xl font-serif">${getOrderTotal(order)}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default OrderHistoryPage;
