import * as Utils from "../utils";
import { UrlContract } from "../urls/urlContract";
import { IUrlService } from "../urls/IUrlService";
import { IObjectStorage, Query, Page } from "../persistence";
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
    
    private convertPage(pageOfUrls: Page<UrlContract>): Page<UrlContract> {
        const resultPage: Page<UrlContract> = {
            value: pageOfUrls.value,
            takeNext: async (): Promise<Page<UrlContract>> => {
                const nextLocalizedPage = await pageOfUrls.takeNext();
                return this.convertPage(nextLocalizedPage);
            }
        };

        if (!pageOfUrls.takeNext) {
            resultPage.takeNext = null;
        }

        return resultPage;
    }

    public async search(query: Query<UrlContract>): Promise<Page<UrlContract>> {
        if (!query) {
            throw new Error(`Parameter "query" not specified.`);
        }

        try {
            const pageOfResults = await this.objectStorage.searchObjects<UrlContract>(urlsPath, query);
            return this.convertPage(pageOfResults);
          
        }
        catch (error) {
            throw new Error(`Unable to search url: ${error.stack || error.message}`);
        }
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
