import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Servicios } from './pages/servicios/servicios';
import { ResenasComponent } from './pages/resenas/resenas';
import { ContactoComponent } from './pages/contacto/contacto';
import { AdminLoginComponent } from './pages/admin-login/admin-login';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel';

import { ProyectosComponent } from './pages/proyectos/proyectos';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: Home, pathMatch: 'full' },
  { path: 'servicios', component: Servicios },
  { path: 'proyectos', component: ProyectosComponent, canActivate: [authGuard] },
  { path: 'resenas', component: ResenasComponent },
  { path: 'contacto', component: ContactoComponent },

  { path: 'admin', redirectTo: 'admin-login', pathMatch: 'full' },
  { path: 'admin-login', component: AdminLoginComponent },
  { path: 'admin-panel', component: AdminPanelComponent, canActivate: [authGuard] },

  // si alguien entra a /galeria viejo, lo mandamos a proyectos
  { path: 'galeria', redirectTo: 'proyectos', pathMatch: 'full' },

  { path: '**', redirectTo: '' }
];
