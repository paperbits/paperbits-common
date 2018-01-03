import { Contract } from "./../contract";

export interface IFile {
    key: string;
    mimeType?: string;
    size?: number;
    content?: string;
    contentModel?: Contract
}