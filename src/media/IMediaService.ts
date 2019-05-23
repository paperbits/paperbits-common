import { MediaContract } from "../media/mediaContract";


/**
 * Service for managing media files.
 */
export interface IMediaService {
    /**
     * Returns media file metadata by specified key.
     * @param key
     */
    getMediaByKey(key: string): Promise<MediaContract>;

    getMediaByUrl(url: string): Promise<MediaContract>;

    search(pattern?: string, mimeType?: string): Promise<MediaContract[]>;

    /**
     * Deletes specified media file.
     * @param media
     */
    deleteMedia(media: MediaContract): Promise<void>;

    /**
     * Creates new media files.
     * @param name Name of media file, i.e. "logo.png"
     * @param content Content in form of byte array.
     * @param contentType Content type, i.e. "image/png".
     */
    createMedia(name: string, content: Uint8Array, contentType?: string): Promise<MediaContract>;

    updateMedia(media: MediaContract): Promise<void>;

    /**
     * Update media file content.
     * @param media metadata to Update
     * @param content New content in form of byte array.
     * @param contentType Content type, i.e. "image/png".
     */
    updateMediaContent(media: MediaContract, content: Uint8Array): Promise<MediaContract>;
}