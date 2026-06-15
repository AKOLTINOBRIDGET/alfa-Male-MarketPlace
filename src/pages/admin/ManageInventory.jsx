import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaFileDownload, FaCloudUploadAlt } from 'react-icons/fa';
import AdminModal from '../../components/admin/AdminModal';
import BulkUpload from '../../data/bulkupload';
import inventoryService from '../../services/inventoryService';
import productService from '../../services/productService';
import { useToastContext } from '../../context/ToastContext';
import { getResponseData, getResponseList } from '../../utils/apiResponse';

const ManageInventory = () => {
  const toast = useToastContext();
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const [formData, setFormData] = useState({ product: '', sku: '', quantity: '', unit: 'units' });

  useEffect(() => {
    const loadInventory = async () => {
      try {
        const [inventoryRes, productsRes] = await Promise.all([
          inventoryService.getInventory(),
          productService.getProducts({ limit: 100 })
        ]);

        setInventory(getResponseList(inventoryRes));
        setProducts(getResponseList(productsRes));
      } catch (error) {
        toast.error(error.message || 'Unable to load inventory data from the database.');
      } finally {
        setIsLoading(false);
      }
    };

    loadInventory();
  }, [toast]);


  const buildItemDisplay = (item) => {
    return {
      id: item._id || item.id,
      sku: item.sku || item.product?.sku || item.id || 'N/A',
      item: item.product?.name || item.item || 'Unnamed Item',
      type: item.product?.category || item.type || 'Inventory',
      stock: item.quantity ?? item.stock ?? 0,
      unit: item.unit || 'units',
      threshold: item.threshold ?? 10,
      status: item.status || (item.quantity === 0 ? 'Out of Stock' : item.quantity < 10 ? 'Low Stock' : 'In Stock')
    };
  };

  const inventoryDisplay = inventory.map(buildItemDisplay);

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    if (!formData.product) {
      toast.error('Select a product to create inventory for.');
      return;
    }

    try {
      const payload = {
        product: formData.product,
        sku: formData.sku || '',
        quantity: parseInt(formData.quantity, 10)
      };

      const response = await inventoryService.createInventoryItem(payload);
      setInventory((current) => [getResponseData(response, payload), ...current]);
      setIsAddModalOpen(false);
      setFormData({ product: '', sku: '', quantity: '', unit: 'units' });
      toast.success('Inventory item created successfully.');
    } catch (error) {
      toast.error(error.message || 'Failed to create inventory item.');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!itemToEdit) {
      return;
    }

    try {
      const payload = {
        quantity: parseInt(itemToEdit.stock, 10)
      };
      const response = await inventoryService.updateInventoryItem(itemToEdit._id || itemToEdit.id, payload);
      const updatedItem = getResponseData(response, { ...itemToEdit, ...payload });
      setInventory((current) => current.map((item) =>
        (item._id || item.id) === (updatedItem._id || updatedItem.id)
          ? updatedItem
          : item
      ));
      setItemToEdit(null);
      toast.success('Inventory updated successfully.');
    } catch (error) {
      toast.error(error.message || 'Failed to update inventory item.');
    }
  };

  const lowStockItems = inventoryDisplay.filter((item) => item.status !== 'In Stock');

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-[#0a0a0a] p-10 text-center text-gray-400">
        Loading inventory from the database...
      </div>
    );
  }

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
            onClick={() => setIsBulkUploadOpen(true)}
            className="btn-outline py-2 px-4 text-sm flex items-center gap-2"
          >
            <FaCloudUploadAlt /> Bulk Upload
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
              {inventoryDisplay.map((item, i) => {
                const statusColor = item.status === 'Out of Stock'
                  ? 'text-red-500 bg-red-500/10 border-red-500/30'
                  : item.status === 'Low Stock'
                    ? 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30'
                    : 'text-green-500 bg-green-500/10 border-green-500/30';

                return (
                  <motion.tr 
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-gray-500">{item.sku}</td>
                    <td className="px-6 py-4 font-medium text-white">{item.item}</td>
                    <td className="px-6 py-4 text-xs text-gray-400 uppercase tracking-wide">{item.type}</td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${item.status !== 'In Stock' ? 'text-red-400' : 'text-white'}`}>
                        {item.stock}
                      </span>
                      <span className="text-gray-500 ml-1 text-xs">{item.unit}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColor}`}>
                        {item.status}
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
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Inventory Product</label>
            <select
              required
              value={formData.product}
              onChange={(e) => setFormData({ ...formData, product: e.target.value })}
              className="input-field"
            >
              <option value="">Select product</option>
              {products.map((product) => (
                <option key={product._id || product.id} value={product._id || product.id}>
                  {product.name} {product.category ? `(${product.category})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">SKU</label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="input-field"
                placeholder="SKU1234"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Quantity</label>
              <input
                type="number"
                required
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="input-field"
              />
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
              <p className="text-xs text-gray-500 mb-1">{itemToEdit.sku}</p>
              <p className="text-lg text-white font-medium">{itemToEdit.item}</p>
              <p className="text-xs text-gray-400 mt-1">{itemToEdit.type}</p>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Quantity</label>
              <input type="number" required min="0" value={itemToEdit.stock} onChange={e => setItemToEdit({...itemToEdit, stock: e.target.value})} className="input-field" />
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

      {/* Bulk Upload Overlay */}
      <AnimatePresence>
        {isBulkUploadOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBulkUploadOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-2xl"
            >
              <BulkUpload 
                title="Bulk Upload Inventory"
                description="Upload a CSV or Excel file containing inventory records to add multiple items at once."
                onUploadSuccess={(file) => {
                  console.log('Bulk upload success', file);
                  // In a real app, parse file and update inventory here
                  setIsBulkUploadOpen(false);
                }}
                onCancel={() => setIsBulkUploadOpen(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ManageInventory;
