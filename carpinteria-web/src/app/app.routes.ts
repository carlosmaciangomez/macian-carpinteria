import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Servicios } from './pages/servicios/servicios';
import { ResenasComponent } from './pages/resenas/resenas';
import { ContactoComponent } from './pages/contacto/contacto';
import { AdminLoginComponent } from './pages/admin-login/admin-login';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel';

import { ProyectosComponent } from './pages/proyectos/proyectos';

import { AdminProyectosComponent } from './pages/admin-proyectos/admin-proyectos';
import { AdminProyectoFormComponent } from './pages/admin-proyecto-form/admin-proyecto-form';


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

  { path: 'admin-proyectos', component: AdminProyectosComponent, canActivate: [authGuard] },
  { path: 'admin-proyectos/nuevo', component: AdminProyectoFormComponent, canActivate: [authGuard] },
  { path: 'admin-proyectos/editar/:id', component: AdminProyectoFormComponent, canActivate: [authGuard] },

  { path: 'galeria', redirectTo: 'proyectos', pathMatch: 'full' },

  { path: '**', redirectTo: '' }
];