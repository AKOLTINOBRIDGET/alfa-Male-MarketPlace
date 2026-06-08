import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserTie, FaCheckCircle, FaStar, FaBriefcase } from 'react-icons/fa';
import AdminModal from '../../components/admin/AdminModal';
import { initialStaff, rankTailorsForOrder } from '../../data/staffData';

const initialOrders = [
  {
    id: 'ORD-009',
    customer: 'James Carter',
    email: 'james@example.com',
    date: '2026-05-15',
    total: 450,
    status: 'Processing',
    items: 'Classic Suit 1, Leather Belt',
    assignedTailor: null,
  },
  {
    id: 'ORD-008',
    customer: 'Michael Doe',
    email: 'mike@example.com',
    date: '2026-05-14',
    total: 120,
    status: 'Shipped',
    items: 'Office Shoe 2',
    assignedTailor: null,
  },
  {
    id: 'ORD-007',
    customer: 'Sarah Connor',
    email: 'sarah@example.com',
    date: '2026-05-12',
    total: 850,
    status: 'Delivered',
    items: 'Bespoke Suit 4, Luxury Watch 11',
    assignedTailor: null,
  },
  {
    id: 'ORD-010',
    customer: 'David Osei',
    email: 'david@example.com',
    date: '2026-05-16',
    total: 310,
    status: 'Processing',
    items: 'Bespoke Jacket, Trousers',
    assignedTailor: null,
  },
];

const statusColors = {
  Processing: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
  Shipped:    'text-blue-400  bg-blue-400/10  border-blue-400/30',
  Delivered:  'text-green-500 bg-green-500/10 border-green-500/30',
};

const availabilityColors = {
  Available:      { dot: 'bg-green-500',  label: 'text-green-400',  badge: 'border-green-500/30 bg-green-500/10' },
  'In Appointment': { dot: 'bg-blue-400',   label: 'text-blue-400',   badge: 'border-blue-400/30 bg-blue-400/10' },
  'Off Duty':     { dot: 'bg-gray-500',   label: 'text-gray-400',   badge: 'border-gray-500/30 bg-gray-500/10' },
};

// ─────────────────────────────────────────────
// Assign Tailor Modal
// ─────────────────────────────────────────────
const AssignTailorModal = ({ order, tailors, onAssign, onClose }) => {
  const [selected, setSelected]   = useState(order.assignedTailor?.id ?? null);
  const [confirmed, setConfirmed] = useState(false);

  const ranked = rankTailorsForOrder(tailors, order.items);

  const handleConfirm = () => {
    if (!selected) return;
    const tailor = tailors.find(t => t.id === selected);
    onAssign(order.id, tailor);
    setConfirmed(true);
    setTimeout(onClose, 1200);
  };

  return (
    <AdminModal isOpen onClose={onClose} title="Assign Tailor" maxWidth="max-w-xl">
      {confirmed ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-3 py-8"
        >
          <FaCheckCircle size={48} className="text-green-500" />
          <p className="text-white text-lg font-serif">Tailor Assigned!</p>
          <p className="text-gray-400 text-sm">
            {tailors.find(t => t.id === selected)?.name} has been assigned to {order.id}.
          </p>
        </motion.div>
      ) : (
        <>
          {/* Order Summary */}
          <div className="mb-5 p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Order</p>
            <p className="text-white font-mono font-bold">{order.id}</p>
            <p className="text-gray-300 text-sm mt-1 truncate" title={order.items}>
              {order.items}
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
            <span className="flex items-center gap-1"><FaStar className="text-gold-500" /> Skill match</span>
            <span className="flex items-center gap-1"><FaBriefcase className="text-gray-400" /> Current load</span>
          </div>

          {/* Tailor List */}
          <div className="space-y-3 max-h-[340px] overflow-y-auto custom-scrollbar pr-1">
            {ranked.map((tailor, i) => {
              const av = availabilityColors[tailor.status] ?? availabilityColors['Off Duty'];
              const isSelected = selected === tailor.id;
              const skillScore = tailor.skills.filter(s =>
                order.items.toLowerCase().includes(s.toLowerCase())
              ).length;
              const matchedSkills = tailor.skills.filter(s =>
                order.items.toLowerCase().includes(s.toLowerCase())
              );

              return (
                <motion.button
                  key={tailor.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelected(tailor.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                    isSelected
                      ? 'border-gold-500 bg-gold-500/10 shadow-[0_0_12px_rgba(var(--color-gold-500),0.2)]'
                      : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8'
                  } ${tailor.status !== 'Available' ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    {/* Left: avatar + name */}
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-dark-200 border border-white/10 flex items-center justify-center flex-shrink-0">
                          <FaUserTie size={18} className="text-gray-400" />
                        </div>
                        <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-dark-100 ${av.dot}`} />
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{tailor.name}</p>
                        <p className="text-gold-500 text-xs">{tailor.role}</p>
                      </div>
                    </div>

                    {/* Right: stats */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {/* Skill match badge */}
                      {skillScore > 0 && (
                        <span className="flex items-center gap-1 text-xs text-gold-500 bg-gold-500/10 border border-gold-500/30 px-2 py-0.5 rounded-full">
                          <FaStar size={10} />
                          {skillScore} match
                        </span>
                      )}
                      {/* Workload */}
                      <span className="flex items-center gap-1 text-xs text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                        <FaBriefcase size={10} />
                        {tailor.assignedReqs}
                      </span>
                      {/* Availability */}
                      <span className={`text-xs border px-2 py-0.5 rounded-full ${av.badge} ${av.label}`}>
                        {tailor.status}
                      </span>
                    </div>
                  </div>

                  {/* Matched skills chips */}
                  {matchedSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2 ml-13">
                      {matchedSkills.map(s => (
                        <span key={s} className="text-[10px] text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-5 pt-5 border-t border-white/10">
            <button
              onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-white/20 text-gray-300 text-sm hover:border-white/40 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selected}
              className="flex-1 btn-primary py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Confirm Assignment
            </button>
          </div>
        </>
      )}
    </AdminModal>
  );
};

// ─────────────────────────────────────────────
// Main ManageOrders
// ─────────────────────────────────────────────
const ManageOrders = () => {
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('alfa_orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });
  const [tailors, setTailors] = useState(() => {
    const saved = localStorage.getItem('alfa_staff');
    return saved ? JSON.parse(saved) : initialStaff;
  });
  const [assigningOrder, setAssigningOrder] = useState(null);

  const handleStatusChange = (orderId, newStatus) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    setOrders(updated);
    localStorage.setItem('alfa_orders', JSON.stringify(updated));
  };

  const handleAssignTailor = (orderId, tailor) => {
    // Update order with assigned tailor
    const updatedOrders = orders.map(o =>
      o.id === orderId ? { ...o, assignedTailor: tailor } : o
    );
    setOrders(updatedOrders);
    localStorage.setItem('alfa_orders', JSON.stringify(updatedOrders));

    // Increment tailor workload
    const updatedTailors = tailors.map(t =>
      t.id === tailor.id ? { ...t, assignedReqs: t.assignedReqs + 1 } : t
    );
    setTailors(updatedTailors);
    localStorage.setItem('alfa_staff', JSON.stringify(updatedTailors));
  };

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Manage Orders</h1>
          <p className="text-gray-400 text-sm">View, update status, and assign tailors to customer orders.</p>
        </div>
      </div>

      <div className="bg-[#0a0a0a] rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Items</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium text-center">Tailor</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 font-mono text-gold-500 font-bold">{order.id}</td>
                  <td className="px-6 py-4">
                    <p className="text-white font-medium">{order.customer}</p>
                    <p className="text-xs text-gray-500">{order.email}</p>
                  </td>
                  <td className="px-6 py-4">{order.date}</td>
                  <td className="px-6 py-4 max-w-[180px] truncate" title={order.items}>{order.items}</td>
                  <td className="px-6 py-4 font-serif text-white">${order.total}</td>

                  {/* Assigned Tailor */}
                  <td className="px-6 py-4 text-center">
                    {order.assignedTailor ? (
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-white text-xs font-medium">{order.assignedTailor.name}</span>
                        <span className="text-gold-500 text-[10px]">{order.assignedTailor.role}</span>
                      </div>
                    ) : (
                      <span className="text-gray-600 text-xs italic">Unassigned</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="bg-dark border border-white/20 text-white text-xs rounded px-2 py-1.5 focus:outline-none focus:border-gold-500"
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                      <button
                        onClick={() => setAssigningOrder(order)}
                        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 whitespace-nowrap ${
                          order.assignedTailor
                            ? 'border-gold-500/40 text-gold-500 bg-gold-500/10 hover:bg-gold-500/20'
                            : 'border-white/20 text-gray-300 bg-white/5 hover:border-gold-500/50 hover:text-gold-400'
                        }`}
                      >
                        <FaUserTie size={10} />
                        {order.assignedTailor ? 'Reassign' : 'Assign'}
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Tailor Modal */}
      <AnimatePresence>
        {assigningOrder && (
          <AssignTailorModal
            order={assigningOrder}
            tailors={tailors}
            onAssign={handleAssignTailor}
            onClose={() => setAssigningOrder(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageOrders;
