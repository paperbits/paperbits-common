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

    faviconSourceKey?: string;

    author?: string;
    /**
     * Facebook Open Graph settings.
     */
    ogSiteName?: string;

    ogUrl?: string;

    ogType?: "website" | "article" | "blog";

    ogImageSourceKey?: string;
}