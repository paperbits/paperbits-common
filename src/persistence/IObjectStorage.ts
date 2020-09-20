import { Query, Page } from "../persistence/query";


/**
 * Object storage.
 */
export interface IObjectStorage {
    /**
     * Creates an object with specified key in storage.
     * @template T Type of created object.
     * @param key string Object key.
     * @param dataObject T Object.
     */
    addObject<T>(key: string, dataObject: T): Promise<void>;

    /**
     * Retrieves an object from storage by specified key.
     * @template T Type of retrieved object.
     * @param key string Object key.
     */
    getObject<T>(key: string): Promise<T>;

    /**
     * Deletes an object with specfied key in stoage.
     * @param key string Object key.
     */
    deleteObject(key: string): Promise<void>;

    /**
     * Updates an object with specified key in storage.
     * @template T Type of updated object.
     * @param key string Object key.
     * @param dataObject {T} Object.
     */
    updateObject<T>(key: string, dataObject: T): Promise<void>;

    /**
     * Returns objects matching search criteria.
     * @param key {string} Collection key.
     * @param query {Query<T>} Search query.
     */
    searchObjects<T>(key: string, query?: Query<T>): Promise<Page<T>>;

    /**
     * Save changes.
     * @param delta 
     */
    saveChanges?(delta: Object): Promise<void>;

    /**
     * Loads data.
     */
    loadData?(): Promise<object>;
}
