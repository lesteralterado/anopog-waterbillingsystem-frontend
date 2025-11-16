"use client";

import { cn } from '@/lib/utils';

interface PurokTabsProps {
  activePurok: number;
  onPurokChange: (purok: number) => void;
  // counts: Record<number, number>;
}

export default function PurokTabs({ activePurok, onPurokChange }: PurokTabsProps) {
  const puroks = Array.from({ length: 8 }, (_, i) => i + 1);

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-4 overflow-x-auto" aria-label="Puroks">
        {puroks.map((p) => (
          <button
            key={p}
            onClick={() => onPurokChange(p)}
            className={cn(
              'whitespace-nowrap py-3 px-4 border-b-2 text-sm font-medium cursor-pointer',
              activePurok === p
                ? 'border-sky-500 text-sky-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            )}
          >
            Purok {p}
            {/* <span className={cn('ml-2 rounded-full px-2 py-0.5 text-xs bg-gray-100 text-gray-600')}>{counts?.[p] ?? 0}</span> */}
          </button>
        ))}
      </nav>
    </div>
  );
}
