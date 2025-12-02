'use client';

import { useState, useEffect } from 'react';
import { billsAPI } from '@/lib/api';
import BillsTable from '@/app/components/bills/BillsTable';
import { Button } from '@/app/components/ui/Button';
import Pagination from '@/app/components/shared/Pagination';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/app/components/ui/Dialog';
import { Loading } from '@/app/components/ui/Loading';
import { Plus, Search } from 'lucide-react';
import { useBills } from '@/hooks/useBills';
import Alert from '@/app/components/ui/Alert';

export default function BillsPage() {
  const { bills, loading, error, isNetworkError, refetch } = useBills();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredBills = bills.filter((bill) =>
    bill.consumer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.consumer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.id.toString().includes(searchTerm)
  );

  // Pagination logic
  const totalFilteredBills = filteredBills.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBills = filteredBills.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <Alert
          type={isNetworkError ? 'warning' : 'error'}
          message={error}
        />
      )}

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
        <>
          <BillsTable bills={paginatedBills} />
          <Pagination
            currentPage={currentPage}
            totalItems={totalFilteredBills}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            itemsPerPageOptions={[10, 15, 20]}
          />
        </>
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

                refetch(); // Refresh the bills list
                setIsDialogOpen(false);
              } catch (err) {
                console.error('Failed to create bill', err);
                const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to create bill';
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
                {/* loadConsumers removed — consumers are now loaded inside the BillsPage component. */}
</div>
</div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
