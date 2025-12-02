"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Receipt,
  CreditCard,
  Users,
  Gauge,
  AlertCircle,
  UserCog,
  X,
} from 'lucide-react';
import Image from 'next/image';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Receipt, label: 'Bills', href: '/bills' },
  { icon: CreditCard, label: 'Payments', href: '/payments' },
  { icon: Users, label: 'Consumers', href: '/consumer' },
  { icon: Gauge, label: 'Meter Readings', href: '/meter-readings' },
  { icon: AlertCircle, label: 'Incidents', href: '/incidents' },
  { icon: UserCog, label: 'Users & Staff', href: '/users' },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn(
      "flex flex-col w-64 bg-blue-950 border-r border-blue-800 h-screen z-50",
      isOpen ? "fixed inset-y-0 left-0" : "hidden lg:flex lg:sticky lg:top-0"
    )}>
      {/* Logo */}
      <div className="p-6 border-b border-blue-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden">
              <Image src="/anopog.png" alt="Logo" width={40} height={40} className="object-cover" />
            </div>
            <div>
              <h1 className="flex-col font-bold text-lg text-white">Anopog<span>Water Billing</span></h1>
              <p className="text-xs text-blue-200">Admin Portal</p>
            </div>
          </div>
          {isOpen && (
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg text-gray-200 hover:bg-blue-800"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={isOpen ? onClose : undefined}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 shadow-sm',
                    isActive
                      ? 'bg-blue-700 text-white font-medium shadow-md'
                      : 'text-gray-200 hover:bg-blue-800 hover:shadow-md'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}