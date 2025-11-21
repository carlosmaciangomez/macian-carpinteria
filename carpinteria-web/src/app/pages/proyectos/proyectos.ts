import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { ProyectosService } from '../../services/proyectos.service';
import { Proyecto } from '../../models/proyecto.model';

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './proyectos.html',
  styleUrls: ['./proyectos.scss']
})
export class ProyectosComponent implements OnInit {

  // ✅ usados en el HTML
  public proyectos: Proyecto[] = [];
  public proyectosFiltrados: Proyecto[] = [];

  public tipos: string[] = ['cocinas', 'armarios', 'muebles', 'puertas', 'exterior'];
  public tipoActivo: string | null = null;

  constructor(
    private proyectosService: ProyectosService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // 1) cargamos los proyectos publicados
    this.proyectos = this.proyectosService.getPublicados();

    // 2) leemos el filtro inicial de la URL (?tipo=armarios)
    this.route.queryParamMap.subscribe(params => {
      this.tipoActivo = params.get('tipo');
      this.aplicarFiltro();
    });
  }

  // ✅ usado en el HTML
  public setTipo(tipo: string | null): void {
    this.tipoActivo = tipo;
    this.aplicarFiltro();
  }

  private aplicarFiltro(): void {
    if (!this.tipoActivo) {
      this.proyectosFiltrados = this.proyectos;
      return;
    }

    this.proyectosFiltrados = this.proyectos.filter(
      p => p.tipo === this.tipoActivo
    );
  }

  // ✅ usado en el HTML
  public getPortada(proyecto: Proyecto): string {
    const primeraImagen = proyecto.media.find(m => m.tipo === 'imagen');
    if (primeraImagen) return primeraImagen.url;

    const primerMedia = proyecto.media[0];
    return primerMedia ? primerMedia.url : '';
  }

  // ✅ usado en el HTML
  public portadaEsVideo(proyecto: Proyecto): boolean {
    const primeraImagen = proyecto.media.find(m => m.tipo === 'imagen');
    if (primeraImagen) return false;

    return proyecto.media[0]?.tipo === 'video';
  }
}
