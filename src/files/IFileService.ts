import { Contract } from "./../editing/contentNode";

/**
 * Service for managing JSON-like content objects.
 */
export interface IFileService {
    createFile(contenNode: Contract): Promise<Contract>;

    getFileByKey(key: string): Promise<Contract>;

    updateFile(content: Contract): Promise<void>;
}
