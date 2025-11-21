"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/app/components/ui/Button'
import { Input } from '@/app/components/ui/Input'
import { Select } from '@/app/components/ui/Select'
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/Card'
import { ToastContainer, toast } from 'react-toastify'
import { usersAPI } from '@/lib/api'

const PUROK_OPTIONS = Array.from({ length: 8 }, (_, i) => ({ value: String(i + 1), label: `Purok ${i + 1}` }))

export default function AddConsumerPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
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

  // Set purok from URL parameter on component mount
  useEffect(() => {
    const purokParam = searchParams.get('purok')
    if (purokParam && purokParam >= '1' && purokParam <= '8') {
      setForm(prev => ({ ...prev, purok: purokParam }))
    }
  }, [searchParams])

  const handleChange = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }))

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!form.fullName.trim()) return toast.error('Full name is required')
    if (!form.meterNumber.trim()) return toast.error('Meter number is required')
    if (!form.username.trim()) return toast.error('Username is required')
    if (!form.password.trim()) return toast.error('Password is required')
    if (!form.purok) return toast.error('Purok is required')

    setLoading(true)
    try {
        const payload = {
            username: form.username.trim(),
            password: form.password.trim(),
            role_id: 3, // Client/Consumer - static for consumers
            address: form.address.trim() || null,
            email: form.email.trim() || null,
            full_name: form.fullName.trim(),
            meter_number: form.meterNumber.trim(),
            phone: form.phone.trim() || null,
            purok: parseInt(form.purok) || null,
        }

        // Forward data to backend endpoint using API utility
        const response = await usersAPI.create(payload)
        const result = response.data

        toast.success('Consumer created successfully')
        router.push(`/consumer?purok=${form.purok}`)
    } catch (err: any) {
        console.error('Failed to create consumer', err)
        const message = err?.response?.data?.message || err?.message || 'Failed to create consumer'
        toast.error(message)
    } finally {
        setLoading(false)
    }
}

  return (
    <div className="container mx-auto py-6">
      <div className="w-full mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Add Consumer</CardTitle>
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
                  <Input required type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="email@example.com" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Phone</label>
                  <Input required value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="+63 9xx xxx xxxx" />
                </div>

              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Username *</label>
                  <Input required value={form.username} onChange={(e) => handleChange('username', e.target.value)} placeholder="username" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Password *</label>
                  <Input required type="password" value={form.password} onChange={(e) => handleChange('password', e.target.value)} placeholder="Enter password" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Meter Number *</label>
                  <Input required value={form.meterNumber} onChange={(e) => handleChange('meterNumber', e.target.value)} placeholder="WM-2025-001" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Address</label>
                  <Input required value={form.address} onChange={(e) => handleChange('address', e.target.value)} placeholder="Street, Barangay" />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Create Consumer'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
        <ToastContainer />
      </div>
    </div>
  )
}
