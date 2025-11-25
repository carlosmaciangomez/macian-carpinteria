import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { ProjectsService } from '../../services/projects.service';
import { Project } from '../../models/project.model';

import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Category {
  id: string;
  name: string;
}

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './proyectos.html',
  styleUrls: ['./proyectos.scss']
})
export class ProyectosComponent implements OnInit {
  // proyectos cargados de Firestore
  public proyectos: Project[] = [];
  public proyectosFiltrados: Project[] = [];

  // categorías dinámicas desde la colección "categories"
  public categorias$!: Observable<Category[]>;

  // filtro activo: 'Todos' o el nombre de la categoría
  public tipoActivo: string | null = 'Todos';

  constructor(
    private projectsService: ProjectsService,
    private route: ActivatedRoute,
    private firestore: Firestore
  ) {
    // referencia a la colección "categories"
    const colRef = collection(this.firestore, 'categories');

    // leemos las categorías y añadimos "Todos" al principio
    this.categorias$ = collectionData(colRef, { idField: 'id' }).pipe(
      map((cats: any[]) => {
        const ordenadas = [...cats].sort((a, b) =>
          (a.name || '').localeCompare(b.name || '', 'es')
        );
        return [{ id: 'Todos', name: 'Todos' }, ...ordenadas];
      })
    );
  }

  ngOnInit(): void {
    // 1) cargamos proyectos publicados desde Firestore
    this.projectsService.getProjects$()
      .pipe(map(ps => ps.filter(p => !!p.published)))
      .subscribe(ps => {
        this.proyectos = ps;
        this.aplicarFiltro(); // aplicamos filtro inicial
      });

    // 2) leemos filtro inicial de la URL (?tipo=armarios)
    this.route.queryParamMap.subscribe(params => {
      const tipo = params.get('tipo');
      this.tipoActivo = tipo ?? 'Todos';
      this.aplicarFiltro();
    });
  }

  public setTipo(tipo: string | null): void {
    this.tipoActivo = tipo;
    this.aplicarFiltro();
  }

  private aplicarFiltro(): void {
    // sin filtro o filtro "Todos" → todos los proyectos
    if (!this.tipoActivo || this.tipoActivo === 'Todos') {
      this.proyectosFiltrados = this.proyectos;
      return;
    }

    // 🔹 ahora filtramos por category (un único string), no por tags[]
    this.proyectosFiltrados = this.proyectos.filter(
      p => (p.category || '') === this.tipoActivo
    );
  }

  public getPortada(proyecto: Project): string {
    // 1) Si has puesto una portada manual (coverUrl), esa manda
    if (proyecto.coverUrl) {
      return proyecto.coverUrl;
    }

    // 2) Si no hay coverUrl, buscamos la primera imagen en media
    const primeraImagen = (proyecto.media || []).find(m => m.type === 'image');
    if (primeraImagen) {
      return primeraImagen.url;
    }

    // 3) Si tampoco hay imagen, usamos el primer media (aunque sea vídeo)
    const primerMedia = (proyecto.media || [])[0];
    return primerMedia ? primerMedia.url : '';
  }

  public portadaEsVideo(proyecto: Project): boolean {
    // 1) Si hay coverUrl asumimos que es imagen → NO es vídeo
    if (proyecto.coverUrl) {
      return false;
    }

    // 2) Si hay alguna imagen en media, la portada será imagen → NO es vídeo
    const primeraImagen = (proyecto.media || []).find(m => m.type === 'image');
    if (primeraImagen) {
      return false;
    }

    // 3) Si no hay coverUrl ni imágenes, miramos el primer media
    return (proyecto.media || [])[0]?.type === 'video';
  }
}