import { useState, useEffect, useCallback } from 'react';
import { billsAPI } from '@/lib/api';
import { Bill } from '@/types';

export function useBills() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNetworkError, setIsNetworkError] = useState(false);

  const fetchBills = useCallback(async () => {
    try {
      setLoading(true);
      const response = await billsAPI.getMyBills();
      const data = response.data;
      const list: Bill[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.bills)
        ? data.bills
        : Array.isArray(data?.data)
        ? data.data
        : [];

      setBills(list);
      setError(null);
      setIsNetworkError(false);
    } catch (err: any) {
      console.error('Failed to fetch bills:', err);
      setIsNetworkError(err.name === 'NetworkError' || err.name === 'ServerError');
      setError(err.message || 'Failed to load bills');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  return { bills, loading, error, isNetworkError, refetch: fetchBills };
}