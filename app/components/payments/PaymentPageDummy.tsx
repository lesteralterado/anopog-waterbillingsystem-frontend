'use client'

import { useState } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import { useBills } from '@/hooks/useBills'
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
import { Loading } from '@/app/components/ui/Loading'
import {
  Search,
  Droplets,
  Calendar,
  User,
  MapPin,
  Smartphone,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { Bill } from '@/types'

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null)
  const [showPayment, setShowPayment] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const { bills, loading, error } = useBills()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount)
  }

  const filteredBills = bills.filter(bill =>
    bill.consumer_name?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
    bill.consumer_email?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
    bill.id.toString().includes(debouncedSearchQuery)
  )

  const handleSelectBill = (bill: Bill) => {
    setSelectedBill(bill)
    setShowPayment(false)
    setPaymentSuccess(false)
  }

  const handleProceedToPayment = () => {
    if (selectedBill && selectedBill.status !== 'paid') {
      setShowPayment(true)
    }
  }

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
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

  const handlePayment = () => {
    setIsProcessing(true)
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setPaymentSuccess(true)
      // Update bill status to paid
      if (selectedBill) {
        selectedBill.status = 'paid'
      }
    }, 3000)
  }

  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 hover:bg-green-100'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
      case 'overdue':
        return 'bg-red-100 text-red-800 hover:bg-red-100'
      default:
        return ''
    }
  }

  if (paymentSuccess && selectedBill) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold text-green-600">Payment Successful!</h2>
              <p className="text-gray-600">
                Your water bill payment of {formatCurrency(selectedBill.amount)} has been processed.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Bill ID:</span>
                  <span className="font-medium">{selectedBill.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Customer Name:</span>
                  <span className="font-medium">{selectedBill.consumer_name || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Transaction ID:</span>
                  <span className="font-mono text-xs">TXN-{Date.now()}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => {
                  setSelectedBill(null)
                  setShowPayment(false)
                  setPaymentSuccess(false)
                  setPhoneNumber('')
                }} variant="outline" className="flex-1">
                  Back to Bills
                </Button>
                <Button onClick={() => window.print()} className="flex-1">
                  Print Receipt
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showPayment && selectedBill) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <Button 
          variant="outline" 
          onClick={() => setShowPayment(false)}
          className="mb-4 cursor-pointer"
        >
          ← Back to Bill Details
        </Button>

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
                  <p className="font-medium mb-1">Payment Summary:</p>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Bill ID:</span>
                      <span className="font-medium">{selectedBill.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span className="font-medium">{formatCurrency(selectedBill.amount)}</span>
                    </div>
                  </div>
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
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button
              onClick={handlePayment}
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
                  Pay {formatCurrency(selectedBill.amount)} via GCash
                </>
              )}
            </Button>
            <p className="text-xs text-center text-gray-500">
              This is a demo mode. No actual payment will be processed.
            </p>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (selectedBill) {
    return (
      <div className="container mx-auto py-8 px-4 w-full">
        <Button 
          variant="outline" 
          onClick={() => setSelectedBill(null)}
          className="mb-4 cursor-pointer"
        >
          ← Back to Search
        </Button>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Bill Details</CardTitle>
                <CardDescription>Bill ID: {selectedBill.id}</CardDescription>
              </div>
              <Badge className={getBadgeColor(selectedBill.status)}>
                {selectedBill.status.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Customer Information */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-gray-700">Customer Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <User className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="font-medium">{selectedBill.consumer_name || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-xs text-gray-500">Due Date</p>
                    <p className="font-medium">{selectedBill.due_date ? new Date(selectedBill.due_date).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold text-sm text-gray-700 mb-3">Billing Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Previous Reading</span>
                  <span className="font-medium">{selectedBill.previous_reading} m³</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current Reading</span>
                  <span className="font-medium">{selectedBill.current_reading} m³</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Consumption</span>
                  <span className="font-medium text-blue-600">{selectedBill.consumption} m³</span>
                </div>
                {selectedBill.consumption > 0 && (
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Rate per m³</span>
                    <span>{formatCurrency(selectedBill.amount / selectedBill.consumption)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Amount Due</span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatCurrency(selectedBill.amount)}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleProceedToPayment}
              disabled={selectedBill.status === 'paid'}
              className="w-full cursor-pointer"
              size="lg"
            >
              {selectedBill.status === 'paid' ? 'Already Paid' : 'Proceed to Payment'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 w-full">
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 w-full">
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Bills</h2>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pay Water Bill</h1>
        <p className="text-gray-600">Search and pay your water bill using GCash</p>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Bill</CardTitle>
          <CardDescription>Enter your account number, meter number, or name</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search by account number, name, or meter number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Bills List */}
      <div className="space-y-4">
        {filteredBills.map((bill) => (
          <Card
            key={bill.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleSelectBill(bill)}
          >
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{bill.consumer_name || 'N/A'}</h3>
                    <Badge className={getBadgeColor(bill.status)}>
                      {bill.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Bill ID:</span>{' '}
                      <span className="font-medium">{bill.id}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Consumption:</span>{' '}
                      <span className="font-medium">{bill.consumption} m³</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Reading Date:</span>{' '}
                      <span className="font-medium">{bill.reading_date ? new Date(bill.reading_date).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Due:</span>{' '}
                      <span className="font-medium">{bill.due_date ? new Date(bill.due_date).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Amount Due</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(bill.amount)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredBills.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No bills found. Try a different search term.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}