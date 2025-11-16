"use client"

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import api from '@/lib/api'
import { Button } from '@/app/components/ui/Button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/app/components/ui/Card'
import { Loading } from '@/app/components/ui/Loading'

export default function IncidentPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id

  const [incident, setIncident] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (!id) return

    const fetchIncident = async () => {
      setLoading(true)
      try {
        const res = await api.get(`/api/incidents/${id}`)
        // Support different response shapes
        const data = res.data?.incident ?? res.data ?? null
        setIncident(data)
      } catch (err: any) {
        setError(err?.response?.data?.message || err?.message || 'Failed to load incident')
      } finally {
        setLoading(false)
      }
    }

    fetchIncident()
  }, [id])

  if (loading) {
    return (
      <div className="p-6">
        <Loading />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-4 flex items-center gap-3">
        <Button variant="ghost" onClick={() => router.back()}>
          Back
        </Button>
        <h1 className="text-2xl font-bold">Incident Details</h1>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {!incident && !error && <div>No incident found.</div>}

      {incident && (
        <Card>
          <CardHeader>
            <CardTitle>{incident.title || `Incident #${incident.id ?? id}`}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-2">
              Status: <strong>{incident.status ?? 'N/A'}</strong>
            </p>

            {incident.description || incident.details ? (
              <p className="mb-4">{incident.description ?? incident.details}</p>
            ) : (
              <pre className="mb-4 text-sm bg-gray-50 p-3 rounded">{JSON.stringify(incident, null, 2)}</pre>
            )}

            <div className="text-xs text-gray-500">
              Reported: {incident.createdAt ?? incident.created_at ?? incident.date ?? '—'}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
