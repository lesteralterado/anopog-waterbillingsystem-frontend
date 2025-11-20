'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { billsAPI } from '@/lib/api';
import { Bill } from '@/types';
import { Loading } from '@/app/components/ui/Loading';
import { Button } from '@/app/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function BillDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [bill, setBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBill = async () => {
      try {
        // Assuming there's a getById endpoint, otherwise we can filter from getAll
        const response = await billsAPI.getAll();
        const data = response.data;
        const list: Bill[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.bills)
          ? data.bills
          : Array.isArray(data?.data)
          ? data.data
          : [];

        const foundBill = list.find(b => b.id.toString() === id);
        setBill(foundBill || null);
      } catch (error) {
        console.error('Failed to fetch bill:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBill();
    }
  }, [id]);

  if (loading) return <Loading />;

  if (!bill) {
    return (
      <div className="space-y-6">
        <Link href="/bills">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Bills
          </Button>
        </Link>
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500">Bill not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/bills">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Bills
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Bill Details</h1>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Bill Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Bill ID</label>
                <p className="text-gray-900">{bill.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Consumer</label>
                <p className="text-gray-900">{bill.consumer_name || bill.consumer_email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Amount</label>
                <p className="text-gray-900">₱{bill.amount}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <p className="text-gray-900">{bill.status}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Additional Details</h3>
            <div className="space-y-3">
              {bill.consumption && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Consumption</label>
                  <p className="text-gray-900">{bill.consumption} m³</p>
                </div>
              )}
              {bill.due_date && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Due Date</label>
                  <p className="text-gray-900">{new Date(bill.due_date).toLocaleDateString()}</p>
                </div>
              )}
              {bill.created_at && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Created</label>
                  <p className="text-gray-900">{new Date(bill.created_at).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}