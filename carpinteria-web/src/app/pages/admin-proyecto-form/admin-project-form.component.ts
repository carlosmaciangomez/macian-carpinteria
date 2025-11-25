import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormBuilder,
    ReactiveFormsModule,
    Validators,
    FormArray
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from '../../services/projects.service';
import { StorageService } from '../../services/storage.service';
import { ProjectMedia } from '../../models/project.model';
import { take } from 'rxjs/operators';

@Component({
    standalone: true,
    selector: 'app-admin-project-form',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './admin-project-form.component.html',
    styleUrls: ['./admin-proyecto-form.scss']
})
export class AdminProjectFormComponent {
    private fb = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private projectsSvc = inject(ProjectsService);
    private storageSvc = inject(StorageService);

    id: string | null = null;
    loading = false;
    saving = false;

    // 🔹 nuevo: indica si el doc YA existe en Firestore
    isExisting = false;

    uploadQueue: Array<{ progress: number; name: string }> = [];

    form = this.fb.nonNullable.group({
        title: ['', Validators.required],
        slug: ['', Validators.required],
        description: ['', Validators.required],

        tags: this.fb.nonNullable.control<string>(''),
        published: this.fb.nonNullable.control(true),

        coverUrl: this.fb.control<string | null>(null),
        media: this.fb.nonNullable.array<ProjectMedia>([])
    });

    get mediaFA() {
        return this.form.get('media') as FormArray;
    }

    // genera ID sin librerías
    private newId(): string {
        return crypto.randomUUID();
    }

    ngOnInit() {
        this.route.paramMap.pipe(take(1)).subscribe(pm => {
            const id = pm.get('id');
            if (!id) return;

            this.id = id;
            this.isExisting = true; // 🔹 estamos editando uno que ya existe
            this.loading = true;

            this.projectsSvc.getProject$(id).pipe(take(1)).subscribe(p => {
                this.form.patchValue({
                    title: p.title,
                    slug: p.slug,
                    description: p.description,
                    tags: (p.tags || []).join(', '),
                    published: p.published,
                    coverUrl: p.coverUrl || null
                });

                this.mediaFA.clear();
                for (const m of (p.media || [])) {
                    this.mediaFA.push(this.fb.control(m));
                }

                this.loading = false;
            });
        });
    }

    // autogenera slug si no hay
    onTitleBlur() {
        if (this.form.value.slug) return;
        const title = this.form.value.title || '';
        const slug = title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');
        this.form.patchValue({ slug });
    }

    async onPickCover(ev: Event) {
        const input = ev.target as HTMLInputElement;
        if (!input.files?.length) return;
        const file = input.files[0];

        // si no hay id aún, generamos uno para usar en Storage
        const projectId = this.id ?? this.newId();
        if (!this.id) this.id = projectId;

        const path = `projects/${projectId}/cover/${Date.now()}_${file.name}`;

        this.uploadQueue.push({ progress: 0, name: file.name });
        const idx = this.uploadQueue.length - 1;

        this.storageSvc.uploadFile(path, file).subscribe({
            next: r => {
                this.uploadQueue[idx].progress = r.progress;
                if (r.url) this.form.patchValue({ coverUrl: r.url });
            },
            error: e => alert('Error subiendo portada: ' + e.message)
        });
    }

    async onPickMedia(ev: Event, type: 'image' | 'video') {
        const input = ev.target as HTMLInputElement;
        if (!input.files?.length) return;

        // igual que arriba: generamos id para Storage si hace falta
        const projectId = this.id ?? this.newId();
        if (!this.id) this.id = projectId;

        const files = Array.from(input.files);

        for (const file of files) {
            const path = `projects/${projectId}/media/${Date.now()}_${file.name}`;

            this.uploadQueue.push({ progress: 0, name: file.name });
            const idx = this.uploadQueue.length - 1;

            this.storageSvc.uploadFile(path, file).subscribe({
                next: r => {
                    this.uploadQueue[idx].progress = r.progress;

                    if (r.url) {
                        const media: ProjectMedia = {
                            type,
                            url: r.url,
                            path: r.path,
                            order: this.mediaFA.length
                        };
                        this.mediaFA.push(this.fb.control(media));
                    }
                },
                error: e => alert('Error subiendo archivo: ' + e.message)
            });
        }
    }

    removeMedia(i: number) {
        const m = this.mediaFA.at(i).value as ProjectMedia;
        const ok = confirm('¿Eliminar este archivo?');
        if (!ok) return;

        if (m?.path) {
            this.storageSvc.deleteFile(m.path).catch(() => { });
        }

        this.mediaFA.removeAt(i);

        // reordenar order
        this.mediaFA.controls.forEach((c, idx) => {
            const v = c.value;
            c.setValue({ ...v, order: idx });
        });
    }

    async save() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.saving = true;
        try {
            // si no hay id todavía (caso sin imágenes), generamos una
            const projectId = this.id ?? this.newId();
            if (!this.id) this.id = projectId;

            const raw = this.form.getRawValue();

            const tags = (raw.tags || '')
                .split(',')
                .map(t => t.trim())
                .filter(Boolean);

            const payload = {
                title: raw.title,
                slug: raw.slug,
                description: raw.description,
                tags,
                coverUrl: raw.coverUrl ?? null,
                media: (raw.media || []) as ProjectMedia[],
                published: raw.published
            };

            if (!this.isExisting) {
                // 🔹 primera vez: CREAR documento
                await this.projectsSvc.createProject(projectId, payload as any);
                this.isExisting = true;
            } else {
                // 🔹 ya existe: actualizar
                await this.projectsSvc.updateProject(projectId, payload as any);
            }

            this.router.navigate(['/admin-proyectos']);
        } finally {
            this.saving = false;
        }
    }

    async onSubmit() {
        await this.save();
    }
}