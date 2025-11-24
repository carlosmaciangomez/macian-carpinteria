import { Injectable, inject } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class AdminUsersService {
    private firestore = inject(Firestore);

    // Devuelve el email asociado a un username (docId)
    async getEmailByUsername(username: string): Promise<string | null> {
        const ref = doc(this.firestore, `admin_users/${username}`);
        const snap = await getDoc(ref);

        if (!snap.exists()) return null;

        const data = snap.data();

        // ✅ Devuelve solo el email como string
        return typeof data['email'] === 'string' ? data['email'] : null;
    }
}