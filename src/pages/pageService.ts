import * as Utils from "../utils";
import { PageContract, IPageService } from "../pages";
import { IObjectStorage } from "../persistence";
import { IPermalinkService } from "../permalinks";
import { IBlockService } from "../blocks";
import { Contract } from "../contract";

const pagesPath = "pages";
const documentsPath = "files";
const templateBlockKey = "blocks/8730d297-af39-8166-83b6-9439addca789";

export class PageService implements IPageService {
    constructor(
        private readonly objectStorage: IObjectStorage,
        private readonly permalinkService: IPermalinkService,
        private readonly blockService: IBlockService
    ) { }

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

    public async createPage(url: string, title: string, description: string, keywords): Promise<PageContract> {
        const identifier = Utils.guid();
        const pageKey = `${pagesPath}/${identifier}`;
        const documentKey = `${documentsPath}/${identifier}`;

        const permalink = await this.permalinkService.createPermalink(url, pageKey);

        const page: PageContract = {
            key: pageKey,
            title: title,
            description: description,
            keywords: keywords,
            permalinkKey: permalink.key,
            contentKey: documentKey
        };

        await this.objectStorage.addObject(pageKey, page);

        const contentTemplate = await this.blockService.getBlockByKey(templateBlockKey);

        await this.objectStorage.addObject(documentKey, { nodes: [contentTemplate.content] });

        return page;
    }

    public async updatePage(page: PageContract): Promise<void> {
        await this.objectStorage.updateObject<PageContract>(page.key, page);
    }

    public async getPageContent(pageKey: string): Promise<Contract> {
        const page = await this.getPageByKey(pageKey);
        return await this.objectStorage.getObject(page.contentKey);
    }

    public async updatePageContent(pageKey: string, document: Contract): Promise<void> {
        const page = await this.getPageByKey(pageKey);
        this.objectStorage.updateObject(page.contentKey, document);
    }
}
