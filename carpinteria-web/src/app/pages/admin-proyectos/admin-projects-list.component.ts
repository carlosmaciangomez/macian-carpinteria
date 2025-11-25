import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectsService } from '../../services/projects.service';
import { StorageService } from '../../services/storage.service';
import { Project } from '../../models/project.model';

@Component({
    standalone: true,
    selector: 'app-admin-projects-list',
    imports: [CommonModule, RouterModule],
    templateUrl: './admin-projects-list.component.html',
    styleUrls: ['./admin-proyectos.scss']
})
export class AdminProjectsListComponent {
    private projectsSvc = inject(ProjectsService);
    private storageSvc = inject(StorageService);

    projects$ = this.projectsSvc.getProjects$();
    deletingId: string | null = null;

    async deleteProject(p: Project) {
        if (!p.id) return;
        const ok = confirm(`¿Borrar el proyecto "${p.title}"? Esto elimina también sus archivos.`);
        if (!ok) return;

        this.deletingId = p.id;
        try {
            // borrar media de Storage
            for (const m of (p.media || [])) {
                if (m.path) {
                    await this.storageSvc.deleteFile(m.path);
                }
            }
            // si en el futuro guardas coverPath, bórralo aquí también

            // borrar doc
            await this.projectsSvc.deleteProject(p.id);
        } finally {
            this.deletingId = null;
        }
    }
}