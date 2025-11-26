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

    // 🔹 Leer todos los proyectos
    getProjects$(): Observable<Project[]> {
        return collectionData(this.projectsCollection, {
            idField: 'id',
        }) as Observable<Project[]>;
    }

    // 🔹 Leer UN proyecto por slug (para la página de detalle)
    getProjectBySlug$(slug: string): Observable<Project | null> {
        const q = query(
            this.projectsCollection,
            where('slug', '==', slug),
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

    // 🔹 (Opcional) borrar proyecto, si ya lo tenías
    async deleteProject(id: string): Promise<void> {
        // Si ya tienes implementado esto en otro sitio, mantén tu versión
        const docRef = doc(this.firestore, `projects/${id}`);
        await setDoc(docRef, { deleted: true }, { merge: true });
    }
}