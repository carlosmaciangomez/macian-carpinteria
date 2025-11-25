import { Injectable } from '@angular/core';
import {
    Storage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject
} from '@angular/fire/storage';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StorageService {
    constructor(private storage: Storage) { }

    uploadFile(
        path: string,
        file: File
    ): Observable<{ progress: number; url?: string; path: string }> {
        return new Observable(sub => {
            const storageRef = ref(this.storage, path);
            const task = uploadBytesResumable(storageRef, file);

            task.on(
                'state_changed',
                snap => {
                    const progress = (snap.bytesTransferred / snap.totalBytes) * 100;
                    sub.next({ progress, path });
                },
                err => sub.error(err),
                async () => {
                    const url = await getDownloadURL(task.snapshot.ref);
                    sub.next({ progress: 100, url, path });
                    sub.complete();
                }
            );
        });
    }

    async deleteFile(path: string) {
        const storageRef = ref(this.storage, path);
        await deleteObject(storageRef);
    }
}
