export interface ISiteSettings {
    title: string;
    description?: string;
    keywords?: string;
    config?: ISiteConfig;
    iconPermalinkKey?: string;
}

export interface ISiteConfig {
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