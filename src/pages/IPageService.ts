import { Contract } from "../";
import { PageContract } from "../pages/pageContract";

/**
 * Service for managing pages.
 */
export interface IPageService {
    /**
     * Searches for pages that contain specified pattern in their title, description or keywords.
     */
    search(pattern: string): Promise<PageContract[]>;

    /**
     * Returns page by specified key.
     */
    getPageByKey(key: string): Promise<PageContract>;

    getPageByUrl(url: string): Promise<PageContract>;

    /**
     * Deletes specified page from storage.
     */
    deletePage(page: PageContract): Promise<void>;

    /**
     * Creates a new page in storage and returns its contract.
     */
    createPage(url: string, title: string, description: string, keywords): Promise<PageContract>;

    /**
     * Updates a page.
     */
    updatePage(page: PageContract): Promise<void>;

    /**
     * Returns page content by specified key.
     * @param pageKey 
     */
    getPageContent(pageKey: string): Promise<Contract>;

    /**
     * Updates page content.
     * @param pageKey {string} Key of the page.
     * @param document {Contract} Content of the page.
     */
    updatePageContent(pageKey: string, document: Contract): Promise<void>;
}
