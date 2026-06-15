import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUserTie, FaEnvelope, FaPlus, FaEdit } from 'react-icons/fa';
import AdminModal from '../../components/admin/AdminModal';
import { useToastContext } from '../../context/ToastContext';
import userService from '../../services/userService';
import staffService from '../../services/staffService';
import { getResponseData, getResponseList } from '../../utils/apiResponse';

const emptyForm = { name: '', role: 'Master Tailor', email: '', password: '' };

const ManageStaff = () => {
  const toast = useToastContext();
  const [staff, setStaff] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editingStaff, setEditingStaff] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState(emptyForm);

  const shouldCreateTailorUser = (role) => {
    const normalized = role.toLowerCase();
    return normalized.includes('tailor') || normalized.includes('stylist') || normalized.includes('fitting');
  };

  const openAddModal = () => {
    setEditingStaff(null);
    setModalMode('add');
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (member) => {
    setEditingStaff(member);
    setModalMode('edit');
    setFormData({ ...member, password: '' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStaff(null);
    setModalMode('add');
    setFormData(emptyForm);
  };

  useEffect(() => {
    const loadStaff = async () => {
      try {
        const response = await staffService.getAllStaff();
        setStaff(getResponseList(response));
      } catch (error) {
        toast.error(error.message || 'Unable to load staff from the database.');
      } finally {
        setIsLoading(false);
      }
    };

    loadStaff();
  }, [toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || (modalMode === 'add' && !formData.password)) {
      toast.error('Name, email, and password are required for new staff members.');
      return;
    }

    setIsSaving(true);

    if (modalMode === 'edit' && editingStaff) {
      try {
        const response = await staffService.updateStaff(editingStaff._id, {
          name: formData.name,
          role: formData.role,
          status: editingStaff.status || 'Available'
        });
        const updatedStaff = getResponseData(response, editingStaff);
        setStaff((current) => current.map((member) =>
          member._id === editingStaff._id ? updatedStaff : member
        ));
        toast.success('Staff member updated successfully.');
        closeModal();
      } catch (error) {
        toast.error(error.message || 'Failed to update staff member.');
      } finally {
        setIsSaving(false);
      }
      return;
    }

    try {
      const newStaffPayload = {
        name: formData.name,
        role: formData.role,
        email: formData.email,
        status: 'Available',
        assignedReqs: 0,
        skills: ['Fitting', 'Alteration', 'Suit']
      };
      const response = await staffService.createStaff(newStaffPayload);
      const createdStaff = getResponseData(response, newStaffPayload);
      setStaff((current) => [createdStaff, ...current]);

      if (shouldCreateTailorUser(formData.role)) {
        try {
          await userService.createAdminUser({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: 'tailor'
          });
          toast.success('Tailor created and login account generated successfully.');
        } catch (userError) {
          toast.error(userError.message || 'Tailor user creation failed. Removing staff entry.');
          await staffService.deleteStaff(createdStaff._id);
          setStaff((current) => current.filter((member) => member._id !== createdStaff._id));
        }
      } else {
        toast.success('Staff member created successfully.');
      }

      closeModal();
    } catch (error) {
      toast.error(error.message || 'Failed to create staff member.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await staffService.updateStaff(id, { status: newStatus });
      const updatedStaff = getResponseData(response, { _id: id, status: newStatus });
      setStaff((current) => current.map((member) =>
        member._id === id ? updatedStaff : member
      ));
      toast.success('Staff status updated.');
    } catch (error) {
      toast.error(error.message || 'Unable to update staff status.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Staff & Tailors</h1>
          <p className="text-gray-400 text-sm">Manage your in-store staff, master tailors, and appointment assignments.</p>
        </div>
        <button
          onClick={openAddModal}
          className="btn-primary flex items-center gap-2 py-2 px-4 text-sm"
        >
          <FaPlus /> Add Staff
        </button>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-[#0a0a0a] p-10 text-center text-gray-400">
          Loading staff from the database...
        </div>
      ) : staff.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-[#0a0a0a] p-10 text-center text-gray-400">
          <p className="text-sm mb-3">No staff records yet. Add a tailor or staff member to start managing assignments and logins.</p>
          <button onClick={openAddModal} className="btn-primary py-2 px-4 text-sm">Create First Staff</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map((member, i) => (
            <motion.div
              key={member._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 hover:border-gold-500/30 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-14 h-14 rounded-full bg-dark-200 border border-white/10 flex items-center justify-center">
                  <FaUserTie size={24} className="text-gray-400" />
                </div>
                <select
                  value={member.status}
                  onChange={(e) => handleStatusChange(member._id, e.target.value)}
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

              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Active Assignments</span>
                  <span className="font-mono text-white bg-dark-200 px-2 py-1 rounded">{member.assignedReqs ?? 0}</span>
                </div>
                <button
                  onClick={() => openEditModal(member)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-sm text-gray-300 hover:border-gold-500 hover:text-white transition"
                >
                  <FaEdit size={14} /> Edit Staff
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AdminModal isOpen={isModalOpen} onClose={closeModal} title={modalMode === 'edit' ? 'Edit Staff Member' : 'Add Staff Member'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              placeholder="e.g. John Doe"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Job Role</label>
              <select
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value })}
                className="input-field"
              >
                <option value="Master Tailor">Master Tailor</option>
                <option value="Fitting Specialist">Fitting Specialist</option>
                <option value="Senior Stylist">Senior Stylist</option>
                <option value="Store Manager">Store Manager</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Work Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
                placeholder="john@alfamale.com"
                disabled={modalMode === 'edit'}
              />
            </div>
          </div>
          {modalMode === 'add' ? (
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                className="input-field"
                placeholder="Create a login password"
              />
              <p className="text-xs text-gray-500 mt-2">Enter a password for the new tailor login. Tailor or stylist roles will get a login account automatically.</p>
            </div>
          ) : (
            <div className="text-xs text-gray-500">Email cannot be updated here. To change login credentials, update the user record from the backend admin panel.</div>
          )}
          <div className="pt-4 flex gap-3">
            <button type="submit" disabled={isSaving} className="flex-1 btn-primary py-2 text-sm">
              {isSaving ? 'Saving...' : modalMode === 'edit' ? 'Save Changes' : 'Add to Team'}
            </button>
          </div>
        </form>
      </AdminModal>

    </div>
  );
};

export default ManageStaff;
