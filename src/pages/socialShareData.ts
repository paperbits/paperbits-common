export interface SocialShareImage {
    /**
     * Source key, e.g. media/my-image-key
     */
    sourceKey: string;

    /**
     * Image width, e.g. 1200
     */
    width?: number;

    /**
     * Image height, e.g. 620
     */
    height?: number;
}

/**
 * Text and image that display when this page is shared on social networks.
 */
export interface SocialShareData {
    /**
     * Image source key.
     */
    image?: SocialShareImage;

    /**
     * Title for social networks.
     */
    title?: string;

    /**
     * Description for social networks.
     */
    description?: string;
}