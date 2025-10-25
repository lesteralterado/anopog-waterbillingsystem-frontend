"use client";

import React, { ReactNode, useEffect, useState } from 'react';
import Alert from '@/app/components/ui/Alert';
import { Button } from '@/app/components/ui/Button';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  delta?: number; // positive or negative change
  icon?: ReactNode;
  onAction?: () => void;
  actionLabel?: string;
  className?: string;
  copyable?: boolean;
}

export default function StatCard({
  title,
  value,
  subtitle,
  delta,
  icon,
  onAction,
  actionLabel = 'Action',
  className,
  copyable = true,
}: StatCardProps) {
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleCopy = async () => {
    if (!copyable) return;
    try {
      await navigator.clipboard.writeText(String(value));
      setToast('Copied to clipboard');
    } catch (err) {
      setToast('Failed to copy');
    }
  };

  const handleAction = () => {
    if (onAction) {
      try {
        onAction();
        setToast(`${actionLabel} successful`);
      } catch (err) {
        setToast(`${actionLabel} failed`);
      }
    } else {
      setToast(`${actionLabel} clicked`);
    }
  };

  const deltaElement = typeof delta === 'number' ? (
    <span
      className={cn(
        'ml-2 inline-flex items-center rounded px-2 py-0.5 text-xs font-medium',
        delta >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      )}
    >
      {delta >= 0 ? `+${delta}` : delta}
    </span>
  ) : null;

  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 p-4', className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {icon ? <div className="text-gray-600">{icon}</div> : null}
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <div className="flex items-center">
              <h3 className="text-2xl font-semibold text-gray-900">{value}</h3>
              {deltaElement}
            </div>
            {subtitle ? <p className="text-sm text-gray-500">{subtitle}</p> : null}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {copyable ? (
            <Button variant="outline" size="sm" onClick={handleCopy}>
              Copy
            </Button>
          ) : null}
          <Button size="sm" onClick={handleAction}>
            {actionLabel}
          </Button>
        </div>
      </div>

      {/* Toast (simple, in-component) */}
      {toast ? (
        <div className="fixed top-4 right-4 z-50 w-80">
          <Alert {...({ variant: 'success', children: toast } as any)} />
        </div>
      ) : null}
    </div>
  );
}
