import { Contract } from "./../contract";

/**
 * Service for managing JSON-like content objects.
 */
export interface IFileService {
    createFile(contract: Contract): Promise<Contract>;

    getFileByKey(key: string): Promise<Contract>;

    updateFile(content: Contract): Promise<void>;
}
