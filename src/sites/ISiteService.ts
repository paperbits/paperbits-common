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

    /**
     * Returns a setting by name.
     * @param name {string} Name for a setting.
     */
    getSetting<T>(key: string): Promise<T>;

    /**
     * Creates/updates a setting.
     * @param name {string} Setting name.
     * @param value {any} Setting value.
     */
    setSetting<T>(key: string, setting: T): Promise<void>;
}