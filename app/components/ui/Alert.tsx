// import { ReactNode } from 'react';
// import { cva, type VariantProps } from 'class-variance-authority';

// const alertVariants = cva(
//   'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
//   {
//     variants: {
//       variant: {
//         default: 'bg-white text-foreground',
//         destructive:
//           'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
//         success: 'border-green-500/50 text-green-700 dark:text-green-400 [&>svg]:text-green-500',
//         warning: 'border-yellow-500/50 text-yellow-700 dark:text-yellow-400 [&>svg]:text-yellow-500',
//         info: 'border-blue-500/50 text-blue-700 dark:text-blue-400 [&>svg]:text-blue-500',
//       },
//     },
//     defaultVariants: {
//       variant: 'default',
//     },
//   }
// );

// export interface AlertProps extends VariantProps<typeof alertVariants> {
//   className?: string;
//   children: ReactNode;
// }

// export function Alert({ type, children, variant, className }: AlertProps) {
//   return (
//     <div className={alertVariants({ variant, className })}>
//       {children}
//     </div>
//   );
// }

import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, XCircle, Info, X } from 'lucide-react';

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
  className?: string;
}

export default function Alert({ type = 'info', message, onClose, className }: AlertProps) {
  const styles = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  };

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const Icon = icons[type];

  return (
    <div className={cn('p-4 rounded-lg border flex items-start gap-3', styles[type], className)}>
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <p className="flex-1">{message}</p>
      {onClose && (
        <button 
          onClick={onClose} 
          className="text-current hover:opacity-70 transition-opacity p-1"
          aria-label="Close alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}