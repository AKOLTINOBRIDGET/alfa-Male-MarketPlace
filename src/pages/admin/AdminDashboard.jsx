import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBox, FaCalendarCheck, FaChartLine, FaSignOutAlt, FaUserShield } from 'react-icons/fa';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ManageOrders from './ManageOrders';
import ManageAppointments from './ManageAppointments';

const AdminDashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Guard: Only admins can access
  if (!isAuthenticated || user?.role !== 'admin') {
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
            <p className="text-sm font-bold text-white">Business Owner</p>
            <p className="text-xs text-gray-400">{user.email}</p>
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
              <h1 className="text-3xl font-serif text-white mb-8">Dashboard Overview</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: "Total Revenue", value: "$12,450", icon: FaChartLine, color: "text-green-500" },
                  { title: "Pending Orders", value: "8", icon: FaBox, color: "text-blue-500" },
                  { title: "New Appointments", value: "3", icon: FaCalendarCheck, color: "text-purple-500" }
                ].map((stat, i) => (
                  <div key={i} className="bg-[#0a0a0a] p-6 rounded-2xl border border-white/5 flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-full bg-white/5 flex items-center justify-center ${stat.color}`}>
                      <stat.icon size={24} />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold font-serif">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Activity Mock */}
              <div className="bg-[#0a0a0a] p-8 rounded-2xl border border-white/5 mt-8">
                <h2 className="text-xl font-serif text-gold-500 mb-6">Recent Activity</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-white/5">
                    <p className="text-sm text-gray-300">New Order <span className="text-gold-500">#ORD-009</span> placed by James</p>
                    <span className="text-xs text-gray-500">2 mins ago</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-white/5">
                    <p className="text-sm text-gray-300">Appointment requested by Michael (Bespoke Suit)</p>
                    <span className="text-xs text-gray-500">1 hr ago</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-white/5">
                    <p className="text-sm text-gray-300">Order <span className="text-gold-500">#ORD-005</span> delivered successfully</p>
                    <span className="text-xs text-gray-500">Yesterday</span>
                  </div>
                </div>
              </div>
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

        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminDashboard;
