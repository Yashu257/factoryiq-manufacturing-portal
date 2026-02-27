import { X } from 'lucide-react';
import { cn } from '../../utils/helpers';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={cn(
        "relative w-full bg-white rounded-xl shadow-2xl transform transition-all flex flex-col",
        sizeClasses[size]
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-secondary-200 flex-shrink-0">
          <h3 className="text-lg font-semibold text-secondary-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-secondary-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-secondary-500" />
          </button>
        </div>
        
        {/* Content - No internal scroll */}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
