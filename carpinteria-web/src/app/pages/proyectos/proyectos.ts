import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { ProjectsService } from '../../services/projects.service';
import { Project } from '../../models/project.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './proyectos.html',
  styleUrls: ['./proyectos.scss']
})
export class ProyectosComponent implements OnInit {

  // usados en el HTML
  public proyectos: Project[] = [];
  public proyectosFiltrados: Project[] = [];

  public tipos: string[] = ['cocinas', 'armarios', 'muebles', 'puertas', 'exterior'];
  public tipoActivo: string | null = null;

  constructor(
    private projectsService: ProjectsService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // 1) cargamos proyectos publicados desde Firestore
    this.projectsService.getProjects$()
      .pipe(map(ps => ps.filter(p => p.published)))
      .subscribe(ps => {
        this.proyectos = ps;
        this.aplicarFiltro(); // por si ya había filtro activo
      });

    // 2) leemos filtro inicial de la URL (?tipo=armarios)
    this.route.queryParamMap.subscribe(params => {
      this.tipoActivo = params.get('tipo');
      this.aplicarFiltro();
    });
  }

  public setTipo(tipo: string | null): void {
    this.tipoActivo = tipo;
    this.aplicarFiltro();
  }

  private aplicarFiltro(): void {
    if (!this.tipoActivo) {
      this.proyectosFiltrados = this.proyectos;
      return;
    }

    // filtramos por tags (porque ya no existe p.tipo)
    this.proyectosFiltrados = this.proyectos.filter(
      p => (p.tags || []).includes(this.tipoActivo!)
    );
  }

  public getPortada(proyecto: Project): string {
    // si tienes coverUrl, úsala primero
    if (proyecto.coverUrl) return proyecto.coverUrl;

    // si no, primera imagen del media
    const primeraImagen = (proyecto.media || []).find(m => m.type === 'image');
    if (primeraImagen) return primeraImagen.url;

    // fallback: primer media (aunque sea vídeo)
    const primerMedia = (proyecto.media || [])[0];
    return primerMedia ? primerMedia.url : '';
  }

  public portadaEsVideo(proyecto: Project): boolean {
    // si hay imagen, no es vídeo
    const primeraImagen = (proyecto.media || []).find(m => m.type === 'image');
    if (primeraImagen) return false;

    // si no hay imagen, miramos el primero
    return (proyecto.media || [])[0]?.type === 'video';
  }
}
