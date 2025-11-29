import { useState, useEffect, useCallback } from 'react';
import { paymentsAPI } from '@/lib/api';
import { Payment } from '@/types';

export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching payments from API...');
      const response = await paymentsAPI.getAll();
      console.log('Payments API response:', response);
      const data = response.data;
      console.log('Payments data:', data);
      const list: Payment[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.payments)
        ? data.payments
        : Array.isArray(data?.data)
        ? data.data
        : [];
      console.log('Parsed payments list:', list);
      setPayments(list);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch payments:', err);
      setError('Failed to load payments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return { payments, loading, error, refetch: fetchPayments };
}