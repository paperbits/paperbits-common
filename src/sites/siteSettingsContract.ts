import { OpenGraph } from "../publishing/openGraph";

export interface SiteSettingsContract {
    /**
     * Website title.
     */
    title: string;

    /**
     * Website description.
     */
    description?: string;

    /**
     * Website keywords.
     */
    keywords?: string;

    /**
     * Website hostname, e.g. "paperbits.io".
     */
    hostname?: string;

    /**
     * Favicon image source key.
     */
    faviconSourceKey?: string;

    /**
     * Website author.
     */
    author?: string;

    /**
     * Open Graph settings.
     */
    openGraphSettings?: OpenGraph;
}