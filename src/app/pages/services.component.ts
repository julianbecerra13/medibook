import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BookingService } from '../services/booking.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatCardModule],
  template: `
    <div class="services-page">
      <div class="page-header">
        <div>
          <h2>Servicios Disponibles</h2>
          <p>Catalogo de servicios ofrecidos</p>
        </div>
        <button mat-raised-button color="primary">
          <mat-icon>add</mat-icon>
          Nuevo Servicio
        </button>
      </div>

      <div class="services-grid">
        @for (service of services(); track service.id) {
          <mat-card class="service-card">
            <mat-card-content>
              <div class="service-header">
                <div class="service-icon" [style.background]="service.color + '20'" [style.color]="service.color">
                  <mat-icon>{{ service.icon }}</mat-icon>
                </div>
                <div class="service-actions">
                  <button mat-icon-button>
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </div>
              <h3>{{ service.name }}</h3>
              <p class="description">{{ service.description }}</p>
              <div class="service-details">
                <div class="detail">
                  <mat-icon>schedule</mat-icon>
                  <span>{{ service.duration }} minutos</span>
                </div>
                <div class="detail">
                  <mat-icon>attach_money</mat-icon>
                  <span>\${{ service.price }}</span>
                </div>
              </div>
              <div class="service-color">
                <span class="color-dot" [style.background]="service.color"></span>
                <span>{{ service.color }}</span>
              </div>
            </mat-card-content>
          </mat-card>
        }

        <!-- Add Service Card -->
        <mat-card class="service-card add-card">
          <mat-card-content>
            <div class="add-content">
              <mat-icon>add_circle_outline</mat-icon>
              <span>Agregar Servicio</span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .services-page {
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

    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .service-card {
      border-radius: 1rem !important;
    }

    mat-card-content {
      padding: 1.5rem !important;
    }

    .service-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .service-icon {
      width: 56px;
      height: 56px;
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .service-icon mat-icon {
      font-size: 1.75rem;
      width: 1.75rem;
      height: 1.75rem;
    }

    .service-actions {
      display: flex;
      gap: 0.25rem;
    }

    h3 {
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0 0 0.5rem;
    }

    .description {
      color: #6b7280;
      font-size: 0.9rem;
      margin: 0 0 1rem;
    }

    .service-details {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 1rem;
    }

    .detail {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #374151;
    }

    .detail mat-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
      color: #6b7280;
    }

    .service-color {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8rem;
      color: #6b7280;
    }

    .color-dot {
      width: 16px;
      height: 16px;
      border-radius: 50%;
    }

    .add-card {
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px dashed #e5e7eb;
      background: transparent !important;
      cursor: pointer;
      min-height: 250px;
    }

    .add-card:hover {
      border-color: #6366f1;
    }

    .add-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #9ca3af;
    }

    .add-card:hover .add-content {
      color: #6366f1;
    }

    .add-content mat-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      margin-bottom: 0.5rem;
    }
  `]
})
export class ServicesComponent {
  private bookingService = inject(BookingService);
  services = this.bookingService.allServices;
}
