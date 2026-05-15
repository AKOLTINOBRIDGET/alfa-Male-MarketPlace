import { useState } from 'react';
import { motion } from 'framer-motion';

const initialOrders = [
  { id: 'ORD-009', customer: 'James Carter', email: 'james@example.com', date: '2026-05-15', total: 450, status: 'Processing', items: 'Classic Suit 1, Leather Belt' },
  { id: 'ORD-008', customer: 'Michael Doe', email: 'mike@example.com', date: '2026-05-14', total: 120, status: 'Shipped', items: 'Office Shoe 2' },
  { id: 'ORD-007', customer: 'Sarah Connor', email: 'sarah@example.com', date: '2026-05-12', total: 850, status: 'Delivered', items: 'Luxury Watch 11, Classic Suit 4' },
];

const statusColors = {
  Processing: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
  Shipped: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  Delivered: 'text-green-500 bg-green-500/10 border-green-500/30',
};

const ManageOrders = () => {
  const [orders, setOrders] = useState(initialOrders);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Manage Orders</h1>
          <p className="text-gray-400 text-sm">View and update customer e-commerce orders.</p>
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
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-center">Action</th>
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
                  <td className="px-6 py-4 max-w-[200px] truncate" title={order.items}>{order.items}</td>
                  <td className="px-6 py-4 font-serif text-white">${order.total}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <select 
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="bg-dark border border-white/20 text-white text-xs rounded px-2 py-1.5 focus:outline-none focus:border-gold-500"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageOrders;
