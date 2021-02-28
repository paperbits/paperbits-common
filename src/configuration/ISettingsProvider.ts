/**
 * Service for managing settings.
 */
export interface ISettingsProvider {
    /**
     * Returns all settings.
     */
    getSettings<T>(): Promise<T>;

    /**
     * Returns a setting by name.
     * @param name {string} Name for a setting.
     */
    getSetting<T>(name: string): Promise<T>;

    /**
     * Creates/updates a setting.
     * @param name {string} Setting name.
     * @param value {any} Setting value.
     */
    setSetting<T>(name: string, value: T): Promise<void>;

    /**
     * Registers a listener for specified setting changes.
     * @param name {string} Setting name.
     * @param eventHandler {(value: T) => void} Change handler.
     */
    onSettingChange?<T>(name: string, eventHandler: (value: T) => void): void;
}