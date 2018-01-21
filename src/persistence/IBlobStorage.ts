import { ProgressPromise } from '../progressPromise';

export interface IBlobStorage {
    listBlobs?(): Promise<Array<string>>;

    uploadBlob(path: string, content: Uint8Array, contentType?:string): ProgressPromise<void>;

    downloadBlob?(path: string): Promise<Uint8Array>;

    getDownloadUrl(blobKey: string): Promise<string>;
    
    deleteBlob(path: string): Promise<void>;
}