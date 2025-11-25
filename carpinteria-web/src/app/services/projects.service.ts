import { Injectable, inject } from '@angular/core';
import {
    Firestore,
    collection,
    collectionData,
    doc,
    setDoc,
    deleteDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Project } from '../models/project.model';
import { CategoriesService } from './categories.service';

@Injectable({ providedIn: 'root' })
export class ProjectsService {
    private firestore = inject(Firestore);
    private categoriesSvc = inject(CategoriesService);

    private projectsCollection = collection(this.firestore, 'projects');

    // Leer proyectos (incluyendo el id del documento)
    getProjects$(): Observable<Project[]> {
        return collectionData(this.projectsCollection, {
            idField: 'id',
        }) as Observable<Project[]>;
    }

    // Crear o actualizar un proyecto
    async save(project: Project): Promise<void> {
        const data: Project = { ...project };

        // Aseguramos que siempre haya array en tags
        data.tags = (data.tags || []).map(t => t.trim()).filter(t => !!t);

        // Si no hay id → generamos uno nuevo
        let docRef;
        if (!data.id) {
            docRef = doc(this.projectsCollection);
            data.id = docRef.id;
        } else {
            docRef = doc(this.firestore, `projects/${data.id}`);
        }

        // Guardamos el proyecto
        await setDoc(docRef, data, { merge: true });

        // Y sincronizamos categorías a partir de las tags
        await this.categoriesSvc.ensureCategories(data.tags || []);
    }

    // Borrar un proyecto por id
    async deleteProject(id: string): Promise<void> {
        const ref = doc(this.firestore, `projects/${id}`);
        await deleteDoc(ref);
    }
}