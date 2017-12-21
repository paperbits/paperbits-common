export interface IObjectStorage {
    /**
     * Creates object with specified key in storage.
     * @param key string Object key.
     * @param dataObject T Object.
     */
    addObject<T>(key: string, dataObject: T): Promise<void>;

    /**
     * Retrieves an object from storage by specified key.
     * @param key string Object key.
     */
    getObject<T>(key: string): Promise<T>;

    /**
     * Deletes an object with specfied key in stoage.
     * @param key string Object key.
     */
    deleteObject(key: string): Promise<void>;

    /**
     * Updates object with specified key in storage.
     * @param key string Object key.
     * @param dataObject T Object.
     */
    updateObject<T>(key: string, dataObject: T): Promise<void>;

    searchObjects<T>(key: string, propertyNames?: Array<string>, searchValue?: string, startAtSearch?: boolean): Promise<Array<T>>;
}
