import { IPermalink } from "../permalinks/IPermalink";

/**
 * Service for managing permalinks.
 */
export interface IPermalinkService {
    /**
     * Creates new permalink in storage.
     */
    createPermalink(uri: string, targetLocation: string, parentKey?: string): Promise<IPermalink>;

    /**
     * Returns permalink by specified key;
     */
    getPermalinkByKey(permalinkKey: string): Promise<IPermalink>;

    /**
     * Returns permalink by specified URI;
     * @param uri 
     */
    getPermalinkByUrl(uri: string): Promise<IPermalink>;

    /**
     * Updates specified permalink in storage.
     * @param permalink
     */
    updatePermalink(permalink: IPermalink): Promise<void>;

    /**
     * Deletes specified permalink from storage.
     * @param permalink 
     */
    deletePermalink(permalink: IPermalink): Promise<void>;

    /**
     * Deletes permalink with specified key from storage.
     * @param permalinkKey
     */
    deletePermalinkByKey(permalinkKey: string): Promise<void>;
}