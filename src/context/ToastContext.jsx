import { createContext, useContext } from 'react';
import useToast from '../hooks/useToast';
import ToastContainer from '../components/common/Toast';

const ToastContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const toast = useToast();

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
    </ToastContext.Provider>
  );
};
