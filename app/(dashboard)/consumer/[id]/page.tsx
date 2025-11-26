'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usersAPI } from '@/lib/api';
import { User } from '@/types';
import { Loading } from '@/app/components/ui/Loading';
import { Button } from '@/app/components/ui/Button';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';

export default function ConsumerDetailPage() {
  const params = useParams();
  const router = useRouter();
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

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this consumer? This action cannot be undone.')) {
      return;
    }

    try {
      await usersAPI.remove(id);
      toast.success('Consumer deleted successfully');
      router.push('/consumer');
    } catch (error) {
      console.error('Failed to delete consumer:', error);
      toast.error('Failed to delete consumer');
    }
  };

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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/consumer">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Consumers
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Consumer Details</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/consumer/${id}/edit`}>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
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
      <ToastContainer />
    </div>
  );
}