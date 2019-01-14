import { SettingsContract } from "../sites";

export interface ISiteService {
    /**
     * Updated site settings.
     * @param settings
     */
    setSiteSettings(settings: SettingsContract): Promise<void>;

    /**
     * Return current site settings.
     */
    getSiteSettings(): Promise<SettingsContract>;
}