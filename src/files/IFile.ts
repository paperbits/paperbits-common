import { Contract } from "./../contract";

export interface FileContract {
    key: string;
    mimeType?: string;
    size?: number;
    content?: string;
    contentModel?: Contract
}