'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { mockConsumers } from '@/lib/mockData';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/app/components/ui/Input';
import { Select } from '@/app/components/ui/Select';
import { Button } from '@/app/components/ui/Button';
import Alert from '@/app/components/ui/Alert';
import PhotoUpload from '@/app/components/meter-readings/PhotoUpload';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/Card';
import { ArrowLeft, Gauge } from 'lucide-react';

export default function NewMeterReadingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    consumer_id: '',
    reading_value: '',
    photo_url: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoSelect = (photoUrl: string) => {
    setFormData({ ...formData, photo_url: photoUrl });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      // Validation
      if (!formData.consumer_id || !formData.reading_value) {
        throw new Error('Please fill in all required fields');
      }

      if (!formData.photo_url) {
        throw new Error('Please upload a meter photo');
      }

      // In real app, this would call the API
      // await meterReadingsAPI.create(formData);

      setSuccess('Meter reading submitted successfully!');
      setTimeout(() => router.push('/meter-readings'), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit reading');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Readings</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center">
            <Gauge className="w-6 h-6 text-sky-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Submit Meter Reading</h1>
            <p className="text-gray-600">Record a new water meter reading</p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Reading Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Consumer Selection */}
            <label className="block text-sm font-medium text-gray-700">Select Consumer *</label>
            <Select
              name="consumer_id"
              value={formData.consumer_id}
              onChange={handleChange}
              options={[
                { value: '', label: 'Choose a consumer...' },
                ...mockConsumers.map((consumer) => ({
                  value: consumer.id.toString(),
                  label: `${consumer.name} - ${consumer.address}`,
                })),
              ]}
              required
            />

            {/* Reading Value */}
            <Input
            //   label="Meter Reading (cubic meters) *"
              type="number"
              name="reading_value"
              placeholder="150.5"
              value={formData.reading_value}
              onChange={handleChange}
              step="0.1"
              min="0"
              required
            />

            {/* Photo Upload */}
            <PhotoUpload
              onPhotoSelect={handlePhotoSelect}
              currentPhoto={formData.photo_url}
            />

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Tips for accurate readings:</strong>
              </p>
              <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
                <li>Take a clear photo of the meter display</li>
                <li>Ensure all digits are visible</li>
                <li>Record the reading shown on the meter exactly</li>
                <li>Verify the reading before submitting</li>
              </ul>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Submitting...' : 'Submit Reading'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}