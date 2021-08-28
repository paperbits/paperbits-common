export enum CachingStrategy {
    /**
     * Fetch data always from cache, while trying to update the cache from network.
     */
    StaleWhileRevalidate,

    /**
     * Try to fetch data from cache first, then fallback to network.
     */
    CacheFirst,

    /**
     * Try to fetch data from network, then fallback to cache.
     */
    NetworkFirst,

    /**
     * Use only network.
     */
    NetworkOnly,

    /**
     * Use only cache.
     */
    CacheOnly
}