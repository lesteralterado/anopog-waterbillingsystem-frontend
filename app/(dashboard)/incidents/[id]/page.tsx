"use client"

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import api, { incidentsAPI } from '@/lib/api'
import { Button } from '@/app/components/ui/Button'
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
} from '@/app/components/ui/Card'
import { Loading } from '@/app/components/ui/Loading'
import { Badge } from '@/app/components/ui/Badge'
// Textarea UI component not found in project; use local fallback instead
import { ArrowLeft, CheckCircle, Clock, MessageSquare } from 'lucide-react'
import { ToastContainer, toast } from 'react-toastify'

// Local fallback Textarea component used when '@/app/components/ui/Textarea' is unavailable
function Textarea(props: any) {
	return (
		<textarea
			{...props}
			className={`${props.className ?? ''} w-full p-2 border rounded`}
		/>
	)
}

export default function IncidentDetailPage() {
	const params = useParams()
	const router = useRouter()
	const id = params?.id

	const [incident, setIncident] = useState<any>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string>('')
	const [addingComment, setAddingComment] = useState(false)
	const [commentText, setCommentText] = useState('')
	const [fixingDate, setFixingDate] = useState<string>('')

	useEffect(() => {
		if (!id) return

		const fetchIncident = async () => {
			setLoading(true)
			try {
				console.log(`Fetching all incidents to find ID: ${id}`)
				const res = await incidentsAPI.getAll()
				console.log('API response:', res)
				const data = res.data?.incidents ?? res.data?.issues ?? res.data ?? []
				console.log('Parsed incidents data:', data)
				const foundIncident = Array.isArray(data) ? data.find((incident: any) => incident.id.toString() === id) : null
				console.log('Found incident:', foundIncident)
				setIncident(foundIncident || null)
				if (foundIncident) {
					const existingFixingDate = foundIncident.fixing_date
					if (existingFixingDate) {
						setFixingDate(new Date(existingFixingDate).toISOString().split('T')[0])
					} else {
						const calculatedDueDate = new Date(new Date(foundIncident.created_at ?? foundIncident.createdAt ?? Date.now()).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
						setFixingDate(calculatedDueDate)
					}
				}
			} catch (err: any) {
				console.error('Failed to load incident', err)
				console.error('Error response:', err?.response)
				setError(err?.response?.data?.message || 'Failed to load incident')
			} finally {
				setLoading(false)
			}
		}

		fetchIncident()
	}, [id])

	const handleChangeStatus = async (newStatus: string) => {
		if (!incident) return
		try {
			setLoading(true)
			// Use incidentsAPI if available
			if (incidentsAPI && incidentsAPI.updateStatus) {
				await incidentsAPI.updateStatus(incident.id ?? id, newStatus)
			} else {
				await api.patch(`/api/issues/${incident.id ?? id}`, { status: newStatus })
			}
			setIncident({ ...incident, status: newStatus })
			toast.success('Status updated')
		} catch (err: any) {
			console.error('Failed to update status', err)
			toast.error('Failed to update status')
		} finally {
			setLoading(false)
		}
	}

	const handleScheduleFix = async () => {
		if (!incident || !fixingDate) return
		try {
			setLoading(true)
			await incidentsAPI.scheduleFix(incident.id ?? id, fixingDate)
			setIncident({ ...incident, fixing_date: fixingDate })
			toast.success('Fix scheduled successfully. Consumer has been notified of the fixing date.')
		} catch (err: any) {
			console.error('Failed to schedule fix', err)
			toast.error('Failed to schedule fix')
		} finally {
			setLoading(false)
		}
	}

	const handleResolveIssue = async () => {
		if (!incident) return
		const resolvedDate = new Date().toISOString()
		try {
			setLoading(true)
			await incidentsAPI.resolveIssue(incident.id ?? id, resolvedDate)
			setIncident({ ...incident, is_resolved: true, resolved_date: resolvedDate, status: 'Resolved' })
			toast.success('Issue resolved successfully')
		} catch (err: any) {
			console.error('Failed to resolve issue', err)
			toast.error('Failed to resolve issue')
		} finally {
			setLoading(false)
		}
	}

	const handleSendReminder = async () => {
		if (!incident) return
		try {
			setLoading(true)
			await incidentsAPI.sendResolutionReminder(incident.id ?? id)
			toast.success('Resolution reminder sent to consumer')
		} catch (err: any) {
			console.error('Failed to send reminder', err)
			toast.error('Failed to send reminder')
		} finally {
			setLoading(false)
		}
	}

	const handleAddComment = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!commentText.trim()) return
		setAddingComment(true)
		try {
			// attempt to post comment if backend supports it
			await api.post(`/api/issues/${id}/comments`, { text: commentText.trim() })
			// optimistic update
			const newComment = {
				id: Date.now(),
				text: commentText.trim(),
				created_at: new Date().toISOString(),
				author: 'You',
			}
			setIncident((prev: any) => ({ ...prev, comments: [newComment, ...(prev?.comments || [])] }))
			setCommentText('')
			toast.success('Comment added')
		} catch (err: any) {
			console.error('Failed to add comment', err)
			toast.error('Failed to add comment')
		} finally {
			setAddingComment(false)
		}
	}

	if (loading) return <div className="p-6"><Loading /></div>

	if (error) return <div className="p-6 text-red-600">{error}</div>

	if (!incident) return <div className="p-6">Incident not found.</div>

	return (
		<div className="container mx-auto p-6">
			<div className="flex items-center gap-4 mb-6">
				<Button variant="ghost" onClick={() => router.back()}>
					<ArrowLeft className="mr-2 h-4 w-4" /> Back
				</Button>
				<h1 className="text-2xl font-bold">Incident #{incident.id}</h1>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2">
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between w-full">
								<div>
									<CardTitle className="text-lg">{incident.title ?? 'Untitled incident'}</CardTitle>
									<p className="text-sm text-gray-500">{incident.location ?? incident.address ?? 'Location not specified'}</p>
								</div>
								<div>
									<Badge>{incident.status ?? 'Unknown'}</Badge>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<p className="mb-4 whitespace-pre-wrap">{incident.description ?? incident.details ?? 'No details provided.'}</p>

							{incident.images && incident.images.length > 0 && (
								<div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
									{incident.images.map((src: string, idx: number) => (
										<img key={idx} src={src} alt={`incident-${idx}`} className="w-full h-40 object-cover rounded" />
									))}
								</div>
							)}

							<div className="flex items-center gap-2 mt-4">
								<Button variant="outline" onClick={() => handleChangeStatus('In Progress')}>
									<Clock className="mr-2 h-4 w-4" /> Mark In Progress
								</Button>
								<Button variant="outline" onClick={handleSendReminder}>
									<MessageSquare className="mr-2 h-4 w-4" /> Send Resolution Reminder
								</Button>
								<Button onClick={handleResolveIssue}>
									<CheckCircle className="mr-2 h-4 w-4" /> Mark Resolved
								</Button>
							</div>
						</CardContent>
					</Card>

					<Card className="mt-6">
						<CardHeader>
							<CardTitle>Activity / Comments</CardTitle>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleAddComment} className="mb-4">
								<Textarea value={commentText} onChange={(e: any) => setCommentText(e.target.value)} placeholder="Add a comment..." />
								<div className="flex justify-end mt-2">
									<Button type="submit" disabled={addingComment}>{addingComment ? 'Adding...' : 'Add Comment'}</Button>
								</div>
							</form>

							<div className="space-y-4">
								{(incident.comments || []).length === 0 && <div className="text-sm text-gray-500">No activity yet.</div>}
								{(incident.comments || []).map((c: any) => (
									<div key={c.id} className="border rounded p-3">
										<div className="text-sm text-gray-700">{c.text}</div>
										<div className="text-xs text-gray-400 mt-2">{c.author ?? 'Unknown'} • {new Date(c.created_at ?? c.createdAt ?? Date.now()).toLocaleString()}</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>

				<aside>
					<Card>
						<CardHeader>
							<CardTitle>Details</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-sm text-gray-700 space-y-2">
								<div><strong>Reported by:</strong> {incident.reported_by ?? incident.reporter ?? '—'}</div>
								<div><strong>Date:</strong> {new Date(incident.created_at ?? incident.createdAt ?? Date.now()).toLocaleString()}</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">Fixing Date</label>
									<div className="flex gap-2">
										<input
											type="date"
											value={fixingDate}
											onChange={(e) => setFixingDate(e.target.value)}
											className="mt-1 block flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
										/>
										<Button onClick={handleScheduleFix} size="sm">Schedule Fix</Button>
									</div>
								</div>
								{incident.fixing_date && <div><strong>Scheduled Fixing Date:</strong> {new Date(incident.fixing_date).toLocaleDateString()}</div>}
								{incident.resolved_date && <div><strong>Resolved Date:</strong> {new Date(incident.resolved_date).toLocaleDateString()}</div>}
								<div><strong>Priority:</strong> {incident.priority ?? 'Normal'}</div>
								<div><strong>Contact:</strong> {incident.contact ?? '—'}</div>
							</div>
						</CardContent>
					</Card>
				</aside>
			</div>

			<ToastContainer />
		</div>
	)
}

