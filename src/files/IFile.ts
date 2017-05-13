import { ContentConfig } from "./../editing/contentNode";

export interface IFile {
    key: string;
    mimeType?: string;
    size?: number;
    content?: string;
    contentModel?: ContentConfig
}