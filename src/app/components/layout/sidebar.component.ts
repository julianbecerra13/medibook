import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  template: `
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <div class="logo-icon">
            <mat-icon>local_hospital</mat-icon>
          </div>
          <div class="logo-text">
            <span class="brand">MediBook</span>
            <span class="subtitle">Sistema de Citas</span>
          </div>
        </div>
      </div>

      <nav class="sidebar-nav">
        <span class="nav-label">MENU PRINCIPAL</span>
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
          <div class="nav-icon"><mat-icon>space_dashboard</mat-icon></div>
          <span>Dashboard</span>
        </a>
        <a routerLink="/calendar" routerLinkActive="active" class="nav-item">
          <div class="nav-icon"><mat-icon>calendar_month</mat-icon></div>
          <span>Calendario</span>
        </a>
        <a routerLink="/bookings" routerLinkActive="active" class="nav-item">
          <div class="nav-icon"><mat-icon>event_note</mat-icon></div>
          <span>Reservas</span>
          @if (pendingCount().pendingBookings > 0) {
            <span class="badge">{{ pendingCount().pendingBookings }}</span>
          }
        </a>

        <span class="nav-label">ADMINISTRACION</span>
        <a routerLink="/services" routerLinkActive="active" class="nav-item">
          <div class="nav-icon"><mat-icon>medical_services</mat-icon></div>
          <span>Servicios</span>
        </a>
        <a routerLink="/settings" routerLinkActive="active" class="nav-item">
          <div class="nav-icon"><mat-icon>settings</mat-icon></div>
          <span>Configuracion</span>
        </a>
      </nav>

      <div class="sidebar-footer">
        <div class="quick-action">
          <a routerLink="/bookings/new" class="new-booking-btn">
            <mat-icon>add</mat-icon>
            <span>Nueva Cita</span>
          </a>
        </div>
        <div class="user-card">
          <img src="https://ui-avatars.com/api/?name=Julian+Becerra&background=0d9488&color=fff" alt="avatar" class="avatar">
          <div class="user-details">
            <span class="user-name">Dr. Julian Becerra</span>
            <span class="user-role">Administrador</span>
          </div>
          <mat-icon class="more-icon">more_vert</mat-icon>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 280px;
      height: 100vh;
      background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
      display: flex;
      flex-direction: column;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 100;
    }

    .sidebar-header {
      padding: 1.5rem;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .logo-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .logo-icon mat-icon {
      color: white;
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
    }

    .logo-text {
      display: flex;
      flex-direction: column;
    }

    .brand {
      font-size: 1.25rem;
      font-weight: 700;
      color: white;
    }

    .subtitle {
      font-size: 0.75rem;
      color: #94a3b8;
    }

    .sidebar-nav {
      flex: 1;
      padding: 0.5rem 1rem;
      overflow-y: auto;
    }

    .nav-label {
      display: block;
      font-size: 0.65rem;
      font-weight: 600;
      color: #64748b;
      letter-spacing: 0.1em;
      padding: 1rem 0.75rem 0.5rem;
      margin-top: 0.5rem;
    }

    .nav-label:first-child {
      margin-top: 0;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      border-radius: 10px;
      color: #94a3b8;
      text-decoration: none;
      transition: all 0.2s;
      margin-bottom: 0.25rem;
    }

    .nav-item:hover {
      background: rgba(255, 255, 255, 0.05);
      color: white;
    }

    .nav-item.active {
      background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(20, 184, 166, 0.3);
    }

    .nav-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.05);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .nav-item.active .nav-icon {
      background: rgba(255, 255, 255, 0.2);
    }

    .nav-icon mat-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
    }

    .badge {
      margin-left: auto;
      background: #ef4444;
      color: white;
      font-size: 0.7rem;
      padding: 0.2rem 0.6rem;
      border-radius: 9999px;
      font-weight: 600;
    }

    .sidebar-footer {
      padding: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .quick-action {
      margin-bottom: 1rem;
    }

    .new-booking-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.875rem;
      background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
      border: none;
      border-radius: 10px;
      color: white;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s;
    }

    .new-booking-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(20, 184, 166, 0.4);
    }

    .user-card {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
    }

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 10px;
    }

    .user-details {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-weight: 600;
      font-size: 0.875rem;
      color: white;
    }

    .user-role {
      font-size: 0.7rem;
      color: #64748b;
    }

    .more-icon {
      color: #64748b;
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
      cursor: pointer;
    }
  `]
})
export class SidebarComponent {
  private bookingService = inject(BookingService);
  pendingCount = this.bookingService.dashboardStats;
}
