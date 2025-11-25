import { Injectable, inject } from '@angular/core';
import {
    Firestore,
    collection,
    doc,
    setDoc,
} from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
    private firestore = inject(Firestore);
    private categoriesCollection = collection(this.firestore, 'categories');

    /**
     * Se asegura de que existan docs para cada tag en la colección "categories".
     * No borra nada, solo crea/actualiza.
     */
    async ensureCategories(tags: string[]): Promise<void> {
        if (!tags || !tags.length) return;

        // normalizamos: quitamos espacios, vacíos y duplicados
        const clean = Array.from(
            new Set(
                tags
                    .map(t => t.trim())
                    .filter(t => !!t)
            )
        );

        for (const name of clean) {
            // usamos el propio nombre como id de doc (ej: "cocinas", "armarios")
            const id = name.toLowerCase();
            const ref = doc(this.categoriesCollection, id);
            await setDoc(ref, { name }, { merge: true });
        }
    }
}