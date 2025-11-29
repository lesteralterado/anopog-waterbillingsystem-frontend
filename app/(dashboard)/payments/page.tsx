'use client'

import React from 'react'
import { usePayments } from '@/hooks/usePayments'
import PaymentsTable from '@/app/components/payments/PaymentsTable'
import { Loading } from '@/app/components/ui/Loading'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/Card'
import { AlertCircle } from 'lucide-react'

function PaymentsPage() {
  const { payments, loading, error } = usePayments()

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Payments</h2>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payments</h1>
        <p className="text-gray-600">View all payment transactions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>
            A list of all payment transactions in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No payments found.</p>
            </div>
          ) : (
            <PaymentsTable payments={payments} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default PaymentsPage
