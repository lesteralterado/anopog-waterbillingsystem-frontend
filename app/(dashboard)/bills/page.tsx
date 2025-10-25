
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { billsAPI } from '@/lib/api';
import { Bill } from '@/types';
import BillsTable from '@/app/components/bills/BillsTable';
import { Button } from '@/app/components/ui/Button';
import { Loading } from '@/app/components/ui/Loading';
import { Plus, Search } from 'lucide-react';

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await billsAPI.getAll();
        setBills(response.data);
      } catch (error) {
        console.error('Failed to fetch bills:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  const filteredBills = bills.filter((bill) =>
    bill.consumer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.consumer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.id.toString().includes(searchTerm)
  );

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bills Management</h1>
          <p className="text-gray-600">Manage and generate water bills</p>
        </div>
        <Button onClick={() => router.push('/bills/create')}>
          <Plus className="w-5 h-5 mr-2" />
          Generate Bill
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by consumer name, email, or bill ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Bills Table */}
      {filteredBills.length > 0 ? (
        <BillsTable bills={filteredBills} />
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No bills found</p>
        </div>
      )}
    </div>
  );
}