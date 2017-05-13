import * as Utils from '../core/utils';
import { IPermalink } from '../permalinks/IPermalink';
import { INewsArticle } from '../news/INewsElement';
import { INewsService } from '../news/INewsService';
import { IFile } from '../files/IFile';
import { IObjectStorage } from '../persistence/IObjectStorage';
import * as _ from 'lodash';

const newsElementsPath = "news";

export class NewsService implements INewsService {
    private readonly objectStorage: IObjectStorage;

    constructor(objectStorage: IObjectStorage) {
        this.objectStorage = objectStorage;
    }

    private async searchByTags(tags: Array<string>, tagValue: string, startAtSearch: boolean): Promise<Array<INewsArticle>> {
        return await this.objectStorage.searchObjects<INewsArticle>(newsElementsPath, tags, tagValue, startAtSearch);
    }

    public async getNewsElementByKey(key: string): Promise<INewsArticle> {
        return await this.objectStorage.getObject<INewsArticle>(key);
    }

    public search(pattern: string): Promise<Array<INewsArticle>> {
        return this.searchByTags(["title"], pattern, true);
    }

    public async deleteNewsElement(newsElement: INewsArticle): Promise<void> {
        var deleteContentPromise = this.objectStorage.deleteObject(newsElement.contentKey);
        var deletePermalinkPromise = this.objectStorage.deleteObject(newsElement.permalinkKey);
        var deleteNewsElementPromise = this.objectStorage.deleteObject(newsElement.key);

        await Promise.all([deleteContentPromise, deletePermalinkPromise, deleteNewsElementPromise]);
    }

    public async createNewsElement(title: string, description: string, keywords): Promise<INewsArticle> {
        var newsElementId = `${newsElementsPath}/${Utils.guid()}`;

        var newsElement: INewsArticle = {
            key: newsElementId,
            title: title,
            description: description,
            keywords: keywords,
        };

        await this.objectStorage.addObject(newsElementId, newsElement);

        return newsElement;
    }

    public async updateNewsElement(newsElement: INewsArticle): Promise<void> {
        await this.objectStorage.updateObject<INewsArticle>(newsElement.key, newsElement);
    }
}
