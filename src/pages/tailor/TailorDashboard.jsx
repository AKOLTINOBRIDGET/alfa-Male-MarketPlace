import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaBox, FaCalendarCheck, FaSignOutAlt, 
  FaUserTie, FaRulerCombined, FaEnvelope, 
  FaCheckCircle, FaEye, FaTimes 
} from 'react-icons/fa';

// Status colors mapping
const statusColors = {
  Processing: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
  Shipped:    'text-blue-400  bg-blue-400/10  border-blue-400/30',
  Delivered:  'text-green-500 bg-green-500/10 border-green-500/30',
};

const apptStatusColors = {
  Pending:   'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
  Contacted: 'text-blue-400  bg-blue-400/10  border-blue-400/30',
  Approved:  'text-green-500 bg-green-500/10 border-green-500/30',
};

const TailorDashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');

  // Local state synced with localStorage — initialized lazily to avoid set-state-in-effect
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('alfa_orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem('alfa_appointments');
    return saved ? JSON.parse(saved) : [];
  });
  const [staff, setStaff] = useState(() => {
    const saved = localStorage.getItem('alfa_staff');
    return saved ? JSON.parse(saved) : [];
  });

  // Modals / Details view
  const [viewingAppt, setViewingAppt] = useState(null);

  // Stable tailor ID — computed once via lazy initializer (avoids impure Math.random during render)
  const [tailorId] = useState(() => user?.id || `STF-${Math.random().toString(36).slice(2)}`);

  // Guard: Only tailors can access (placed AFTER all hooks)
  if (!isAuthenticated || user?.role?.toLowerCase() !== 'tailor') {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Find current tailor staff profile
  const currentTailor = staff.find(s => s.email.toLowerCase() === user.email.toLowerCase()) || {
    id: tailorId,
    name: user.name || 'Tailor',
    role: user.role || 'Master Tailor',
    email: user.email || '',
    status: 'Available',
    assignedReqs: 0,
    skills: ['Fitting', 'Alteration', 'Suit'],
  };

  // Handle availability status change
  const handleAvailabilityChange = (newStatus) => {
    const lowerEmail = user.email.toLowerCase();
    const exists = staff.some(s => s.email.toLowerCase() === lowerEmail);
    const updatedStaff = exists
      ? staff.map(s => s.email.toLowerCase() === lowerEmail ? { ...s, status: newStatus } : s)
      : [...staff, { ...currentTailor, status: newStatus }];

    setStaff(updatedStaff);
    localStorage.setItem('alfa_staff', JSON.stringify(updatedStaff));
  };

  // Filter orders assigned to this tailor
  const myOrders = orders.filter(order => order.assignedTailor?.id === currentTailor.id);

  // Filter appointments assigned to this tailor
  const myAppointments = appointments.filter(appt => appt.assignedStaff?.id === currentTailor.id);

  // Handle order status update
  const handleOrderStatusChange = (orderId, newStatus) => {
    const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    setOrders(updatedOrders);
    localStorage.setItem('alfa_orders', JSON.stringify(updatedOrders));
  };

  // Handle appointment status update
  const handleApptStatusChange = (apptId, newStatus) => {
    const updatedAppts = appointments.map(a => a.id === apptId ? { ...a, status: newStatus } : a);
    setAppointments(updatedAppts);
    localStorage.setItem('alfa_appointments', JSON.stringify(updatedAppts));
  };

  // Calculate statistics
  const activeOrdersCount = myOrders.filter(o => o.status !== 'Delivered').length;
  const completedOrdersCount = myOrders.filter(o => o.status === 'Delivered').length;
  const pendingApptsCount = myAppointments.filter(a => a.status !== 'Approved').length;

  return (
    <div className="min-h-screen bg-dark flex flex-col md:flex-row font-sans text-white z-50 fixed inset-0">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0a0a0a] border-r border-white/10 flex flex-col">
        {/* Brand */}
        <div className="p-6 border-b border-white/10">
          <div className="text-xl font-serif font-bold text-white tracking-wider flex items-center gap-2">
            <span className="text-gold-500 text-2xl">A</span>lfa Tailor
          </div>
        </div>

        {/* Tailor Profile Snippet */}
        <div className="p-6 border-b border-white/10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500">
              <FaUserTie size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight">{currentTailor.name}</p>
              <p className="text-xs text-gold-500">{currentTailor.role}</p>
            </div>
          </div>

          {/* Availability Switcher */}
          <div className="pt-2">
            <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">My Status</label>
            <select
              value={currentTailor.status}
              onChange={(e) => handleAvailabilityChange(e.target.value)}
              className="w-full bg-dark-200 border border-white/10 text-xs rounded px-2.5 py-1.5 focus:outline-none focus:border-gold-500"
            >
              <option value="Available">Available</option>
              <option value="In Appointment">In Appointment</option>
              <option value="Off Duty">Off Duty</option>
            </select>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
              activeTab === 'orders' 
                ? 'bg-gold-500 text-dark font-bold' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <FaBox size={16} />
            Assigned Orders ({myOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
              activeTab === 'appointments' 
                ? 'bg-gold-500 text-dark font-bold' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <FaCalendarCheck size={16} />
            Assigned Fittings ({myAppointments.length})
          </button>
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
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-serif text-white">Tailor Workspace</h1>
              <p className="text-gray-400 text-sm mt-1">Review measurements, update garment statuses, and track fittings.</p>
            </div>
            <div className="text-xs text-gray-500 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 max-w-max">
              Last Synced: {new Date().toLocaleTimeString()}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: "Active Garments", value: activeOrdersCount, icon: FaBox, color: "text-yellow-500" },
              { title: "Completed Pieces", value: completedOrdersCount, icon: FaCheckCircle, color: "text-green-500" },
              { title: "Pending Fittings", value: pendingApptsCount, icon: FaCalendarCheck, color: "text-blue-400" }
            ].map((stat, i) => (
              <div key={i} className="bg-[#0a0a0a] p-6 rounded-2xl border border-white/5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                  <stat.icon size={20} className={stat.color} />
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-0.5">{stat.title}</p>
                  <p className="text-2xl font-bold font-serif">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Table / Tab Content */}
          <div className="bg-[#0a0a0a] rounded-2xl border border-white/5 overflow-hidden">
            <AnimatePresence mode="wait">
              {activeTab === 'orders' ? (
                <motion.div
                  key="orders-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-6"
                >
                  <h2 className="text-xl font-serif text-gold-500 mb-6">Your Assigned Orders</h2>
                  
                  {myOrders.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-white/10 rounded-xl text-gray-500">
                      No custom orders assigned to you yet.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-white/5 border-b border-white/10">
                          <tr>
                            <th className="px-6 py-4 font-medium">Order ID</th>
                            <th className="px-6 py-4 font-medium">Customer</th>
                            <th className="px-6 py-4 font-medium">Items</th>
                            <th className="px-6 py-4 font-medium">Total</th>
                            <th className="px-6 py-4 font-medium text-center">Status</th>
                            <th className="px-6 py-4 font-medium text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {myOrders.map((order) => (
                            <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                              <td className="px-6 py-4 font-mono text-gold-500 font-bold">{order.id}</td>
                              <td className="px-6 py-4">
                                <p className="text-white font-medium">{order.customer}</p>
                                <p className="text-xs text-gray-500">{order.email}</p>
                              </td>
                              <td className="px-6 py-4 max-w-[200px] truncate" title={order.items}>{order.items}</td>
                              <td className="px-6 py-4 font-serif text-white">${order.total}</td>
                              <td className="px-6 py-4 text-center">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[order.status]}`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <select
                                  value={order.status}
                                  onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                                  className="bg-dark border border-white/20 text-white text-xs rounded px-2 py-1.5 focus:outline-none focus:border-gold-500 cursor-pointer"
                                >
                                  <option value="Processing">Processing</option>
                                  <option value="Shipped">Shipped</option>
                                  <option value="Delivered">Delivered</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="appointments-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-6"
                >
                  <h2 className="text-xl font-serif text-gold-500 mb-6">Your Fitting & Measurement Appointments</h2>

                  {myAppointments.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-white/10 rounded-xl text-gray-500">
                      No bespoke appointments assigned to you yet.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-white/5 border-b border-white/10">
                          <tr>
                            <th className="px-6 py-4 font-medium">Req ID</th>
                            <th className="px-6 py-4 font-medium">Customer</th>
                            <th className="px-6 py-4 font-medium">Fabric</th>
                            <th className="px-6 py-4 font-medium">Type</th>
                            <th className="px-6 py-4 font-medium text-center">Status</th>
                            <th className="px-6 py-4 font-medium text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {myAppointments.map((appt) => (
                            <tr key={appt.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                              <td className="px-6 py-4 font-mono text-gold-500 font-bold">{appt.id}</td>
                              <td className="px-6 py-4">
                                <p className="text-white font-medium">{appt.customer}</p>
                                <p className="text-xs text-gray-500">{appt.email}</p>
                              </td>
                              <td className="px-6 py-4">{appt.fabric}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-0.5 rounded text-xs ${
                                  appt.type === 'Manual Measurements'
                                    ? 'bg-purple-500/10 text-purple-400'
                                    : 'bg-orange-500/10 text-orange-400'
                                }`}>
                                  {appt.type}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${apptStatusColors[appt.status]}`}>
                                  {appt.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => setViewingAppt(appt)}
                                    className="bg-white/10 hover:bg-white/20 text-white p-1.5 rounded transition"
                                    title="View Measurements / Details"
                                  >
                                    <FaEye size={12} />
                                  </button>
                                  <select
                                    value={appt.status}
                                    onChange={(e) => handleApptStatusChange(appt.id, e.target.value)}
                                    className="bg-dark border border-white/20 text-white text-xs rounded px-2 py-1.5 focus:outline-none focus:border-gold-500 cursor-pointer"
                                  >
                                    <option value="Pending">Pending</option>
                                    <option value="Contacted">Contacted</option>
                                    <option value="Approved">Approved</option>
                                  </select>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Appointment Detail Modal */}
      <AnimatePresence>
        {viewingAppt && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingAppt(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-dark-100 border border-white/10 p-8 rounded-2xl shadow-2xl relative z-10 w-full max-w-lg"
            >
              <button 
                onClick={() => setViewingAppt(null)} 
                className="absolute top-6 right-6 text-gray-400 hover:text-white"
              >
                <FaTimes size={20} />
              </button>

              <h3 className="text-2xl font-serif text-gold-500 mb-6">Request {viewingAppt.id}</h3>

              <div className="space-y-6 text-left">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Customer</p>
                  <p className="text-lg text-white">
                    {viewingAppt.customer}{' '}
                    <span className="text-sm text-gray-400">({viewingAppt.email})</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-dark-200 p-4 rounded-lg border border-white/5">
                    <p className="text-xs text-gray-500 mb-1">Fabric Choice</p>
                    <p className="text-white">{viewingAppt.fabric}</p>
                  </div>
                  <div className="bg-dark-200 p-4 rounded-lg border border-white/5">
                    <p className="text-xs text-gray-500 mb-1">Request Type</p>
                    <p className="text-white">{viewingAppt.type}</p>
                  </div>
                </div>

                {viewingAppt.type === 'In-Store Appointment' ? (
                  <div className="bg-dark-200 p-5 rounded-lg border border-gold-500/20">
                    <h4 className="text-gold-500 font-serif mb-3 flex items-center gap-2">
                      <FaCalendarCheck size={14} /> Fitting Details
                    </h4>
                    <p className="text-gray-300"><strong className="text-white">Date:</strong> {viewingAppt.date}</p>
                    <p className="text-gray-300 mt-2"><strong className="text-white">Time:</strong> {viewingAppt.time}</p>
                  </div>
                ) : (
                  <div className="bg-dark-200 p-5 rounded-lg border border-gold-500/20">
                    <h4 className="text-gold-500 font-serif mb-3 flex items-center gap-2">
                      <FaRulerCombined size={14} /> Manual Measurements
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <p className="text-gray-300"><strong className="text-white">Chest:</strong> {viewingAppt.details?.chest}"</p>
                      <p className="text-gray-300"><strong className="text-white">Waist:</strong> {viewingAppt.details?.waist}"</p>
                      <p className="text-gray-300"><strong className="text-white">Shoulders:</strong> {viewingAppt.details?.shoulders}"</p>
                      <p className="text-gray-300"><strong className="text-white">Sleeve:</strong> {viewingAppt.details?.sleeve}"</p>
                    </div>
                    {viewingAppt.details?.notes && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <p className="text-xs text-gray-500 mb-1">Notes</p>
                        <p className="text-gray-300 text-sm italic">"{viewingAppt.details.notes}"</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <a 
                    href={`mailto:${viewingAppt.email}`}
                    className="flex-1 btn-primary text-center py-2 text-sm flex items-center justify-center gap-2"
                  >
                    <FaEnvelope size={14} /> Email Client
                  </a>
                  <button 
                    onClick={() => setViewingAppt(null)} 
                    className="flex-1 btn-outline py-2 text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default TailorDashboard;
