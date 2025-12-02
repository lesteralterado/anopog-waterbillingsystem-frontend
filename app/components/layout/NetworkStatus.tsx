'use client';

import { useNetworkStatusContext } from '@/context/NetworkStatusContext';
import { Wifi, WifiOff } from 'lucide-react';
import Alert from '@/app/components/ui/Alert';

export default function NetworkStatus() {
  const { isOnline, wasOffline } = useNetworkStatusContext();

  if (isOnline && !wasOffline) {
    return null; // Don't show anything when online and no recent offline event
  }

  return (
    <div className="mb-4">
      {!isOnline ? (
        <Alert
          type="warning"
          message="You're currently offline. Some features may not be available."
          className="border-amber-300"
        />
      ) : wasOffline ? (
        <Alert
          type="success"
          message="Connection restored! You're back online."
          className="border-green-300"
        />
      ) : null}
    </div>
  );
}

export function NetworkStatusIndicator() {
  const { isOnline } = useNetworkStatusContext();

  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium">
      {isOnline ? (
        <>
          <Wifi className="w-4 h-4 text-green-600" />
          <span className="text-green-700">Online</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4 text-red-600" />
          <span className="text-red-700">Offline</span>
        </>
      )}
    </div>
  );
}