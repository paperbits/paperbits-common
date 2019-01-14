import { Bag } from "./../bag";
import * as Utils from "../utils";
import { UrlContract } from "../urls/urlContract";
import { IUrlService } from "../urls/IUrlService";
import { IObjectStorage } from "../persistence/IObjectStorage";
import * as _ from "lodash";

const urlsPath = "urls";

export class UrlService implements IUrlService {
    private readonly objectStorage: IObjectStorage;

    constructor(objectStorage: IObjectStorage) {
        this.objectStorage = objectStorage;
    }

    private async searchByProperties(properties: string[], value: string): Promise<UrlContract[]> {
        const result = await this.objectStorage.searchObjects<Bag<UrlContract>>(urlsPath, properties, value);
        return Object.keys(result).map(key => result[key]);
    }

    public async getUrlByKey(key: string): Promise<UrlContract> {
        return await this.objectStorage.getObject<UrlContract>(key);
    }

    public search(pattern: string): Promise<UrlContract[]> {
        return this.searchByProperties(["title"], pattern);
    }

    public async deleteUrl(url: UrlContract): Promise<void> {
        const deleteUrlPromise = this.objectStorage.deleteObject(url.key);
        await Promise.all([deleteUrlPromise]);
    }

    public async createUrl(permalink: string, title: string, description?: string): Promise<UrlContract> {
        const key = `${urlsPath}/${Utils.guid()}`;

        const url: UrlContract = {
            key: key,
            title: title,
            description: description,
            permalink: permalink
        };

        await this.objectStorage.addObject(key, url);

        return url;
    }

    public async updateUrl(url: UrlContract): Promise<void> {
        await this.objectStorage.updateObject<UrlContract>(url.key, url);
    }
}
