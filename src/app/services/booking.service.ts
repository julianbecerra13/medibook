import { Injectable, signal, computed } from '@angular/core';
import { Booking, Service, DashboardStats, TimeSlot } from '../models/booking.model';
import { format, isToday, parseISO, addDays } from 'date-fns';
import { es } from 'date-fns/locale';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private services = signal<Service[]>([
    {
      id: '1',
      name: 'Consulta General',
      description: 'Consulta médica general de 30 minutos',
      duration: 30,
      price: 50,
      color: '#3b82f6',
      icon: 'medical_services'
    },
    {
      id: '2',
      name: 'Especialista',
      description: 'Consulta con especialista de 45 minutos',
      duration: 45,
      price: 80,
      color: '#8b5cf6',
      icon: 'psychology'
    },
    {
      id: '3',
      name: 'Terapia Física',
      description: 'Sesión de terapia física de 60 minutos',
      duration: 60,
      price: 70,
      color: '#10b981',
      icon: 'fitness_center'
    },
    {
      id: '4',
      name: 'Laboratorio',
      description: 'Exámenes de laboratorio',
      duration: 15,
      price: 35,
      color: '#f59e0b',
      icon: 'science'
    },
    {
      id: '5',
      name: 'Odontología',
      description: 'Consulta dental de 45 minutos',
      duration: 45,
      price: 60,
      color: '#ec4899',
      icon: 'dentistry'
    },
    {
      id: '6',
      name: 'Nutrición',
      description: 'Consulta nutricional de 40 minutos',
      duration: 40,
      price: 55,
      color: '#06b6d4',
      icon: 'restaurant'
    }
  ]);

  private bookings = signal<Booking[]>([
    {
      id: '1',
      serviceId: '1',
      serviceName: 'Consulta General',
      clientName: 'Carlos García',
      clientEmail: 'carlos@email.com',
      clientPhone: '+57 300 123 4567',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '09:00',
      duration: 30,
      price: 50,
      status: 'confirmed',
      createdAt: format(addDays(new Date(), -2), 'yyyy-MM-dd')
    },
    {
      id: '2',
      serviceId: '2',
      serviceName: 'Especialista',
      clientName: 'María López',
      clientEmail: 'maria@email.com',
      clientPhone: '+57 301 234 5678',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '10:30',
      duration: 45,
      price: 80,
      status: 'pending',
      createdAt: format(addDays(new Date(), -1), 'yyyy-MM-dd')
    },
    {
      id: '3',
      serviceId: '3',
      serviceName: 'Terapia Física',
      clientName: 'Juan Rodríguez',
      clientEmail: 'juan@email.com',
      clientPhone: '+57 302 345 6789',
      date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
      time: '14:00',
      duration: 60,
      price: 70,
      status: 'confirmed',
      createdAt: format(new Date(), 'yyyy-MM-dd')
    },
    {
      id: '4',
      serviceId: '5',
      serviceName: 'Odontología',
      clientName: 'Ana Martínez',
      clientEmail: 'ana@email.com',
      clientPhone: '+57 303 456 7890',
      date: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
      time: '11:00',
      duration: 45,
      price: 60,
      status: 'pending',
      createdAt: format(new Date(), 'yyyy-MM-dd')
    },
    {
      id: '5',
      serviceId: '1',
      serviceName: 'Consulta General',
      clientName: 'Pedro Sánchez',
      clientEmail: 'pedro@email.com',
      clientPhone: '+57 304 567 8901',
      date: format(addDays(new Date(), -3), 'yyyy-MM-dd'),
      time: '16:00',
      duration: 30,
      price: 50,
      status: 'completed',
      createdAt: format(addDays(new Date(), -5), 'yyyy-MM-dd')
    }
  ]);

  // Computed signals
  readonly allServices = computed(() => this.services());
  readonly allBookings = computed(() => this.bookings());

  readonly dashboardStats = computed<DashboardStats>(() => {
    const allBookings = this.bookings();
    const today = format(new Date(), 'yyyy-MM-dd');

    return {
      totalBookings: allBookings.length,
      todayBookings: allBookings.filter(b => b.date === today).length,
      pendingBookings: allBookings.filter(b => b.status === 'pending').length,
      totalRevenue: allBookings
        .filter(b => b.status === 'completed' || b.status === 'confirmed')
        .reduce((acc, b) => acc + b.price, 0)
    };
  });

  readonly upcomingBookings = computed(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return this.bookings()
      .filter(b => b.date >= today && b.status !== 'cancelled' && b.status !== 'completed')
      .sort((a, b) => {
        if (a.date === b.date) {
          return a.time.localeCompare(b.time);
        }
        return a.date.localeCompare(b.date);
      })
      .slice(0, 5);
  });

  readonly recentBookings = computed(() => {
    return [...this.bookings()]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 10);
  });

  // Methods
  getServiceById(id: string): Service | undefined {
    return this.services().find(s => s.id === id);
  }

  getBookingById(id: string): Booking | undefined {
    return this.bookings().find(b => b.id === id);
  }

  getBookingsByDate(date: string): Booking[] {
    return this.bookings().filter(b => b.date === date && b.status !== 'cancelled');
  }

  getAvailableSlots(date: string, serviceId: string): TimeSlot[] {
    const service = this.getServiceById(serviceId);
    if (!service) return [];

    const existingBookings = this.getBookingsByDate(date);
    const slots: TimeSlot[] = [];

    // Horario de 8:00 a 18:00
    for (let hour = 8; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const isBooked = existingBookings.some(b => {
          const bookingStart = this.timeToMinutes(b.time);
          const bookingEnd = bookingStart + b.duration;
          const slotStart = this.timeToMinutes(time);
          const slotEnd = slotStart + service.duration;
          return (slotStart < bookingEnd && slotEnd > bookingStart);
        });

        slots.push({ time, available: !isBooked });
      }
    }

    return slots;
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  addBooking(booking: Omit<Booking, 'id' | 'createdAt'>): void {
    const newBooking: Booking = {
      ...booking,
      id: Date.now().toString(),
      createdAt: format(new Date(), 'yyyy-MM-dd')
    };
    this.bookings.update(bookings => [...bookings, newBooking]);
  }

  updateBookingStatus(id: string, status: Booking['status']): void {
    this.bookings.update(bookings =>
      bookings.map(b => b.id === id ? { ...b, status } : b)
    );
  }

  cancelBooking(id: string): void {
    this.updateBookingStatus(id, 'cancelled');
  }

  confirmBooking(id: string): void {
    this.updateBookingStatus(id, 'confirmed');
  }

  completeBooking(id: string): void {
    this.updateBookingStatus(id, 'completed');
  }

  formatDate(date: string): string {
    return format(parseISO(date), "d 'de' MMMM, yyyy", { locale: es });
  }

  isToday(date: string): boolean {
    return isToday(parseISO(date));
  }
}
