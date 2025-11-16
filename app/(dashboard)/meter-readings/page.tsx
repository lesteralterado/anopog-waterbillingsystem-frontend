'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockMeterReadings } from '@/lib/mockData';
import ReadingsTable from '@/app/components/meter-readings/ReadingsTable';
import ReadingCard from '@/app/components/meter-readings/ReadingCard';
import { Button } from '@/app/components/ui/Button';
import { Select } from '@/app/components/ui/Select';
import { Plus, Search, Grid, List } from 'lucide-react';

export default function MeterReadingsPage() {
  const router = useRouter();
  const [readings] = useState(mockMeterReadings);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Filter readings
  const filteredReadings = readings.filter((reading) => {
    const matchesSearch =
      reading.consumer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reading.reader_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reading.id.toString().includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || reading.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
                placeholder="Search by consumer, reader, or reading ID..."
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
          <p className="text-2xl font-bold text-gray-900 mt-1">{readings.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600">Pending Approval</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            {readings.filter((r) => r.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600">Approved Today</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {readings.filter((r) => r.status === 'approved').length}
          </p>
        </div>
      </div>

      {/* Readings Display */}
      {filteredReadings.length > 0 ? (
        viewMode === 'table' ? (
          <ReadingsTable readings={filteredReadings} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReadings.map((reading) => (
              <ReadingCard
                key={reading.id}
                reading={reading}
                onViewPhoto={setSelectedImage}
              />
            ))}
          </div>
        )
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
