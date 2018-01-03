import { Contract } from "./../contract";
import * as Utils from '../utils';
import { IFile } from '../files/IFile';
import { IFileService } from '../files/IFileService';
import { IObjectStorage } from '../persistence/IObjectStorage';

const filesPath = "files";

export class FileService implements IFileService {
    private readonly objectStorage: IObjectStorage;

    constructor(objectStorage: IObjectStorage) {
        this.objectStorage = objectStorage;
    }

    public async getFileByKey(key: string): Promise<Contract> {
        return await this.objectStorage.getObject<Contract>(key);
    }

    public async createFile(contentNode: Contract): Promise<Contract> {
        let key = `${filesPath}/${Utils.guid()}`;

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
