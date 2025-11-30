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
      const rawPayments = Array.isArray(data)
        ? data
        : Array.isArray(data?.payments)
        ? data.payments
        : Array.isArray(data?.data)
        ? data.data
        : [];

      // Transform backend data to match Payment interface
      const list: Payment[] = rawPayments.map((item: any) => ({
        id: parseInt(item.id) || 0,
        bill_id: item.bill_id || item.bill?.id || 0,
        amount: item.amount_paid?.d?.[0] || item.amount || 0,
        payment_method: item.payment_method || 'N/A',
        transaction_id: item.transaction_id || 'N/A',
        payment_date: (typeof item.payment_date === 'string' && item.payment_date) ||
                      (typeof item.payment_date === 'object' && Object.keys(item.payment_date).length > 0 && !isNaN(new Date(item.payment_date).getTime()))
                      ? new Date(item.payment_date).toISOString()
                      : '',
        status: item.status || 'completed', // Assume completed if not provided
        consumer_name: item.consumer_name || item.bill?.user?.full_name || item.bill?.user?.name || 'N/A',
        bill_amount: item.bill?.amount_due || item.amount || 0,
      }));

      // Sort payments by payment_date descending (newest first)
      list.sort((a, b) => {
        const dateA = a.payment_date ? new Date(a.payment_date).getTime() : 0;
        const dateB = b.payment_date ? new Date(b.payment_date).getTime() : 0;
        return dateB - dateA;
      });

      console.log('Parsed and sorted payments list:', list);
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