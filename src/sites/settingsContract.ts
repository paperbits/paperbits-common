export interface SettingsContract {
    integration?: IntegrationSettingsContract;
    site: SiteSettingsContract;
}

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

export interface IntegrationSettingsContract {
    googleMaps?: GoogleMapsConfig;
    googleTagManager?: GoogleTagManagerConfig;
    googleFonts?: GoogleFontsConfig;
    intercom?: IIntercomConfig;
}

export interface GoogleMapsConfig {
    apiKey: string;
}

export interface GoogleFontsConfig {
    apiKey: string;
}

export interface GoogleTagManagerConfig {
    containerId: string;
    dataLayerName?: string;
}

export interface IIntercomConfig {
    appId: string;
}