import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BookingService } from '../services/booking.service';
import { format, addDays, startOfWeek, addWeeks, subWeeks } from 'date-fns';
import { es } from 'date-fns/locale';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="calendar-page">
      <div class="page-header">
        <div class="header-info">
          <h1>Calendario</h1>
          <p>Vista semanal de citas programadas</p>
        </div>
        <div class="header-controls">
          <div class="nav-controls">
            <button mat-icon-button (click)="previousWeek()" class="nav-btn">
              <mat-icon>chevron_left</mat-icon>
            </button>
            <button mat-stroked-button (click)="goToToday()" class="today-btn">
              <mat-icon>today</mat-icon>
              Hoy
            </button>
            <button mat-icon-button (click)="nextWeek()" class="nav-btn">
              <mat-icon>chevron_right</mat-icon>
            </button>
          </div>
          <span class="current-period">{{ currentMonthYear }}</span>
        </div>
      </div>

      <div class="calendar-container">
        <div class="calendar-grid">
          <!-- Time Column -->
          <div class="time-column">
            <div class="time-header"></div>
            @for (hour of hours; track hour) {
              <div class="time-slot">
                <span>{{ hour }}:00</span>
              </div>
            }
          </div>

          <!-- Day Columns -->
          @for (day of weekDays(); track day.date) {
            <div class="day-column" [class.today]="isToday(day.date)">
              <div class="day-header" [class.today]="isToday(day.date)">
                <span class="day-name">{{ day.dayName }}</span>
                <span class="day-number">{{ day.dayNumber }}</span>
              </div>
              <div class="day-body">
                @for (hour of hours; track hour) {
                  <div class="hour-cell">
                    @for (booking of getBookingsForSlot(day.date, hour); track booking.id) {
                      <div class="booking-card"
                           [style.height.px]="booking.duration"
                           [style.borderLeftColor]="getServiceColor(booking.serviceId)">
                        <div class="booking-time">{{ booking.time }}</div>
                        <div class="booking-service">{{ booking.serviceName }}</div>
                        <div class="booking-client">{{ booking.clientName }}</div>
                      </div>
                    }
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Today's Appointments Panel -->
      <div class="today-panel">
        <div class="panel-header">
          <mat-icon>event_note</mat-icon>
          <h3>Citas de Hoy</h3>
        </div>
        <div class="panel-content">
          @if (todayBookings().length > 0) {
            @for (booking of todayBookings(); track booking.id) {
              <div class="today-item">
                <div class="item-time" [style.background]="getServiceColor(booking.serviceId)">
                  {{ booking.time }}
                </div>
                <div class="item-details">
                  <span class="item-service">{{ booking.serviceName }}</span>
                  <span class="item-client">{{ booking.clientName }}</span>
                </div>
                <span [class]="'item-status ' + booking.status">
                  {{ getStatusLabel(booking.status) }}
                </span>
              </div>
            }
          } @else {
            <div class="empty-panel">
              <mat-icon>event_available</mat-icon>
              <span>No hay citas para hoy</span>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .calendar-page {
      padding: 1.5rem;
      display: grid;
      grid-template-columns: 1fr 320px;
      gap: 1.5rem;
      grid-template-rows: auto 1fr;
    }

    .page-header {
      grid-column: 1 / -1;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-info h1 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
    }

    .header-info p {
      color: #64748b;
      margin: 0;
      font-size: 0.9rem;
    }

    .header-controls {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .nav-controls {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .nav-btn {
      background: white;
      border: 1px solid #e2e8f0;
    }

    .today-btn {
      border-color: #0d9488 !important;
      color: #0d9488 !important;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .current-period {
      font-weight: 600;
      color: #0f172a;
      text-transform: capitalize;
      font-size: 1.1rem;
    }

    .calendar-container {
      background: white;
      border-radius: 16px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }

    .calendar-grid {
      display: grid;
      grid-template-columns: 70px repeat(7, 1fr);
    }

    .time-column {
      border-right: 1px solid #e2e8f0;
    }

    .time-header {
      height: 70px;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
    }

    .time-slot {
      height: 70px;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding-top: 0.5rem;
      font-size: 0.75rem;
      color: #64748b;
      font-weight: 500;
      border-bottom: 1px solid #f1f5f9;
    }

    .day-column {
      border-right: 1px solid #e2e8f0;
    }

    .day-column:last-child {
      border-right: none;
    }

    .day-header {
      height: 70px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
    }

    .day-header.today {
      background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
    }

    .day-name {
      font-size: 0.75rem;
      text-transform: uppercase;
      color: #64748b;
      font-weight: 500;
    }

    .day-header.today .day-name {
      color: rgba(255, 255, 255, 0.9);
    }

    .day-number {
      font-size: 1.5rem;
      font-weight: 700;
      color: #0f172a;
    }

    .day-header.today .day-number {
      color: white;
    }

    .day-body {
      position: relative;
    }

    .hour-cell {
      height: 70px;
      border-bottom: 1px solid #f1f5f9;
      position: relative;
    }

    .booking-card {
      position: absolute;
      left: 4px;
      right: 4px;
      background: white;
      border-radius: 8px;
      padding: 0.5rem;
      border-left: 4px solid;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      overflow: hidden;
      z-index: 1;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .booking-card:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    }

    .booking-time {
      font-size: 0.7rem;
      font-weight: 700;
      color: #0f172a;
    }

    .booking-service {
      font-size: 0.75rem;
      font-weight: 600;
      color: #334155;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .booking-client {
      font-size: 0.65rem;
      color: #64748b;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .today-panel {
      background: white;
      border-radius: 16px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      align-self: start;
    }

    .panel-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1.25rem;
      border-bottom: 1px solid #f1f5f9;
    }

    .panel-header mat-icon {
      color: #0d9488;
    }

    .panel-header h3 {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      color: #0f172a;
    }

    .panel-content {
      padding: 1rem;
    }

    .today-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.875rem;
      background: #f8fafc;
      border-radius: 10px;
      margin-bottom: 0.75rem;
    }

    .today-item:last-child {
      margin-bottom: 0;
    }

    .item-time {
      padding: 0.375rem 0.625rem;
      border-radius: 6px;
      color: white;
      font-weight: 700;
      font-size: 0.8rem;
    }

    .item-details {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .item-service {
      font-weight: 600;
      color: #0f172a;
      font-size: 0.875rem;
    }

    .item-client {
      font-size: 0.75rem;
      color: #64748b;
    }

    .item-status {
      font-size: 0.65rem;
      font-weight: 600;
      padding: 0.25rem 0.625rem;
      border-radius: 20px;
    }

    .item-status.pending { background: #fef3c7; color: #d97706; }
    .item-status.confirmed { background: #ccfbf1; color: #0d9488; }
    .item-status.completed { background: #dbeafe; color: #2563eb; }
    .item-status.cancelled { background: #fee2e2; color: #dc2626; }

    .empty-panel {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem;
      color: #94a3b8;
    }

    .empty-panel mat-icon {
      font-size: 2.5rem;
      width: 2.5rem;
      height: 2.5rem;
      margin-bottom: 0.5rem;
    }

    @media (max-width: 1200px) {
      .calendar-page {
        grid-template-columns: 1fr;
      }

      .today-panel {
        grid-row: 2;
      }

      .calendar-container {
        grid-row: 3;
      }
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

  todayBookings = signal(this.bookingService.getBookingsByDate(format(new Date(), 'yyyy-MM-dd')));

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
    return service?.color || '#0d9488';
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
