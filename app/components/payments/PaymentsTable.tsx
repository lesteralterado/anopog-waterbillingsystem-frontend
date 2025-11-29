import { Payment } from '@/types';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/app/components/ui/Table';
import { Badge } from '@/app/components/ui/Badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Eye } from 'lucide-react';

interface PaymentsTableProps {
  payments: Payment[];
}

export default function PaymentsTable({ payments }: PaymentsTableProps) {
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
      case 'cancelled':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Payment ID</TableHead>
            <TableHead>Bill ID</TableHead>
            <TableHead>Consumer</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Payment Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell className="font-medium">#{payment.id}</TableCell>
              <TableCell>#{payment.bill_id}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{payment.consumer_name || 'N/A'}</p>
                </div>
              </TableCell>
              <TableCell className="font-semibold">{formatCurrency(payment.amount)}</TableCell>
              <TableCell className="capitalize">{payment.payment_method}</TableCell>
              <TableCell className="font-mono text-sm">{payment.transaction_id}</TableCell>
              <TableCell>{formatDate(payment.payment_date)}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(payment.status)}>
                  {payment.status.toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}