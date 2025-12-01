import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { ProjectsService } from '../../services/projects.service';
import { Project } from '../../models/project.model';

@Component({
    selector: 'app-proyecto-detalle',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './proyecto-detalle.component.html',
    styleUrls: ['./proyecto-detalle.component.scss'],
})
export class ProyectoDetalleComponent implements OnInit {

    // proyecto que mostramos en la vista
    project: Project | null = null;

    // índice de la foto/vídeo seleccionado en la galería
    selectedMediaIndex = 0;

    constructor(
        private route: ActivatedRoute,
        private projectsSvc: ProjectsService,
        private title: Title
    ) { }

    ngOnInit(): void {
        // cogemos el slug de la URL /proyecto/:slug (o /proyectos/:slug)
        const slug = this.route.snapshot.paramMap.get('slug');
        if (!slug) {
            // por si acaso, si no hay slug ponemos un título genérico
            this.title.setTitle('Proyecto');
            return;
        }

        this.projectsSvc.getProjects$().subscribe(projects => {
            const found = projects.find(p => p.slug === slug) || null;
            this.project = found;
            this.selectedMediaIndex = 0; // siempre empezamos por el primero

            // ⬇️ aquí actualizamos el <title> según el proyecto
            if (found?.title) {
                this.title.setTitle(
                    `${found.title}`
                );
            } else {
                this.title.setTitle('Proyecto');
            }
        });
    }

    // 👉 llamado desde (click)="selectMedia($index)" en las miniaturas
    selectMedia(index: number): void {
        if (!this.project || !this.project.media) return;
        if (index < 0 || index >= this.project.media.length) return;
        this.selectedMediaIndex = index;
    }

    // 👉 usado en la plantilla: {{ toDate(p.createdAt) | date:'longDate' }}
    toDate(value: any): Date | null {
        if (!value) return null;
        if (value instanceof Date) return value;
        if (value.toDate) return value.toDate(); // Timestamp de Firestore
        return new Date(value);
    }
}
