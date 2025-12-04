import { useState, useEffect, useCallback } from 'react';
import { billsAPI, usersAPI } from '@/lib/api';
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
      let response;
      if (user.role_id === '3') { // Consumer
        response = await billsAPI.getMyBills();
      } else {
        response = await billsAPI.getAll();
      }
      const data = response.data;
      const rawList: any[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.bills)
        ? data.bills
        : Array.isArray(data?.data)
        ? data.data
        : [];

      // Fetch consumers to get consumer details
      const consumersResponse = await usersAPI.getConsumers();
      const consumers = consumersResponse.data;

      // Map API response to Bill interface
      const list: Bill[] = rawList.map((bill) => {
        console.log('Raw bill from API:', bill); // Debug log
        const consumer = consumers.find((c: any) => parseInt(c.id) === parseInt(bill.user_id));
        return {
          id: parseInt(bill.id),
          consumer_id: parseInt(bill.user_id),
          consumer_name: (consumer?.full_name || consumer?.name || '') as string,
          consumer_email: (consumer?.email || '') as string,
          amount: bill.amount_due,
          previous_reading: 0, // Not provided
          current_reading: 0, // Not provided
          consumption: bill.consumption || bill.usage || bill.consumption_amount || 0,
          due_date: bill.due_date || bill.dueDate || bill.due_date?.date || bill.due_date?.toString() || '',
          status: bill.is_paid ? 'paid' : 'unpaid',
          reading_date: '', // Not provided
          created_at: '', // Not provided
        };
      });

      // For consumers, API already filters; for others, show all
      const userBills = user.role_id === '3' ? list : list;
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