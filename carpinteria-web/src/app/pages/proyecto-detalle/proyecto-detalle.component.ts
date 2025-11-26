import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

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
        private projectsSvc: ProjectsService
    ) { }

    ngOnInit(): void {
        // cogemos el slug de la URL /proyectos/:slug
        const slug = this.route.snapshot.paramMap.get('slug');
        if (!slug) return;

        this.projectsSvc.getProjects$().subscribe(projects => {
            const found = projects.find(p => p.slug === slug);
            this.project = found ?? null;
            this.selectedMediaIndex = 0; // siempre empezamos por el primero
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
