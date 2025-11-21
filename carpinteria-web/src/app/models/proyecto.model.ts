export type MediaTipo = 'imagen' | 'video';

export interface MediaItem {
    tipo: MediaTipo;
    url: string;          // base64 o URL
    thumbnail?: string;  // opcional para vídeos si luego quieres miniatura
}

export interface Proyecto {
    id: string;
    titulo: string;
    descripcion: string;
    tipo: string;         // cocinas | armarios | muebles | puertas | exterior...
    media: MediaItem[];   // 👈 fotos y vídeos juntos
    fecha: string;        // ISO string
    publicado: boolean;
}