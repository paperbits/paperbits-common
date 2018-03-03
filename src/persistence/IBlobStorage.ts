import { ProgressPromise } from '../progressPromise';

export interface IBlobStorage {
    listBlobs?(): Promise<Array<string>>;

    uploadBlob(blobKey: string, content: Uint8Array, contentType?:string): ProgressPromise<void>;

    downloadBlob?(blobKey: string): Promise<Uint8Array>;

    getDownloadUrl(blobKey: string): Promise<string>;
    
    deleteBlob(blobKey: string): Promise<void>;
}