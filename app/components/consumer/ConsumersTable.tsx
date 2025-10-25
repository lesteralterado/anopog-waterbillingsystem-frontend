"use client";

import { useRouter } from 'next/navigation';
import { Consumer } from '@/types/consumer';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/app/components/ui/Table';
import { Badge } from '@/app/components/ui/Badge';
import { Button } from '@/app/components/ui/Button';
import { Eye } from 'lucide-react';

interface ConsumersTableProps {
  consumers: Consumer[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function ConsumersTable({ consumers, currentPage, totalPages, onPageChange }: ConsumersTableProps) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Meter #</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {consumers.map((c) => (
            <TableRow key={c.id}>
              <TableCell>{c.name}</TableCell>
              <TableCell>{c.meter_number}</TableCell>
              <TableCell>{c.address}</TableCell>
              <TableCell>{c.phone || 'N/A'}</TableCell>
              <TableCell>
                <Badge variant={c.status === 'active' ? 'success' : 'destructive'}>
                  {c.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button size="sm" variant="outline" onClick={() => router.push(`/consumer/${c.id}`)}>
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button key={i} variant={currentPage === i + 1 ? 'default' : 'outline'} size="sm" onClick={() => onPageChange(i + 1)}>
              {i + 1}
            </Button>
          ))}
          <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
