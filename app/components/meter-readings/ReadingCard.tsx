import { MeterReading } from '@/types';
import { Card } from '@/app/components/ui/Card';
// import { Badge } from '@/app/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { User, Calendar, Gauge, Image } from 'lucide-react';

interface ReadingCardProps {
  reading: MeterReading;
  onViewPhoto?: (photoUrl: string) => void;
}

export default function ReadingCard({ reading, onViewPhoto }: ReadingCardProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'danger';
      default:
        return 'default';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="space-y-4 p-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500">Reading #{reading.id}</p>
            <h3 className="text-xl font-bold text-gray-900 mt-1">
              {reading.reading_value} m³
            </h3>
          </div>
          {/* <Badge variant={getStatusVariant(reading.status)}>
            {reading.status.toUpperCase()}
          </Badge> */}
        </div>

        {/* Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span>Consumer: {reading.consumer_name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Gauge className="w-4 h-4" />
            <span>Reader: {reading.reader_name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(reading.reading_date)}</span>
          </div>
        </div>

        {/* Photo */}
        {reading.photo_url && (
          <button
            onClick={() => onViewPhoto?.(reading.photo_url!)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-sky-50 text-sky-600 rounded-lg hover:bg-sky-100 transition-colors"
          >
            <Image className="w-4 h-4" />
            <span className="text-sm font-medium">View Photo</span>
          </button>
        )}
      </div>
    </Card>
  );
}