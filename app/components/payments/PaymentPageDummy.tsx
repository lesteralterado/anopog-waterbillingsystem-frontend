'use client'

import { useState } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
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

interface Bill {
  id: string
  accountNumber: string
  customerName: string
  purok: string
  meterNumber: string
  billingPeriod: string
  dueDate: string
  previousReading: number
  currentReading: number
  consumption: number
  pricePerCubicMeter: number
  amountDue: number
  status: 'pending' | 'paid' | 'overdue'
}

// Dummy bill data
const dummyBills: Bill[] = [
  {
    id: 'BILL-2024-001',
    accountNumber: 'WM-2024-001',
    customerName: 'Juan Dela Cruz',
    purok: 'Purok 1',
    meterNumber: 'MTR-001-2024',
    billingPeriod: 'October 2024',
    dueDate: 'November 10, 2024',
    previousReading: 150,
    currentReading: 165,
    consumption: 15,
    pricePerCubicMeter: 25,
    amountDue: 375.00,
    status: 'pending',
  },
  {
    id: 'BILL-2024-002',
    accountNumber: 'WM-2024-002',
    customerName: 'Maria Santos',
    purok: 'Purok 2',
    meterNumber: 'MTR-002-2024',
    billingPeriod: 'October 2024',
    dueDate: 'November 10, 2024',
    previousReading: 200,
    currentReading: 220,
    consumption: 20,
    pricePerCubicMeter: 25,
    amountDue: 500.00,
    status: 'pending',
  },
  {
    id: 'BILL-2024-003',
    accountNumber: 'WM-2024-003',
    customerName: 'Pedro Reyes',
    purok: 'Purok 3',
    meterNumber: 'MTR-003-2024',
    billingPeriod: 'October 2024',
    dueDate: 'November 10, 2024',
    previousReading: 180,
    currentReading: 192,
    consumption: 12,
    pricePerCubicMeter: 25,
    amountDue: 300.00,
    status: 'overdue',
  },
  {
    id: 'BILL-2024-004',
    accountNumber: 'WM-2024-004',
    customerName: 'Rosa Garcia',
    purok: 'Purok 4',
    meterNumber: 'MTR-004-2024',
    billingPeriod: 'October 2024',
    dueDate: 'November 10, 2024',
    previousReading: 120,
    currentReading: 138,
    consumption: 18,
    pricePerCubicMeter: 25,
    amountDue: 450.00,
    status: 'pending',
  },
  {
    id: 'BILL-2024-005',
    accountNumber: 'WM-2024-005',
    customerName: 'Antonio Cruz',
    purok: 'Purok 5',
    meterNumber: 'MTR-005-2024',
    billingPeriod: 'September 2024',
    dueDate: 'October 10, 2024',
    previousReading: 250,
    currentReading: 275,
    consumption: 25,
    pricePerCubicMeter: 25,
    amountDue: 625.00,
    status: 'paid',
  },
]

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null)
  const [showPayment, setShowPayment] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount)
  }

  const filteredBills = dummyBills.filter(bill =>
    bill.accountNumber.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
    bill.customerName.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
    bill.meterNumber.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
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
                Your water bill payment of {formatCurrency(selectedBill.amountDue)} has been processed.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Account Number:</span>
                  <span className="font-medium">{selectedBill.accountNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Customer Name:</span>
                  <span className="font-medium">{selectedBill.customerName}</span>
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
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <Button 
          variant="outline" 
          onClick={() => setShowPayment(false)}
          className="mb-4"
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
                      <span>Account:</span>
                      <span className="font-medium">{selectedBill.accountNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span className="font-medium">{formatCurrency(selectedBill.amountDue)}</span>
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
                  Pay {formatCurrency(selectedBill.amountDue)} via GCash
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
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <Button 
          variant="outline" 
          onClick={() => setSelectedBill(null)}
          className="mb-4"
        >
          ← Back to Search
        </Button>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Bill Details</CardTitle>
                <CardDescription>Account: {selectedBill.accountNumber}</CardDescription>
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
                    <p className="font-medium">{selectedBill.customerName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-xs text-gray-500">Purok</p>
                    <p className="font-medium">{selectedBill.purok}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Droplets className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-xs text-gray-500">Meter Number</p>
                    <p className="font-medium">{selectedBill.meterNumber}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-xs text-gray-500">Due Date</p>
                    <p className="font-medium">{selectedBill.dueDate}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold text-sm text-gray-700 mb-3">Billing Period: {selectedBill.billingPeriod}</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Previous Reading</span>
                  <span className="font-medium">{selectedBill.previousReading} m³</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current Reading</span>
                  <span className="font-medium">{selectedBill.currentReading} m³</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Consumption</span>
                  <span className="font-medium text-blue-600">{selectedBill.consumption} m³</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Rate per m³</span>
                  <span>{formatCurrency(selectedBill.pricePerCubicMeter)}</span>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Amount Due</span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatCurrency(selectedBill.amountDue)}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleProceedToPayment}
              disabled={selectedBill.status === 'paid'}
              className="w-full"
              size="lg"
            >
              {selectedBill.status === 'paid' ? 'Already Paid' : 'Proceed to Payment'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
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
                    <h3 className="font-semibold text-lg">{bill.customerName}</h3>
                    <Badge className={getBadgeColor(bill.status)}>
                      {bill.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Account:</span>{' '}
                      <span className="font-medium">{bill.accountNumber}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Purok:</span>{' '}
                      <span className="font-medium">{bill.purok}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Period:</span>{' '}
                      <span className="font-medium">{bill.billingPeriod}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Due:</span>{' '}
                      <span className="font-medium">{bill.dueDate}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Amount Due</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(bill.amountDue)}
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