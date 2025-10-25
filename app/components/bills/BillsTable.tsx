import { Bill } from '@/types';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/app/components/ui/Table';
import { Badge } from '@/app/components/ui/Badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Eye } from 'lucide-react';

interface BillsTableProps {
  bills: Bill[];
}

export default function BillsTable({ bills }: BillsTableProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'unpaid':
        return 'warning';
      case 'overdue':
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
            <TableHead>Bill ID</TableHead>
            <TableHead>Consumer</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Consumption</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bills.map((bill) => (
            <TableRow key={bill.id}>
              <TableCell className="font-medium">#{bill.id}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{bill.consumer_name}</p>
                  <p className="text-xs text-gray-500">{bill.consumer_email}</p>
                </div>
              </TableCell>
              <TableCell className="font-semibold">{formatCurrency(bill.amount)}</TableCell>
              <TableCell>{bill.consumption} m³</TableCell>
              <TableCell>{formatDate(bill.due_date)}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(bill.status)}>
                  {bill.status.toUpperCase()}
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