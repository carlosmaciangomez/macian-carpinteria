import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly STORAGE_KEY = 'admin_logged_in';

    login(username: string, password: string): boolean {
        const ok = username === 'test' && password === 'test';

        if (ok) {
            localStorage.setItem(this.STORAGE_KEY, 'true');
        }

        return ok;
    }

    isLoggedIn(): boolean {
        return localStorage.getItem(this.STORAGE_KEY) === 'true';
    }

    logout(): void {
        localStorage.removeItem(this.STORAGE_KEY);
    }
}
