export interface ILocalCache {
    /**
     * Returns keys of all cached items.
     */
    getKeys(): Promise<string[]>;

    /**
     * Creates/updates cached item.
     * @param key 
     * @param value 
     */
    setItem<T>(key: string, value: T): Promise<void>;

    /**
     * Retuns cached item by key.
     * @param key 
     */
    getItem<T>(key: string): Promise<T>;

    /**
     * Returns space occupied by cache (if supported);
     */
    getOccupiedSpace?(): Promise<number>;

    /**
     * Returns remaining space (if supported)
     */
    getRemainingSpace?(): Promise<number>;

    /**
     * Registers a listener for cache changes.
     * @param callback
     */
    addChangeListener(callback: () => void): void;

    /**
     * Removes element by key.
     * @param key 
     */
    removeItem(key: string): Promise<void>;

    /**
     * Clears cache.
     */
    clear(): Promise<void>;
}