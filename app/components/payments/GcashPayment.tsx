'use client'

import { useState } from 'react'
import { Button } from '@/app/components/ui/Button'
import { Input } from '@/app/components/ui/Input'
import { Label } from '@/app/components/ui/Label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/app/components/ui/Card'
import { Badge } from '@/app/components/ui/Badge'
import { Loader2, CheckCircle, XCircle, Smartphone, AlertCircle } from 'lucide-react'
import api from '@/lib/api'

interface Bill {
  id: string
  accountNumber: string
  customerName: string
  billingPeriod: string
  dueDate: string
  previousReading: number
  currentReading: number
  consumption: number
  amountDue: number
  status: 'pending' | 'paid' | 'overdue'
}

interface PaymentComponentProps {
  bill: Bill
  onPaymentSuccess?: (paymentId: string) => void
  onPaymentError?: (error: string) => void
}

export default function GCashPaymentComponent({ 
  bill, 
  onPaymentSuccess,
  onPaymentError 
}: PaymentComponentProps) {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [transactionId, setTransactionId] = useState('')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount)
  }

  const formatPhoneNumber = (value: string) => {
    // Remove non-digits
    const cleaned = value.replace(/\D/g, '')
    
    // Format as +63 XXX XXX XXXX
    if (cleaned.startsWith('63')) {
      const formatted = cleaned.slice(0, 12)
      if (formatted.length >= 3) {
        return `+63 ${formatted.slice(2, 5)}${formatted.length > 5 ? ' ' + formatted.slice(5, 8) : ''}${formatted.length > 8 ? ' ' + formatted.slice(8) : ''}`
      }
      return `+${formatted}`
    } else if (cleaned.startsWith('0')) {
      const formatted = cleaned.slice(0, 11)
      return `+63 ${formatted.slice(1, 4)}${formatted.length > 4 ? ' ' + formatted.slice(4, 7) : ''}${formatted.length > 7 ? ' ' + formatted.slice(7) : ''}`
    }
    return value
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhoneNumber(formatted)
  }

  const validatePhoneNumber = (phone: string): boolean => {
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '')
    // Check if it's a valid PH number (starts with 63 or 0 and has correct length)
    return (cleaned.startsWith('63') && cleaned.length === 12) || 
           (cleaned.startsWith('0') && cleaned.length === 11)
  }

  const createPayment = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setErrorMessage('Please enter a valid Philippine mobile number')
      return
    }

    setIsProcessing(true)
    setPaymentStatus('processing')
    setErrorMessage('')

    try {
      // Step 1: Create Payment Intent (use shared axios client)
      const intentRes = await api.post('/api/payments/create-intent', {
        amount: bill.amountDue,
        billId: bill.id,
        customerName: bill.customerName,
        accountNumber: bill.accountNumber,
      })

      const intentData = intentRes.data
      const paymentIntentId = intentData?.data?.id

      // Step 2: Create Payment Method
      const methodRes = await api.post('/api/payments/create-method', {
        paymentIntentId,
        phoneNumber: phoneNumber.replace(/\D/g, ''),
      })

      const methodData = methodRes.data
      const checkoutUrl = methodData?.data?.attributes?.next_action?.redirect?.url

      if (checkoutUrl) {
        // Redirect to GCash
        window.location.href = checkoutUrl
      } else {
        // Poll for payment status
        pollPaymentStatus(paymentIntentId)
      }

    } catch (error) {
      console.error('Payment error:', error)
      setPaymentStatus('failed')
      setErrorMessage(error instanceof Error ? error.message : 'Payment failed. Please try again.')
      setIsProcessing(false)
      onPaymentError?.(errorMessage)
    }
  }

  const pollPaymentStatus = async (paymentIntentId: string) => {
    const maxAttempts = 30
    let attempts = 0

    const poll = setInterval(async () => {
      attempts++

      try {
  const res = await api.get('/api/payments/status', { params: { id: paymentIntentId } })
  const data = res.data

  const status = data?.data?.attributes?.status

        if (status === 'succeeded') {
          clearInterval(poll)
          setPaymentStatus('success')
          setTransactionId(data.data.id)
          setIsProcessing(false)
          onPaymentSuccess?.(data.data.id)
        } else if (status === 'failed' || status === 'cancelled') {
          clearInterval(poll)
          setPaymentStatus('failed')
          setErrorMessage('Payment was cancelled or failed')
          setIsProcessing(false)
          onPaymentError?.('Payment failed')
        } else if (attempts >= maxAttempts) {
          clearInterval(poll)
          setPaymentStatus('failed')
          setErrorMessage('Payment timeout. Please check your GCash app.')
          setIsProcessing(false)
        }
      } catch (error) {
        console.error('Polling error:', error)
        clearInterval(poll)
        setPaymentStatus('failed')
        setErrorMessage('Failed to verify payment status')
        setIsProcessing(false)
      }
    }, 3000) // Poll every 3 seconds
  }

  const resetPayment = () => {
    setPaymentStatus('idle')
    setPhoneNumber('')
    setErrorMessage('')
    setTransactionId('')
  }

  if (paymentStatus === 'success') {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold text-green-600">Payment Successful!</h2>
            <p className="text-gray-600">
              Your water bill payment of {formatCurrency(bill.amountDue)} has been processed.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Transaction ID</p>
              <p className="font-mono text-sm">{transactionId}</p>
            </div>
            <Button onClick={resetPayment} className="w-full">
              Make Another Payment
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (paymentStatus === 'failed') {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
            <h2 className="text-2xl font-bold text-red-600">Payment Failed</h2>
            <p className="text-gray-600">{errorMessage}</p>
            <Button onClick={resetPayment} variant="outline" className="w-full">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Bill Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Bill Summary</CardTitle>
          <CardDescription>Account Number: {bill.accountNumber}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Customer Name</p>
              <p className="font-medium">{bill.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Billing Period</p>
              <p className="font-medium">{bill.billingPeriod}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Due Date</p>
              <p className="font-medium">{bill.dueDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <Badge variant={bill.status === 'paid' ? 'default' : 'destructive'}>
                {bill.status.toUpperCase()}
              </Badge>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Previous Reading</span>
              <span>{bill.previousReading} m³</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Current Reading</span>
              <span>{bill.currentReading} m³</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium">Consumption</span>
              <span className="font-medium">{bill.consumption} m³</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold pt-4 border-t">
              <span>Total Amount Due</span>
              <span className="text-blue-600">{formatCurrency(bill.amountDue)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* GCash Payment Form */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-blue-500" />
            <CardTitle>Pay with GCash</CardTitle>
          </div>
          <CardDescription>
            Enter your GCash mobile number to proceed with payment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">How it works:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Enter your GCash-registered mobile number</li>
                  <li>You&apos;ll be redirected to GCash to authorize payment</li>
                  <li>Enter your GCash PIN to confirm</li>
                  <li>Payment confirmation will be sent via SMS</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">GCash Mobile Number *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+63 912 345 6789"
              value={phoneNumber}
              onChange={handlePhoneChange}
              disabled={isProcessing}
              maxLength={17}
            />
            <p className="text-xs text-gray-500">
              Enter your 11-digit mobile number (e.g., 09123456789)
            </p>
          </div>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-800">{errorMessage}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button
            onClick={createPayment}
            disabled={isProcessing || !phoneNumber}
            className="w-full"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                Pay {formatCurrency(bill.amountDue)} via GCash
              </>
            )}
          </Button>
          <p className="text-xs text-center text-gray-500">
            Secured by PayMongo • Payment processing fee applies
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

// Example Usage Component
export function PaymentPage() {
  // Sample bill data - replace with actual data from your database
  const sampleBill: Bill = {
    id: 'BILL-2024-001',
    accountNumber: 'WM-2024-001',
    customerName: 'Juan Dela Cruz',
    billingPeriod: 'January 2024',
    dueDate: 'January 31, 2024',
    previousReading: 100,
    currentReading: 115,
    consumption: 15,
    amountDue: 450.00,
    status: 'pending',
  }

  const handlePaymentSuccess = (paymentId: string) => {
    console.log('Payment successful:', paymentId)
    // Update bill status in database
    // Send SMS confirmation
    // Redirect to receipt page
  }

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error)
    // Log error
    // Show notification
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pay Water Bill</h1>
        <p className="text-gray-600">Complete your payment using GCash</p>
      </div>

      <GCashPaymentComponent
        bill={sampleBill}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={handlePaymentError}
      />
    </div>
  )
}