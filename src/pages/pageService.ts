import * as Utils from "../utils";
import { PageContract } from "../pages/pageContract";
import { IPageService } from "../pages/IPageService";
import { IObjectStorage } from "../persistence/IObjectStorage";

const pagesPath = "pages";

export class PageService implements IPageService {
    private readonly objectStorage: IObjectStorage;

    constructor(objectStorage: IObjectStorage) {
        this.objectStorage = objectStorage;
    }

    private async searchByTags(tags: string[], tagValue: string, startAtSearch: boolean): Promise<PageContract[]> {
        return await this.objectStorage.searchObjects<PageContract>(pagesPath, tags, tagValue, startAtSearch);
    }

    public async getPageByKey(key: string): Promise<PageContract> {
        return await this.objectStorage.getObject<PageContract>(key);
    }

    public search(pattern: string): Promise<PageContract[]> {
        return this.searchByTags(["title"], pattern, true);
    }

    public async deletePage(page: PageContract): Promise<void> {
        const deleteContentPromise = this.objectStorage.deleteObject(page.contentKey);
        const deletePermalinkPromise = this.objectStorage.deleteObject(page.permalinkKey);
        const deletePagePromise = this.objectStorage.deleteObject(page.key);

        await Promise.all([deleteContentPromise, deletePermalinkPromise, deletePagePromise]);
    }

    public async createPage(title: string, description: string, keywords): Promise<PageContract> {
        const key = `${pagesPath}/${Utils.guid()}`;

        const page: PageContract = {
            key: key,
            title: title,
            description: description,
            keywords: keywords,
        };

        await this.objectStorage.addObject(key, page);

        return page;
    }

    public async updatePage(page: PageContract): Promise<void> {
        await this.objectStorage.updateObject<PageContract>(page.key, page);
    }
}
