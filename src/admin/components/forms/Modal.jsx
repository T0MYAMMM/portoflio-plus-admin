import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  className
}) => {
  // Close modal on escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={cn(
            "relative w-full bg-card border border-border rounded-lg shadow-xl",
            sizeClasses[size],
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              {title && (
                <h2 className="text-lg font-semibold text-foreground">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-1 text-sm text-foreground/60">
                  {description}
                </p>
              )}
            </div>
            
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              aria-label="Close modal"
            >
              <X className="h-4 w-4 text-foreground/60" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default", // default, danger
  isLoading = false
}) => {
  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
    >
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
        >
          {cancelText}
        </button>
        
        <button
          type="button"
          onClick={handleConfirm}
          disabled={isLoading}
          className={cn(
            "px-4 py-2 text-sm rounded-lg font-medium transition-colors disabled:opacity-50",
            variant === 'danger'
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              <span>Loading...</span>
            </div>
          ) : (
            confirmText
          )}
        </button>
      </div>
    </Modal>
  );
};

export default Modal; 