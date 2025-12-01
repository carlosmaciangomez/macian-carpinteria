import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './footer.html',
    styleUrls: ['./footer.scss'],
})
export class Footer {
    isAdminRoute = false;

    constructor(private router: Router) {
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe((event) => {
                const url = (event as NavigationEnd).urlAfterRedirects;

                // Rutas donde NO queremos footer
                this.isAdminRoute =
                    url.startsWith('/admin-panel') ||
                    url.startsWith('/admin-proyectos') ||
                    url.startsWith('/admin-login');
            });
    }
}