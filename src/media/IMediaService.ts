import { MediaContract } from "../media/mediaContract";
import { Query, Page } from "../persistence";


/**
 * Service for managing media files.
 */
export interface IMediaService {
    /**
     * Searches for media files that contain specified pattern in their title, description or keywords.
     * @param query {Query<MediaContract>} Search query.
     */
    search(query: Query<MediaContract>): Promise<Page<MediaContract>>;

    /**
     * Returns media file metadata by specified key.
     * @param key
     */
    getMediaByKey(key: string): Promise<MediaContract>;

    /**
     * Return media file metadata by permalink.
     * @param permalink {string} Permanent link of the media.
     */
    getMediaByPermalink(permalink: string): Promise<MediaContract>;

    /**
     * Deletes specified media file.
     * @param media {MediaContract} Contract describing media file metadata.
     */
    deleteMedia(media: MediaContract): Promise<void>;

    /**
     * Creates new media files.
     * @param name Name of media file, i.e. "logo.png"
     * @param content Content in form of byte array.
     * @param contentType Content type, i.e. "image/png".
     */
    createMedia(name: string, content: Uint8Array, contentType?: string): Promise<MediaContract>;

    /**
     * Creates new media files.
     * @param name Name of media file, i.e. "logo.png"
     * @param referenceUrl URL, i.e. "https://cdn.paperbits.io/images/logo.svg"
     * @param contentType Content type, i.e. "image/png".
     */
    createMediaUrl(name: string, referenceUrl: string, mimeType?: string): Promise<MediaContract>;

    /**
     * Updates media file metadata.
     * @param media {MediaContract} Contract describing media file metadata.
     */
    updateMedia(media: MediaContract): Promise<void>;

    /**
     * Update media file content.
     * @param media metadata to Update
     * @param content New content in form of byte array.
     * @param contentType Content type, i.e. "image/png".
     */
    updateMediaContent(media: MediaContract, content: Uint8Array): Promise<MediaContract>;
}