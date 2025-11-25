import { Timestamp } from '@angular/fire/firestore';

export interface ProjectMedia {
    type: 'image' | 'video';  // <-- unión directa, sin MediaType
    url: string;
    path: string;
    order: number;
}

export interface Project {
    id?: string;          // id de Firestore (no se guarda dentro del doc)
    title: string;        // título del proyecto
    slug: string;         // para URL amigable
    description: string;  // texto largo

    tags: string[];       // etiquetas
    coverUrl?: string;    // portada (downloadURL)
    media: ProjectMedia[];// galería

    published: boolean;   // publicado/borrador
    createdAt: Timestamp; // fecha creación
    updatedAt: Timestamp; // fecha update
}