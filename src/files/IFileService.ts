import { ContentConfig } from "./../editing/contentNode";

export interface IFileService {
    createFile(contenNode: ContentConfig): Promise<ContentConfig>;

    getFileByKey(key: string): Promise<ContentConfig>;

    updateFile(content: ContentConfig): Promise<void>;
}
