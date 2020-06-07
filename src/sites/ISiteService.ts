export interface ISiteService {
    /**
     * Return current site settings.
     */
    getSettings<T>(): Promise<T>;

    /**
     * Updated site settings.
     * @param settings
     */
    setSettings<T>(settings: T): Promise<void>;
}