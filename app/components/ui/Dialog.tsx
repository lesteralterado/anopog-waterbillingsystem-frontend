"use client";

import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

interface DialogContentProps {
  className?: string;
  children: ReactNode;
}

interface DialogHeaderProps {
  className?: string;
  children: ReactNode;
}

interface DialogFooterProps {
  className?: string;
  children: ReactNode;
}

interface DialogTitleProps {
  className?: string;
  children: ReactNode;
}

interface DialogDescriptionProps {
  className?: string;
  children: ReactNode;
}

interface DialogTriggerProps {
  asChild?: boolean;
  children: ReactNode;
}

let DialogContext: any;
const DialogContextProvider = ({ children, value }: any) => {
  DialogContext = { value };
  return <>{children}</>;
};

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  const [isOpen, setIsOpen] = useState(open || false);

  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  return (
    <DialogContextProvider value={{ isOpen, setIsOpen: handleOpenChange }}>
      {children}
    </DialogContextProvider>
  );
}

export function DialogTrigger({ asChild, children }: DialogTriggerProps) {
  const { setIsOpen } = DialogContext.value;

  const handleClick = () => {
    setIsOpen(true);
  };

  if (asChild && children) {
    const child = children as any;
    return (
      <child.type {...child.props} onClick={handleClick}>
        {child.props.children}
      </child.type>
    );
  }

  return <button onClick={handleClick}>{children}</button>;
}

export function DialogContent({ className, children }: DialogContentProps) {
  const { isOpen, setIsOpen } = DialogContext.value;

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
  const content = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60"
        onClick={() => setIsOpen(false)}
      />

      {/* Dialog */}
      <div
        className={`relative z-[10000] bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 ${
          className || ''
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        {children}
      </div>
    </div>
  );

  if (typeof document !== 'undefined') {
    return createPortal(content, document.body);
  }

  return null;
}

export function DialogHeader({ className, children }: DialogHeaderProps) {
  return (
    <div className={`flex flex-col space-y-1.5 text-center sm:text-left p-6 pb-4 ${className || ''}`}>
      {children}
    </div>
  );
}

export function DialogFooter({ className, children }: DialogFooterProps) {
  return (
    <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-4 ${className || ''}`}>
      {children}
    </div>
  );
}

export function DialogTitle({ className, children }: DialogTitleProps) {
  return (
    <h2 className={`text-lg font-semibold leading-none tracking-tight ${className || ''}`}>
      {children}
    </h2>
  );
}

export function DialogDescription({ className, children }: DialogDescriptionProps) {
  return (
    <p className={`text-sm text-gray-500 ${className || ''}`}>
      {children}
    </p>
  );
}