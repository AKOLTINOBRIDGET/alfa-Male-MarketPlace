import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaFileDownload } from 'react-icons/fa';
import AdminModal from '../../components/admin/AdminModal';

const initialInventory = [
  { id: 'INV-01', item: 'Italian Premium Wool (Fabric)', type: 'Raw Material', stock: 150, unit: 'yards', threshold: 50 },
  { id: 'INV-02', item: 'Mulberry Silk Blend (Fabric)', type: 'Raw Material', stock: 20, unit: 'yards', threshold: 30 },
  { id: 'INV-03', item: 'Classic Suit 4', type: 'Ready-to-Wear', stock: 12, unit: 'units', threshold: 10 },
  { id: 'INV-04', item: 'Luxury Watch 11', type: 'Ready-to-Wear', stock: 5, unit: 'units', threshold: 10 },
  { id: 'INV-05', item: 'Office Shoe 15 (Size 42)', type: 'Ready-to-Wear', stock: 0, unit: 'units', threshold: 5 },
];

const ManageInventory = () => {
  const [inventory, setInventory] = useState(initialInventory);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({ id: '', item: '', type: 'Ready-to-Wear', stock: '', unit: 'units', threshold: '' });

  // Handlers
  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      ...formData,
      stock: parseInt(formData.stock),
      threshold: parseInt(formData.threshold)
    };
    setInventory([newItem, ...inventory]);
    setIsAddModalOpen(false);
    setFormData({ id: '', item: '', type: 'Ready-to-Wear', stock: '', unit: 'units', threshold: '' });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setInventory(inventory.map(item => 
      item.id === itemToEdit.id ? { 
        ...itemToEdit, 
        stock: parseInt(itemToEdit.stock),
        threshold: parseInt(itemToEdit.threshold)
      } : item
    ));
    setItemToEdit(null);
  };

  const lowStockItems = inventory.filter(item => item.stock <= item.threshold);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Inventory Levels</h1>
          <p className="text-gray-400 text-sm">Track raw fabric yardage and ready-to-wear stock.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsReportOpen(true)}
            className="btn-outline py-2 px-4 text-sm text-gold-500 border-gold-500 hover:bg-gold-500/10 flex items-center gap-2"
          >
            <FaFileDownload /> Restock Report
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary py-2 px-4 text-sm flex items-center gap-2"
          >
            <FaPlus /> Add Item
          </button>
        </div>
      </div>

      <div className="bg-[#0a0a0a] rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-medium">SKU</th>
                <th className="px-6 py-4 font-medium">Item Name</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Stock Level</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item, i) => {
                let status = 'In Stock';
                let colorClass = 'text-green-500 bg-green-500/10 border-green-500/30';
                
                if (item.stock === 0) {
                  status = 'Out of Stock';
                  colorClass = 'text-red-500 bg-red-500/10 border-red-500/30';
                } else if (item.stock <= item.threshold) {
                  status = 'Low Stock';
                  colorClass = 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
                }

                return (
                  <motion.tr 
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-gray-500">{item.id}</td>
                    <td className="px-6 py-4 font-medium text-white">{item.item}</td>
                    <td className="px-6 py-4 text-xs text-gray-400 uppercase tracking-wide">{item.type}</td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${item.stock <= item.threshold ? 'text-red-400' : 'text-white'}`}>
                        {item.stock}
                      </span> 
                      <span className="text-gray-500 ml-1 text-xs">{item.unit}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colorClass}`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => setItemToEdit(item)}
                        className="text-blue-400 hover:text-blue-300 transition p-1" 
                        title="Edit Stock"
                      >
                        <FaEdit />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* Add Inventory Modal */}
      <AdminModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Inventory Item">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">SKU / ID</label>
              <input type="text" required value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} className="input-field" placeholder="INV-06" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Item Type</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="input-field">
                <option value="Ready-to-Wear">Ready-to-Wear</option>
                <option value="Raw Material">Raw Material</option>
                <option value="Accessory">Accessory</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Item Name</label>
            <input type="text" required value={formData.item} onChange={e => setFormData({...formData, item: e.target.value})} className="input-field" placeholder="Navy Blue Suit" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Initial Stock</label>
              <input type="number" required min="0" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="input-field" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Unit</label>
              <input type="text" required value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} className="input-field" placeholder="units/yards" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Low Alert at</label>
              <input type="number" required min="0" value={formData.threshold} onChange={e => setFormData({...formData, threshold: e.target.value})} className="input-field" />
            </div>
          </div>
          <div className="pt-4 flex gap-3">
            <button type="submit" className="flex-1 btn-primary py-2 text-sm">Add Item</button>
          </div>
        </form>
      </AdminModal>

      {/* Edit Inventory Modal */}
      <AdminModal isOpen={!!itemToEdit} onClose={() => setItemToEdit(null)} title="Update Stock Level">
        {itemToEdit && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="bg-dark-200 p-4 rounded-lg border border-white/5 mb-4">
              <p className="text-xs text-gray-500 mb-1">{itemToEdit.id}</p>
              <p className="text-lg text-white font-medium">{itemToEdit.item}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Current Stock ({itemToEdit.unit})</label>
                <input type="number" required min="0" value={itemToEdit.stock} onChange={e => setItemToEdit({...itemToEdit, stock: e.target.value})} className="input-field" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Low Stock Alert Level</label>
                <input type="number" required min="0" value={itemToEdit.threshold} onChange={e => setItemToEdit({...itemToEdit, threshold: e.target.value})} className="input-field" />
              </div>
            </div>
            <div className="pt-4 flex gap-3">
              <button type="submit" className="flex-1 btn-primary py-2 text-sm">Save Changes</button>
            </div>
          </form>
        )}
      </AdminModal>

      {/* Restock Report Modal */}
      <AdminModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} title="Restock Action Report" maxWidth="max-w-2xl">
        <div className="space-y-6">
          <p className="text-gray-400 text-sm">
            The following items are at or below their designated stock thresholds and require immediate reordering.
          </p>
          
          {lowStockItems.length === 0 ? (
            <div className="bg-green-500/10 border border-green-500/30 p-6 rounded-xl text-center">
              <p className="text-green-500 font-medium">All inventory levels are healthy!</p>
            </div>
          ) : (
            <div className="border border-white/10 rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="bg-dark-200 border-b border-white/10">
                  <tr>
                    <th className="px-4 py-3 font-medium">SKU</th>
                    <th className="px-4 py-3 font-medium">Item</th>
                    <th className="px-4 py-3 font-medium">Current Stock</th>
                    <th className="px-4 py-3 font-medium">Deficit</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockItems.map(item => (
                    <tr key={item.id} className="border-b border-white/5 last:border-0 bg-dark-100">
                      <td className="px-4 py-3 font-mono text-xs">{item.id}</td>
                      <td className="px-4 py-3 font-medium text-white">{item.item}</td>
                      <td className="px-4 py-3 text-red-400 font-bold">{item.stock} {item.unit}</td>
                      <td className="px-4 py-3 text-gray-400">Needs {(item.threshold * 2) - item.stock} {item.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-white/10">
            <button className="flex-1 btn-primary py-2 text-sm" disabled={lowStockItems.length === 0}>
              Export to CSV
            </button>
            <button className="flex-1 btn-primary py-2 text-sm" disabled={lowStockItems.length === 0}>
              Email Suppliers
            </button>
          </div>
        </div>
      </AdminModal>

    </div>
  );
};

export default ManageInventory;
