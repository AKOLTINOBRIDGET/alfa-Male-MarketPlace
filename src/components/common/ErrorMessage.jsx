import { FaExclamationTriangle } from 'react-icons/fa';

const ErrorMessage = ({ message, onRetry, className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      <div className="text-red-500 mb-4">
        <FaExclamationTriangle size={48} />
      </div>
      <h3 className="text-xl font-serif text-white mb-2">Something went wrong</h3>
      <p className="text-gray-400 text-center mb-6 max-w-md">
        {message || 'An unexpected error occurred. Please try again.'}
      </p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary">
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
