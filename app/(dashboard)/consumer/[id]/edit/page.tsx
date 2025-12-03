"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/app/components/ui/Button'
import { Input } from '@/app/components/ui/Input'
import { Select } from '@/app/components/ui/Select'
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/Card'
import { ToastContainer, toast } from 'react-toastify'
import { usersAPI } from '@/lib/api'
import { User } from '@/types'
import { Loading } from '@/app/components/ui/Loading'

const PUROK_OPTIONS = Array.from({ length: 8 }, (_, i) => ({ value: String(i + 1), label: `Purok ${i + 1}` }))

export default function EditConsumerPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    password: '',
    meterNumber: '',
    purok: '1',
    address: '',
    phone: '',
    email: '',
  })

  useEffect(() => {
    const fetchConsumer = async () => {
      try {
        const response = await usersAPI.getConsumers()
        const data = response.data as any
        const list: User[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.users)
          ? data.users
          : Array.isArray(data?.data)
          ? data.data
          : []

        const consumer = list.find(c => c.id.toString() === id)
        if (consumer) {
          setForm({
            fullName: consumer.full_name || '',
            username: consumer.username || '',
            password: '', // Don't pre-fill password
            meterNumber: consumer.meter_number || '',
            purok: consumer.purok?.toString() || '1',
            address: consumer.address || '',
            phone: consumer.phone || '',
            email: consumer.email || '',
          })
        } else {
          toast.error('Consumer not found')
          router.push('/consumer')
        }
      } catch (error) {
        console.error('Failed to fetch consumer:', error)
        toast.error('Failed to load consumer data')
        router.push('/consumer')
      } finally {
        setFetchLoading(false)
      }
    }

    if (id) {
      fetchConsumer()
    }
  }, [id, router])

  const handleChange = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!form.fullName.trim()) return toast.error('Full name is required')
    if (!form.meterNumber.trim()) return toast.error('Meter number is required')
    if (!form.username.trim()) return toast.error('Username is required')
    if (!form.purok) return toast.error('Purok is required')

    setLoading(true)
    try {
      const payload: Record<string, unknown> = {
        username: form.username.trim(),
        role_id: 3, // Client/Consumer - static for consumers
        address: form.address.trim() || null,
        email: form.email.trim() || null,
        full_name: form.fullName.trim(),
        meterNumber: form.meterNumber.trim(),
        phone: form.phone.trim() || null,
        purok: parseInt(form.purok) || null,
      }

      if (form.password.trim()) {
        payload.password = form.password.trim()
      }

      // Update consumer
      await usersAPI.update(id, payload)

      toast.success('Consumer updated successfully')
      router.push(`/consumer/${id}`)
    } catch (err: any) {
      console.error('Failed to update consumer', err)
      const message = err?.response?.data?.message || err?.message || 'Failed to update consumer'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) return <Loading />

  return (
    <div className="container mx-auto py-6">
      <div className="w-full mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Edit Consumer</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Full Name *</label>
                  <Input required value={form.fullName} onChange={(e) => handleChange('fullName', e.target.value)} placeholder="Juan Dela Cruz" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Purok *</label>
                  <Select required value={form.purok} onChange={(e) => handleChange('purok', e.target.value)} options={[{ value: '', label: 'Select Purok' }, ...PUROK_OPTIONS]} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Email</label>
                  <Input type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="email@example.com" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Phone</label>
                  <Input value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="+63 9xx xxx xxxx" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Username *</label>
                  <Input required value={form.username} onChange={(e) => handleChange('username', e.target.value)} placeholder="username" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Password (leave blank to keep current)</label>
                  <Input type="password" value={form.password} onChange={(e) => handleChange('password', e.target.value)} placeholder="Enter new password" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Meter Number *</label>
                  <Input required value={form.meterNumber} onChange={(e) => handleChange('meterNumber', e.target.value)} placeholder="WM-2025-001" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Address</label>
                  <Input value={form.address} onChange={(e) => handleChange('address', e.target.value)} placeholder="Street, Barangay" />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update Consumer'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
        <ToastContainer />
      </div>
    </div>
  )
}