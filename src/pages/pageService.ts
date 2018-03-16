import * as Utils from '../utils';
import { IPermalink } from '../permalinks/IPermalink';
import { PageContract } from '../pages/pageContract';
import { IPageService } from '../pages/IPageService';
import { IFile } from '../files/IFile';
import { IObjectStorage } from '../persistence/IObjectStorage';
import * as _ from 'lodash';

const pagesPath = "pages";

export class PageService implements IPageService {
    private readonly objectStorage: IObjectStorage;

    constructor(objectStorage: IObjectStorage) {
        this.objectStorage = objectStorage;
    }

    public async getPageByKey(key: string): Promise<PageContract> {
        return await this.objectStorage.getObject<PageContract>(key);
    }

    public async searchPages(pattern: string): Promise<Array<PageContract>> {
        return await this.objectStorage.searchObjects<PageContract>(pagesPath, { area: pagesPath, properties: "title" });
    }

    public async deletePage(page: PageContract): Promise<void> {
        var deleteContentPromise = this.objectStorage.deleteObject(page.contentKey);
        var deletePermalinkPromise = this.objectStorage.deleteObject(page.permalinkKey);
        var deletePagePromise = this.objectStorage.deleteObject(page.key);

        await Promise.all([deleteContentPromise, deletePermalinkPromise, deletePagePromise]);
    }

    public async createPage(title: string, description: string, keywords): Promise<PageContract> {
        var key = `${pagesPath}/${Utils.guid()}`;

        var page: PageContract = {
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
