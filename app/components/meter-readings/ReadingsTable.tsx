import { MeterReading } from '@/types';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/app/components/ui/Table';
// import { Badge } from '@/app/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

interface ReadingsTableProps {
  readings: MeterReading[];
}

export default function ReadingsTable({ readings }: ReadingsTableProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // const getStatusVariant = (status: string) => {
  //   switch (status) {
  //     case 'approved':
  //       return 'success';
  //     case 'pending':
  //       return 'warning';
  //     case 'rejected':
  //       return 'danger';
  //     default:
  //       return 'default';
  //   }
  // };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reading ID</TableHead>
              <TableHead>Consumer</TableHead>
              <TableHead>Reader</TableHead>
              <TableHead>Reading Value</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Photo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {readings.map((reading) => (
              <TableRow key={reading.id}>
                <TableCell className="font-medium">#{reading.id}</TableCell>
                <TableCell>
                  <p className="font-medium">{reading.consumer_name}</p>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-gray-600">{reading.reader_name}</p>
                </TableCell>
                <TableCell className="font-semibold text-lg">
                  {reading.reading_value} m³
                </TableCell>
                <TableCell>{formatDate(reading.reading_date)}</TableCell>
                <TableCell>
                  {/* <Badge variant={getStatusVariant(reading.status)}>
                    {reading.status.toUpperCase()}
                  </Badge> */}
                </TableCell>
                <TableCell>
                  {reading.photo_url ? (
                    <button
                      onClick={() => setSelectedImage(reading.photo_url!)}
                      className="flex items-center gap-2 text-sky-600 hover:text-sky-700"
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span className="text-sm">View</span>
                    </button>
                  ) : (
                    <span className="text-gray-400 text-sm">No photo</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 text-2xl"
            >
              ✕
            </button>
            <Image
              src={selectedImage}
              alt="Meter Reading"
              width={800}
              height={600}
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
}