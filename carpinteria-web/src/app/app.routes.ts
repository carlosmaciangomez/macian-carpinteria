import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Servicios } from './pages/servicios/servicios';
import { Galeria } from './pages/galeria/galeria';
import { ResenasComponent } from './pages/resenas/resenas';
import { ContactoComponent } from './pages/contacto/contacto';
import { AdminLogin } from './pages/admin-login/admin-login';
import { AdminPanel } from './pages/admin-panel/admin-panel';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'servicios', component: Servicios },
  { path: 'galeria', component: Galeria },
  { path: 'resenas', component: ResenasComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'admin/login', component: AdminLogin },
  { path: 'admin', component: AdminPanel },
  { path: '**', redirectTo: '' }
];