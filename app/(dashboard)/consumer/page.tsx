"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Consumer } from '@/types/consumer';
import ConsumersTable from '@/app/components/consumer/ConsumersTable';
import PurokTabs from '@/app/components/consumer/PurokTabs';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { Select } from '@/app/components/ui/Select';
import { Loading } from '@/app/components/ui/Loading';
import { Search, UserPlus, Filter } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { mockConsumersWithPurok } from '@/lib/mockData';

const STATUS_OPTIONS = [
  { label: 'All Status', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

// Simulated API call with mock data
const fetchConsumers = async (purok: number) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockConsumersWithPurok.filter(consumer => consumer.purok === purok);
};

const ITEMS_PER_PAGE = 10;

export default function ConsumerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [consumers, setConsumers] = useState<Consumer[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    purok: 1,
    status: null as string | null,
    search: '',
  });
  const [purokCounts, setPurokCounts] = useState<Record<number, number>>({});
  
  const debouncedSearch = useDebounce(filters.search, 300);

  useEffect(() => {
    const loadConsumers = async () => {
      setLoading(true);
      try {
        const data = await fetchConsumers(filters.purok);
        setConsumers(data);
        
        // Calculate counts for all puroks
        const counts = Array.from({ length: 8 }, (_, i) => i + 1).reduce(
          (acc, purok) => ({
            ...acc,
            [purok]: mockConsumersWithPurok.filter(c => c.purok === purok).length,
          }),
          {}
        );
        setPurokCounts(counts);
      } catch (error) {
        console.error('Failed to fetch consumers:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConsumers();
  }, [filters.purok]);

  // Filter consumers based on search and status
  const filteredConsumers = consumers.filter((consumer) => {
    const matchesSearch = debouncedSearch
      ? consumer.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        consumer.meter_number.toLowerCase().includes(debouncedSearch.toLowerCase())
      : true;
    
    const matchesStatus = filters.status
      ? consumer.status === filters.status
      : true;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredConsumers.length / ITEMS_PER_PAGE);
  const paginatedConsumers = filteredConsumers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePurokChange = (purok: number) => {
    setFilters((prev) => ({ ...prev, purok }));
    setCurrentPage(1);
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Consumer Management</h1>
          <p className="text-gray-600">View and manage water consumers by purok</p>
        </div>
        <Button onClick={() => router.push('/consumer/add')}>
          <UserPlus className="w-5 h-5 mr-2" />
          Add Consumer
        </Button>
      </div>

      {/* Purok Tabs */}
      <PurokTabs
        activePurok={filters.purok}
        onPurokChange={handlePurokChange}
        // counts={purokCounts}
      />

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search by name or meter number..."
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="text-gray-400 w-5 h-5" />
          <Select
            value={filters.status || ''}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value || null }))}
            options={STATUS_OPTIONS}
          />
        </div>
      </div>

      {/* Consumers Table */}
      {filteredConsumers.length > 0 ? (
        <ConsumersTable
          consumers={paginatedConsumers}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No consumers found</p>
        </div>
      )}
    </div>
  );
}
