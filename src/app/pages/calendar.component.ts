import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BookingService } from '../services/booking.service';
import { format, addDays, startOfWeek, addWeeks, subWeeks } from 'date-fns';
import { es } from 'date-fns/locale';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatCardModule],
  template: `
    <div class="calendar-page">
      <div class="calendar-header">
        <div class="header-left">
          <h2>Calendario de Reservas</h2>
          <p>{{ currentMonthYear }}</p>
        </div>
        <div class="header-actions">
          <button mat-icon-button (click)="previousWeek()">
            <mat-icon>chevron_left</mat-icon>
          </button>
          <button mat-stroked-button (click)="goToToday()">Hoy</button>
          <button mat-icon-button (click)="nextWeek()">
            <mat-icon>chevron_right</mat-icon>
          </button>
        </div>
      </div>

      <div class="calendar-grid">
        <!-- Time Column -->
        <div class="time-column">
          <div class="time-header"></div>
          @for (hour of hours; track hour) {
            <div class="time-slot">{{ hour }}:00</div>
          }
        </div>

        <!-- Day Columns -->
        @for (day of weekDays(); track day.date) {
          <div class="day-column" [class.today]="isToday(day.date)">
            <div class="day-header" [class.today]="isToday(day.date)">
              <span class="day-name">{{ day.dayName }}</span>
              <span class="day-number">{{ day.dayNumber }}</span>
            </div>
            <div class="day-slots">
              @for (hour of hours; track hour) {
                <div class="hour-slot">
                  @for (booking of getBookingsForSlot(day.date, hour); track booking.id) {
                    <div class="booking-block"
                         [style.height.px]="booking.duration"
                         [style.background]="getServiceColor(booking.serviceId)">
                      <span class="booking-time">{{ booking.time }}</span>
                      <span class="booking-service">{{ booking.serviceName }}</span>
                      <span class="booking-client">{{ booking.clientName }}</span>
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        }
      </div>

      <!-- Selected Day Details -->
      <mat-card class="day-details">
        <mat-card-header>
          <mat-card-title>Reservas del dia</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          @if (selectedDayBookings().length > 0) {
            <div class="bookings-list">
              @for (booking of selectedDayBookings(); track booking.id) {
                <div class="booking-detail">
                  <div class="booking-time-block" [style.background]="getServiceColor(booking.serviceId)">
                    {{ booking.time }}
                  </div>
                  <div class="booking-info">
                    <span class="service">{{ booking.serviceName }}</span>
                    <span class="client">{{ booking.clientName }}</span>
                    <span class="duration">{{ booking.duration }} min</span>
                  </div>
                  <span [class]="'status ' + booking.status">
                    {{ getStatusLabel(booking.status) }}
                  </span>
                </div>
              }
            </div>
          } @else {
            <div class="no-bookings">
              <mat-icon>event_available</mat-icon>
              <span>No hay reservas para hoy</span>
            </div>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .calendar-page {
      padding: 1.5rem;
    }

    .calendar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .header-left h2 {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0;
    }

    .header-left p {
      color: #6b7280;
      margin: 0;
      text-transform: capitalize;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .calendar-grid {
      display: grid;
      grid-template-columns: 60px repeat(7, 1fr);
      background: white;
      border-radius: 1rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      margin-bottom: 1.5rem;
    }

    .time-column {
      border-right: 1px solid #e5e7eb;
    }

    .time-header {
      height: 60px;
      border-bottom: 1px solid #e5e7eb;
    }

    .time-slot {
      height: 60px;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding-top: 0.25rem;
      font-size: 0.75rem;
      color: #6b7280;
      border-bottom: 1px solid #f3f4f6;
    }

    .day-column {
      border-right: 1px solid #e5e7eb;
    }

    .day-column:last-child {
      border-right: none;
    }

    .day-header {
      height: 60px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-bottom: 1px solid #e5e7eb;
      background: #f9fafb;
    }

    .day-header.today {
      background: #6366f1;
      color: white;
    }

    .day-name {
      font-size: 0.75rem;
      text-transform: uppercase;
    }

    .day-number {
      font-size: 1.25rem;
      font-weight: 600;
    }

    .day-slots {
      position: relative;
    }

    .hour-slot {
      height: 60px;
      border-bottom: 1px solid #f3f4f6;
      position: relative;
    }

    .booking-block {
      position: absolute;
      left: 2px;
      right: 2px;
      border-radius: 0.25rem;
      padding: 0.25rem 0.5rem;
      color: white;
      font-size: 0.7rem;
      overflow: hidden;
      z-index: 1;
      display: flex;
      flex-direction: column;
    }

    .booking-time {
      font-weight: 600;
    }

    .booking-service {
      font-weight: 500;
    }

    .booking-client {
      opacity: 0.8;
    }

    mat-card {
      border-radius: 1rem !important;
    }

    mat-card-header {
      padding: 1rem 1.5rem !important;
      border-bottom: 1px solid #f3f4f6;
    }

    mat-card-title {
      font-size: 1rem !important;
      font-weight: 600 !important;
      margin: 0 !important;
    }

    mat-card-content {
      padding: 1rem 1.5rem !important;
    }

    .bookings-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .booking-detail {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem;
      background: #f9fafb;
      border-radius: 0.5rem;
    }

    .booking-time-block {
      padding: 0.5rem 0.75rem;
      border-radius: 0.5rem;
      color: white;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .booking-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .booking-info .service {
      font-weight: 500;
    }

    .booking-info .client {
      font-size: 0.8rem;
      color: #6b7280;
    }

    .booking-info .duration {
      font-size: 0.75rem;
      color: #9ca3af;
    }

    .status {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .status.pending { background: #fef3c7; color: #92400e; }
    .status.confirmed { background: #dcfce7; color: #166534; }
    .status.completed { background: #dbeafe; color: #1e40af; }
    .status.cancelled { background: #fee2e2; color: #991b1b; }

    .no-bookings {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem;
      color: #9ca3af;
    }

    .no-bookings mat-icon {
      font-size: 2.5rem;
      width: 2.5rem;
      height: 2.5rem;
      margin-bottom: 0.5rem;
    }
  `]
})
export class CalendarComponent {
  private bookingService = inject(BookingService);

  currentDate = signal(new Date());
  hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

  get currentMonthYear(): string {
    return format(this.currentDate(), 'MMMM yyyy', { locale: es });
  }

  weekDays = signal(this.generateWeekDays());

  selectedDayBookings = signal(this.bookingService.getBookingsByDate(format(new Date(), 'yyyy-MM-dd')));

  private generateWeekDays() {
    const start = startOfWeek(this.currentDate(), { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(start, i);
      return {
        date: format(date, 'yyyy-MM-dd'),
        dayName: format(date, 'EEE', { locale: es }),
        dayNumber: format(date, 'd')
      };
    });
  }

  previousWeek() {
    this.currentDate.set(subWeeks(this.currentDate(), 1));
    this.weekDays.set(this.generateWeekDays());
  }

  nextWeek() {
    this.currentDate.set(addWeeks(this.currentDate(), 1));
    this.weekDays.set(this.generateWeekDays());
  }

  goToToday() {
    this.currentDate.set(new Date());
    this.weekDays.set(this.generateWeekDays());
  }

  isToday(date: string): boolean {
    return this.bookingService.isToday(date);
  }

  getBookingsForSlot(date: string, hour: number) {
    return this.bookingService.getBookingsByDate(date)
      .filter(b => {
        const bookingHour = parseInt(b.time.split(':')[0]);
        return bookingHour === hour;
      });
  }

  getServiceColor(serviceId: string): string {
    const service = this.bookingService.getServiceById(serviceId);
    return service?.color || '#6366f1';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      confirmed: 'Confirmada',
      completed: 'Completada',
      cancelled: 'Cancelada'
    };
    return labels[status] || status;
  }
}
