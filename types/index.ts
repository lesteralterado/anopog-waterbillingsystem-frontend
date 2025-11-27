export interface User {
  id: string;
  username: string;
  role_id: string;
  purok: number | null;
  meter_number: string | null;
  full_name: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  role: {
    name: string;
  };
}

export interface Bill {
  id: number;
  consumer_id: number;
  consumer_name?: string;
  consumer_email?: string;
  amount: number;
  previous_reading: number;
  current_reading: number;
  consumption: number;
  due_date: string;
  status: 'paid' | 'unpaid' | 'overdue';
  reading_date: string;
  created_at: string;
}

export interface Payment {
  id: number;
  bill_id: number;
  amount: number;
  payment_method: string;
  transaction_id: string;
  payment_date: string;
  status: string;
  consumer_name?: string;
  bill_amount?: number;
}

export interface MeterReading {
  id: number;
  consumer_id: number;
  reader_id: number;
  consumer_name?: string;
  reader_name?: string;
  reading_value: number;
  photo_url?: string;
  reading_date: string;
  status: string;
  created_at: string;
}

export interface Incident {
  id: number;
  reporter_id: number;
  reporter_name?: string;
  reporter_phone?: string;
  type: string;
  description: string;
  status: 'pending' | 'resolved' | 'in-progress';
  photo_url?: string;
  reported_date: string;
  resolved_date?: string;
}

export interface MeterReadingAPI {
  id: string;
  user_id: string;
  reading_date: any;
  reading_value: {
    s: number;
    e: number;
    d: number[];
  };
  image_url: string | null;
  user: any;
}

export interface DashboardStats {
  totalBills: string;
  unpaidBills: string;
  totalRevenue: string;
  totalConsumers: string;
  pendingIncidents: string;
}