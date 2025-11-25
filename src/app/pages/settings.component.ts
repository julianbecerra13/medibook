import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatIconModule, MatButtonModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatSlideToggleModule,
    MatSelectModule, MatSnackBarModule
  ],
  template: `
    <div class="settings-page">
      <div class="page-header">
        <h2>Configuracion</h2>
        <p>Administra las preferencias del sistema</p>
      </div>

      <div class="settings-grid">
        <!-- Business Info -->
        <mat-card>
          <mat-card-header>
            <mat-icon>business</mat-icon>
            <mat-card-title>Informacion del Negocio</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <mat-form-field appearance="outline">
              <mat-label>Nombre del negocio</mat-label>
              <input matInput [(ngModel)]="settings.businessName">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput [(ngModel)]="settings.email" type="email">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Telefono</mat-label>
              <input matInput [(ngModel)]="settings.phone">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Direccion</mat-label>
              <textarea matInput [(ngModel)]="settings.address" rows="2"></textarea>
            </mat-form-field>
          </mat-card-content>
        </mat-card>

        <!-- Working Hours -->
        <mat-card>
          <mat-card-header>
            <mat-icon>schedule</mat-icon>
            <mat-card-title>Horario de Atencion</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="hours-row">
              <mat-form-field appearance="outline">
                <mat-label>Hora de apertura</mat-label>
                <mat-select [(ngModel)]="settings.openTime">
                  @for (hour of hours; track hour) {
                    <mat-option [value]="hour">{{ hour }}:00</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Hora de cierre</mat-label>
                <mat-select [(ngModel)]="settings.closeTime">
                  @for (hour of hours; track hour) {
                    <mat-option [value]="hour">{{ hour }}:00</mat-option>
                  }
                </mat-select>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline">
              <mat-label>Intervalo de citas (minutos)</mat-label>
              <mat-select [(ngModel)]="settings.slotInterval">
                <mat-option [value]="15">15 minutos</mat-option>
                <mat-option [value]="30">30 minutos</mat-option>
                <mat-option [value]="60">60 minutos</mat-option>
              </mat-select>
            </mat-form-field>
          </mat-card-content>
        </mat-card>

        <!-- Notifications -->
        <mat-card>
          <mat-card-header>
            <mat-icon>notifications</mat-icon>
            <mat-card-title>Notificaciones</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="toggle-row">
              <div class="toggle-info">
                <span class="toggle-label">Notificaciones por email</span>
                <span class="toggle-desc">Recibir confirmaciones de reservas</span>
              </div>
              <mat-slide-toggle [(ngModel)]="settings.emailNotifications"></mat-slide-toggle>
            </div>

            <div class="toggle-row">
              <div class="toggle-info">
                <span class="toggle-label">Recordatorios</span>
                <span class="toggle-desc">Enviar recordatorios a clientes</span>
              </div>
              <mat-slide-toggle [(ngModel)]="settings.reminders"></mat-slide-toggle>
            </div>

            <div class="toggle-row">
              <div class="toggle-info">
                <span class="toggle-label">Notificaciones push</span>
                <span class="toggle-desc">Alertas en tiempo real</span>
              </div>
              <mat-slide-toggle [(ngModel)]="settings.pushNotifications"></mat-slide-toggle>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Preferences -->
        <mat-card>
          <mat-card-header>
            <mat-icon>tune</mat-icon>
            <mat-card-title>Preferencias</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <mat-form-field appearance="outline">
              <mat-label>Moneda</mat-label>
              <mat-select [(ngModel)]="settings.currency">
                <mat-option value="USD">USD ($)</mat-option>
                <mat-option value="EUR">EUR (€)</mat-option>
                <mat-option value="COP">COP ($)</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Idioma</mat-label>
              <mat-select [(ngModel)]="settings.language">
                <mat-option value="es">Espanol</mat-option>
                <mat-option value="en">English</mat-option>
              </mat-select>
            </mat-form-field>

            <div class="toggle-row">
              <div class="toggle-info">
                <span class="toggle-label">Confirmacion automatica</span>
                <span class="toggle-desc">Confirmar reservas automaticamente</span>
              </div>
              <mat-slide-toggle [(ngModel)]="settings.autoConfirm"></mat-slide-toggle>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="save-section">
        <button mat-raised-button color="primary" (click)="saveSettings()">
          <mat-icon>save</mat-icon>
          Guardar Cambios
        </button>
      </div>
    </div>
  `,
  styles: [`
    .settings-page {
      padding: 1.5rem;
      max-width: 1200px;
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

    .settings-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    mat-card {
      border-radius: 1rem !important;
    }

    mat-card-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.5rem !important;
      border-bottom: 1px solid #f3f4f6;
    }

    mat-card-header mat-icon {
      color: #6366f1;
    }

    mat-card-title {
      font-size: 1rem !important;
      font-weight: 600 !important;
      margin: 0 !important;
    }

    mat-card-content {
      padding: 1.5rem !important;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .hours-row {
      display: flex;
      gap: 1rem;
    }

    .hours-row mat-form-field {
      flex: 1;
    }

    .toggle-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid #f3f4f6;
    }

    .toggle-row:last-child {
      border-bottom: none;
    }

    .toggle-info {
      display: flex;
      flex-direction: column;
    }

    .toggle-label {
      font-weight: 500;
    }

    .toggle-desc {
      font-size: 0.8rem;
      color: #6b7280;
    }

    .save-section {
      display: flex;
      justify-content: flex-end;
    }

    @media (max-width: 768px) {
      .settings-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SettingsComponent {
  settings = {
    businessName: 'Centro Medico BookingSystem',
    email: 'contacto@bookingsystem.com',
    phone: '+57 300 123 4567',
    address: 'Calle 123 #45-67, Bucaramanga',
    openTime: 8,
    closeTime: 18,
    slotInterval: 30,
    emailNotifications: true,
    reminders: true,
    pushNotifications: false,
    currency: 'USD',
    language: 'es',
    autoConfirm: false
  };

  hours = Array.from({ length: 24 }, (_, i) => i);

  constructor(private snackBar: MatSnackBar) {}

  saveSettings() {
    this.snackBar.open('Configuracion guardada exitosamente', 'Cerrar', {
      duration: 3000
    });
  }
}
