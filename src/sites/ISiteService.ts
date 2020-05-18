import { SiteSettingsContract } from "../sites";

export interface ISiteService {
    /**
     * Updated site settings.
     * @param settings
     */
    setSiteSettings(settings: SiteSettingsContract): Promise<void>;

    /**
     * Return current site settings.
     */
    getSiteSettings(): Promise<SiteSettingsContract>;

    /**
     * Returns third-party component integration settings.
     * @param intergationName e.g. "intercom".
     */
    getIntegrationSettings<TSettings>(intergationName: string): Promise<TSettings>;
}