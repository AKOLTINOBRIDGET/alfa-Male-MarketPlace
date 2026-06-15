import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaEye, FaTimes, FaUserTie, FaCheckCircle,
  FaStar, FaBriefcase,
} from 'react-icons/fa';
import AdminModal from '../../components/admin/AdminModal';
import { rankTailorsForOrder } from '../../data/staffData';
import appointmentService from '../../services/appointmentService';
import staffService from '../../services/staffService';
import { useToastContext } from '../../context/ToastContext';
import { getResponseList } from '../../utils/apiResponse';

const statusColors = {
  Scheduled: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
  Completed: 'text-green-500 bg-green-500/10 border-green-500/30',
  Cancelled: 'text-red-500 bg-red-500/10 border-red-500/30',
  'No Show': 'text-orange-500 bg-orange-500/10 border-orange-500/30'
};

const availabilityColors = {
  Available:        { dot: 'bg-green-500', label: 'text-green-400', badge: 'border-green-500/30 bg-green-500/10' },
  'In Appointment': { dot: 'bg-blue-400',  label: 'text-blue-400',  badge: 'border-blue-400/30 bg-blue-400/10'  },
  'Off Duty':       { dot: 'bg-gray-500',  label: 'text-gray-400',  badge: 'border-gray-500/30 bg-gray-500/10'  },
};

const appointmentStatusOptions = ['Scheduled', 'Completed', 'Cancelled', 'No Show'];

const appointmentSearchString = (appt) =>
  `${appt.serviceType || ''} ${appt.notes || ''}`;

const AssignStaffModal = ({ appointment, staffList, onAssign, onClose }) => {
  const [selected, setSelected] = useState(appointment.assignedStaff?._id ?? null);
  const [confirmed, setConfirmed] = useState(false);
  const searchStr = appointmentSearchString(appointment);
  const ranked = rankTailorsForOrder(staffList, searchStr);

  const handleConfirm = () => {
    if (!selected) return;
    const member = staffList.find((s) => s._id === selected);
    onAssign(appointment._id, member);
    setConfirmed(true);
    setTimeout(onClose, 1200);
  };

  return (
    <AdminModal isOpen onClose={onClose} title="Assign Staff Member" maxWidth="max-w-xl">
      {confirmed ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-3 py-8"
        >
          <FaCheckCircle size={48} className="text-green-500" />
          <p className="text-white text-lg font-serif">Staff Assigned!</p>
          <p className="text-gray-400 text-sm">
            {staffList.find((s) => s._id === selected)?.name} has been assigned to {appointment._id.slice(-6)}.
          </p>
        </motion.div>
      ) : (
        <>
          <div className="mb-5 p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Appointment</p>
            <p className="text-white font-mono font-bold">{appointment._id.slice(-6)}</p>
            <p className="text-gray-300 text-sm mt-1">
              <span className={`px-2 py-0.5 rounded text-xs mr-2 ${
                appointment.serviceType === 'Manual Measurements'
                  ? 'bg-purple-500/10 text-purple-400'
                  : 'bg-orange-500/10 text-orange-400'
              }`}>
                {appointment.serviceType}
              </span>
              {new Date(appointment.date).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
            <span className="flex items-center gap-1"><FaStar className="text-gold-500" /> Skill match</span>
            <span className="flex items-center gap-1"><FaBriefcase className="text-gray-400" /> Current load</span>
          </div>

          <div className="space-y-3 max-h-[340px] overflow-y-auto custom-scrollbar pr-1">
            {ranked.map((member, i) => {
              const av = availabilityColors[member.status] ?? availabilityColors['Off Duty'];
              const isSelected = selected === member._id;
              const matchedSkills = member.skills.filter((s) =>
                searchStr.toLowerCase().includes(s.toLowerCase())
              );
              const skillScore = matchedSkills.length;

              return (
                <motion.button
                  key={member._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelected(member._id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                    isSelected
                      ? 'border-gold-500 bg-gold-500/10 shadow-[0_0_12px_rgba(var(--color-gold-500),0.2)]'
                      : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8'
                  } ${member.status !== 'Available' ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-dark-200 border border-white/10 flex items-center justify-center flex-shrink-0">
                          <FaUserTie size={18} className="text-gray-400" />
                        </div>
                        <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-dark-100 ${av.dot}`} />
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{member.name}</p>
                        <p className="text-gold-500 text-xs">{member.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      {skillScore > 0 && (
                        <span className="flex items-center gap-1 text-xs text-gold-500 bg-gold-500/10 border border-gold-500/30 px-2 py-0.5 rounded-full">
                          <FaStar size={10} />
                          {skillScore} match
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-xs text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                        <FaBriefcase size={10} />
                        {member.assignedReqs}
                      </span>
                      <span className={`text-xs border px-2 py-0.5 rounded-full ${av.badge} ${av.label}`}>
                        {member.status}
                      </span>
                    </div>
                  </div>

                  {matchedSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2 ml-13">
                      {matchedSkills.map((s) => (
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

const DetailsModal = ({ appointment, onClose }) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="absolute inset-0 bg-black/60 backdrop-blur-sm"
    />
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className="bg-dark-100 border border-white/10 p-8 rounded-2xl shadow-2xl relative z-10 w-full max-w-lg"
    >
      <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-white">
        <FaTimes size={20} />
      </button>

      <h3 className="text-2xl font-serif text-gold-500 mb-6">Request {appointment._id.slice(-6)}</h3>

      <div className="space-y-6">
        <div>
          <p className="text-sm text-gray-500 mb-1">Customer</p>
          <p className="text-lg text-white">
            {appointment.customer?.name || 'Unknown Customer'}{' '}
            <span className="text-sm text-gray-400">({appointment.customer?.email || 'No email'})</span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-dark-200 p-4 rounded-lg border border-white/5">
            <p className="text-xs text-gray-500 mb-1">Service</p>
            <p className="text-white">{appointment.serviceType}</p>
          </div>
          <div className="bg-dark-200 p-4 rounded-lg border border-white/5">
            <p className="text-xs text-gray-500 mb-1">Date / Time</p>
            <p className="text-white">{new Date(appointment.date).toLocaleDateString()}</p>
            <p className="text-gray-400 text-sm mt-1">{appointment.time}</p>
          </div>
        </div>

        {appointment.assignedStaff && (
          <div className="bg-dark-200 p-4 rounded-lg border border-gold-500/20 flex items-center gap-3">
            <FaUserTie className="text-gold-500 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Assigned Staff</p>
              <p className="text-white font-medium">{appointment.assignedStaff.name}</p>
              <p className="text-gold-500 text-xs">{appointment.assignedStaff.role}</p>
            </div>
          </div>
        )}

        {appointment.notes && (
          <div className="bg-dark-200 p-5 rounded-lg border border-gold-500/20">
            <h4 className="text-gold-500 font-serif mb-3">Notes</h4>
            <p className="text-gray-300 text-sm">{appointment.notes}</p>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button className="flex-1 btn-primary py-2 text-sm">Email Customer</button>
          <button onClick={onClose} className="flex-1 btn-outline py-2 text-sm">Close</button>
        </div>
      </div>
    </motion.div>
  </div>
);

const ManageAppointments = () => {
  const toast = useToastContext();
  const [appointments, setAppointments] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [viewingAppt, setViewingAppt] = useState(null);
  const [assigningAppt, setAssigningAppt] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [appointmentsResponse, staffResponse] = await Promise.all([
          appointmentService.getAppointments(),
          staffService.getAllStaff()
        ]);
        setAppointments(getResponseList(appointmentsResponse));
        setStaffList(getResponseList(staffResponse));
      } catch (error) {
        toast.error(error.message || 'Unable to load appointments and staff from the database.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await appointmentService.updateAppointment(id, { status: newStatus });
      setAppointments((current) => current.map((appt) =>
        appt._id === id ? { ...appt, status: newStatus } : appt
      ));
      toast.success('Appointment status updated.');
    } catch (error) {
      toast.error(error.message || 'Failed to update appointment status.');
    }
  };

  const handleAssignStaff = async (apptId, member) => {
    try {
      await appointmentService.updateAppointment(apptId, { assignedStaff: member._id });
      setAppointments((current) => current.map((appt) =>
        appt._id === apptId ? { ...appt, assignedStaff: member } : appt
      ));
      setStaffList((current) => current.map((staff) =>
        staff._id === member._id ? { ...staff, assignedReqs: (staff.assignedReqs ?? 0) + 1 } : staff
      ));
      toast.success('Staff assigned successfully.');
    } catch (error) {
      toast.error(error.message || 'Failed to assign staff.');
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-[#0a0a0a] p-10 text-center text-gray-400">
        Loading appointments from the database...
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Bespoke Appointments</h1>
          <p className="text-gray-400 text-sm">Review custom tailoring requests, measurements, and assign staff.</p>
        </div>
      </div>

      <div className="bg-[#0a0a0a] rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-medium">Req ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Service</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Time</th>
                <th className="px-6 py-4 font-medium text-center">Assigned Staff</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt, i) => (
                <motion.tr
                  key={appt._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 font-mono text-gold-500 font-bold">{appt._id.slice(-6)}</td>
                  <td className="px-6 py-4">
                    <p className="text-white font-medium">{appt.customer?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">{appt.customer?.email || ''}</p>
                  </td>
                  <td className="px-6 py-4">{appt.serviceType}</td>
                  <td className="px-6 py-4">{new Date(appt.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{appt.time}</td>

                  <td className="px-6 py-4 text-center">
                    {appt.assignedStaff ? (
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-white text-xs font-medium">{appt.assignedStaff.name}</span>
                        <span className="text-gold-500 text-[10px]">{appt.assignedStaff.role}</span>
                      </div>
                    ) : (
                      <span className="text-gray-600 text-xs italic">Unassigned</span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[appt.status] || 'text-gray-400 bg-white/5 border-gray-500/30'}`}>
                      {appt.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setViewingAppt(appt)}
                        className="bg-white/10 hover:bg-white/20 text-white p-1.5 rounded transition"
                        title="View Details"
                      >
                        <FaEye />
                      </button>

                      <select
                        value={appt.status}
                        onChange={(e) => handleStatusChange(appt._id, e.target.value)}
                        className="bg-dark border border-white/20 text-white text-xs rounded px-2 py-1.5 focus:outline-none focus:border-gold-500"
                      >
                        {appointmentStatusOptions.map((statusValue) => (
                          <option key={statusValue} value={statusValue}>{statusValue}</option>
                        ))}
                      </select>

                      <button
                        onClick={() => setAssigningAppt(appt)}
                        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 whitespace-nowrap ${
                          appt.assignedStaff
                            ? 'border-gold-500/40 text-gold-500 bg-gold-500/10 hover:bg-gold-500/20'
                            : 'border-white/20 text-gray-300 bg-white/5 hover:border-gold-500/50 hover:text-gold-400'
                        }`}
                      >
                        <FaUserTie size={10} />
                        {appt.assignedStaff ? 'Reassign' : 'Assign'}
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {viewingAppt && (
          <DetailsModal appointment={viewingAppt} onClose={() => setViewingAppt(null)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {assigningAppt && (
          <AssignStaffModal
            appointment={assigningAppt}
            staffList={staffList}
            onAssign={handleAssignStaff}
            onClose={() => setAssigningAppt(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageAppointments;
