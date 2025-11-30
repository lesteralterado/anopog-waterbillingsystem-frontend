"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { incidentsAPI } from '@/lib/api'
import { Button } from '@/app/components/ui/Button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/app/components/ui/Card'
import { Input } from '@/app/components/ui/Input'
import { Label } from '@/app/components/ui/Label'
import { Textarea } from '@/app/components/ui/Textarea'
import { Loading } from '@/app/components/ui/Loading'
import { AlertCircle, CheckCircle } from 'lucide-react'

export default function ReportIssuePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    contact: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await incidentsAPI.create(formData)
      setSuccess(true)
      setFormData({
        title: '',
        description: '',
        location: '',
        contact: '',
      })
    } catch (err: any) {
      console.error('Failed to report issue', err)
      setError(err?.response?.data?.message || 'Failed to report issue. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Issue Reported Successfully</h2>
              <p className="text-gray-600 mb-6">
                Thank you for reporting this issue. Our team will review it and take appropriate action.
              </p>
              <Button onClick={() => setSuccess(false)} className="w-full">
                Report Another Issue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Report an Issue</CardTitle>
          <p className="text-gray-600 text-center">
            Please provide details about the water service issue you're experiencing.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Issue Title *</Label>
              <Input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="Brief description of the issue"
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                placeholder="Please provide detailed information about the issue"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                placeholder="Where is the issue occurring?"
              />
            </div>

            <div>
              <Label htmlFor="contact">Contact Information</Label>
              <Input
                id="contact"
                name="contact"
                type="text"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Phone number or email for follow-up"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Loading /> : 'Submit Report'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}