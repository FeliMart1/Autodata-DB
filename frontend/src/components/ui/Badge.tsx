import * as React from 'react';
import { ModeloEstado } from '@/types';
import { cn } from '@utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info';
  estado?: ModeloEstado;
}

const estadoVariants: Record<ModeloEstado, { variant: BadgeProps['variant']; label: string }> = {
  [ModeloEstado.IMPORTADO]: { variant: 'info', label: 'Importado' },
  [ModeloEstado.REQUISITOS_MINIMOS]: { variant: 'secondary', label: 'Requisitos Mínimos' },
  [ModeloEstado.EN_REVISION]: { variant: 'warning', label: 'En Revisión' },
  [ModeloEstado.PARA_CORREGIR]: { variant: 'destructive', label: 'Para Corregir' },
  [ModeloEstado.DEFINITIVO]: { variant: 'success', label: 'Definitivo' },
};

function Badge({ className, variant = 'default', estado, children, ...props }: BadgeProps) {
  const actualVariant = estado && estadoVariants[estado] ? estadoVariants[estado].variant : variant;
  const displayText = estado && estadoVariants[estado] ? estadoVariants[estado].label : children;

  const variants: Record<NonNullable<BadgeProps['variant']>, string> = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/80',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/80',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    success: 'bg-success text-success-foreground hover:bg-success/80',
    warning: 'bg-warning text-warning-foreground hover:bg-warning/80',
    info: 'bg-info text-info-foreground hover:bg-info/80',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        actualVariant ? variants[actualVariant] : variants.default,
        className
      )}
      {...props}
    >
      {displayText}
    </div>
  );
}

export { Badge, estadoVariants };
