import * as Utils from "../utils";
import { PageContract, IPageService } from "../pages";
import { IObjectStorage, Operator, Query } from "../persistence";
import { IBlockService } from "../blocks";
import { Contract } from "../contract";

const pagesPath = "pages";
const documentsPath = "files";
const templateBlockKey = "blocks/new-page-template";

export class PageService implements IPageService {
    constructor(
        private readonly objectStorage: IObjectStorage,
        private readonly blockService: IBlockService
    ) { }

    public async getPageByPermalink(permalink: string): Promise<PageContract> {
        if (!permalink) {
            throw new Error(`Parameter "permalink" not specified.`);
        }

        const query = Query
            .from<PageContract>()
            .where("permalink", Operator.equals, permalink);

        const result = await this.objectStorage.searchObjects<PageContract>(pagesPath, query);
        const pages = Object.values(result);

        return pages.length > 0 ? pages[0] : null;
    }

    public async getPageByKey(key: string): Promise<PageContract> {
        if (!key) {
            throw new Error(`Parameter "key" not specified.`);
        }

        return await this.objectStorage.getObject<PageContract>(key);
    }

    public async search(pattern: string): Promise<PageContract[]> {
        const query = Query
            .from<PageContract>()
            .where("title", Operator.contains, pattern)
            .orderBy("title");

        const result = await this.objectStorage.searchObjects<PageContract>(pagesPath, query);
        
        return Object.values(result);
    }

    public async deletePage(page: PageContract): Promise<void> {
        if (!page) {
            throw new Error(`Parameter "page" not specified.`);
        }

        const deleteContentPromise = this.objectStorage.deleteObject(page.contentKey);
        const deletePagePromise = this.objectStorage.deleteObject(page.key);

        await Promise.all([deleteContentPromise, deletePagePromise]);
    }

    public async createPage(permalink: string, title: string, description: string, keywords: string): Promise<PageContract> {
        const identifier = Utils.guid();
        const pageKey = `${pagesPath}/${identifier}`;
        const contentKey = `${documentsPath}/${identifier}`;

        const page: PageContract = {
            key: pageKey,
            title: title,
            description: description,
            keywords: keywords,
            permalink: permalink,
            contentKey: contentKey
        };

        await this.objectStorage.addObject(pageKey, page);

        const template = await this.blockService.getBlockContent(templateBlockKey);

        await this.objectStorage.addObject(contentKey, template);

        return page;
    }

    public async updatePage(page: PageContract): Promise<void> {
        if (!page) {
            throw new Error(`Parameter "page" not specified.`);
        }

        await this.objectStorage.updateObject<PageContract>(page.key, page);
    }

    public async getPageContent(key: string): Promise<Contract> {
        if (!key) {
            throw new Error(`Parameter "key" not specified.`);
        }

        const page = await this.getPageByKey(key);
        return await this.objectStorage.getObject(page.contentKey);
    }

    public async updatePageContent(pageKey: string, content: Contract): Promise<void> {
        if (!pageKey) {
            throw new Error(`Parameter "pageKey" not specified.`);
        }

        if (!content) {
            throw new Error(`Parameter "content" not specified.`);
        }

        const page = await this.getPageByKey(pageKey);
        this.objectStorage.updateObject(page.contentKey, content);
    }
}