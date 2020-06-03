import * as Utils from "../utils";
import { UrlContract } from "../urls/urlContract";
import { IUrlService } from "../urls/IUrlService";
import { IObjectStorage, Query, Operator } from "../persistence";
import * as _ from "lodash";

const urlsPath = "urls";

export class UrlService implements IUrlService {
    private readonly objectStorage: IObjectStorage;

    constructor(objectStorage: IObjectStorage) {
        this.objectStorage = objectStorage;
    }

    public async getUrlByKey(key: string): Promise<UrlContract> {
        return await this.objectStorage.getObject<UrlContract>(key);
    }

    public async search(pattern: string): Promise<UrlContract[]> {
        const query = Query
            .from<UrlContract>()
            .where("title", Operator.contains, pattern)
            .orderBy("title");

        const result = await this.objectStorage.searchObjects<UrlContract>(urlsPath, query);

        return Object.values(result);
    }

    public async deleteUrl(url: UrlContract): Promise<void> {
        const deleteUrlPromise = this.objectStorage.deleteObject(url.key);
        await Promise.all([deleteUrlPromise]);
    }

    public async createUrl(permalink: string, title: string, description?: string): Promise<UrlContract> {
        const key = `${urlsPath}/${Utils.guid()}`;

        const contract: UrlContract = {
            key: key,
            title: title,
            description: description,
            permalink: permalink
        };

        await this.objectStorage.addObject(key, contract);

        return contract;
    }

    public async updateUrl(url: UrlContract): Promise<void> {
        await this.objectStorage.updateObject<UrlContract>(url.key, url);
    }
}
