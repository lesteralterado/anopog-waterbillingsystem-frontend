'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { meterReadingsAPI, usersAPI } from '@/lib/api';
import { MeterReading } from '@/types';
import ReadingsTable from '@/app/components/meter-readings/ReadingsTable';
import ReadingCard from '@/app/components/meter-readings/ReadingCard';
import { Button } from '@/app/components/ui/Button';
import { Select } from '@/app/components/ui/Select';
import { Loading } from '@/app/components/ui/Loading';
import Pagination from '@/app/components/shared/Pagination';
import { Plus, Search, Grid, List } from 'lucide-react';

export default function MeterReadingsPage() {
  const router = useRouter();
  const [readings, setReadings] = useState<MeterReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [consumersMap, setConsumersMap] = useState<Map<number, string>>(new Map());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First, fetch consumers to build the map
        const consumersResponse = await usersAPI.getConsumers();
        const consumersData = consumersResponse.data;
        const consumersList = Array.isArray(consumersData) ? consumersData : [];
        const map = new Map<number, string>();
        for (const consumer of consumersList) {
          const name = consumer.full_name || consumer.username || `Consumer ${consumer.id}`;
          map.set(Number(consumer.id), name);
        }
        setConsumersMap(map);

        // Then fetch meter readings
        const response = await meterReadingsAPI.getAll();

        // Normalize different possible response shapes from the backend.
        // API returns: { success: true, meterReadings: [...] }
        const data = response.data;
        const apiList = data?.meterReadings || data || [];
        const list = Array.isArray(apiList) ? apiList : [];

        // console.log('Normalized list:', list);

        if (!Array.isArray(list)) {
          console.error('Unexpected meter readings response shape:', response.data);
        }

        // Map API response to frontend expected format
        const processedList: MeterReading[] = [];
        for (const reading of list) {
          try {
            // Handle reading_value object (appears to be a Decimal/BigNumber representation)
            let readingValue = 0;
            if (typeof reading.reading_value === 'number') {
              readingValue = reading.reading_value;
            } else if (reading.reading_value && typeof reading.reading_value === 'object') {
              // Handle Decimal object format: {s: 1, e: 2, d: [185]} = 185 * 10^(2-1) = 18500
              const rv = reading.reading_value as any;
              if (rv.d && Array.isArray(rv.d) && rv.d.length > 0) {
                readingValue = rv.d[0] * Math.pow(10, (rv.e || 0) - (rv.s || 0));
              }
            }

            // Handle reading_date (currently empty object, use current date as fallback)
            let readingDate = new Date().toISOString();
            if (reading.reading_date && typeof reading.reading_date === 'string') {
              readingDate = reading.reading_date;
            }

            const consumerId = Number(reading.user_id) || 0;
            const consumerName = map.get(consumerId) || reading.user?.full_name || reading.user?.username || `Consumer ${consumerId}`;

            const processedReading: MeterReading = {
              id: Number(reading.id) || 0,
              consumer_id: consumerId,
              reader_id: 0, // Not provided by API, default to 0
              consumer_name: consumerName,
              reader_name: 'System', // Not provided by API
              reading_value: readingValue,
              photo_url: reading.image_url ? String(reading.image_url) : undefined, // API uses image_url
              reading_date: readingDate,
              status: 'pending', // Default status
              created_at: readingDate, // Use reading_date as created_at fallback
            };
            processedList.push(processedReading);
          } catch (error) {
            console.error('Error processing reading:', reading, error);
          }
        }

        // Sort by reading_date descending (newest first)
        processedList.sort((a, b) => new Date(b.reading_date).getTime() - new Date(a.reading_date).getTime());

        // console.log('Processed and sorted list:', processedList);

        setReadings(processedList);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter readings
  const filteredReadings = readings.filter((reading) => {
    const matchesSearch =
      reading.consumer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reading.reader_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reading.id.toString().includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || reading.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalFilteredReadings = filteredReadings.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedReadings = filteredReadings.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Reset to first page when items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meter Readings</h1>
          <p className="text-gray-600">View and manage water meter readings</p>
        </div>
        <Button className='cursor-pointer' onClick={() => router.push('/meter-readings/new')}>
          <Plus className="w-5 h-5 mr-2" />
          Submit Reading
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by user, or reading ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'pending', label: 'Pending' },
                { value: 'approved', label: 'Approved' },
                { value: 'rejected', label: 'Rejected' },
              ]}
            />
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
          <span className="text-sm text-gray-600 mr-2">View:</span>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'table'
                ? 'bg-sky-100 text-sky-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-sky-100 text-sky-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600">Total Readings</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{filteredReadings.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600">Pending Approval</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            {filteredReadings.filter((r) => r.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600">Approved Today</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {filteredReadings.filter((r) => r.status === 'approved').length}
          </p>
        </div>
      </div>

      {/* Readings Display */}
      {filteredReadings.length > 0 ? (
        <>
          {viewMode === 'table' ? (
            <>
              <ReadingsTable readings={paginatedReadings} />
              <Pagination
                currentPage={currentPage}
                totalItems={totalFilteredReadings}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedReadings.map((reading) => (
                <ReadingCard
                  key={reading.id}
                  reading={reading}
                  onViewPhoto={setSelectedImage}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No meter readings found</p>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 text-2xl font-bold"
            >
              ✕
            </button>
            <img
              src={selectedImage}
              alt="Meter Reading"
              className="w-full h-auto rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
