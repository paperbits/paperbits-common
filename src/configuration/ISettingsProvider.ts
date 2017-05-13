export interface ISettingsProvider {
    getSettings(): Promise<Object>;
    getSetting(name: string): Promise<Object>;
    setSetting(name: string, value: Object): void;
    onSettingChange(name: string, eventHandler: (value)=> void);
}

export module Settings {
    export module Config {
        export const GMaps = "googlemaps";
        export const Gtm = "gtm";
        export const Intercom = "intercom"; 
    }
}