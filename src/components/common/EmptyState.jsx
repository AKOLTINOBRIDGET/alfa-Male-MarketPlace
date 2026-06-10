const EmptyState = ({ 
  icon, 
  title = 'No items found', 
  message, 
  actionLabel, 
  onAction 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {icon && (
        <div className="text-gray-600 mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-serif text-white mb-2">{title}</h3>
      {message && (
        <p className="text-gray-400 text-center mb-6 max-w-md">
          {message}
        </p>
      )}
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn-primary">
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
