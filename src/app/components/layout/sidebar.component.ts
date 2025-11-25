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
          <mat-icon>event_available</mat-icon>
          <span>BookingSystem</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item">
          <mat-icon>dashboard</mat-icon>
          <span>Dashboard</span>
        </a>
        <a routerLink="/calendar" routerLinkActive="active" class="nav-item">
          <mat-icon>calendar_month</mat-icon>
          <span>Calendario</span>
        </a>
        <a routerLink="/bookings" routerLinkActive="active" class="nav-item">
          <mat-icon>book_online</mat-icon>
          <span>Reservas</span>
          @if (pendingCount().pendingBookings > 0) {
            <span class="badge">{{ pendingCount().pendingBookings }}</span>
          }
        </a>
        <a routerLink="/services" routerLinkActive="active" class="nav-item">
          <mat-icon>medical_services</mat-icon>
          <span>Servicios</span>
        </a>
        <a routerLink="/settings" routerLinkActive="active" class="nav-item">
          <mat-icon>settings</mat-icon>
          <span>Configuracion</span>
        </a>
      </nav>

      <div class="sidebar-footer">
        <div class="user-info">
          <div class="avatar">JB</div>
          <div class="user-details">
            <span class="user-name">Julian Becerra</span>
            <span class="user-role">Administrador</span>
          </div>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 260px;
      height: 100vh;
      background: white;
      border-right: 1px solid #e5e7eb;
      display: flex;
      flex-direction: column;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 100;
    }

    .sidebar-header {
      padding: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.25rem;
      font-weight: 700;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .logo mat-icon {
      font-size: 1.75rem;
      width: 1.75rem;
      height: 1.75rem;
      color: #6366f1;
    }

    .sidebar-nav {
      flex: 1;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      color: #6b7280;
      text-decoration: none;
      transition: all 0.2s;
    }

    .nav-item:hover {
      background: #f3f4f6;
      color: #374151;
    }

    .nav-item.active {
      background: #6366f1;
      color: white;
    }

    .nav-item mat-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
    }

    .badge {
      margin-left: auto;
      background: #ef4444;
      color: white;
      font-size: 0.7rem;
      padding: 0.15rem 0.5rem;
      border-radius: 9999px;
      font-weight: 600;
    }

    .nav-item.active .badge {
      background: white;
      color: #6366f1;
    }

    .sidebar-footer {
      padding: 1rem;
      border-top: 1px solid #e5e7eb;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #6366f1;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
    }

    .user-details {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-weight: 600;
      font-size: 0.9rem;
      color: #374151;
    }

    .user-role {
      font-size: 0.75rem;
      color: #9ca3af;
    }
  `]
})
export class SidebarComponent {
  private bookingService = inject(BookingService);

  pendingCount = this.bookingService.dashboardStats;

  constructor() {}

  get pendingBookings(): number {
    return this.pendingCount().pendingBookings;
  }
}
