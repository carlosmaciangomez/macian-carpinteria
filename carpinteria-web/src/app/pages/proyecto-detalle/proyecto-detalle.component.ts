// src/app/pages/proyecto-detalle/proyecto-detalle.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { ProjectsService } from '../../services/projects.service';
import { Project } from '../../models/project.model';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-proyecto-detalle',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './proyecto-detalle.component.html',
    styleUrls: ['./proyecto-detalle.component.scss'],
})
export class ProyectoDetalleComponent {
    project: Project | null = null;
    selectedMediaIndex = 0;

    constructor(
        private route: ActivatedRoute,
        private projectsSvc: ProjectsService,
        private title: Title
    ) { }

    ngOnInit(): void {
        // slug de la URL: /proyectos/:slug
        const slug = this.route.snapshot.paramMap.get('slug');
        if (!slug) {
            return;
        }

        // 🔹 LEEMOS SOLO EL PROYECTO PUBLICADO CON ESE SLUG
        this.projectsSvc.getProjectBySlug$(slug)
            .pipe(take(1))
            .subscribe({
                next: (p) => {
                    this.project = p ?? null;

                    if (p) {
                        this.selectedMediaIndex = 0;
                        this.title.setTitle(`${p.title} | Macián Carpintería`);
                    }
                },
                error: (err) => {
                    console.error('Error cargando proyecto por slug', err);
                    this.project = null;
                },
            });
    }

    selectMedia(index: number): void {
        this.selectedMediaIndex = index;
    }

    toDate(value: any): Date | null {
        if (!value) return null;
        if (value instanceof Date) return value;
        if (value.toDate) {
            return value.toDate();
        }
        return new Date(value);
    }
}