"use client";

import { useRouter } from 'next/navigation';
import { Consumer } from '@/types/consumer';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/app/components/ui/Table';
import { Badge } from '@/app/components/ui/Badge';
import { Button } from '@/app/components/ui/Button';
import { Eye } from 'lucide-react';
import Pagination from '@/app/components/shared/Pagination';

interface ConsumersTableProps {
  consumers: Consumer[];
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

export default function ConsumersTable({ consumers, currentPage, totalItems, itemsPerPage, onPageChange, onItemsPerPageChange }: ConsumersTableProps) {
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

      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
        onItemsPerPageChange={onItemsPerPageChange}
      />
    </div>
  );
}
