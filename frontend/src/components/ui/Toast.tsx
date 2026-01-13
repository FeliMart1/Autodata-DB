import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@utils/cn';

interface ToastProps {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose: (id: string) => void;
}

export function Toast({ id, message, type = 'info', onClose }: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  const variants = {
    success: 'bg-success text-success-foreground border-success',
    error: 'bg-destructive text-destructive-foreground border-destructive',
    warning: 'bg-warning text-warning-foreground border-warning',
    info: 'bg-info text-info-foreground border-info',
  };

  return (
    <div
      className={cn(
        'pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border shadow-lg animate-in slide-in-from-top-5',
        variants[type]
      )}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-1">
            <p className="text-sm font-medium">{message}</p>
          </div>
          <button
            onClick={() => onClose(id)}
            className="ml-4 inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Array<{
    id: string;
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
  }>;
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="pointer-events-none fixed top-0 right-0 z-50 flex max-h-screen w-full flex-col-reverse p-4 sm:flex-col md:max-w-[420px]">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={onClose}
        />
      ))}
    </div>
  );
}
