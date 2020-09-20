import { Contract } from "../";
import { PageContract } from "../pages/pageContract";
import { Query, Page } from "../persistence";

/**
 * Service for managing website pages.
 */
export interface IPageService {
    /**
     * Searches for pages that contain specified pattern in their title, description or keywords.
     * @param query {Query<PageContract>} Search query.
     * @param locale {string} Search locale.
     */
    search(query: Query<PageContract>, locale?: string): Promise<Page<PageContract>>;

    /**
     * Returns page by specified key.
     * @param key {string} Unique page identifier.
     * @param locale {string} If provided, operation returns metadata in specified locale.
     */
    getPageByKey(key: string, locale?: string): Promise<PageContract>;

    /**
     * Returns page with specified permalink.
     * @param permalink {string} Permanent link of the page, e.g. /about.
     */
    getPageByPermalink(permalink: string, locale?: string): Promise<PageContract>;

    /**
     * Deletes specified page from store.
     * @param page {PageContract} Contract describing page metadata.
     * @param locale {string} If provided, operation deletes metadata in specified locale.
     */
    deletePage(page: PageContract, locale?: string): Promise<void>;

    /**
     * Creates a new page in store and returns its contract.
     * @param permalink {string} Permanent link of the page, e.g. /about.
     * @param title {string} Page title.
     * @param description {string} Page description.
     * @param keywords {string} Page keywords.
     */
    createPage(permalink: string, title: string, description: string, keywords: string): Promise<PageContract>;

    /**
     * Updates page metadata.
     * @param page {PageContract} Contract describing page metadata.
     * @param locale {string} If provided, operation updates metadata in specified locale.
     */
    updatePage(page: PageContract, locale?: string): Promise<void>;

    /**
     * Returns page content by specified key.
     * @param pageKey {string}
     * @param locale {string} If provided, operation returns content in specified locale.
     */
    getPageContent(pageKey: string, locale?: string): Promise<Contract>;

    /**
     * Updates page content.
     * @param pageKey {string} Key of the page.
     * @param content {Contract} Contract describing content of the page.
     * @param locale {string} If provided, operation updates content in specified locale.
     */
    updatePageContent(pageKey: string, content: Contract, locale?: string): Promise<void>;
}
