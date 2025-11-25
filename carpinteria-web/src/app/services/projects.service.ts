import { Injectable } from '@angular/core';
import {
    Firestore,
    collection,
    collectionData,
    doc,
    docData,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    serverTimestamp,
    CollectionReference
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Project } from '../models/project.model';

@Injectable({ providedIn: 'root' })
export class ProjectsService {
    private colRef: CollectionReference;

    constructor(private fs: Firestore) {
        this.colRef = collection(this.fs, 'projects');
    }

    getProjects$(): Observable<Project[]> {
        const q = query(this.colRef, orderBy('createdAt', 'desc'));
        return collectionData(q, { idField: 'id' }) as Observable<Project[]>;
    }

    getProject$(id: string): Observable<Project> {
        const ref = doc(this.fs, `projects/${id}`);
        return docData(ref, { idField: 'id' }) as Observable<Project>;
    }

    async createProject(
        id: string,
        data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>
    ) {
        const ref = doc(this.fs, `projects/${id}`);
        await setDoc(ref, {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
    }

    async updateProject(id: string, patch: Partial<Project>) {
        const ref = doc(this.fs, `projects/${id}`);
        await updateDoc(ref, {
            ...patch,
            updatedAt: serverTimestamp()
        });
    }

    async deleteProject(id: string) {
        const ref = doc(this.fs, `projects/${id}`);
        await deleteDoc(ref);
    }
}