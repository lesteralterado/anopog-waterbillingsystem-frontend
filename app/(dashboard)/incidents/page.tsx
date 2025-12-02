"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { incidentsAPI } from '@/lib/api'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/app/components/ui/Card'
import { Loading } from '@/app/components/ui/Loading'
import { Badge } from '@/app/components/ui/Badge'

export default function IncidentsPage() {
  const router = useRouter()

  const [incidents, setIncidents] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const fetchIncidents = async () => {
      setLoading(true)
      try {
        console.log('Fetching all incidents/issues')
        const res = await incidentsAPI.getAll()
        console.log('Incidents API response:', res)
        const data = res.data?.incidents ?? res.data?.issues ?? res.data ?? []
        console.log('Parsed incidents data:', data)
        setIncidents(Array.isArray(data) ? data : [])
      } catch (err: any) {
        console.error('Failed to load incidents', err)
        console.error('Error response:', err?.response)
        setError(err?.response?.data?.message || 'Failed to load incidents')
      } finally {
        setLoading(false)
      }
    }

    fetchIncidents()
  }, [])

  if (loading) {
    return (
      <div className="p-6">
        <Loading />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Issues</h1>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {!incidents.length && !error && <div>No issues reported yet.</div>}

      <div className="grid gap-4">
        {incidents.map((incident: any) => (
          <Card key={incident.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push(`/incidents/${incident.id}`)}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{incident.title ?? `Issue #${incident.id}`}</CardTitle>
                <Badge>{incident.status ?? 'Open'}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">{incident.description ?? incident.details ?? 'No description'}</p>
              <div className="text-xs text-gray-500">
                Reported: {new Date(incident.created_at ?? incident.createdAt ?? Date.now()).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
