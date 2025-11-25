import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <header class="header">
      <div class="header-left">
        <h1>{{ pageTitle }}</h1>
      </div>
      <div class="header-right">
        <span class="date">{{ currentDate }}</span>
      </div>
    </header>
  `,
  styles: [`
    .header {
      height: 64px;
      background: white;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.5rem;
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .header-left h1 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #111827;
      margin: 0;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .date {
      color: #6b7280;
      font-size: 0.9rem;
      text-transform: capitalize;
    }
  `]
})
export class HeaderComponent {
  pageTitle = 'Dashboard';

  get currentDate(): string {
    return format(new Date(), "EEEE, d 'de' MMMM yyyy", { locale: es });
  }
}
