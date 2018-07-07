import * as Utils from '../utils';
import { IPermalink } from '../permalinks/IPermalink';
import { UrlContract } from '../urls/urlContract';
import { IUrlService } from '../urls/IUrlService';
import { IObjectStorage } from '../persistence/IObjectStorage';
import * as _ from 'lodash';

const urlsPath = "urls";

export class UrlService implements IUrlService {
    private readonly objectStorage: IObjectStorage;

    constructor(objectStorage: IObjectStorage) {
        this.objectStorage = objectStorage;
    }

    private async searchByTags(tags: Array<string>, tagValue: string, startAtSearch: boolean): Promise<Array<UrlContract>> {
        return await this.objectStorage.searchObjects<UrlContract>(urlsPath, tags, tagValue, startAtSearch);
    }

    public async getUrlByKey(key: string): Promise<UrlContract> {
        return await this.objectStorage.getObject<UrlContract>(key);
    }

    public search(pattern: string): Promise<Array<UrlContract>> {
        return this.searchByTags(["title"], pattern, true);
    }

    public async deleteUrl(url: UrlContract): Promise<void> {
        let deletePermalinkPromise = this.objectStorage.deleteObject(url.permalinkKey);
        let deleteUrlPromise = this.objectStorage.deleteObject(url.key);

        await Promise.all([deletePermalinkPromise, deleteUrlPromise]);
    }

    public async createUrl(title: string, description?: string): Promise<UrlContract> {
        const key = `${urlsPath}/${Utils.guid()}`;

        const url: UrlContract = {
            key: key,
            title: title,
            description: description
        };

        await this.objectStorage.addObject(key, url);

        return url;
    }

    public async updateUrl(url: UrlContract): Promise<void> {
        await this.objectStorage.updateObject<UrlContract>(url.key, url);
    }
}
