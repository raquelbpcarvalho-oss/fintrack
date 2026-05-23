import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LancamentosComponent } from './pages/lancamentos/lancamentos.component';
import { MetasComponent } from './pages/metas/metas.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'lancamentos', component: LancamentosComponent },
  { path: 'metas', component: MetasComponent }
];
