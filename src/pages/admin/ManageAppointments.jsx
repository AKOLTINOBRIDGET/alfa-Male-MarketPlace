import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEye, FaTimes } from 'react-icons/fa';

const initialAppointments = [
  { 
    id: 'REQ-003', 
    customer: 'David Smith', 
    email: 'david@example.com',
    fabric: 'Italian Premium Wool', 
    type: 'In-Store Appointment',
    date: '2026-05-20',
    time: 'Morning (09:00 AM - 12:00 PM)',
    status: 'Pending',
    details: null
  },
  { 
    id: 'REQ-002', 
    customer: 'Alex Johnson', 
    email: 'alex@example.com',
    fabric: 'Plush Velvet', 
    type: 'Manual Measurements',
    status: 'Contacted',
    details: { chest: 42, waist: 34, shoulders: 19, sleeve: 26, notes: 'Prefer a slim fit.' }
  },
  { 
    id: 'REQ-001', 
    customer: 'Bruce Wayne', 
    email: 'bruce@example.com',
    fabric: 'Mulberry Silk Blend', 
    type: 'Manual Measurements',
    status: 'Approved',
    details: { chest: 44, waist: 36, shoulders: 20, sleeve: 27, notes: 'Darkest black possible.' }
  },
];

const statusColors = {
  Pending: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
  Contacted: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  Approved: 'text-green-500 bg-green-500/10 border-green-500/30',
};

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleStatusChange = (reqId, newStatus) => {
    setAppointments(appointments.map(app => 
      app.id === reqId ? { ...app, status: newStatus } : app
    ));
  };

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Bespoke Appointments</h1>
          <p className="text-gray-400 text-sm">Review custom tailoring requests and measurements.</p>
        </div>
      </div>

      <div className="bg-[#0a0a0a] rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-medium">Req ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Fabric</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((app, i) => (
                <motion.tr 
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 font-mono text-gold-500 font-bold">{app.id}</td>
                  <td className="px-6 py-4">
                    <p className="text-white font-medium">{app.customer}</p>
                    <p className="text-xs text-gray-500">{app.email}</p>
                  </td>
                  <td className="px-6 py-4">{app.fabric}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${app.type === 'Manual Measurements' ? 'bg-purple-500/10 text-purple-400' : 'bg-orange-500/10 text-orange-400'}`}>
                      {app.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[app.status]}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <button 
                      onClick={() => setSelectedRequest(app)}
                      className="bg-white/10 hover:bg-white/20 text-white p-1.5 rounded transition"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    <select 
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      className="bg-dark border border-white/20 text-white text-xs rounded px-2 py-1 focus:outline-none focus:border-gold-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Approved">Approved</option>
                    </select>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedRequest && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedRequest(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-dark-100 border border-white/10 p-8 rounded-2xl shadow-2xl relative z-10 w-full max-w-lg"
            >
              <button 
                onClick={() => setSelectedRequest(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white"
              >
                <FaTimes size={20} />
              </button>
              
              <h3 className="text-2xl font-serif text-gold-500 mb-6">Request {selectedRequest.id}</h3>
              
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Customer</p>
                  <p className="text-lg text-white">{selectedRequest.customer} <span className="text-sm text-gray-400">({selectedRequest.email})</span></p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-dark-200 p-4 rounded-lg border border-white/5">
                    <p className="text-xs text-gray-500 mb-1">Fabric Choice</p>
                    <p className="text-white">{selectedRequest.fabric}</p>
                  </div>
                  <div className="bg-dark-200 p-4 rounded-lg border border-white/5">
                    <p className="text-xs text-gray-500 mb-1">Request Type</p>
                    <p className="text-white">{selectedRequest.type}</p>
                  </div>
                </div>

                {selectedRequest.type === 'In-Store Appointment' ? (
                  <div className="bg-dark-200 p-5 rounded-lg border border-gold-500/20">
                    <h4 className="text-gold-500 font-serif mb-3">Appointment Details</h4>
                    <p className="text-gray-300"><strong className="text-white">Date:</strong> {selectedRequest.date}</p>
                    <p className="text-gray-300 mt-2"><strong className="text-white">Time:</strong> {selectedRequest.time}</p>
                  </div>
                ) : (
                  <div className="bg-dark-200 p-5 rounded-lg border border-gold-500/20">
                    <h4 className="text-gold-500 font-serif mb-3">Manual Measurements</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <p className="text-gray-300"><strong className="text-white">Chest:</strong> {selectedRequest.details.chest}"</p>
                      <p className="text-gray-300"><strong className="text-white">Waist:</strong> {selectedRequest.details.waist}"</p>
                      <p className="text-gray-300"><strong className="text-white">Shoulders:</strong> {selectedRequest.details.shoulders}"</p>
                      <p className="text-gray-300"><strong className="text-white">Sleeve:</strong> {selectedRequest.details.sleeve}"</p>
                    </div>
                    {selectedRequest.details.notes && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <p className="text-sm text-gray-500 mb-1">Notes</p>
                        <p className="text-gray-300 text-sm italic">"{selectedRequest.details.notes}"</p>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex gap-3 pt-4">
                  <button className="flex-1 btn-primary py-2 text-sm">Email Customer</button>
                  <button onClick={() => setSelectedRequest(null)} className="flex-1 btn-outline py-2 text-sm">Close</button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ManageAppointments;
