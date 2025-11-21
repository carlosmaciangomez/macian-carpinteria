import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './proyectos.html',
  styleUrls: ['./proyectos.scss']
})
export class ProyectosComponent {
  // De momento vacío.
  // Aquí luego cargaremos los proyectos desde el servicio.
}