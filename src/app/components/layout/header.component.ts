import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <header class="header">
      <div class="header-left">
        <button mat-icon-button class="menu-btn">
          <mat-icon>menu</mat-icon>
        </button>
        <div class="search-box">
          <mat-icon>search</mat-icon>
          <input type="text" placeholder="Buscar pacientes, citas...">
        </div>
      </div>

      <div class="header-right">
        <div class="date-display">
          <mat-icon>event</mat-icon>
          <span>{{ currentDate }}</span>
        </div>
        <button mat-icon-button class="notification-btn">
          <mat-icon>notifications</mat-icon>
          <span class="notification-dot"></span>
        </button>
        <button mat-icon-button>
          <mat-icon>help_outline</mat-icon>
        </button>
      </div>
    </header>
  `,
  styles: [`
    .header {
      height: 70px;
      background: white;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.5rem;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .menu-btn {
      display: none;
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.625rem 1rem;
      background: #f1f5f9;
      border-radius: 10px;
      min-width: 320px;
    }

    .search-box mat-icon {
      color: #94a3b8;
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
    }

    .search-box input {
      border: none;
      background: transparent;
      outline: none;
      font-size: 0.9rem;
      width: 100%;
      color: #334155;
    }

    .search-box input::placeholder {
      color: #94a3b8;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .date-display {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%);
      border-radius: 10px;
      color: #0d9488;
      font-weight: 500;
      font-size: 0.875rem;
      margin-right: 0.5rem;
    }

    .date-display mat-icon {
      font-size: 1.125rem;
      width: 1.125rem;
      height: 1.125rem;
    }

    .notification-btn {
      position: relative;
    }

    .notification-dot {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 8px;
      height: 8px;
      background: #ef4444;
      border-radius: 50%;
      border: 2px solid white;
    }

    @media (max-width: 768px) {
      .menu-btn {
        display: flex;
      }

      .search-box {
        display: none;
      }
    }
  `]
})
export class HeaderComponent {
  currentDate = format(new Date(), "EEEE, d 'de' MMMM", { locale: es });
}
