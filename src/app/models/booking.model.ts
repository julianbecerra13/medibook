export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // en minutos
  price: number;
  color: string;
  icon: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalBookings: number;
  todayBookings: number;
  pendingBookings: number;
  totalRevenue: number;
}
