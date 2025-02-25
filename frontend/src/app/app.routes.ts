import { Routes } from '@angular/router';
import { RegisterDriverComponent } from './components/register-driver/register-driver.component';
import { ReferralReportComponent } from './components/referral-report/referral-report.component';
import { PaymentsReportComponent } from './components/payments-report/payments-report.component';

export const routes: Routes = [
  { path: '', component: RegisterDriverComponent }, // Ruta raíz (home)
  { path: 'referals', component: ReferralReportComponent }, // Página "Acerca de"
  { path: 'payments', component: PaymentsReportComponent }, // Página 404
];
