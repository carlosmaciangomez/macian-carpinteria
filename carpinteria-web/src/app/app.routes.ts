import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Servicios } from './pages/servicios/servicios';
import { ResenasComponent } from './pages/resenas/resenas';
import { ContactoComponent } from './pages/contacto/contacto';
import { AdminLoginComponent } from './pages/admin-login/admin-login';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel';

import { ProyectosComponent } from './pages/proyectos/proyectos';
import { ProyectoDetalleComponent } from './pages/proyecto-detalle/proyecto-detalle.component';

import { AdminProjectsListComponent } from './pages/admin-proyectos/admin-projects-list.component';
import { AdminProjectFormComponent } from './pages/admin-proyecto-form/admin-project-form.component';

import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: Home, pathMatch: 'full' },
  { path: 'servicios', component: Servicios },

  // Página de listado de proyectos (PÚBLICA)
  { path: 'proyectos', component: ProyectosComponent },

  // Página de detalle de un proyecto por slug (PÚBLICA)
  { path: 'proyectos/:slug', component: ProyectoDetalleComponent },

  { path: 'resenas', component: ResenasComponent },
  { path: 'contacto', component: ContactoComponent },

  { path: 'admin', redirectTo: 'admin-login', pathMatch: 'full' },
  { path: 'admin-login', component: AdminLoginComponent },
  { path: 'admin-panel', component: AdminPanelComponent, canActivate: [authGuard] },

  { path: 'admin-proyectos', component: AdminProjectsListComponent, canActivate: [authGuard] },
  { path: 'admin-proyectos/nuevo', component: AdminProjectFormComponent, canActivate: [authGuard] },
  { path: 'admin-proyectos/editar/:id', component: AdminProjectFormComponent, canActivate: [authGuard] },

  { path: 'galeria', redirectTo: 'proyectos', pathMatch: 'full' },

  { path: '**', redirectTo: '' }
];