import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  menuOpen = false;

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
}
