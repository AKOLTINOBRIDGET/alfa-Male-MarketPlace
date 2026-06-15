import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaTrash } from 'react-icons/fa';
import AdminModal from '../../components/admin/AdminModal';
import couponService from '../../services/couponService';
import { useToastContext } from '../../context/ToastContext';
import { getResponseData, getResponseList } from '../../utils/apiResponse';

const ManageCoupons = () => {
  const toast = useToastContext();
  const [coupons, setCoupons] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({ code: '', value: '', maxUses: '', expiry: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCoupons = async () => {
      try {
        const response = await couponService.getCoupons();
        setCoupons(getResponseList(response));
      } catch (error) {
        toast.error(error.message || 'Unable to load coupons from the database.');
      } finally {
        setIsLoading(false);
      }
    };

    loadCoupons();
  }, [toast]);

  const handleDelete = async (id) => {
    try {
      await couponService.deleteCoupon(id);
      setCoupons((current) => current.filter((coupon) => coupon._id !== id));
      toast.success('Coupon deleted.');
    } catch (error) {
      toast.error(error.message || 'Failed to delete coupon.');
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        code: formData.code.toUpperCase(),
        discountPercentage: parseInt(formData.value, 10),
        expiryDate: formData.expiry,
        usageLimit: formData.maxUses ? parseInt(formData.maxUses, 10) : 100
      };
      const response = await couponService.createCoupon(payload);
      const newCoupon = getResponseData(response, payload);
      setCoupons((current) => [newCoupon, ...current]);
      setIsAddModalOpen(false);
      setFormData({ code: '', value: '', maxUses: '', expiry: '' });
      toast.success('Coupon created successfully.');
    } catch (error) {
      toast.error(error.message || 'Failed to create coupon.');
    }
  };

  const formatStatus = (coupon) => {
    const isExpired = new Date(coupon.expiryDate) <= new Date();
    return coupon.isActive && !isExpired ? 'Active' : 'Expired';
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-[#0a0a0a] p-10 text-center text-gray-400">
        Loading coupons from the database...
      </div>
    );
  }

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
                  key={coupon._id}
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
                  <td className="px-6 py-4 font-medium text-white">{coupon.discountPercentage}% OFF</td>
                  <td className="px-6 py-4">{coupon.timesUsed} / {coupon.usageLimit || 'Unlimited'}</td>
                  <td className="px-6 py-4 text-gray-400">{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      formatStatus(coupon) === 'Active' ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'
                    }`}>
                      {formatStatus(coupon)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => handleDelete(coupon._id)}
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

      <AdminModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Create New Coupon">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Promo Code</label>
            <input type="text" required value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} className="input-field font-mono uppercase" placeholder="e.g. WINTER50" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Discount Percentage</label>
              <input type="number" required min="1" max="100" value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })} className="input-field" placeholder="20" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Max Uses</label>
              <input type="number" min="1" value={formData.maxUses} onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })} className="input-field" placeholder="Leave blank for unlimited" />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Expiry Date</label>
            <input type="date" required value={formData.expiry} onChange={(e) => setFormData({ ...formData, expiry: e.target.value })} className="input-field" />
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
