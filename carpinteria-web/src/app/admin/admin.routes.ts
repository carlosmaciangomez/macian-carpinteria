import { Routes } from '@angular/router';
import { AdminProjectsListComponent } from '../pages/admin-proyectos/admin-projects-list.component';
import { AdminProjectFormComponent } from '../pages/admin-proyecto-form/admin-project-form.component';

export const ADMIN_ROUTES: Routes = [
    { path: 'projects', component: AdminProjectsListComponent },
    { path: 'projects/new', component: AdminProjectFormComponent },
    { path: 'projects/:id/edit', component: AdminProjectFormComponent }
];
