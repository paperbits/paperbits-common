export interface BackgroundPictureContract {
    sourceKey: string;
    repeat?: string;
}

export interface BackgroundVideoContract {
    sourcePermalinkKey: string;
}

export interface BackgroundMapContract {
    address: string;
    markerIconPermalinkKey?: string;
}

export interface BackgroundContract {
    picture?: BackgroundPictureContract;
    map?: BackgroundMapContract;
    position?: string;
    color?: string;
    size?: string;
}
