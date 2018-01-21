export interface MediaContract {
    key?: string;
    filename: string;
    blobKey: string;
    description: string;
    keywords: string;
    downloadUrl?: string;
    permalinkKey?: string;
    contentType?:string;
}