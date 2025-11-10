import { Component } from '@angular/core';

@Component({
  selector: 'app-resenas',
  standalone: true,
  templateUrl: './resenas.html',
  styleUrls: ['./resenas.scss']
})
export class ResenasComponent {
  resenas: any[] = [];
  cargando = true;
  error = false;

  private reviewsUrl = 'https://www.google.com/maps/place/?q=place_id:ChIJZcRmlAJ7YA0R7oqLIH1eT-U&entry=ttu';

  async ngOnInit() {
    await this.cargarResenas();
  }

  async cargarResenas() {
    try {
      const res = await fetch('http://localhost:3000/api/reviews');
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