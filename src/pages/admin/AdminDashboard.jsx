import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ManageOrders from './ManageOrders';
import ManageAppointments from './ManageAppointments';
import ManageProducts from './ManageProducts';
import ManageInventory from './ManageInventory';
import ManageCustomers from './ManageCustomers';
import ManageCoupons from './ManageCoupons';
import ManageStaff from './ManageStaff';
import ManageReviews from './ManageReviews';
import DashboardOverview from './DashboardOverview';
import { FaBox, FaCalendarCheck, FaChartLine, FaSignOutAlt, FaUserShield, FaTags, FaWarehouse, FaUsers, FaTicketAlt, FaUserTie, FaStar } from 'react-icons/fa';
import { getCurrentUserSnapshot, getStoredAuth, hasRole } from '../../utils/auth';

const AdminDashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Guard: Only admins can access
  const currentUser = getCurrentUserSnapshot(user);
  const isAdmin = hasRole(currentUser, 'admin');

  if (!(isAuthenticated || getStoredAuth()) || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: FaChartLine },
    { id: 'orders', label: 'Manage Orders', icon: FaBox },
    { id: 'appointments', label: 'Appointments', icon: FaCalendarCheck },
    { id: 'products', label: 'Products', icon: FaTags },
    { id: 'inventory', label: 'Inventory', icon: FaWarehouse },
    { id: 'customers', label: 'Customers', icon: FaUsers },
    { id: 'reviews', label: 'Customer Reviews', icon: FaStar },
    { id: 'coupons', label: 'Coupons', icon: FaTicketAlt },
    { id: 'staff', label: 'Staff Management', icon: FaUserTie },
  ];

  return (
    <div className="min-h-screen bg-dark flex flex-col md:flex-row font-sans text-white z-50 fixed inset-0">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0a0a0a] border-r border-white/10 flex flex-col">
        {/* Brand */}
        <div className="p-6 border-b border-white/10">
          <div className="text-xl font-serif font-bold text-white tracking-wider flex items-center gap-2">
            <span className="text-gold-500 text-2xl">A</span>lfa Admin
          </div>
        </div>

        {/* User Profile Snippet */}
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500">
            <FaUserShield size={18} />
          </div>
          <div>
            <p className="text-sm font-bold text-white">{currentUser?.name || 'Business Owner'}</p>
            <p className="text-xs text-gray-400">{currentUser?.email || 'admin@alfamale.com'}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
                activeTab === item.id 
                  ? 'bg-gold-500 text-dark font-bold' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-red-400/10 transition-all"
          >
            <FaSignOutAlt size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-dark-100 p-6 md:p-10 custom-scrollbar">
        <AnimatePresence mode="wait">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <DashboardOverview setActiveTab={setActiveTab} />
            </motion.div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ManageOrders />
            </motion.div>
          )}

          {/* APPOINTMENTS TAB */}
          {activeTab === 'appointments' && (
            <motion.div key="appointments" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ManageAppointments />
            </motion.div>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === 'products' && (
            <motion.div key="products" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ManageProducts />
            </motion.div>
          )}

          {/* INVENTORY TAB */}
          {activeTab === 'inventory' && (
            <motion.div key="inventory" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ManageInventory />
            </motion.div>
          )}

          {/* CUSTOMERS TAB */}
          {activeTab === 'customers' && (
            <motion.div key="customers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ManageCustomers />
            </motion.div>
          )}

          {/* REVIEWS TAB */}
          {activeTab === 'reviews' && (
            <motion.div key="reviews" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ManageReviews />
            </motion.div>
          )}

          {/* COUPONS TAB */}
          {activeTab === 'coupons' && (
            <motion.div key="coupons" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ManageCoupons />
            </motion.div>
          )}

          {/* STAFF TAB */}
          {activeTab === 'staff' && (
            <motion.div key="staff" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ManageStaff />
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminDashboard;
