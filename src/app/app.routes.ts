import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'calendar',
    loadComponent: () => import('./pages/calendar.component').then(m => m.CalendarComponent)
  },
  {
    path: 'bookings',
    loadComponent: () => import('./pages/bookings.component').then(m => m.BookingsComponent)
  },
  {
    path: 'bookings/new',
    loadComponent: () => import('./pages/new-booking.component').then(m => m.NewBookingComponent)
  },
  {
    path: 'services',
    loadComponent: () => import('./pages/services.component').then(m => m.ServicesComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings.component').then(m => m.SettingsComponent)
  },
  { path: '**', redirectTo: '/dashboard' }
];
