import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaBan } from 'react-icons/fa';

const initialCustomers = [
  { id: 'CUS-101', name: 'James Carter', email: 'james@example.com', joinDate: '2025-11-20', totalOrders: 5, lifetimeValue: 2450, status: 'Active' },
  { id: 'CUS-102', name: 'Michael Doe', email: 'mike@example.com', joinDate: '2026-01-15', totalOrders: 1, lifetimeValue: 120, status: 'Active' },
  { id: 'CUS-103', name: 'Sarah Connor', email: 'sarah@example.com', joinDate: '2025-08-05', totalOrders: 12, lifetimeValue: 8400, status: 'VIP' },
  { id: 'CUS-104', name: 'Bruce Wayne', email: 'bruce@example.com', joinDate: '2026-03-10', totalOrders: 2, lifetimeValue: 1500, status: 'Active' },
  { id: 'CUS-105', name: 'Arthur Fleck', email: 'arthur@example.com', joinDate: '2024-10-31', totalOrders: 0, lifetimeValue: 0, status: 'Suspended' },
];

const ManageCustomers = () => {
  const [customers] = useState(initialCustomers);

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Customer CRM</h1>
          <p className="text-gray-400 text-sm">View registered users and their lifetime value.</p>
        </div>
      </div>

      <div className="bg-[#0a0a0a] rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium">Orders</th>
                <th className="px-6 py-4 font-medium">Lifetime Value</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((cus, i) => (
                <motion.tr 
                  key={cus.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="text-white font-medium">{cus.name}</p>
                    <p className="text-xs text-gray-500">{cus.email}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{cus.joinDate}</td>
                  <td className="px-6 py-4">{cus.totalOrders}</td>
                  <td className="px-6 py-4 text-gold-500 font-serif">${cus.lifetimeValue.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${
                      cus.status === 'VIP' ? 'text-purple-400 bg-purple-400/10 border-purple-400/30' :
                      cus.status === 'Active' ? 'text-green-500 bg-green-500/10 border-green-500/30' :
                      'text-red-500 bg-red-500/10 border-red-500/30'
                    }`}>
                      {cus.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center space-x-3">
                    <button className="text-blue-400 hover:text-blue-300 transition" title="Email Customer">
                      <FaEnvelope size={16} />
                    </button>
                    <button className="text-red-400 hover:text-red-300 transition" title="Suspend Account">
                      <FaBan size={16} />
                    </button>
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

export default ManageCustomers;
