import { Injectable } from '@angular/core';
import { Proyecto } from '../models/proyecto.model';

@Injectable({
    providedIn: 'root'
})
export class ProyectosService {
    private readonly STORAGE_KEY = 'proyectos';

    // Proyectos de ejemplo para arrancar (puedes borrarlos luego)
    private seed: Proyecto[] = [
        {
            id: '1',
            titulo: 'Cocina en roble natural',
            descripcion: 'Cocina a medida con isla central y herrajes soft-close.',
            tipo: 'cocinas',
            media: [
                { tipo: 'imagen', url: 'assets/proyectos/cocina1.jpg' },
                { tipo: 'imagen', url: 'assets/proyectos/cocina2.jpg' }
                // aquí podrías meter vídeos también:
                // { tipo: 'video', url: 'assets/proyectos/cocina-video.mp4' }
            ],
            fecha: new Date().toISOString(),
            publicado: true
        },
        {
            id: '2',
            titulo: 'Armario empotrado lacado blanco',
            descripcion: 'Armario con puertas correderas y distribución interior personalizada.',
            tipo: 'armarios',
            media: [
                { tipo: 'imagen', url: 'assets/proyectos/armario1.jpg' }
            ],
            fecha: new Date().toISOString(),
            publicado: true
        }
    ];

    constructor() {
        // Si no hay nada guardado aún, ponemos seed
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.seed));
        }
    }

    // Público: solo publicados
    getPublicados(): Proyecto[] {
        return this.readStorage().filter(p => p.publicado);
    }

    // Admin: todos
    getAll(): Proyecto[] {
        return this.readStorage();
    }

    create(proyecto: Proyecto): void {
        const proyectos = this.readStorage();
        proyectos.unshift(proyecto);
        this.writeStorage(proyectos);
    }

    update(proyecto: Proyecto): void {
        const proyectos = this.readStorage();
        const i = proyectos.findIndex(p => p.id === proyecto.id);
        if (i !== -1) {
            proyectos[i] = proyecto;
            this.writeStorage(proyectos);
        }
    }

    delete(id: string): void {
        const proyectos = this.readStorage().filter(p => p.id !== id);
        this.writeStorage(proyectos);
    }

    // --- helpers privados ---
    private readStorage(): Proyecto[] {
        const raw = localStorage.getItem(this.STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    }

    private writeStorage(proyectos: Proyecto[]) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(proyectos));
    }
}