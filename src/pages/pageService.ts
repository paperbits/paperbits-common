import * as Utils from "../utils";
import * as Constants from "../constants";
import { PageContract, PageMetadata, PageLocalizedContract, IPageService } from ".";
import { IObjectStorage, Operator, Query, Page } from "../persistence";
import { IBlockService } from "../blocks";
import { Contract } from "../contract";
import { ILocaleService } from "../localization";

const documentsPath = "files";
const templateBlockKey = "blocks/new-page-template";

export class PageService implements IPageService {
    protected pagesPath: string = "pages";

    constructor(
        private readonly objectStorage: IObjectStorage,
        private readonly blockService: IBlockService,
        private readonly localeService: ILocaleService
    ) {
    }

    /**
     * Copies limited number of metadata properties.
     */
    private copyMetadata(sourceMetadata: PageMetadata, targetMetadata: PageMetadata): PageMetadata {
        if (!sourceMetadata) {
            throw new Error(`Parameter "sourceMetadata" not specified.`);
        }

        if (!targetMetadata) {
            throw new Error(`Parameter "targetMetadata" not specified.`);
        }

        targetMetadata.title = sourceMetadata.title;
        targetMetadata.description = sourceMetadata.description;
        targetMetadata.keywords = sourceMetadata.keywords;
        targetMetadata.permalink = sourceMetadata.permalink;
        targetMetadata.jsonLd = sourceMetadata.jsonLd;
        targetMetadata.socialShareData = sourceMetadata.socialShareData;

        return targetMetadata;
    }

    private localizedContractToContract(defaultLocale: string, currentLocale: string, requestedLocale: string, localizedPageContract: PageLocalizedContract): PageContract {
        const locales = localizedPageContract[Constants.localePrefix];

        const pageMetadata = (requestedLocale
            ? locales[requestedLocale]
            : locales[currentLocale])
            || this.copyMetadata(locales[defaultLocale], {});

        if (!pageMetadata) {
            return null;
        }

        const pageContract: any = {
            key: localizedPageContract.key,
            ...pageMetadata
        };

        return pageContract;
    }

    public async getPageByPermalink(permalink: string, requestedLocale: string = null): Promise<PageContract> {
        if (!permalink) {
            throw new Error(`Parameter "permalink" not specified.`);
        }

        const defaultLocale = await this.localeService.getDefaultLocale();
        const currentLocale = await this.localeService.getCurrentLocale();
        const permalinkProperty = `${Constants.localePrefix}/${defaultLocale}/permalink`; // We use permalink from default locale only (for now).

        const query = Query
            .from<PageContract>()
            .where(permalinkProperty, Operator.equals, permalink);

        try {
            const pageOfObjects = await this.objectStorage.searchObjects<PageLocalizedContract>(this.pagesPath, query);
            const result = pageOfObjects.value;

            if (!result) {
                return null;
            }

            const pages: any[] = Object.values(result);

            if (pages.length === 0) {
                return null;
            }

            const firstPage = pages[0];

            return this.localizedContractToContract(defaultLocale, currentLocale, requestedLocale, firstPage);
        }
        catch (error) {
            throw new Error(`Unable to search pages: ${error.stack || error.message}`);
        }
    }

    public async getPageByKey(key: string, requestedLocale?: string): Promise<PageContract> {
        if (!key) {
            throw new Error(`Parameter "key" not specified.`);
        }

        const pageContract = await this.objectStorage.getObject<PageLocalizedContract>(key);

        if (!pageContract) {
            return null;
        }

        const defaultLocale = await this.localeService.getDefaultLocale();
        const currentLocale = await this.localeService.getCurrentLocale();

        return this.localizedContractToContract(defaultLocale, currentLocale, requestedLocale, pageContract);
    }

    private convertPage(localizedPage: Page<PageLocalizedContract>, defaultLocale: string, searchLocale: string, requestedLocale: string): Page<PageContract> {
        const resultPage: Page<PageContract> = {
            value: localizedPage.value.map(x => this.localizedContractToContract(defaultLocale, searchLocale, requestedLocale, x)),
            takeNext: async (): Promise<Page<PageContract>> => {
                const nextLocalizedPage = await localizedPage.takeNext();
                return this.convertPage(nextLocalizedPage, defaultLocale, searchLocale, requestedLocale);
            }
        };

        if (!localizedPage.takeNext) {
            resultPage.takeNext = null;
        }

        return resultPage;
    }

    public async search(query: Query<PageContract>, requestedLocale?: string): Promise<Page<PageContract>> {
        if (!query) {
            throw new Error(`Parameter "query" not specified.`);
        }

        const defaultLocale = await this.localeService.getDefaultLocale();
        const currentLocale = await this.localeService.getCurrentLocale();
        const searchLocale = requestedLocale || currentLocale;

        const localizedQuery = Utils.localizeQuery(query, searchLocale);

        try {
            const pageOfResults = await this.objectStorage.searchObjects<PageLocalizedContract>(this.pagesPath, localizedQuery);
            return this.convertPage(pageOfResults, defaultLocale, searchLocale, requestedLocale);

        }
        catch (error) {
            throw new Error(`Unable to search pages: ${error.stack || error.message}`);
        }
    }

    public async deletePage(page: PageContract): Promise<void> {
        if (!page) {
            throw new Error(`Parameter "page" not specified.`);
        }

        try {
            const localizedPageContract = await this.objectStorage.getObject<PageLocalizedContract>(page.key);

            if (localizedPageContract.locales) {
                const contentKeys = Object.values(localizedPageContract.locales).map(x => x.contentKey);

                for (const contentKey of contentKeys) {
                    await this.objectStorage.deleteObject(contentKey);
                }
            }

            await this.objectStorage.deleteObject(page.key);
        }
        catch (error) {
            throw new Error(`Unable to delete page ${page.title}: ${error.stack || error.message}`);
        }
    }

    public async createPage(permalink: string, title: string, description: string, keywords: string): Promise<PageContract> {
        const locale = await this.localeService.getDefaultLocale();
        const identifier = Utils.guid();
        const pageKey = `${this.pagesPath}/${identifier}`;
        const contentKey = `${documentsPath}/${identifier}`;

        const localizedPage: PageLocalizedContract = {
            key: pageKey,
            locales: {
                [locale]: {
                    title: title,
                    description: description,
                    keywords: keywords,
                    permalink: permalink,
                    contentKey: contentKey
                }
            }
        };

        await this.objectStorage.addObject<PageLocalizedContract>(pageKey, localizedPage);

        const template = await this.blockService.getBlockContent(templateBlockKey);
        template["key"] = contentKey; // rewriting own key
        await this.objectStorage.addObject<Contract>(contentKey, template);

        const pageContent: PageContract = {
            key: pageKey,
            title: title,
            description: description,
            keywords: keywords,
            permalink: permalink,
            contentKey: contentKey
        };

        return pageContent;
    }

    public async updatePage(page: PageContract, requestedLocale?: string): Promise<void> {
        if (!page) {
            throw new Error(`Parameter "page" not specified.`);
        }

        if (!requestedLocale) {
            requestedLocale = await this.localeService.getCurrentLocale();
        }

        const pageContract = await this.objectStorage.getObject<PageLocalizedContract>(page.key);

        if (!pageContract) {
            throw new Error(`Could not update page. Page with key "${page.key}" doesn't exist.`);
        }

        const existingLocaleMetadata = pageContract.locales[requestedLocale] || <PageMetadata>{};

        pageContract.locales[requestedLocale] = this.copyMetadata(page, existingLocaleMetadata);

        await this.objectStorage.updateObject<PageLocalizedContract>(page.key, pageContract);
    }

    public async getPageContent(pageKey: string, requestedLocale?: string): Promise<Contract> {
        if (!pageKey) {
            throw new Error(`Parameter "pageKey" not specified.`);
        }

        if (!requestedLocale) {
            requestedLocale = await this.localeService.getCurrentLocale();
        }

        const defaultLocale = await this.localeService.getDefaultLocale();
        const localizedPageContract = await this.objectStorage.getObject<PageLocalizedContract>(pageKey);

        let pageMetadata = localizedPageContract.locales[requestedLocale];

        if (!pageMetadata) {
            pageMetadata = localizedPageContract.locales[defaultLocale];
        }

        let pageContent;

        if (pageMetadata.contentKey) {
            pageContent = await this.objectStorage.getObject<Contract>(pageMetadata.contentKey);
        }
        else {
            const pageDefaultLocaleMetadata = localizedPageContract.locales[defaultLocale];
            pageContent = await this.objectStorage.getObject<Contract>(pageDefaultLocaleMetadata.contentKey);
        }

        return pageContent;
    }

    public async updatePageContent(pageKey: string, content: Contract, requestedLocale?: string): Promise<void> {
        if (!pageKey) {
            throw new Error(`Parameter "pageKey" not specified.`);
        }

        if (!content) {
            throw new Error(`Parameter "content" not specified.`);
        }

        const localizedPageContract = await this.objectStorage.getObject<PageLocalizedContract>(pageKey);

        if (!localizedPageContract) {
            throw new Error(`Page with key "${pageKey}" not found.`);
        }

        if (!requestedLocale) {
            requestedLocale = await this.localeService.getCurrentLocale();
        }

        let pageMetadata = localizedPageContract.locales[requestedLocale];

        if (!pageMetadata) {
            const defaultLocale = await this.localeService.getDefaultLocale();
            const defaultPageMetadata = localizedPageContract.locales[defaultLocale];
            const identifier = Utils.guid();

            pageMetadata = this.copyMetadata(defaultPageMetadata, {
                contentKey: `${documentsPath}/${identifier}`
            });

            localizedPageContract.locales[requestedLocale] = pageMetadata;

            await this.objectStorage.updateObject(pageKey, localizedPageContract);
        }
        else if (!pageMetadata.contentKey) {
            const identifier = Utils.guid();
            pageMetadata.contentKey = `${documentsPath}/${identifier}`;
            await this.objectStorage.updateObject(pageKey, pageMetadata);
        }

        await this.objectStorage.updateObject(pageMetadata.contentKey, content);
    }
}