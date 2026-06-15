import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaBan } from 'react-icons/fa';
import { useToastContext } from '../../context/ToastContext';
import userService from '../../services/userService';
import { getResponseList } from '../../utils/apiResponse';

const ManageCustomers = () => {
  const toast = useToastContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'customer' });

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await userService.getAdminUsers();
      setUsers(getResponseList(response));
    } catch (error) {
      toast.error(error.message || 'Unable to load users');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadUsers();
  }, [loadUsers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Name, email, and password are required');
      return;
    }

    setSaving(true);
    try {
      await userService.createAdminUser(formData);
      toast.success('User created successfully');
      setFormData({ name: '', email: '', password: '', role: 'customer' });
      loadUsers();
    } catch (error) {
      toast.error(error.message || 'Failed to create user');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">User Management</h1>
          <p className="text-gray-400 text-sm">Create admin, tailor, or customer accounts and review registered users.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] mb-8">
        <div className="bg-[#0a0a0a] rounded-2xl border border-white/5 p-6">
          <h2 className="text-xl text-white font-semibold mb-4">Create a New User</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field w-full"
                placeholder="Full name"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field w-full"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Password</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field w-full"
                placeholder="Password"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input-field w-full"
              >
                <option value="customer">Customer</option>
                <option value="tailor">Tailor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              className="btn-primary w-full py-3"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Create User'}
            </button>
          </form>
        </div>

        <div className="bg-[#0a0a0a] rounded-2xl border border-white/5 p-6">
          <h2 className="text-xl text-white font-semibold mb-4">Active Users</h2>
          <div className="text-sm text-gray-400 mb-4">
            {loading ? 'Loading users...' : `${users.length} registered user${users.length === 1 ? '' : 's'}`}
          </div>
          <div className="space-y-3">
            {users.slice(0, 5).map((user) => (
              <div key={user._id} className="rounded-2xl border border-white/10 p-4 bg-white/5">
                <div className="flex justify-between items-center gap-3">
                  <div>
                    <p className="text-white font-semibold">{user.name}</p>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                  </div>
                  <span className="text-xs uppercase tracking-[0.15em] text-gold-400">{user.role}</span>
                </div>
                <div className="mt-3 text-gray-400 text-xs">
                  Created {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
            {users.length === 0 && !loading && (
              <div className="rounded-2xl border border-white/10 p-4 bg-white/5 text-gray-400">
                No users found yet.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-[#0a0a0a] rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="text-white font-medium">{user.name}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{user.email}</td>
                  <td className="px-6 py-4 text-gold-300 uppercase">{user.role}</td>
                  <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-400 hover:text-blue-300 transition" title="Email User">
                      <FaEnvelope size={16} />
                    </button>
                    <button className="ml-3 text-red-400 hover:text-red-300 transition" title="Suspend User">
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
