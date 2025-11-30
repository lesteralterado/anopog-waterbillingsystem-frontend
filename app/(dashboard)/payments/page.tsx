'use client'

import React, { useState, useMemo } from 'react'
import { usePayments } from '@/hooks/usePayments'
import PaymentsTable from '@/app/components/payments/PaymentsTable'
import { Loading } from '@/app/components/ui/Loading'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/Card'
import { Input } from '@/app/components/ui/Input'
import { Select } from '@/app/components/ui/Select'
import { AlertCircle, Search, Filter } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'

const PAYMENT_METHOD_OPTIONS = [
  { label: 'All Methods', value: '' },
  { label: 'GCash', value: 'gcash' },
  { label: 'Cash', value: 'cash' },
  { label: 'Bank Transfer', value: 'bank_transfer' },
];

const STATUS_OPTIONS = [
  { label: 'All Status', value: '' },
  { label: 'Completed', value: 'completed' },
  { label: 'Pending', value: 'pending' },
  { label: 'Failed', value: 'failed' },
  { label: 'Cancelled', value: 'cancelled' },
];

const DEFAULT_ITEMS_PER_PAGE = 10;

function PaymentsPage() {
  const { payments, loading, error } = usePayments()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE)
  const [filters, setFilters] = useState({
    search: '',
    paymentMethod: '',
    status: '',
  })

  const debouncedSearch = useDebounce(filters.search, 300)

  // Filter payments based on search and filters
  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const matchesSearch = debouncedSearch
        ? (payment.consumer_name || '').toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          payment.transaction_id.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          payment.id.toString().includes(debouncedSearch)
        : true;

      const matchesMethod = filters.paymentMethod
        ? payment.payment_method === filters.paymentMethod
        : true;

      const matchesStatus = filters.status
        ? payment.status === filters.status
        : true;

      return matchesSearch && matchesMethod && matchesStatus;
    });
  }, [payments, debouncedSearch, filters.paymentMethod, filters.status]);

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Payments</h2>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payments</h1>
        <p className="text-gray-600">View and manage all payment transactions</p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by consumer name, transaction ID..."
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <Select
                value={filters.paymentMethod}
                onChange={(e) => setFilters((prev) => ({ ...prev, paymentMethod: e.target.value }))}
                options={PAYMENT_METHOD_OPTIONS}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <Select
                value={filters.status}
                onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
                options={STATUS_OPTIONS}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>
            A list of all payment transactions in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredPayments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No payments found matching your criteria.</p>
            </div>
          ) : (
            <PaymentsTable
              payments={paginatedPayments}
              currentPage={currentPage}
              totalItems={filteredPayments.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default PaymentsPage
