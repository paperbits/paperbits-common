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
     * @param name 
     */
    getSetting<T>(name: string): Promise<T>;

    /**
     * Creates/updates a setting.
     * @param name {string} Setting name.
     * @param value {any} Setting value.
     */
    setSetting<T>(name: string, value: T): void;

    onSettingChange?(name: string, eventHandler: (value) => void);
}

export module Settings {
    export module Config {
        export const GMaps = "googlemaps";
        export const Gtm = "gtm";
        export const Intercom = "intercom";
    }
}