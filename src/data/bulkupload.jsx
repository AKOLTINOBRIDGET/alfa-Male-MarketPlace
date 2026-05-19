import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCloudUploadAlt, 
  FaFileCsv, 
  FaCheckCircle, 
  FaExclamationCircle, 
  FaTimes 
} from 'react-icons/fa';

/**
 * A highly scalable, reusable Bulk Upload component.
 * Fits the system's luxury dark-mode aesthetic.
 * 
 * @param {Object} props
 * @param {string} props.title - Title for the upload section.
 * @param {string} props.description - Description/instructions.
 * @param {string} props.accept - Accepted file types (e.g. ".csv, .xlsx").
 * @param {Function} props.onUploadSuccess - Callback when upload successfully completes. Receives the File object.
 * @param {Function} props.onCancel - Callback if the user wants to cancel/close.
 */
const BulkUpload = ({
  title = "Bulk Upload",
  description = "Drag and drop your CSV or Excel file here to upload records in bulk.",
  accept = ".csv, .xlsx, .xls",
  onUploadSuccess,
  onCancel
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadState, setUploadState] = useState('idle'); // 'idle' | 'uploading' | 'success' | 'error'
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  
  const fileInputRef = useRef(null);

  // --- Drag & Drop Handlers ---
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  // --- File Selection ---
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (selectedFile) => {
    // Basic validation
    const fileExt = selectedFile.name.split('.').pop().toLowerCase();
    const acceptedExts = accept.split(',').map(ext => ext.trim().replace('.', ''));
    
    if (!acceptedExts.includes(fileExt)) {
      setErrorMessage(`Invalid file format. Please upload one of: ${accept}`);
      setUploadState('error');
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setUploadState('idle');
    setErrorMessage('');
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const resetState = () => {
    setFile(null);
    setUploadState('idle');
    setProgress(0);
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // --- Simulated Upload Process ---
  const handleUpload = () => {
    if (!file) return;
    
    setUploadState('uploading');
    setProgress(0);

    // Simulate progress
    const duration = 2000; // 2 seconds
    const interval = 100;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = Math.round((currentStep / steps) * 100);
      setProgress(newProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        setUploadState('success');
        if (onUploadSuccess) {
          // Delaying callback slightly so user can see 100% success state
          setTimeout(() => onUploadSuccess(file), 800);
        }
      }
    }, interval);
  };

  // --- Render Helpers ---
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-dark-100 border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-2xl mx-auto relative overflow-hidden">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-serif text-gold-500 mb-2">{title}</h2>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
        {onCancel && (
          <button 
            onClick={onCancel}
            className="text-gray-500 hover:text-white transition-colors"
            title="Close"
          >
            <FaTimes size={20} />
          </button>
        )}
      </div>

      {/* Upload Zone */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center p-8 md:p-12 border-2 border-dashed rounded-xl transition-all duration-300 ${
          isDragging 
            ? 'border-gold-500 bg-gold-500/10' 
            : 'border-white/20 bg-dark-200 hover:border-gold-500/50 hover:bg-white/5'
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          className="hidden" 
        />

        <AnimatePresence mode="wait">
          {/* Default / Idle State (No File Selected) */}
          {!file && uploadState !== 'error' && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                <FaCloudUploadAlt size={32} className="text-gold-500" />
              </div>
              <p className="text-white text-lg font-medium mb-2">
                Drag & Drop file here
              </p>
              <p className="text-gray-500 text-sm mb-6">
                Supported formats: {accept}
              </p>
              <button 
                onClick={triggerFileInput}
                className="btn-outline px-6 py-2 text-sm"
              >
                Browse Files
              </button>
            </motion.div>
          )}

          {/* File Selected / Uploading / Success State */}
          {file && uploadState !== 'error' && (
            <motion.div 
              key="file-selected"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full"
            >
              <div className="flex items-center gap-4 bg-dark-100 p-4 rounded-lg border border-white/10 mb-6">
                <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20 text-blue-400">
                  <FaFileCsv size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{file.name}</p>
                  <p className="text-gray-500 text-xs">{formatFileSize(file.size)}</p>
                </div>
                {uploadState === 'idle' && (
                  <button 
                    onClick={resetState}
                    className="text-gray-500 hover:text-red-400 p-2 transition-colors"
                    title="Remove file"
                  >
                    <FaTimes />
                  </button>
                )}
                {uploadState === 'success' && (
                  <div className="text-green-500 p-2">
                    <FaCheckCircle size={20} />
                  </div>
                )}
              </div>

              {/* Progress Bar (Visible during uploading or success) */}
              {(uploadState === 'uploading' || uploadState === 'success') && (
                <div className="mb-6">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-gray-400">
                      {uploadState === 'uploading' ? 'Uploading & Validating...' : 'Upload Complete!'}
                    </span>
                    <span className="text-gold-500 font-medium">{progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-dark-200 rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full ${uploadState === 'success' ? 'bg-green-500' : 'bg-gold-500'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ ease: "linear", duration: 0.1 }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {uploadState === 'idle' && (
                <div className="flex gap-4 justify-end">
                  <button onClick={resetState} className="btn-outline px-6 py-2 text-sm">
                    Cancel
                  </button>
                  <button onClick={handleUpload} className="btn-primary px-6 py-2 text-sm">
                    Upload & Process
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Error State */}
          {uploadState === 'error' && (
            <motion.div 
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4 border border-red-500/20">
                <FaExclamationCircle size={32} className="text-red-500" />
              </div>
              <p className="text-white text-lg font-medium mb-2">Upload Failed</p>
              <p className="text-red-400 text-sm mb-6">{errorMessage}</p>
              <button 
                onClick={resetState}
                className="btn-outline px-6 py-2 text-sm"
              >
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Info / Template Download */}
      <div className="mt-6 flex flex-col md:flex-row items-center justify-between pt-6 border-t border-white/10 text-sm">
        <p className="text-gray-500 mb-4 md:mb-0">
          Need help? <a href="#" className="text-gold-500 hover:underline">Read upload guidelines</a>
        </p>
        <button className="text-gray-300 hover:text-white flex items-center gap-2 transition-colors">
          <FaFileCsv className="text-gray-500" /> Download Sample Template
        </button>
      </div>

    </div>
  );
};

export default BulkUpload;
