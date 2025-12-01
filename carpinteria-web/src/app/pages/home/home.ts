import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home implements AfterViewInit, OnInit {

  constructor(private title: Title) { }

  ngOnInit() {
    // 🔹 Título de la página de inicio
    this.title.setTitle('Macián Carpintería');

    // 🔹 Listener para mostrar / ocultar botón "scroll-top"
    window.addEventListener('scroll', () => {
      const button = document.querySelector('.scroll-top') as HTMLElement;
      if (window.scrollY > 300) {
        button?.classList.add('show');
      } else {
        button?.classList.remove('show');
      }
    });
  }

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    document
      .querySelectorAll('.reveal')
      .forEach((el) => observer.observe(el));
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}