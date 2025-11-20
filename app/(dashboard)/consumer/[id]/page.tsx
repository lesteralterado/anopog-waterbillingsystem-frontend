'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { usersAPI } from '@/lib/api';
import { User } from '@/types';
import { Loading } from '@/app/components/ui/Loading';
import { Button } from '@/app/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ConsumerDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [consumer, setConsumer] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsumer = async () => {
      try {
        const response = await usersAPI.getConsumers();
        const data = response.data;
        const list: User[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.users)
          ? data.users
          : Array.isArray(data?.data)
          ? data.data
          : [];

        const foundConsumer = list.find(c => c.id.toString() === id);
        setConsumer(foundConsumer || null);
      } catch (error) {
        console.error('Failed to fetch consumer:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchConsumer();
    }
  }, [id]);

  if (loading) return <Loading />;

  if (!consumer) {
    return (
      <div className="space-y-6">
        <Link href="/consumer">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Consumers
          </Button>
        </Link>
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500">Consumer not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/consumer">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Consumers
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Consumer Details</h1>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">ID</label>
                <p className="text-gray-900">{consumer.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Full Name</label>
                <p className="text-gray-900">{consumer.full_name || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Username</label>
                <p className="text-gray-900">{consumer.username || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{consumer.email}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Account Details</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Role</label>
                <p className="text-gray-900">{consumer.role?.name || 'Consumer'}</p>
              </div>
              {consumer.address && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Address</label>
                  <p className="text-gray-900">{consumer.address}</p>
                </div>
              )}
              {consumer.phone && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-gray-900">{consumer.phone}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}