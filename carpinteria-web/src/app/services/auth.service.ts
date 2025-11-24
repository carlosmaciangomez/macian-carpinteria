import { Injectable, inject } from '@angular/core';
import {
    Auth,
    authState,
    signInWithEmailAndPassword,
    signOut,
    User
} from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

    private auth = inject(Auth);

    // Observable con el usuario actual (Firebase lo emite al cargar y en cambios)
    user$: Observable<User | null> = authState(this.auth);

    // Login con email + password (ya te llega el email desde AdminUsersService)
    async login(email: string, password: string): Promise<boolean> {
        try {
            await signInWithEmailAndPassword(this.auth, email, password);
            return true;
        } catch (err) {
            console.error('Firebase login error:', err);
            return false;
        }
    }

    // ✅ Logout (esto es lo que te faltaba)
    async logout(): Promise<void> {
        await signOut(this.auth);
    }

    // Para checks rápidos en componentes (sync)
    isLoggedInSync(): boolean {
        return !!this.auth.currentUser;
    }
}