import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormBuilder,
    FormGroup,
    FormArray,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { ProjectsService } from '../../services/projects.service';
import { Project } from '../../models/project.model';

import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { StorageService } from '../../services/storage.service';

interface UploadItem {
    name: string;
    progress: number;
}

interface Category {
    id: string;
    name: string;
}

@Component({
    selector: 'app-admin-project-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './admin-project-form.component.html',
    styleUrls: ['./admin-proyecto-form.scss'],
})
export class AdminProjectFormComponent implements OnInit {
    form!: FormGroup;

    id: string | null = null;
    project: Project | null = null;

    loading = false; // usado en la plantilla: @if (loading)
    saving = false;  // usado en [disabled]="saving"

    uploadQueue: UploadItem[] = []; // usado en la plantilla: uploadQueue.length

    // 🔹 categorías que usaremos en el <select>
    categorias$!: Observable<Category[]>;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private projectsSvc: ProjectsService,
        private firestore: Firestore,
        private storageSvc: StorageService,
        private title: Title
    ) { }

    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id');

        // 🔹 título según estemos creando o editando
        if (this.id) {
            this.title.setTitle('Editar proyecto');
        } else {
            this.title.setTitle('Nuevo proyecto');
        }

        // 🔹 formulario: usamos "category" en vez de "tags"
        this.form = this.fb.group({
            title: ['', [Validators.required]],
            slug: ['', [Validators.required]],
            description: ['', [Validators.required]],
            category: [''],           // una sola categoría
            published: [false],
            coverUrl: [''],
            // si usas coverPath en el modelo, puedes añadirlo:
            // coverPath: [''],
            media: this.fb.array([]), // array de { type, url, path? }
        });

        // 🔹 cargamos categorías desde la colección "categories"
        const colRef = collection(this.firestore, 'categories');
        this.categorias$ = collectionData(colRef, {
            idField: 'id',
        }) as Observable<Category[]>;

        // 🔹 si estamos editando un proyecto existente
        if (this.id) {
            this.loading = true;
            this.projectsSvc.getProjects$().subscribe({
                next: (projects) => {
                    const found = projects.find((p) => p.id === this.id);
                    if (!found) {
                        this.loading = false;
                        return;
                    }

                    this.project = found;

                    // rellenamos media
                    const mediaFA = this.mediaFA;
                    mediaFA.clear();
                    (found.media || []).forEach((m: any) => {
                        mediaFA.push(
                            this.fb.group({
                                type: [m.type],
                                url: [m.url],
                                path: [m.path || null],
                            })
                        );
                    });

                    this.form.patchValue({
                        title: found.title ?? '',
                        slug: found.slug ?? '',
                        description: found.description ?? '',
                        // si no tiene category pero sí tags, usamos el primer tag
                        category: (found as any).category || found.tags?.[0] || '',
                        published: !!found.published,
                        coverUrl: found.coverUrl ?? '',
                        // coverPath: (found as any).coverPath || '',
                    });

                    this.loading = false;
                },
                error: () => {
                    this.loading = false;
                },
            });
        }
    }

    // 👉 getter usado en la plantilla: mediaFA.length, mediaFA.controls
    get mediaFA(): FormArray {
        return this.form.get('media') as FormArray;
    }

    // 👉 llamado desde (blur)="onTitleBlur()"
    onTitleBlur(): void {
        const titleCtrl = this.form.get('title');
        const slugCtrl = this.form.get('slug');
        if (!titleCtrl || !slugCtrl) return;

        const title = titleCtrl.value || '';
        const slugCurrent = slugCtrl.value || '';

        // si el slug está vacío o es igual al anterior auto-generado, lo regeneramos
        if (!slugCurrent || slugCurrent === this.slugify(title)) {
            slugCtrl.setValue(this.slugify(title));
        }
    }

    private slugify(text: string): string {
        return text
            .toString()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    // 👉 llamado desde (ngSubmit)="save()"
    async save(): Promise<void> {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.saving = true;

        const v = this.form.value as any;

        const mediaArray =
            this.mediaFA.controls.map((c: any) => ({
                type: c.value.type,
                url: c.value.url,
                path: c.value.path || null,
            })) || [];

        const project: Project = {
            id: this.id || undefined,
            title: v.title ?? '',
            slug: v.slug ?? '',
            description: v.description ?? '',
            // 🔹 una sola categoría
            category: v.category || null,
            published: !!v.published,
            coverUrl: v.coverUrl ?? '',
            // coverPath: v.coverPath || null,
            media: mediaArray,
            // si ya existía, mantenemos la fecha; si no, nueva
            createdAt: this.project?.createdAt ?? new Date(),
        };

        try {
            await this.projectsSvc.save(project);
            await this.router.navigate(['/admin-proyectos']);
        } catch (err) {
            console.error('Error guardando proyecto', err);
        } finally {
            this.saving = false;
        }
    }

    // 👉 llamado desde (change)="onPickCover($event)"
    //    Sube a Firebase Storage y actualiza coverUrl con la URL real
    onPickCover(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;

        const queueItem: UploadItem = { name: file.name, progress: 0 };
        this.uploadQueue.push(queueItem);

        const projectId = this.id ?? 'tmp';
        const storagePath = `projects/${projectId}/cover-${Date.now()}-${file.name}`;

        const upload$ = this.storageSvc.uploadFile(storagePath, file);

        upload$.subscribe({
            next: ({ progress, url, path }) => {
                queueItem.progress = progress;

                // cuando ya tenemos URL (emisión final), actualizamos el form
                if (url) {
                    this.form.patchValue({
                        coverUrl: url,
                        // si usas coverPath:
                        // coverPath: path,
                    });
                }
            },
            error: (err) => {
                console.error('Error subiendo portada', err);
                queueItem.progress = 0;
            },
        });
    }

    // 👉 llamado desde (change)="onPickMedia($event, 'image' | 'video')"
    //    Sube cada archivo a Storage y añade la entrada al form cuando haya URL
    onPickMedia(event: Event, type: 'image' | 'video'): void {
        const input = event.target as HTMLInputElement;
        const files = input.files;
        if (!files || !files.length) return;

        const mediaFA = this.mediaFA;
        const projectId = this.id ?? 'tmp';

        Array.from(files).forEach((file) => {
            const queueItem: UploadItem = { name: file.name, progress: 0 };
            this.uploadQueue.push(queueItem);

            const storagePath = `projects/${projectId}/media/${Date.now()}-${file.name}`;
            const upload$ = this.storageSvc.uploadFile(storagePath, file);

            let added = false; // para no pushear dos veces el mismo media

            upload$.subscribe({
                next: ({ progress, url, path }) => {
                    queueItem.progress = progress;

                    if (url && path && !added) {
                        added = true;
                        mediaFA.push(
                            this.fb.group({
                                type: [type],
                                url: [url],
                                path: [path],
                            })
                        );
                    }
                },
                error: (err) => {
                    console.error('Error subiendo media', err);
                    queueItem.progress = 0;
                },
            });
        });
    }

    // 👉 llamado desde (click)="removeMedia($index)"
    removeMedia(index: number): void {
        this.mediaFA.removeAt(index);
    }
}