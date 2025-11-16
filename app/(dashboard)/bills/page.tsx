'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { billsAPI, usersAPI } from '@/lib/api';
import { Bill } from '@/types';
import BillsTable from '@/app/components/bills/BillsTable';
import { Button } from '@/app/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/app/components/ui/Dialog';
import { Loading } from '@/app/components/ui/Loading';
import { Plus, Search } from 'lucide-react';

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Consumers state and loader
  const [consumers, setConsumers] = useState<any[]>([]);

  useEffect(() => {
    const fetchConsumers = async () => {
      try {
        const res = await usersAPI.getConsumers();
        const data = res.data;
        const list: any[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.users)
          ? data.users
          : Array.isArray(data?.data)
          ? data.data
          : [];

        if (!Array.isArray(list)) {
          console.error('Unexpected consumers response shape:', res.data);
        }

        setConsumers(list);
      } catch (err) {
        console.error('Failed to fetch consumers', err);
      }
    };

    fetchConsumers();
  }, []);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await billsAPI.getAll();
        // Normalize different possible response shapes from the backend.
        // Some APIs return an array directly, others wrap it: { bills: [...] } or { data: [...] }
        const data = response.data;
        const list: Bill[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.bills)
          ? data.bills
          : Array.isArray(data?.data)
          ? data.data
          : [];

        if (!Array.isArray(list)) {
          console.error('Unexpected bills response shape:', response.data);
        }

        setBills(list);
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
        <Button className='cursor-pointer' onClick={() => setIsDialogOpen(true)}>
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

      {/* Generate Bill Dialog (popover/modal) */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => setIsDialogOpen(open)}>
        <DialogContent className="sm:max-w-[720px] max-h-[90vh] overflow-y-auto rounded-lg bg-gray-900 text-white">
          <DialogHeader>
            <DialogTitle>Generate New Bill</DialogTitle>
            <DialogDescription>
              Fill out the form below to create a new bill. The background is dark to focus attention.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement & {
                consumer_email: { value: string };
                amount: { value: string };
                consumption: { value: string };
                due_date: { value: string };
              };

              const consumerEmail = form.consumer_email.value.trim();
              const amount = Number(form.amount.value);
              const consumption = form.consumption.value ? Number(form.consumption.value) : undefined;
              const dueDate = form.due_date.value || undefined;

              if (!consumerEmail) {
                alert('Consumer email is required');
                return;
              }
              if (!amount || amount <= 0) {
                alert('Amount must be greater than 0');
                return;
              }

              try {
                const res = await billsAPI.create({
                  consumer_email: consumerEmail,
                  amount,
                  consumption,
                  due_date: dueDate,
                });

                const created = res.data?.bill ?? res.data;
                if (created) {
                  // prepend to list for immediate feedback
                  setBills((prev) => [created, ...prev]);
                }
                setIsDialogOpen(false);
              } catch (err) {
                console.error('Failed to create bill', err);
                const message = (err as any)?.response?.data?.message || 'Failed to create bill';
                alert(message);
              }
            }}
            className="p-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Consumer email</label>
                <input name="consumer_email" type="email" className="w-full px-3 py-2 rounded-md bg-gray-800 text-white border border-gray-700" placeholder="consumer@example.com" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Amount</label>
                <input name="amount" type="number" step="0.01" className="w-full px-3 py-2 rounded-md bg-gray-800 text-white border border-gray-700" placeholder="Amount (PHP)" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Consumption (m³)</label>
                <input name="consumption" type="number" className="w-full px-3 py-2 rounded-md bg-gray-800 text-white border border-gray-700" placeholder="Consumption" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Due date</label>
// loadConsumers removed — consumers are now loaded inside the BillsPage component. 
</div>
</div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Consumers List (for debugging) */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Consumers ({consumers.length})</h2>
        <ul className="space-y-2">
          {consumers.map((c) => (
            <li key={c.id} className="text-gray-700">
              {c.full_name ?? c.username ?? c.email}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

async function loadConsumers() {
  try {
    const res = await usersAPI.getConsumers();
    // res.data will be an array of consumer user objects
    const consumers = res.data;
    console.log('consumers', consumers);
  } catch (err) {
    console.error('Failed to load consumers', err);
  }
}