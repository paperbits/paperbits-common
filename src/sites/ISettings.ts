export interface ISettings {
    integration?: IIntegrationSettings;
    site: ISiteSettings;
}

export interface ISiteSettings {
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

export interface IIntegrationSettings {
    googlemaps?: IGMapsConfig;
    gtm?: IGtmConfig;
    intercom?: IIntercomConfig;
}

export interface IGMapsConfig {
    apiKey: string;
}

export interface IGtmConfig {
    containerId: string;
    dataLayerName?: string;
}

export interface IIntercomConfig {
    appId: string;
}