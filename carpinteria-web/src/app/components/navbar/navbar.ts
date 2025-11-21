import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  menuOpen = false;

  constructor(private router: Router) { }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;

    if (this.menuOpen) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }

  closeMenu() {
    this.menuOpen = false;
  }

  /** ✔ Saber si el admin está logueado */
  isLoggedIn(): boolean {
    return localStorage.getItem('adminLogged') === 'true';
  }

  /** ✔ Navegar correctamente según si está logueado o no */
  goAdmin() {
    this.closeMenu();

    if (this.isLoggedIn()) {
      this.router.navigate(['/admin-panel']);
    } else {
      this.router.navigate(['/admin-login']);
    }
  }
}
