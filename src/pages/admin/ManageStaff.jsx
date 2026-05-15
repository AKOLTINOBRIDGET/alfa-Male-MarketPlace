import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUserTie, FaEnvelope, FaPlus } from 'react-icons/fa';
import AdminModal from '../../components/admin/AdminModal';

const initialStaff = [
  { id: 'STF-01', name: 'Antonio Rossi', role: 'Master Tailor', email: 'antonio@alfamale.com', status: 'Available', assignedReqs: 2 },
  { id: 'STF-02', name: 'Elena Croft', role: 'Senior Stylist', email: 'elena@alfamale.com', status: 'In Appointment', assignedReqs: 4 },
  { id: 'STF-03', name: 'Marcus Chen', role: 'Fitting Specialist', email: 'marcus@alfamale.com', status: 'Off Duty', assignedReqs: 0 },
];

const ManageStaff = () => {
  const [staff, setStaff] = useState(initialStaff);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({ name: '', role: 'Master Tailor', email: '' });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newStaff = {
      id: `STF-0${staff.length + 1}`,
      ...formData,
      status: 'Available',
      assignedReqs: 0
    };
    setStaff([...staff, newStaff]);
    setIsAddModalOpen(false);
    setFormData({ name: '', role: 'Master Tailor', email: '' });
  };

  const handleStatusChange = (id, newStatus) => {
    setStaff(staff.map(member => 
      member.id === id ? { ...member, status: newStatus } : member
    ));
  };

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Staff & Tailors</h1>
          <p className="text-gray-400 text-sm">Manage your in-store staff, master tailors, and appointment assignments.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary flex items-center gap-2 py-2 px-4 text-sm"
        >
          <FaPlus /> Add Staff
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map((member, i) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 hover:border-gold-500/30 transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-14 h-14 rounded-full bg-dark-200 border border-white/10 flex items-center justify-center">
                <FaUserTie size={24} className="text-gray-400" />
              </div>
              <select 
                value={member.status}
                onChange={(e) => handleStatusChange(member.id, e.target.value)}
                className={`px-2 py-1 rounded text-xs font-medium border appearance-none cursor-pointer focus:outline-none ${
                  member.status === 'Available' ? 'text-green-500 bg-green-500/10 border-green-500/30' :
                  member.status === 'In Appointment' ? 'text-blue-400 bg-blue-400/10 border-blue-400/30' :
                  'text-gray-400 bg-gray-500/10 border-gray-500/30'
                }`}
              >
                <option value="Available" className="bg-dark text-white">Available</option>
                <option value="In Appointment" className="bg-dark text-white">In Appointment</option>
                <option value="Off Duty" className="bg-dark text-white">Off Duty</option>
              </select>
            </div>
            
            <h3 className="text-xl font-serif text-white mb-1">{member.name}</h3>
            <p className="text-gold-500 text-sm mb-4">{member.role}</p>
            
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-6">
              <FaEnvelope size={14} />
              <a href={`mailto:${member.email}`} className="hover:text-white transition">{member.email}</a>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-between items-center">
              <span className="text-sm text-gray-500">Active Assignments</span>
              <span className="font-mono text-white bg-dark-200 px-2 py-1 rounded">{member.assignedReqs}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Staff Modal */}
      <AdminModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Staff Member">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Full Name</label>
            <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-field" placeholder="e.g. John Doe" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Job Role</label>
              <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="input-field">
                <option value="Master Tailor">Master Tailor</option>
                <option value="Fitting Specialist">Fitting Specialist</option>
                <option value="Senior Stylist">Senior Stylist</option>
                <option value="Store Manager">Store Manager</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Work Email</label>
              <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="input-field" placeholder="john@alfamale.com" />
            </div>
          </div>
          <div className="pt-4 flex gap-3">
            <button type="submit" className="flex-1 btn-primary py-2 text-sm">Add to Team</button>
          </div>
        </form>
      </AdminModal>

    </div>
  );
};

export default ManageStaff;
