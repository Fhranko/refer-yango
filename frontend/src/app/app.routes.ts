import { Routes } from '@angular/router';
import { DriverFormComponent } from './components/driver-form/driver-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'drivers/register', pathMatch: 'full' },
  { path: 'drivers/register', component: DriverFormComponent },
  { path: '**', redirectTo: 'drivers/register' }, // Fallback para rutas desconocidas
];
