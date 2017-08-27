import { Contract } from "./../editing/contentNode";

export interface IFileService {
    createFile(contenNode: Contract): Promise<Contract>;

    getFileByKey(key: string): Promise<Contract>;

    updateFile(content: Contract): Promise<void>;
}
