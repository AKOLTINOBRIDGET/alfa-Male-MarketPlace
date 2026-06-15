import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserTie, FaCheckCircle, FaStar, FaBriefcase } from 'react-icons/fa';
import AdminModal from '../../components/admin/AdminModal';
import { rankTailorsForOrder } from '../../data/staffData';
import orderService from '../../services/orderService';
import staffService from '../../services/staffService';
import { useToastContext } from '../../context/ToastContext';
import { getResponseList } from '../../utils/apiResponse';

const statusColors = {
  Pending: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
  Confirmed: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  Processing: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
  'Ready for Fitting': 'text-fuchsia-400 bg-fuchsia-400/10 border-fuchsia-400/30',
  Shipped: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30',
  Delivered: 'text-green-500 bg-green-500/10 border-green-500/30',
  Completed: 'text-teal-400 bg-teal-400/10 border-teal-400/30',
  Cancelled: 'text-red-500 bg-red-500/10 border-red-500/30',
  Refunded: 'text-rose-500 bg-rose-500/10 border-rose-500/30'
};

const orderStatusOptions = [
  'Pending', 'Confirmed', 'Processing', 'Ready for Fitting', 'Shipped', 'Delivered', 'Completed', 'Cancelled', 'Refunded'
];

const availabilityColors = {
  Available:      { dot: 'bg-green-500',  label: 'text-green-400',  badge: 'border-green-500/30 bg-green-500/10' },
  'In Appointment': { dot: 'bg-blue-400',   label: 'text-blue-400',   badge: 'border-blue-400/30 bg-blue-400/10' },
  'Off Duty':     { dot: 'bg-gray-500',   label: 'text-gray-400',   badge: 'border-gray-500/30 bg-gray-500/10' },
};

// ─────────────────────────────────────────────
// Assign Tailor Modal
// ─────────────────────────────────────────────
const AssignTailorModal = ({ order, tailors, onAssign, onClose }) => {
  const [selected, setSelected] = useState(order.assignedTailor?._id ?? null);
  const [confirmed, setConfirmed] = useState(false);
  const itemsText = order.items?.map((item) => item.name).join(' ') || '';
  const ranked = rankTailorsForOrder(tailors, itemsText);

  const handleConfirm = () => {
    if (!selected) return;
    const tailor = tailors.find((t) => t._id === selected);
    onAssign(order._id, tailor);
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
            {tailors.find((t) => t._id === selected)?.name} has been assigned to {order.orderNumber || order._id.slice(-6)}.
          </p>
        </motion.div>
      ) : (
        <>
          {/* Order Summary */}
          <div className="mb-5 p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Order</p>
            <p className="text-white font-mono font-bold">{order.orderNumber || order._id.slice(-6)}</p>
            <p className="text-gray-300 text-sm mt-1 truncate" title={itemsText}>
              {itemsText}
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
              const isSelected = selected === tailor._id;
              const skillScore = tailor.skills.filter((s) =>
                itemsText.toLowerCase().includes(s.toLowerCase())
              ).length;
              const matchedSkills = tailor.skills.filter((s) =>
                itemsText.toLowerCase().includes(s.toLowerCase())
              );

              return (
                <motion.button
                  key={tailor._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelected(tailor._id)}
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
  const toast = useToastContext();
  const [orders, setOrders] = useState([]);
  const [tailors, setTailors] = useState([]);
  const [assigningOrder, setAssigningOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [ordersResponse, tailorsResponse] = await Promise.all([
          orderService.getOrders(),
          staffService.getAllStaff()
        ]);
        setOrders(getResponseList(ordersResponse));
        setTailors(getResponseList(tailorsResponse));
      } catch (error) {
        toast.error(error.message || 'Unable to load orders and tailors from the database.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus, 'Updated by admin');
      setOrders((current) => current.map((o) =>
        o._id === orderId ? { ...o, status: newStatus } : o
      ));
      toast.success('Order status updated.');
    } catch (error) {
      toast.error(error.message || 'Failed to update order status.');
    }
  };

  const handleAssignTailor = async (orderId, tailor) => {
    try {
      await orderService.assignTailor(orderId, tailor._id);
      setOrders((current) => current.map((o) =>
        o._id === orderId ? { ...o, assignedTailor: tailor } : o
      ));
      setTailors((current) => current.map((t) =>
        t._id === tailor._id ? { ...t, assignedReqs: (t.assignedReqs ?? 0) + 1 } : t
      ));
      toast.success('Tailor assigned successfully.');
    } catch (error) {
      toast.error(error.message || 'Failed to assign tailor.');
    }
  };

  const formatDate = (value) => value ? new Date(value).toLocaleDateString() : '-';
  const getOrderTotal = (order) => order.pricing?.total ?? order.total ?? 0;
  const getItemsText = (order) => order.items?.map((item) => `${item.name} x${item.quantity}`).join(', ') || 'No items';

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-[#0a0a0a] p-10 text-center text-gray-400">
        Loading orders from the database...
      </div>
    );
  }

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
                  key={order._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 font-mono text-gold-500 font-bold">{order.orderNumber || order._id.slice(-6)}</td>
                  <td className="px-6 py-4">
                    <p className="text-white font-medium">{order.customer?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">{order.customer?.email || ''}</p>
                  </td>
                  <td className="px-6 py-4">{formatDate(order.createdAt)}</td>
                  <td className="px-6 py-4 max-w-[180px] truncate" title={getItemsText(order)}>{getItemsText(order)}</td>
                  <td className="px-6 py-4 font-serif text-white">${getOrderTotal(order)}</td>

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
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="bg-dark border border-white/20 text-white text-xs rounded px-2 py-1.5 focus:outline-none focus:border-gold-500"
                      >
                        {orderStatusOptions.map((statusValue) => (
                          <option key={statusValue} value={statusValue}>{statusValue}</option>
                        ))}
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
