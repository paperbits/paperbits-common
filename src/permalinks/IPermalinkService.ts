import { PermalinkContract } from "../permalinks/permalinkContract";

/**
 * Service for managing permalinks.
 */
export interface IPermalinkService {
    /**
     * Creates new permalink in storage.
     */
    createPermalink(uri: string, targetLocation: string, parentKey?: string): Promise<PermalinkContract>;

    /**
     * Returns permalink by specified key;
     */
    getPermalinkByKey(permalinkKey: string): Promise<PermalinkContract>;

    /**
     * Returns permalink by specified URI;
     * @param uri 
     */
    getPermalinkByUrl(uri: string): Promise<PermalinkContract>;

    /**
     * Updates specified permalink in storage.
     * @param permalink
     */
    updatePermalink(permalink: PermalinkContract): Promise<void>;

    /**
     * Deletes specified permalink from storage.
     * @param permalink 
     */
    deletePermalink(permalink: PermalinkContract): Promise<void>;

    /**
     * Deletes permalink with specified key from storage.
     * @param permalinkKey
     */
    deletePermalinkByKey(permalinkKey: string): Promise<void>;
}