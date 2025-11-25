import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatStepperModule } from '@angular/material/stepper';
import { BookingService } from '../services/booking.service';
import { format } from 'date-fns';

@Component({
  selector: 'app-new-booking',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatIconModule, MatButtonModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatDatepickerModule, MatNativeDateModule, MatStepperModule
  ],
  template: `
    <div class="new-booking-page">
      <div class="page-header">
        <h2>Nueva Reserva</h2>
        <p>Completa los pasos para crear una nueva reserva</p>
      </div>

      <mat-card>
        <mat-card-content>
          <mat-stepper [linear]="true" #stepper>
            <!-- Step 1: Select Service -->
            <mat-step [stepControl]="serviceForm">
              <ng-template matStepLabel>Seleccionar Servicio</ng-template>
              <form [formGroup]="serviceForm">
                <div class="services-grid">
                  @for (service of services(); track service.id) {
                    <div class="service-card"
                         [class.selected]="serviceForm.get('serviceId')?.value === service.id"
                         (click)="selectService(service.id)">
                      <div class="service-icon" [style.background]="service.color + '20'" [style.color]="service.color">
                        <mat-icon>{{ service.icon }}</mat-icon>
                      </div>
                      <div class="service-info">
                        <span class="name">{{ service.name }}</span>
                        <span class="desc">{{ service.description }}</span>
                        <span class="details">{{ service.duration }} min - \${{ service.price }}</span>
                      </div>
                    </div>
                  }
                </div>
                <div class="step-actions">
                  <button mat-raised-button color="primary" matStepperNext [disabled]="!serviceForm.valid">
                    Siguiente
                    <mat-icon>arrow_forward</mat-icon>
                  </button>
                </div>
              </form>
            </mat-step>

            <!-- Step 2: Select Date & Time -->
            <mat-step [stepControl]="dateForm">
              <ng-template matStepLabel>Fecha y Hora</ng-template>
              <form [formGroup]="dateForm">
                <div class="date-time-grid">
                  <mat-form-field appearance="outline">
                    <mat-label>Fecha</mat-label>
                    <input matInput [matDatepicker]="picker" formControlName="date" [min]="minDate">
                    <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
                    <mat-datepicker #picker></mat-datepicker>
                  </mat-form-field>

                  @if (availableSlots().length > 0) {
                    <div class="time-slots">
                      <label>Horarios disponibles</label>
                      <div class="slots-grid">
                        @for (slot of availableSlots(); track slot.time) {
                          <button type="button"
                                  class="slot-btn"
                                  [class.selected]="dateForm.get('time')?.value === slot.time"
                                  [class.unavailable]="!slot.available"
                                  [disabled]="!slot.available"
                                  (click)="selectTime(slot.time)">
                            {{ slot.time }}
                          </button>
                        }
                      </div>
                    </div>
                  }
                </div>
                <div class="step-actions">
                  <button mat-button matStepperPrevious>
                    <mat-icon>arrow_back</mat-icon>
                    Anterior
                  </button>
                  <button mat-raised-button color="primary" matStepperNext [disabled]="!dateForm.valid">
                    Siguiente
                    <mat-icon>arrow_forward</mat-icon>
                  </button>
                </div>
              </form>
            </mat-step>

            <!-- Step 3: Client Info -->
            <mat-step [stepControl]="clientForm">
              <ng-template matStepLabel>Datos del Cliente</ng-template>
              <form [formGroup]="clientForm">
                <div class="client-form">
                  <mat-form-field appearance="outline">
                    <mat-label>Nombre completo</mat-label>
                    <input matInput formControlName="clientName" placeholder="Nombre del cliente">
                    <mat-icon matPrefix>person</mat-icon>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Email</mat-label>
                    <input matInput formControlName="clientEmail" type="email" placeholder="email@example.com">
                    <mat-icon matPrefix>email</mat-icon>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Telefono</mat-label>
                    <input matInput formControlName="clientPhone" placeholder="+57 300 123 4567">
                    <mat-icon matPrefix>phone</mat-icon>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Notas (opcional)</mat-label>
                    <textarea matInput formControlName="notes" rows="3" placeholder="Notas adicionales..."></textarea>
                  </mat-form-field>
                </div>
                <div class="step-actions">
                  <button mat-button matStepperPrevious>
                    <mat-icon>arrow_back</mat-icon>
                    Anterior
                  </button>
                  <button mat-raised-button color="primary" matStepperNext [disabled]="!clientForm.valid">
                    Siguiente
                    <mat-icon>arrow_forward</mat-icon>
                  </button>
                </div>
              </form>
            </mat-step>

            <!-- Step 4: Confirm -->
            <mat-step>
              <ng-template matStepLabel>Confirmar</ng-template>
              <div class="confirmation">
                <h3>Resumen de la Reserva</h3>
                <div class="summary-card">
                  <div class="summary-item">
                    <span class="label">Servicio</span>
                    <span class="value">{{ selectedService()?.name }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="label">Fecha</span>
                    <span class="value">{{ formatSelectedDate() }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="label">Hora</span>
                    <span class="value">{{ dateForm.get('time')?.value }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="label">Duracion</span>
                    <span class="value">{{ selectedService()?.duration }} minutos</span>
                  </div>
                  <div class="summary-item">
                    <span class="label">Cliente</span>
                    <span class="value">{{ clientForm.get('clientName')?.value }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="label">Email</span>
                    <span class="value">{{ clientForm.get('clientEmail')?.value }}</span>
                  </div>
                  <div class="summary-item total">
                    <span class="label">Total</span>
                    <span class="value">\${{ selectedService()?.price }}</span>
                  </div>
                </div>
              </div>
              <div class="step-actions">
                <button mat-button matStepperPrevious>
                  <mat-icon>arrow_back</mat-icon>
                  Anterior
                </button>
                <button mat-raised-button color="primary" (click)="createBooking()">
                  <mat-icon>check</mat-icon>
                  Confirmar Reserva
                </button>
              </div>
            </mat-step>
          </mat-stepper>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .new-booking-page {
      padding: 1.5rem;
      max-width: 900px;
      margin: 0 auto;
    }

    .page-header {
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
    }

    mat-card-content {
      padding: 1.5rem !important;
    }

    .services-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin: 1rem 0;
    }

    .service-card {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 0.75rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .service-card:hover {
      border-color: #6366f1;
    }

    .service-card.selected {
      border-color: #6366f1;
      background: #eef2ff;
    }

    .service-icon {
      width: 48px;
      height: 48px;
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .service-info {
      display: flex;
      flex-direction: column;
    }

    .service-info .name {
      font-weight: 600;
      color: #111827;
    }

    .service-info .desc {
      font-size: 0.8rem;
      color: #6b7280;
      margin: 0.25rem 0;
    }

    .service-info .details {
      font-size: 0.9rem;
      font-weight: 500;
      color: #6366f1;
    }

    .date-time-grid {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin: 1rem 0;
    }

    .date-time-grid mat-form-field {
      max-width: 300px;
    }

    .time-slots label {
      display: block;
      font-weight: 500;
      margin-bottom: 0.75rem;
    }

    .slots-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 0.5rem;
    }

    .slot-btn {
      padding: 0.5rem;
      border: 1px solid #e5e7eb;
      background: white;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .slot-btn:hover:not(:disabled) {
      border-color: #6366f1;
    }

    .slot-btn.selected {
      background: #6366f1;
      color: white;
      border-color: #6366f1;
    }

    .slot-btn.unavailable {
      background: #f3f4f6;
      color: #9ca3af;
      cursor: not-allowed;
    }

    .client-form {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin: 1rem 0;
      max-width: 500px;
    }

    .confirmation h3 {
      margin: 0 0 1rem;
    }

    .summary-card {
      background: #f9fafb;
      border-radius: 0.75rem;
      padding: 1.5rem;
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem 0;
      border-bottom: 1px solid #e5e7eb;
    }

    .summary-item:last-child {
      border-bottom: none;
    }

    .summary-item .label {
      color: #6b7280;
    }

    .summary-item .value {
      font-weight: 500;
    }

    .summary-item.total {
      padding-top: 1rem;
      margin-top: 0.5rem;
      border-top: 2px solid #e5e7eb;
    }

    .summary-item.total .value {
      font-size: 1.25rem;
      color: #6366f1;
    }

    .step-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e5e7eb;
    }

    @media (max-width: 640px) {
      .services-grid {
        grid-template-columns: 1fr;
      }

      .slots-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }
  `]
})
export class NewBookingComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private bookingService = inject(BookingService);

  services = this.bookingService.allServices;
  minDate = new Date();

  serviceForm = this.fb.group({
    serviceId: ['', Validators.required]
  });

  dateForm = this.fb.group({
    date: [null as Date | null, Validators.required],
    time: ['', Validators.required]
  });

  clientForm = this.fb.group({
    clientName: ['', Validators.required],
    clientEmail: ['', [Validators.required, Validators.email]],
    clientPhone: ['', Validators.required],
    notes: ['']
  });

  availableSlots = signal<{time: string, available: boolean}[]>([]);

  selectedService = signal(this.bookingService.getServiceById(''));

  constructor() {
    this.dateForm.get('date')?.valueChanges.subscribe(date => {
      if (date && this.serviceForm.get('serviceId')?.value) {
        const formattedDate = format(date, 'yyyy-MM-dd');
        const slots = this.bookingService.getAvailableSlots(
          formattedDate,
          this.serviceForm.get('serviceId')?.value || ''
        );
        this.availableSlots.set(slots);
        this.dateForm.patchValue({ time: '' });
      }
    });
  }

  selectService(id: string) {
    this.serviceForm.patchValue({ serviceId: id });
    this.selectedService.set(this.bookingService.getServiceById(id));
  }

  selectTime(time: string) {
    this.dateForm.patchValue({ time });
  }

  formatSelectedDate(): string {
    const date = this.dateForm.get('date')?.value;
    if (date) {
      return this.bookingService.formatDate(format(date, 'yyyy-MM-dd'));
    }
    return '';
  }

  createBooking() {
    const service = this.selectedService();
    if (!service) return;

    const dateValue = this.dateForm.get('date')?.value;
    if (!dateValue) return;

    this.bookingService.addBooking({
      serviceId: service.id,
      serviceName: service.name,
      clientName: this.clientForm.get('clientName')?.value || '',
      clientEmail: this.clientForm.get('clientEmail')?.value || '',
      clientPhone: this.clientForm.get('clientPhone')?.value || '',
      date: format(dateValue, 'yyyy-MM-dd'),
      time: this.dateForm.get('time')?.value || '',
      duration: service.duration,
      price: service.price,
      status: 'pending',
      notes: this.clientForm.get('notes')?.value || undefined
    });

    this.router.navigate(['/bookings']);
  }
}
