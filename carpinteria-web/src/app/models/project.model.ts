export interface ProjectMedia {
    type: 'image' | 'video';
    url: string;
    path?: string;
}

export interface Project {
    id?: string;
    title: string;
    slug: string;
    description: string;

    // 🔹 NUEVO: una sola categoría por proyecto (nombre de la categoría)
    category?: string | null;

    // opcional: si ya lo tenías, lo puedes dejar por compatibilidad
    tags?: string[];

    published?: boolean;
    coverUrl?: string;
    media?: ProjectMedia[];
    createdAt?: any; // Timestamp de Firestore
}