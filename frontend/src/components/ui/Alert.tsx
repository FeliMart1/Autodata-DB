import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '@utils/cn';

interface AlertProps {
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export function Alert({ variant = 'default', title, children, onClose, className }: AlertProps) {
  const variants = {
    default: {
      container: 'bg-background border-border',
      icon: <Info className="h-5 w-5" />,
      iconColor: 'text-foreground',
    },
    destructive: {
      container: 'bg-destructive/10 border-destructive/50',
      icon: <AlertCircle className="h-5 w-5" />,
      iconColor: 'text-destructive',
    },
    success: {
      container: 'bg-success/10 border-success/50',
      icon: <CheckCircle2 className="h-5 w-5" />,
      iconColor: 'text-success',
    },
    warning: {
      container: 'bg-warning/10 border-warning/50',
      icon: <AlertTriangle className="h-5 w-5" />,
      iconColor: 'text-warning',
    },
    info: {
      container: 'bg-info/10 border-info/50',
      icon: <Info className="h-5 w-5" />,
      iconColor: 'text-info',
    },
  };

  const currentVariant = variants[variant];

  return (
    <div
      className={cn(
        'relative w-full rounded-lg border p-4',
        currentVariant.container,
        className
      )}
    >
      <div className="flex gap-3">
        <div className={cn('flex-shrink-0', currentVariant.iconColor)}>
          {currentVariant.icon}
        </div>
        <div className="flex-1">
          {title && (
            <h5 className="mb-1 font-medium leading-none tracking-tight">
              {title}
            </h5>
          )}
          <div className="text-sm [&_p]:leading-relaxed">{children}</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
