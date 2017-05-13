export interface BackgroundPictureData {
    sourcePermalinkKey: string;
    repeat?: string;
}

export interface BackgroundVideoData {
    sourcePermalinkKey: string;
}

export interface BackgroundMapData {
    address: string;
    markerIconPermalinkKey?: string;
}

export interface BackgroundData {
    picture?: BackgroundPictureData;
    map?: BackgroundMapData;
    position?: string;
    color?: string;
    size?: string;
}
