export interface ILocalCache {
    /**
     * Returns keys of all cached items.
     */
    getKeys(): Promise<string[]>;

    /**
     * Creates/updates cached item.
     * @param key {string} Cached item key.
     * @param value {T} Cached value.
     */
    setItem<T>(key: string, value: T): Promise<void>;

    /**
     * Retuns cached item by key.
     * @param key {string} Cached item key.
     */
    getItem<T>(key: string): Promise<T>;

    /**
     * Removes item with specified key.
     * @param key {string} Cached item key.
     */
    removeItem(key: string): Promise<void>;

    /**
     * Clears cache.
     */
    clear(): Promise<void>;
}