import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-resenas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resenas.html',
  styleUrls: ['./resenas.scss']
})
export class ResenasComponent implements OnInit {
  resenas: any[] = [];
  cargando = true;
  error = false;

  private reviewsUrl =
    'https://www.google.com/maps/place/?q=place_id:ChIJZcRmlAJ7YA0R7oqLIH1eT-U&entry=ttu';

  constructor(private title: Title) { }

  async ngOnInit(): Promise<void> {
    // título de la pestaña para /resenas
    this.title.setTitle('Reseñas');
    await this.cargarResenas();
  }

  private async cargarResenas(): Promise<void> {
    try {
      const res = await fetch('https://carpinteria-backend.onrender.com/api/reviews');
      const data = await res.json();

      if (Array.isArray(data)) {
        // Añadimos el enlace global de reseñas a cada tarjeta
        this.resenas = data.map((r) => ({
          ...r,
          review_url: this.reviewsUrl
        }));
      } else {
        console.error('Respuesta inesperada del backend:', data);
        this.error = true;
      }

      this.cargando = false;
    } catch (e) {
      console.error('Error al cargar reseñas:', e);
      this.error = true;
      this.cargando = false;
    }
  }
}