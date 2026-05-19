import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaCloudUploadAlt } from 'react-icons/fa';
import { products as initialProducts } from '../../data/products';
import AdminModal from '../../components/admin/AdminModal';
import BulkUpload from '../../data/bulkupload';

const ManageProducts = () => {
  const [products, setProducts] = useState(initialProducts);
  const [filter, setFilter] = useState('all');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  // Form State
  const [formData, setFormData] = useState({ name: '', category: 'suits', price: '', image: '' });

  // Filter Logic
  const filteredProducts = useMemo(() => {
    if (filter === 'all') return products;
    return products.filter(p => p.category === filter);
  }, [products, filter]);

  // Handlers
  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      id: Date.now(), // mock ID
      ...formData,
      price: parseFloat(formData.price)
    };
    setProducts([newProduct, ...products]);
    setIsAddModalOpen(false);
    setFormData({ name: '', category: 'suits', price: '', image: '' });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setProducts(products.map(p => 
      p.id === productToEdit.id ? { ...productToEdit, price: parseFloat(productToEdit.price) } : p
    ));
    setProductToEdit(null);
  };

  const confirmDelete = () => {
    setProducts(products.filter(p => p.id !== productToDelete.id));
    setProductToDelete(null);
  };

  return (
    <div>
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Product Management</h1>
          <p className="text-gray-400 text-sm mb-4 md:mb-0">Add, edit, or remove items from your e-commerce store.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input-field py-2 w-40"
          >
            <option value="all">All Categories</option>
            <option value="suits">Suits</option>
            <option value="watches">Watches</option>
            <option value="office">Office Shoes</option>
            <option value="snickers">Snickers</option>
            <option value="casual">Casual Attire</option>
            <option value="others">Accessories</option>
          </select>
          <button 
            onClick={() => setIsBulkUploadOpen(true)}
            className="btn-outline flex items-center gap-2 py-2 px-4 text-sm"
          >
            <FaCloudUploadAlt /> Bulk Upload
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary flex items-center gap-2 py-2 px-4 text-sm"
          >
            <FaPlus /> Add Product
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0a0a0a] rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto max-h-[60vh] custom-scrollbar">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-white/5 border-b border-white/10 sticky top-0 backdrop-blur-md z-10">
              <tr>
                <th className="px-6 py-4 font-medium">Image</th>
                <th className="px-6 py-4 font-medium">Product Name</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, i) => (
                <motion.tr 
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: (i % 10) * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-3">
                    <img src={product.image || '/images/placeholder.jpg'} alt={product.name} className="w-10 h-10 object-cover rounded border border-white/10 bg-dark-200" />
                  </td>
                  <td className="px-6 py-3 font-medium text-white">{product.name}</td>
                  <td className="px-6 py-3 capitalize">{product.category}</td>
                  <td className="px-6 py-3 text-gold-500 font-serif">${product.price}</td>
                  <td className="px-6 py-3 text-center space-x-3">
                    <button 
                      onClick={() => setProductToEdit(product)}
                      className="text-blue-400 hover:text-blue-300 transition p-1" 
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      onClick={() => setProductToDelete(product)}
                      className="text-red-400 hover:text-red-300 transition p-1" 
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </motion.tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                    No products found in this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* Add Product Modal */}
      <AdminModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Product">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Product Name</label>
            <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-field" placeholder="e.g. Classic Tuxedo" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Category</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="input-field">
                <option value="suits">Suits</option>
                <option value="watches">Watches</option>
                <option value="office">Office Shoes</option>
                <option value="snickers">Snickers</option>
                <option value="casual">Casual Attire</option>
                <option value="others">Accessories</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Price ($)</label>
              <input type="number" required min="0" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="input-field" placeholder="0.00" />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Image URL</label>
            <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="input-field" placeholder="/images/my-product.jpg" />
          </div>
          <div className="pt-4 flex gap-3">
            <button type="submit" className="flex-1 btn-primary py-2 text-sm">Create Product</button>
            <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 btn-outline py-2 text-sm">Cancel</button>
          </div>
        </form>
      </AdminModal>

      {/* Edit Product Modal */}
      <AdminModal isOpen={!!productToEdit} onClose={() => setProductToEdit(null)} title="Edit Product">
        {productToEdit && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Product Name</label>
              <input type="text" required value={productToEdit.name} onChange={e => setProductToEdit({...productToEdit, name: e.target.value})} className="input-field" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Category</label>
                <select value={productToEdit.category} onChange={e => setProductToEdit({...productToEdit, category: e.target.value})} className="input-field">
                  <option value="suits">Suits</option>
                  <option value="watches">Watches</option>
                  <option value="office">Office Shoes</option>
                  <option value="snickers">Snickers</option>
                  <option value="casual">Casual Attire</option>
                  <option value="others">Accessories</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Price ($)</label>
                <input type="number" required min="0" step="0.01" value={productToEdit.price} onChange={e => setProductToEdit({...productToEdit, price: e.target.value})} className="input-field" />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Image URL</label>
              <input type="text" value={productToEdit.image} onChange={e => setProductToEdit({...productToEdit, image: e.target.value})} className="input-field" />
            </div>
            <div className="pt-4 flex gap-3">
              <button type="submit" className="flex-1 btn-primary py-2 text-sm">Save Changes</button>
              <button type="button" onClick={() => setProductToEdit(null)} className="flex-1 btn-outline py-2 text-sm">Cancel</button>
            </div>
          </form>
        )}
      </AdminModal>

      {/* Delete Confirmation Modal */}
      <AdminModal isOpen={!!productToDelete} onClose={() => setProductToDelete(null)} title="Confirm Deletion">
        {productToDelete && (
          <div className="space-y-6">
            <p className="text-gray-300">
              Are you sure you want to delete <strong className="text-white">{productToDelete.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={confirmDelete} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                Yes, Delete
              </button>
              <button onClick={() => setProductToDelete(null)} className="flex-1 btn-outline py-2 text-sm">
                Cancel
              </button>
            </div>
          </div>
        )}
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
                title="Bulk Upload Products"
                description="Upload a CSV or Excel file containing product details to add multiple items at once."
                onUploadSuccess={(file) => {
                  console.log('Bulk upload success', file);
                  // In a real app, parse file and add to products here
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

export default ManageProducts;
