import { Contract } from "./../contract";
import * as Utils from "../utils";
import { IFileService, FileContract } from "../files";
import { IObjectStorage } from "../persistence";

const filesPath = "files";

export class FileService implements IFileService {
    private readonly objectStorage: IObjectStorage;

    constructor(objectStorage: IObjectStorage) {
        this.objectStorage = objectStorage;
    }

    public async getFileByKey(key: string): Promise<FileContract> {
        return await this.objectStorage.getObject<FileContract>(key);
    }

    public async createFile(contentNode: FileContract): Promise<FileContract> {
        const key = `${filesPath}/${Utils.guid()}`;

        if (!contentNode["key"]) {
            contentNode["key"] = key;
        }

        await this.objectStorage.addObject(key, contentNode);

        return contentNode;
    }

    public updateFile(content: Contract): Promise<void> {
        return this.objectStorage.updateObject(content["key"], content);
    }
}
