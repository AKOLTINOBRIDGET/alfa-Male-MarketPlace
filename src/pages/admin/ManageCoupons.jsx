import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaTrash } from 'react-icons/fa';
import AdminModal from '../../components/admin/AdminModal';

const initialCoupons = [
  { id: 1, code: 'SUMMER20', type: 'Percentage', value: 20, uses: 145, maxUses: null, expiry: '2026-08-31', status: 'Active' },
  { id: 2, code: 'WELCOME50', type: 'Fixed Amount', value: 50, uses: 32, maxUses: 100, expiry: '2026-12-31', status: 'Active' },
  { id: 3, code: 'FLASHX', type: 'Percentage', value: 30, uses: 500, maxUses: 500, expiry: '2026-05-01', status: 'Expired' },
];

const ManageCoupons = () => {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({ code: '', type: 'Percentage', value: '', maxUses: '', expiry: '' });

  const handleDelete = (id) => {
    setCoupons(coupons.filter(c => c.id !== id));
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newCoupon = {
      id: Date.now(),
      code: formData.code.toUpperCase(),
      type: formData.type,
      value: parseInt(formData.value),
      uses: 0,
      maxUses: formData.maxUses ? parseInt(formData.maxUses) : null,
      expiry: formData.expiry,
      status: new Date(formData.expiry) > new Date() ? 'Active' : 'Expired'
    };
    setCoupons([newCoupon, ...coupons]);
    setIsAddModalOpen(false);
    setFormData({ code: '', type: 'Percentage', value: '', maxUses: '', expiry: '' });
  };

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Coupons & Promotions</h1>
          <p className="text-gray-400 text-sm">Create and manage discount codes for your store.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary flex items-center gap-2 py-2 px-4 text-sm"
        >
          <FaPlus /> New Coupon
        </button>
      </div>

      <div className="bg-[#0a0a0a] rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-medium">Promo Code</th>
                <th className="px-6 py-4 font-medium">Discount</th>
                <th className="px-6 py-4 font-medium">Usage</th>
                <th className="px-6 py-4 font-medium">Expiry Date</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon, i) => (
                <motion.tr 
                  key={coupon.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="font-mono text-gold-500 font-bold bg-gold-500/10 px-2 py-1 rounded border border-gold-500/20 tracking-wider">
                      {coupon.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-white">
                    {coupon.type === 'Percentage' ? `${coupon.value}% OFF` : `$${coupon.value} OFF`}
                  </td>
                  <td className="px-6 py-4">
                    {coupon.uses} {coupon.maxUses ? `/ ${coupon.maxUses}` : '(Unlimited)'}
                  </td>
                  <td className="px-6 py-4 text-gray-400">{coupon.expiry}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      coupon.status === 'Active' ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'
                    }`}>
                      {coupon.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => handleDelete(coupon.id)}
                      className="text-red-400 hover:text-red-300 transition" 
                      title="Delete Coupon"
                    >
                      <FaTrash size={14} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Coupon Modal */}
      <AdminModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Create New Coupon">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Promo Code</label>
            <input type="text" required value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} className="input-field font-mono uppercase" placeholder="e.g. WINTER50" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Discount Type</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="input-field">
                <option value="Percentage">Percentage (%)</option>
                <option value="Fixed Amount">Fixed Amount ($)</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Value</label>
              <input type="number" required min="1" value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} className="input-field" placeholder={formData.type === 'Percentage' ? '20' : '50'} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Max Uses (Optional)</label>
              <input type="number" min="1" value={formData.maxUses} onChange={e => setFormData({...formData, maxUses: e.target.value})} className="input-field" placeholder="Leave blank for unlimited" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Expiry Date</label>
              <input type="date" required value={formData.expiry} onChange={e => setFormData({...formData, expiry: e.target.value})} className="input-field" />
            </div>
          </div>
          <div className="pt-4 flex gap-3">
            <button type="submit" className="flex-1 btn-primary py-2 text-sm">Generate Coupon</button>
          </div>
        </form>
      </AdminModal>

    </div>
  );
};

export default ManageCoupons;
