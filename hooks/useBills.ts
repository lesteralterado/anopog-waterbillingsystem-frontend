import { useState, useEffect, useCallback } from 'react';
import { billsAPI } from '@/lib/api';
import { Bill } from '@/types';
import { useAuth } from '@/context/AuthContext';

export function useBills() {
  const { user } = useAuth();
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNetworkError, setIsNetworkError] = useState(false);

  const fetchBills = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await billsAPI.getAll();
      const data = response.data;
      const list: Bill[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.bills)
        ? data.bills
        : Array.isArray(data?.data)
        ? data.data
        : [];

      // Filter bills for the current user
      const userBills = list.filter((bill) => bill.consumer_id === parseInt(user.id));
      setBills(userBills);
      setError(null);
      setIsNetworkError(false);
    } catch (err: any) {
      console.error('Failed to fetch bills:', err);
      setIsNetworkError(err.name === 'NetworkError' || err.name === 'ServerError');
      setError(err.message || 'Failed to load bills');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  return { bills, loading, error, isNetworkError, refetch: fetchBills };
}