// src/app/services/projects.service.ts

import { Injectable, inject } from '@angular/core';
import {
    Firestore,
    collection,
    collectionData,
    doc,
    setDoc,
    query,
    where,
    limit
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Project } from '../models/project.model';

@Injectable({ providedIn: 'root' })
export class ProjectsService {
    private firestore = inject(Firestore);
    private projectsCollection = collection(this.firestore, 'projects');

    // 🔹 Leer TODOS los proyectos (ADMIN)
    getProjects$(): Observable<Project[]> {
        return collectionData(this.projectsCollection, {
            idField: 'id',
        }) as Observable<Project[]>;
    }

    // 🔹 Leer SOLO proyectos publicados (WEB PÚBLICA)
    getPublishedProjects$(): Observable<Project[]> {
        const q = query(
            this.projectsCollection,
            where('published', '==', true)
        );

        return collectionData(q, {
            idField: 'id',
        }) as Observable<Project[]>;
    }

    // 🔹 Leer UN proyecto publicado por slug (WEB PÚBLICA)
    getProjectBySlug$(slug: string): Observable<Project | null> {
        const q = query(
            this.projectsCollection,
            where('slug', '==', slug),
            where('published', '==', true),
            limit(1)
        );

        return collectionData(q, { idField: 'id' }).pipe(
            map((arr: any[]) => (arr[0] as Project) ?? null)
        );
    }

    // 🔹 Crear o actualizar un proyecto
    async save(project: Project): Promise<void> {
        const data: Project = { ...project };

        // Si NO hay id → crear documento nuevo con id automático
        if (!data.id) {
            const newDocRef = doc(this.projectsCollection); // genera id nuevo
            data.id = newDocRef.id;
            await setDoc(newDocRef, data);
            return;
        }

        // Si hay id → crear/actualizar ese doc (merge)
        const docRef = doc(this.firestore, `projects/${data.id}`);
        await setDoc(docRef, data, { merge: true });
    }

    // 🔹 Borrado "lógico" marcando deleted: true
    async deleteProject(id: string): Promise<void> {
        const docRef = doc(this.firestore, `projects/${id}`);
        await setDoc(docRef, { deleted: true }, { merge: true });
    }
}