import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { BookingService } from '../services/booking.service';
import { Booking } from '../models/booking.model';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [
    CommonModule, RouterModule, FormsModule,
    MatIconModule, MatButtonModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatTableModule, MatMenuModule
  ],
  template: `
    <div class="bookings-page">
      <div class="page-header">
        <div>
          <h2>Gestion de Reservas</h2>
          <p>Administra todas las reservas del sistema</p>
        </div>
        <button mat-raised-button color="primary" routerLink="/bookings/new">
          <mat-icon>add</mat-icon>
          Nueva Reserva
        </button>
      </div>

      <!-- Filters -->
      <mat-card class="filters-card">
        <mat-card-content>
          <div class="filters-row">
            <mat-form-field appearance="outline">
              <mat-label>Buscar</mat-label>
              <input matInput [(ngModel)]="searchQuery" placeholder="Nombre, servicio...">
              <mat-icon matPrefix>search</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Estado</mat-label>
              <mat-select [(ngModel)]="statusFilter">
                <mat-option value="">Todos</mat-option>
                <mat-option value="pending">Pendiente</mat-option>
                <mat-option value="confirmed">Confirmada</mat-option>
                <mat-option value="completed">Completada</mat-option>
                <mat-option value="cancelled">Cancelada</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Bookings Table -->
      <mat-card class="table-card">
        <mat-card-content>
          <table mat-table [dataSource]="filteredBookings" class="bookings-table">
            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef>Fecha</th>
              <td mat-cell *matCellDef="let booking">
                <div class="date-cell">
                  <span class="date">{{ bookingService.formatDate(booking.date) }}</span>
                  <span class="time">{{ booking.time }}</span>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="service">
              <th mat-header-cell *matHeaderCellDef>Servicio</th>
              <td mat-cell *matCellDef="let booking">
                <div class="service-cell">
                  <span class="name">{{ booking.serviceName }}</span>
                  <span class="duration">{{ booking.duration }} min</span>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="client">
              <th mat-header-cell *matHeaderCellDef>Cliente</th>
              <td mat-cell *matCellDef="let booking">
                <div class="client-cell">
                  <span class="name">{{ booking.clientName }}</span>
                  <span class="email">{{ booking.clientEmail }}</span>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="price">
              <th mat-header-cell *matHeaderCellDef>Precio</th>
              <td mat-cell *matCellDef="let booking">
                <span class="price">\${{ booking.price }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let booking">
                <span [class]="'status-badge ' + booking.status">
                  {{ getStatusLabel(booking.status) }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let booking">
                <button mat-icon-button [matMenuTriggerFor]="menu">
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #menu="matMenu">
                  @if (booking.status === 'pending') {
                    <button mat-menu-item (click)="confirmBooking(booking.id)">
                      <mat-icon>check_circle</mat-icon>
                      <span>Confirmar</span>
                    </button>
                  }
                  @if (booking.status === 'confirmed') {
                    <button mat-menu-item (click)="completeBooking(booking.id)">
                      <mat-icon>done_all</mat-icon>
                      <span>Completar</span>
                    </button>
                  }
                  @if (booking.status !== 'cancelled' && booking.status !== 'completed') {
                    <button mat-menu-item (click)="cancelBooking(booking.id)">
                      <mat-icon>cancel</mat-icon>
                      <span>Cancelar</span>
                    </button>
                  }
                </mat-menu>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>

          @if (filteredBookings.length === 0) {
            <div class="empty-state">
              <mat-icon>event_busy</mat-icon>
              <span>No se encontraron reservas</span>
            </div>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .bookings-page {
      padding: 1.5rem;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
    }

    .page-header h2 {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0;
    }

    .page-header p {
      color: #6b7280;
      margin: 0;
    }

    mat-card {
      border-radius: 1rem !important;
      margin-bottom: 1.5rem;
    }

    .filters-card mat-card-content {
      padding: 1rem !important;
    }

    .filters-row {
      display: flex;
      gap: 1rem;
    }

    .filters-row mat-form-field {
      flex: 1;
      max-width: 300px;
    }

    .table-card mat-card-content {
      padding: 0 !important;
    }

    .bookings-table {
      width: 100%;
    }

    th.mat-header-cell {
      font-weight: 600;
      color: #374151;
      padding: 1rem;
    }

    td.mat-cell {
      padding: 1rem;
    }

    .date-cell, .service-cell, .client-cell {
      display: flex;
      flex-direction: column;
    }

    .date-cell .date {
      font-weight: 500;
    }

    .date-cell .time,
    .service-cell .duration,
    .client-cell .email {
      font-size: 0.8rem;
      color: #6b7280;
    }

    .service-cell .name,
    .client-cell .name {
      font-weight: 500;
    }

    .price {
      font-weight: 600;
      color: #111827;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .status-badge.pending { background: #fef3c7; color: #92400e; }
    .status-badge.confirmed { background: #dcfce7; color: #166534; }
    .status-badge.completed { background: #dbeafe; color: #1e40af; }
    .status-badge.cancelled { background: #fee2e2; color: #991b1b; }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 3rem;
      color: #9ca3af;
    }

    .empty-state mat-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      margin-bottom: 0.5rem;
    }
  `]
})
export class BookingsComponent {
  bookingService = inject(BookingService);

  displayedColumns = ['date', 'service', 'client', 'price', 'status', 'actions'];
  searchQuery = '';
  statusFilter = '';

  get filteredBookings(): Booking[] {
    return this.bookingService.allBookings().filter(booking => {
      const matchesSearch = !this.searchQuery ||
        booking.clientName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        booking.serviceName.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesStatus = !this.statusFilter || booking.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
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

  confirmBooking(id: string) {
    this.bookingService.confirmBooking(id);
  }

  completeBooking(id: string) {
    this.bookingService.completeBooking(id);
  }

  cancelBooking(id: string) {
    this.bookingService.cancelBooking(id);
  }
}
