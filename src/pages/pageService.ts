import { Bag } from "./../bag";
import * as Utils from "../utils";
import { PageContract, IPageService } from "../pages";
import { IObjectStorage } from "../persistence";
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

    private async searchByProperties(properties: string[], value: string): Promise<PageContract[]> {
        const result = await this.objectStorage.searchObjects<Bag<PageContract>>(pagesPath, properties, value);
        return Object.keys(result).map(key => result[key]);
    }

    public async getPageByPermalink(permalink: string): Promise<PageContract> {
        if (!permalink) {
            throw new Error(`Parameter "permalink" not specified.`);
        }

        const result = await this.objectStorage.searchObjects<Bag<PageContract>>(pagesPath, ["permalink"], permalink);
        const pages = Object.keys(result).map(key => result[key]);

        return pages.length > 0 ? pages[0] : null;
    }

    public async getPageByKey(key: string): Promise<PageContract> {
        if (!key) {
            throw new Error(`Parameter "key" not specified.`);
        }

        return await this.objectStorage.getObject<PageContract>(key);
    }

    public search(pattern: string): Promise<PageContract[]> {
        return this.searchByProperties(["title"], pattern);
    }

    public async deletePage(page: PageContract): Promise<void> {
        if (!page) {
            throw new Error(`Parameter "page" not specified.`);
        }

        const deleteContentPromise = this.objectStorage.deleteObject(page.contentKey);
        const deletePagePromise = this.objectStorage.deleteObject(page.key);

        await Promise.all([deleteContentPromise, deletePagePromise]);
    }

    public async createPage(url: string, title: string, description: string, keywords): Promise<PageContract> {
        const identifier = Utils.guid();
        const pageKey = `${pagesPath}/${identifier}`;
        const documentKey = `${documentsPath}/${identifier}`;

        const page: PageContract = {
            key: pageKey,
            title: title,
            description: description,
            keywords: keywords,
            permalink: url,
            contentKey: documentKey
        };

        await this.objectStorage.addObject(pageKey, page);

        const contentTemplate = await this.blockService.getBlockByKey(templateBlockKey);

        await this.objectStorage.addObject(documentKey, { nodes: [contentTemplate.content] });

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
