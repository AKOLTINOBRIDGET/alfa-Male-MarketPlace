import { useState } from 'react';
import { FaCloudUploadAlt, FaTimes, FaImage } from 'react-icons/fa';
import LoadingSpinner from './LoadingSpinner';

const ImageUpload = ({ 
  onImagesSelected, 
  maxImages = 5, 
  existingImages = [],
  onRemoveImage 
}) => {
  const [previews, setPreviews] = useState(existingImages);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (files) => {
    const fileArray = Array.from(files);
    const remaining = maxImages - previews.length;

    if (fileArray.length > remaining) {
      alert(`You can only upload ${remaining} more image(s)`);
      return;
    }

    // Create previews
    const newPreviews = fileArray.map(file => ({
      file,
      url: URL.createObjectURL(file),
      isNew: true
    }));

    const updatedPreviews = [...previews, ...newPreviews];
    setPreviews(updatedPreviews);
    onImagesSelected(fileArray);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleRemove = (index) => {
    const image = previews[index];
    
    // If it's a new image, revoke the object URL
    if (image.isNew) {
      URL.revokeObjectURL(image.url);
    }

    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);

    if (!image.isNew && onRemoveImage) {
      onRemoveImage(image);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-gold-500 bg-gold-500/10'
            : 'border-white/20 hover:border-gold-500/50'
        } ${previews.length >= maxImages ? 'opacity-50 pointer-events-none' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="image-upload"
          className="hidden"
          accept="image/*"
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
          disabled={previews.length >= maxImages}
        />
        
        <label
          htmlFor="image-upload"
          className="cursor-pointer block"
        >
          <FaCloudUploadAlt className="mx-auto text-5xl text-gold-500 mb-4" />
          <p className="text-white font-medium mb-2">
            {isDragging ? 'Drop images here' : 'Click to upload or drag and drop'}
          </p>
          <p className="text-gray-400 text-sm">
            PNG, JPG or WEBP (max. 5MB each)
          </p>
          <p className="text-gray-500 text-xs mt-2">
            {previews.length}/{maxImages} images
          </p>
        </label>
      </div>

      {/* Image Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {previews.map((preview, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-lg overflow-hidden border border-white/10 bg-dark-200"
            >
              <img
                src={preview.url}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Remove Button */}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FaTimes />
              </button>

              {/* New Badge */}
              {preview.isNew && (
                <div className="absolute top-2 left-2 bg-gold-500 text-dark text-xs px-2 py-1 rounded">
                  New
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
