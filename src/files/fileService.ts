import { ContentConfig } from "./../editing/contentNode";
import * as Utils from '../core/utils';
import { IFile } from '../files/IFile';
import { IFileService } from '../files/IFileService';
import { IObjectStorage } from '../persistence/IObjectStorage';

const filesPath = "files";

export class FileService implements IFileService {
    private readonly objectStorage: IObjectStorage;

    constructor(objectStorage: IObjectStorage) {
        this.objectStorage = objectStorage;
    }

    public getFileByKey(key: string): Promise<ContentConfig> {
        return this.objectStorage.getObject<ContentConfig>(key);
    }

    public async createFile(contentNode: ContentConfig): Promise<ContentConfig> {
        let key = `${filesPath}/${Utils.guid()}`;

        if (!contentNode["key"]) {
            contentNode["key"] = key;
        }

        await this.objectStorage.addObject(key, contentNode);
        
        return contentNode;
    }

    public updateFile(content: ContentConfig): Promise<void> {
        return this.objectStorage.updateObject(content["key"], content);
    }
}
