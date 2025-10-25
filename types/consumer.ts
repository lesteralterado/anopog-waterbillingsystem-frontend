export interface Consumer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address: string;
  purok: number; // 1-8 for the different puroks
  meter_number: string;
  status: 'active' | 'inactive';
  connection_date: string;
  created_at: string;
}

export interface ConsumerFilters {
  purok: number | null;
  status: string | null;
  search: string;
}