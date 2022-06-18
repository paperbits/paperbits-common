import { UrlContract } from "../urls/urlContract";
import { Query, Page } from "../persistence";

/**
 * Service for managing urls.
 */
export interface IUrlService {
    /**
     * Searches for urls that contain specified pattern in their title, description or keywords.
     */
    search(query: Query<UrlContract>): Promise<Page<UrlContract>>;

    /**
     * Returns a URL by specified key;
     */
    getUrlByKey(key: string, locale?: string): Promise<UrlContract>;

    /**
     * Deletes a specified URL from storage.
     */
    deleteUrl(url: UrlContract): Promise<void>;

    /**
     * Creates new URL in storage and returns a contract of it.
     */
    createUrl(permalink: string, title: string, description?: string): Promise<UrlContract>;

    /**
     * Updates a URL.
     */
    updateUrl(url: UrlContract): Promise<void>;
}
