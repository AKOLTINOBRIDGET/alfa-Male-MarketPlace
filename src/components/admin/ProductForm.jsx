import { useState } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';
import ImageUpload from '../common/ImageUpload';
import LoadingSpinner from '../common/LoadingSpinner';
import useAsync from '../../hooks/useAsync';
import { useToastContext } from '../../context/ToastContext';
import productService from '../../services/productService';
import api from '../../services/api';

const ProductForm = ({ product = null, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    compareAtPrice: product?.compareAtPrice || '',
    category: product?.category || '',
    brand: product?.brand || '',
    stock: product?.stock || 0,
    tags: product?.tags?.join(', ') || '',
    isFeatured: product?.isFeatured || false,
    specifications: {
      material: product?.specifications?.material || '',
      fabric: product?.specifications?.fabric || '',
      fit: product?.specifications?.fit || '',
      careInstructions: product?.specifications?.careInstructions || '',
      madeIn: product?.specifications?.madeIn || ''
    }
  });

  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState(product?.images || []);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  const { loading, execute } = useAsync();
  const toast = useToastContext();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('specifications.')) {
      const specField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleImagesSelected = (files) => {
    setNewImages(prev => [...prev, ...files]);
  };

  const handleRemoveExistingImage = (image) => {
    setExistingImages(prev => prev.filter(img => img.url !== image.url));
    setImagesToDelete(prev => [...prev, image.publicId]);
  };

  const uploadImages = async (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    const response = await api.post('/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  };

  const deleteImages = async (publicIds) => {
    for (const publicId of publicIds) {
      await api.delete('/upload/image', { data: { publicId } });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Upload new images first
      let uploadedImages = [];
      if (newImages.length > 0) {
        const uploadResult = await execute(() => uploadImages(newImages));
        uploadedImages = uploadResult.map(img => ({
          url: img.url,
          publicId: img.publicId,
          alt: formData.name
        }));
      }

      // Combine existing and new images
      const allImages = [...existingImages, ...uploadedImages];

      // Prepare product data
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : undefined,
        stock: parseInt(formData.stock),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        images: allImages
      };

      // Create or update product
      let result;
      if (product) {
        result = await execute(() => productService.updateProduct(product._id, productData));
        
        // Delete removed images
        if (imagesToDelete.length > 0) {
          await deleteImages(imagesToDelete);
        }
      } else {
        result = await execute(() => productService.createProduct(productData));
      }

      toast.success(`Product ${product ? 'updated' : 'created'} successfully!`);
      onSuccess(result);
    } catch (error) {
      toast.error(error.message || 'Failed to save product');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-dark-100 p-6 rounded-lg">
        <h3 className="text-xl font-serif text-white mb-4">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-2">Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="e.g., Classic Navy Suit"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Brand</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., Alfa Male"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="input-field"
            >
              <option value="">Select Category</option>
              <option value="suits">Suits</option>
              <option value="shirts">Shirts</option>
              <option value="watches">Watches</option>
              <option value="shoes">Shoes</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Stock *</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Price *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="input-field"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Compare At Price</label>
            <input
              type="number"
              name="compareAtPrice"
              value={formData.compareAtPrice}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="input-field"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-gray-300 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="input-field resize-none"
            placeholder="Describe your product..."
          />
        </div>

        <div className="mt-4">
          <label className="block text-gray-300 mb-2">Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="input-field"
            placeholder="formal, wedding, luxury"
          />
        </div>

        <div className="mt-4 flex items-center">
          <input
            type="checkbox"
            name="isFeatured"
            checked={formData.isFeatured}
            onChange={handleChange}
            className="mr-2"
            id="isFeatured"
          />
          <label htmlFor="isFeatured" className="text-gray-300">
            Featured Product
          </label>
        </div>
      </div>

      {/* Specifications */}
      <div className="bg-dark-100 p-6 rounded-lg">
        <h3 className="text-xl font-serif text-white mb-4">Specifications</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-2">Material</label>
            <input
              type="text"
              name="specifications.material"
              value={formData.specifications.material}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., 100% Wool"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Fabric</label>
            <input
              type="text"
              name="specifications.fabric"
              value={formData.specifications.fabric}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., Italian Wool"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Fit</label>
            <select
              name="specifications.fit"
              value={formData.specifications.fit}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Select Fit</option>
              <option value="slim">Slim Fit</option>
              <option value="regular">Regular Fit</option>
              <option value="relaxed">Relaxed Fit</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Made In</label>
            <input
              type="text"
              name="specifications.madeIn"
              value={formData.specifications.madeIn}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., Italy"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-300 mb-2">Care Instructions</label>
            <textarea
              name="specifications.careInstructions"
              value={formData.specifications.careInstructions}
              onChange={handleChange}
              rows="3"
              className="input-field resize-none"
              placeholder="Dry clean only..."
            />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-dark-100 p-6 rounded-lg">
        <h3 className="text-xl font-serif text-white mb-4">Product Images</h3>
        <ImageUpload
          onImagesSelected={handleImagesSelected}
          maxImages={5}
          existingImages={existingImages}
          onRemoveImage={handleRemoveExistingImage}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors"
          disabled={loading}
        >
          <FaTimes className="inline mr-2" />
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
        >
          {loading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <>
              <FaSave className="inline mr-2" />
              {product ? 'Update' : 'Create'} Product
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
