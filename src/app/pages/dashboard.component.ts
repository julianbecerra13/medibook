import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { BookingService } from '../services/booking.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, MatCardModule, MatChipsModule],
  template: `
    <div class="dashboard">
      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon blue">
            <mat-icon>calendar_month</mat-icon>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stats().totalBookings }}</span>
            <span class="stat-label">Total Reservas</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon purple">
            <mat-icon>today</mat-icon>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stats().todayBookings }}</span>
            <span class="stat-label">Reservas Hoy</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon orange">
            <mat-icon>pending_actions</mat-icon>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ stats().pendingBookings }}</span>
            <span class="stat-label">Pendientes</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon green">
            <mat-icon>attach_money</mat-icon>
          </div>
          <div class="stat-content">
            <span class="stat-value">\${{ stats().totalRevenue }}</span>
            <span class="stat-label">Ingresos</span>
          </div>
        </div>
      </div>

      <div class="content-grid">
        <!-- Proximas Reservas -->
        <mat-card class="upcoming-card">
          <mat-card-header>
            <mat-card-title>Proximas Reservas</mat-card-title>
            <a routerLink="/bookings" class="view-all">Ver todas</a>
          </mat-card-header>
          <mat-card-content>
            @if (upcomingBookings().length > 0) {
              <div class="bookings-list">
                @for (booking of upcomingBookings(); track booking.id) {
                  <div class="booking-item">
                    <div class="booking-time">
                      <span class="time">{{ booking.time }}</span>
                      <span class="date">{{ bookingService.formatDate(booking.date) }}</span>
                    </div>
                    <div class="booking-info">
                      <span class="service-name">{{ booking.serviceName }}</span>
                      <span class="client-name">{{ booking.clientName }}</span>
                    </div>
                    <span [class]="'status-badge ' + booking.status">
                      {{ getStatusLabel(booking.status) }}
                    </span>
                  </div>
                }
              </div>
            } @else {
              <div class="empty-state">
                <mat-icon>event_available</mat-icon>
                <span>No hay reservas proximas</span>
              </div>
            }
          </mat-card-content>
        </mat-card>

        <!-- Servicios Disponibles -->
        <mat-card class="services-card">
          <mat-card-header>
            <mat-card-title>Servicios Disponibles</mat-card-title>
            <a routerLink="/services" class="view-all">Ver todos</a>
          </mat-card-header>
          <mat-card-content>
            <div class="services-grid">
              @for (service of services(); track service.id) {
                <div class="service-item" [style.border-left-color]="service.color">
                  <div class="service-icon" [style.background]="service.color + '20'" [style.color]="service.color">
                    <mat-icon>{{ service.icon }}</mat-icon>
                  </div>
                  <div class="service-info">
                    <span class="service-name">{{ service.name }}</span>
                    <span class="service-details">{{ service.duration }} min - \${{ service.price }}</span>
                  </div>
                </div>
              }
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Quick Actions -->
      <mat-card class="actions-card">
        <mat-card-header>
          <mat-card-title>Acciones Rapidas</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="actions-grid">
            <button mat-raised-button color="primary" routerLink="/bookings/new">
              <mat-icon>add</mat-icon>
              Nueva Reserva
            </button>
            <button mat-stroked-button routerLink="/calendar">
              <mat-icon>calendar_month</mat-icon>
              Ver Calendario
            </button>
            <button mat-stroked-button routerLink="/bookings">
              <mat-icon>list</mat-icon>
              Ver Todas las Reservas
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 1.5rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .stat-card {
      background: white;
      border-radius: 1rem;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .stat-icon mat-icon {
      font-size: 1.75rem;
      width: 1.75rem;
      height: 1.75rem;
    }

    .stat-icon.blue { background: linear-gradient(135deg, #3b82f6, #60a5fa); }
    .stat-icon.purple { background: linear-gradient(135deg, #8b5cf6, #a78bfa); }
    .stat-icon.orange { background: linear-gradient(135deg, #f59e0b, #fbbf24); }
    .stat-icon.green { background: linear-gradient(135deg, #10b981, #34d399); }

    .stat-content {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #111827;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    mat-card {
      border-radius: 1rem !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
    }

    mat-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem !important;
      border-bottom: 1px solid #f3f4f6;
    }

    mat-card-title {
      font-size: 1rem !important;
      font-weight: 600 !important;
      margin: 0 !important;
    }

    .view-all {
      font-size: 0.875rem;
      color: #6366f1;
      text-decoration: none;
    }

    .view-all:hover {
      text-decoration: underline;
    }

    mat-card-content {
      padding: 1rem 1.5rem !important;
    }

    .bookings-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .booking-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem;
      background: #f9fafb;
      border-radius: 0.5rem;
    }

    .booking-time {
      display: flex;
      flex-direction: column;
      min-width: 80px;
    }

    .booking-time .time {
      font-weight: 600;
      color: #111827;
    }

    .booking-time .date {
      font-size: 0.75rem;
      color: #6b7280;
    }

    .booking-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .booking-info .service-name {
      font-weight: 500;
      color: #374151;
    }

    .booking-info .client-name {
      font-size: 0.8rem;
      color: #6b7280;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .status-badge.pending {
      background: #fef3c7;
      color: #92400e;
    }

    .status-badge.confirmed {
      background: #dcfce7;
      color: #166534;
    }

    .status-badge.completed {
      background: #dbeafe;
      color: #1e40af;
    }

    .status-badge.cancelled {
      background: #fee2e2;
      color: #991b1b;
    }

    .services-grid {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .service-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem;
      background: #f9fafb;
      border-radius: 0.5rem;
      border-left: 3px solid;
    }

    .service-icon {
      width: 40px;
      height: 40px;
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .service-info {
      display: flex;
      flex-direction: column;
    }

    .service-info .service-name {
      font-weight: 500;
      color: #374151;
    }

    .service-info .service-details {
      font-size: 0.8rem;
      color: #6b7280;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem;
      color: #9ca3af;
    }

    .empty-state mat-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      margin-bottom: 0.5rem;
    }

    .actions-card mat-card-content {
      padding-top: 1rem !important;
    }

    .actions-grid {
      display: flex;
      gap: 1rem;
    }

    .actions-grid button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    @media (max-width: 1024px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .content-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 640px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .actions-grid {
        flex-direction: column;
      }
    }
  `]
})
export class DashboardComponent {
  bookingService = inject(BookingService);

  stats = this.bookingService.dashboardStats;
  upcomingBookings = this.bookingService.upcomingBookings;
  services = this.bookingService.allServices;

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
