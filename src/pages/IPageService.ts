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
     * Returns page by specified key;
     */
    getPageByKey(key: string): Promise<PageContract>;

    /**
     * Deletes specified page from storage.
     */
    deletePage(page: PageContract): Promise<void>;

    /**
     * Creates new page in storage and returns its contract.
     */
    createPage(title: string, description: string, keywords): Promise<PageContract>;

    /**
     * Updates a page.
     */
    updatePage(page: PageContract): Promise<void>;
}
