export interface ILocalCache {
    /**
     * Returns keys of all cached items.
     */
    getKeys(): string[];

    /**
     * Creates/updates cached item.
     * @param key 
     * @param value 
     */
    setItem(key: string, value: any): void;

    /**
     * Retuns cached item by key.
     * @param key 
     */
    getItem<T>(key: string): T;

    /**
     * Returns space occupied by cache (if supported);
     */
    getOccupiedSpace?(): number;

    /**
     * Returns remaining space (if supported)
     */
    getRemainingSpace?(): number;

    /**
     * Registers a listener for cache changes.
     * @param callback
     */
    addChangeListener(callback: () => void): void;

    /**
     * Removes element by key.
     * @param key 
     */
    removeItem(key: string): void;

    /**
     * Clears cache.
     */
    clear(): void;
}