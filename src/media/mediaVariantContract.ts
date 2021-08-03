/**
 * Variant of the media for different screen sizes.
 */

export interface MediaVariantContract {
    /**
     * A key that is used to identify a file in blob.
     */
    blobKey?: string;

    /**
     * Width in pixels.
     */
    width?: number;

    /**
     * Height in pixels.
     */
    height?: number;

    /**
     * Mime type, e.g. `image/png`.
     */
    mimeType?: string;

    /**
     * Download URL. If available, can be used for direct download.
     */
    downloadUrl?: string;
}
