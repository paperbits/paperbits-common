import { ISettings } from "../sites";

export interface ISiteService {
    /**
     * Updated site settings.
     * @param settings
     */
    setSiteSettings(settings: ISettings): Promise<void>;

    /**
     * Return current site settings.
     */
    getSiteSettings(): Promise<ISettings>;
}