/**
 * Service for managing settings.
 */
export interface ISettingsProvider {
    /**
     * Returns all settings.
     */
    getSettings(): Promise<Object>;

    /**
     * Returns a setting by name.
     * @param name 
     */
    getSetting(name: string): Promise<Object>;

    /**
     * Creates/updates a setting.
     * @param name {string} Setting name.
     * @param value {any} Setting value.
     */
    setSetting(name: string, value: Object): void;

    onSettingChange?(name: string, eventHandler: (value) => void);
}

export module Settings {
    export module Config {
        export const GMaps = "googlemaps";
        export const Gtm = "gtm";
        export const Intercom = "intercom";
    }
}