import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BookingService } from '../services/booking.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  template: `
    <div class="dashboard">
      <!-- Welcome Section -->
      <div class="welcome-section">
        <div class="welcome-content">
          <h1>Bienvenido, Dr. Becerra</h1>
          <p>Tienes {{ stats().todayBookings }} citas programadas para hoy</p>
        </div>
        <button mat-flat-button class="cta-btn" routerLink="/bookings/new">
          <mat-icon>add</mat-icon>
          Agendar Nueva Cita
        </button>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon blue">
            <mat-icon>event_available</mat-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats().totalBookings }}</span>
            <span class="stat-label">Total Citas</span>
          </div>
          <div class="stat-trend up">
            <mat-icon>trending_up</mat-icon>
            <span>+12%</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon teal">
            <mat-icon>today</mat-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats().todayBookings }}</span>
            <span class="stat-label">Citas Hoy</span>
          </div>
          <div class="stat-badge">En curso</div>
        </div>

        <div class="stat-card">
          <div class="stat-icon amber">
            <mat-icon>pending_actions</mat-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats().pendingBookings }}</span>
            <span class="stat-label">Pendientes</span>
          </div>
          <div class="stat-trend down">
            <mat-icon>trending_down</mat-icon>
            <span>-5%</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon green">
            <mat-icon>payments</mat-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">\${{ stats().totalRevenue.toLocaleString() }}</span>
            <span class="stat-label">Ingresos</span>
          </div>
          <div class="stat-trend up">
            <mat-icon>trending_up</mat-icon>
            <span>+8%</span>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="content-grid">
        <!-- Upcoming Appointments -->
        <div class="card appointments-card">
          <div class="card-header">
            <div class="card-title">
              <mat-icon>schedule</mat-icon>
              <span>Proximas Citas</span>
            </div>
            <a routerLink="/bookings" class="view-all">Ver todas</a>
          </div>
          <div class="appointments-list">
            @for (booking of upcomingBookings(); track booking.id) {
              <div class="appointment-item">
                <div class="appointment-time">
                  <span class="time">{{ booking.time }}</span>
                  <span class="duration">{{ booking.duration }} min</span>
                </div>
                <div class="appointment-divider" [style.background]="getServiceColor(booking.serviceId)"></div>
                <div class="appointment-info">
                  <span class="patient-name">{{ booking.clientName }}</span>
                  <span class="service-name">{{ booking.serviceName }}</span>
                </div>
                <span [class]="'status-pill ' + booking.status">
                  {{ getStatusLabel(booking.status) }}
                </span>
              </div>
            } @empty {
              <div class="empty-state">
                <mat-icon>event_busy</mat-icon>
                <span>No hay citas proximas</span>
              </div>
            }
          </div>
        </div>

        <!-- Services Overview -->
        <div class="card services-card">
          <div class="card-header">
            <div class="card-title">
              <mat-icon>medical_services</mat-icon>
              <span>Servicios Populares</span>
            </div>
            <a routerLink="/services" class="view-all">Ver todos</a>
          </div>
          <div class="services-list">
            @for (service of services().slice(0, 4); track service.id) {
              <div class="service-item">
                <div class="service-icon" [style.background]="service.color + '15'" [style.color]="service.color">
                  <mat-icon>{{ service.icon }}</mat-icon>
                </div>
                <div class="service-info">
                  <span class="service-name">{{ service.name }}</span>
                  <span class="service-duration">{{ service.duration }} minutos</span>
                </div>
                <span class="service-price">\${{ service.price }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="card quick-stats-card">
          <div class="card-header">
            <div class="card-title">
              <mat-icon>insights</mat-icon>
              <span>Resumen Semanal</span>
            </div>
          </div>
          <div class="weekly-chart">
            <div class="chart-bars">
              @for (day of weekData; track day.name) {
                <div class="bar-container">
                  <div class="bar" [style.height.%]="day.value"></div>
                  <span class="bar-label">{{ day.name }}</span>
                </div>
              }
            </div>
            <div class="chart-legend">
              <div class="legend-item">
                <span class="legend-dot completed"></span>
                <span>Completadas: 18</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot pending"></span>
                <span>Pendientes: 7</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 1.5rem;
    }

    .welcome-section {
      background: linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #2dd4bf 100%);
      border-radius: 16px;
      padding: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      position: relative;
      overflow: hidden;
    }

    .welcome-section::before {
      content: '';
      position: absolute;
      right: -50px;
      top: -50px;
      width: 200px;
      height: 200px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
    }

    .welcome-section::after {
      content: '';
      position: absolute;
      right: 100px;
      bottom: -80px;
      width: 150px;
      height: 150px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 50%;
    }

    .welcome-content h1 {
      color: white;
      font-size: 1.75rem;
      font-weight: 700;
      margin: 0 0 0.5rem;
    }

    .welcome-content p {
      color: rgba(255, 255, 255, 0.9);
      margin: 0;
      font-size: 1rem;
    }

    .cta-btn {
      background: white !important;
      color: #0d9488 !important;
      font-weight: 600 !important;
      padding: 0.75rem 1.5rem !important;
      border-radius: 10px !important;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      z-index: 1;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.25rem;
      margin-bottom: 1.5rem;
    }

    .stat-card {
      background: white;
      border-radius: 16px;
      padding: 1.25rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .stat-icon {
      width: 52px;
      height: 52px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon.blue { background: #dbeafe; color: #2563eb; }
    .stat-icon.teal { background: #ccfbf1; color: #0d9488; }
    .stat-icon.amber { background: #fef3c7; color: #d97706; }
    .stat-icon.green { background: #dcfce7; color: #16a34a; }

    .stat-icon mat-icon {
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
    }

    .stat-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #0f172a;
    }

    .stat-label {
      font-size: 0.8rem;
      color: #64748b;
    }

    .stat-trend {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
    }

    .stat-trend.up {
      background: #dcfce7;
      color: #16a34a;
    }

    .stat-trend.down {
      background: #fee2e2;
      color: #dc2626;
    }

    .stat-trend mat-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
    }

    .stat-badge {
      font-size: 0.7rem;
      font-weight: 600;
      padding: 0.25rem 0.75rem;
      background: #ccfbf1;
      color: #0d9488;
      border-radius: 20px;
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 1.25rem;
    }

    .card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem;
      border-bottom: 1px solid #f1f5f9;
    }

    .card-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      color: #0f172a;
    }

    .card-title mat-icon {
      color: #0d9488;
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
    }

    .view-all {
      font-size: 0.8rem;
      color: #0d9488;
      text-decoration: none;
      font-weight: 500;
    }

    .view-all:hover {
      text-decoration: underline;
    }

    .appointments-list {
      padding: 0.5rem;
    }

    .appointment-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border-radius: 10px;
      transition: background 0.2s;
    }

    .appointment-item:hover {
      background: #f8fafc;
    }

    .appointment-time {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 50px;
    }

    .appointment-time .time {
      font-weight: 700;
      color: #0f172a;
      font-size: 0.95rem;
    }

    .appointment-time .duration {
      font-size: 0.7rem;
      color: #94a3b8;
    }

    .appointment-divider {
      width: 3px;
      height: 40px;
      border-radius: 2px;
    }

    .appointment-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .patient-name {
      font-weight: 600;
      color: #0f172a;
      font-size: 0.9rem;
    }

    .service-name {
      font-size: 0.8rem;
      color: #64748b;
    }

    .status-pill {
      font-size: 0.7rem;
      font-weight: 600;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
    }

    .status-pill.pending { background: #fef3c7; color: #d97706; }
    .status-pill.confirmed { background: #ccfbf1; color: #0d9488; }
    .status-pill.completed { background: #dbeafe; color: #2563eb; }
    .status-pill.cancelled { background: #fee2e2; color: #dc2626; }

    .services-list {
      padding: 0.5rem;
    }

    .service-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border-radius: 10px;
      transition: background 0.2s;
    }

    .service-item:hover {
      background: #f8fafc;
    }

    .service-icon {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .service-icon mat-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
    }

    .service-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .service-info .service-name {
      font-weight: 600;
      color: #0f172a;
      font-size: 0.9rem;
    }

    .service-duration {
      font-size: 0.75rem;
      color: #64748b;
    }

    .service-price {
      font-weight: 700;
      color: #0d9488;
      font-size: 1rem;
    }

    .weekly-chart {
      padding: 1.25rem;
    }

    .chart-bars {
      display: flex;
      justify-content: space-around;
      align-items: flex-end;
      height: 120px;
      margin-bottom: 1rem;
    }

    .bar-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .bar {
      width: 24px;
      background: linear-gradient(180deg, #14b8a6 0%, #0d9488 100%);
      border-radius: 4px;
      min-height: 8px;
    }

    .bar-label {
      font-size: 0.7rem;
      color: #64748b;
      font-weight: 500;
    }

    .chart-legend {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      padding-top: 0.75rem;
      border-top: 1px solid #f1f5f9;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      color: #64748b;
    }

    .legend-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .legend-dot.completed { background: #0d9488; }
    .legend-dot.pending { background: #f59e0b; }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem;
      color: #94a3b8;
    }

    .empty-state mat-icon {
      font-size: 2.5rem;
      width: 2.5rem;
      height: 2.5rem;
      margin-bottom: 0.5rem;
    }

    @media (max-width: 1200px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .content-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .welcome-section {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
      }
    }
  `]
})
export class DashboardComponent {
  private bookingService = inject(BookingService);

  stats = this.bookingService.dashboardStats;
  upcomingBookings = this.bookingService.upcomingBookings;
  services = this.bookingService.allServices;

  weekData = [
    { name: 'Lun', value: 65 },
    { name: 'Mar', value: 45 },
    { name: 'Mie', value: 80 },
    { name: 'Jue', value: 55 },
    { name: 'Vie', value: 90 },
    { name: 'Sab', value: 30 },
    { name: 'Dom', value: 15 }
  ];

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
