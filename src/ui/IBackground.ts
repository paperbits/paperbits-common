export interface IBackground {
    imageUrl?: string;
    videoUrl?: string;
    position?: string;
    repeat?: string;
    color?: string;
    size?: string;
}

export interface BackgroundPicture {
    sourceUrl: string;
    repeat: boolean;  // true, false
    position: string; // center center
}

export interface BackgroundVideo {
    sourceUrl: string;
    autoplay: boolean;
}

export interface BackgroundMap {
    address: string;
    pinImageUrl: string;
}