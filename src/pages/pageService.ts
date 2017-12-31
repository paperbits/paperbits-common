import * as Utils from '../core/utils';
import { IPermalink } from '../permalinks/IPermalink';
import { IPage } from '../pages/IPage';
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

    private async searchByTags(tags: Array<string>, tagValue: string, startAtSearch: boolean): Promise<Array<IPage>> {
        return await this.objectStorage.searchObjects<IPage>(pagesPath, tags, tagValue, startAtSearch);
    }

    public async getPageByKey(key: string): Promise<IPage> {
        return await this.objectStorage.getObject<IPage>(key);
    }

    public search(pattern: string): Promise<Array<IPage>> {
        return this.searchByTags(["title"], pattern, true);
    }

    public async deletePage(page: IPage): Promise<void> {
        var deleteContentPromise = this.objectStorage.deleteObject(page.contentKey);
        var deletePermalinkPromise = this.objectStorage.deleteObject(page.permalinkKey);
        var deletePagePromise = this.objectStorage.deleteObject(page.key);

        await Promise.all([deleteContentPromise, deletePermalinkPromise, deletePagePromise]);
    }

    public async createPage(title: string, description: string, keywords): Promise<IPage> {
        var key = `${pagesPath}/${Utils.guid()}`;

        var page: IPage = {
            key: key,
            title: title,
            description: description,
            keywords: keywords,
        };

        await this.objectStorage.addObject(key, page);

        return page;
    }

    public async updatePage(page: IPage): Promise<void> {
        await this.objectStorage.updateObject<IPage>(page.key, page);
    }
}
