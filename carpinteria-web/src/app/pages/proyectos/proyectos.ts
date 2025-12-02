// src/app/pages/proyectos/proyectos.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';

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

  // filtro activo: 'Todos' o el id de la categoría (ej: 'cocinas')
  public tipoActivo: string | null = 'Todos';

  constructor(
    private projectsService: ProjectsService,
    private firestore: Firestore,
    private title: Title
  ) {
    // referencia a la colección "categories"
    const colRef = collection(this.firestore, 'categories');

    // leemos las categorías ordenadas por nombre
    this.categorias$ = collectionData(colRef, { idField: 'id' }).pipe(
      map((cats: any[]) =>
        [...cats].sort((a, b) =>
          (a.name || '').localeCompare(b.name || '', 'es')
        )
      )
    );
  }

  ngOnInit(): void {
    this.title.setTitle('Proyectos de carpintería | Macián Carpintería');

    // cargamos SOLO proyectos publicados desde Firestore
    this.projectsService.getPublishedProjects$()
      .subscribe(ps => {
        this.proyectos = ps;
        this.aplicarFiltro(); // aplicamos filtro inicial
      });
  }

  public setTipo(tipo: string | null): void {
    this.tipoActivo = tipo;
    this.aplicarFiltro();
  }

  // (opcional) normalizar texto, por si acaso
  private normalizar(texto: string | null | undefined): string {
    return (texto || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  private aplicarFiltro(): void {
    // sin filtro o filtro "Todos" → todos los proyectos
    if (!this.tipoActivo || this.tipoActivo === 'Todos') {
      this.proyectosFiltrados = this.proyectos;
      return;
    }

    const activoNorm = this.normalizar(this.tipoActivo);

    // filtramos por category (un único string en el Project)
    this.proyectosFiltrados = this.proyectos.filter(p => {
      const catNorm = this.normalizar(p.category || '');
      return catNorm === activoNorm;
    });
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

  public toDate(value: any): Date | null {
    if (!value) return null;
    if (value instanceof Date) return value;
    if ((value as any).toDate) {
      return (value as any).toDate();
    }
    return new Date(value);
  }
}