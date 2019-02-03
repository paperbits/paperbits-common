import * as Utils from "../utils";
import * as Constants from "./constants";
import { IObjectStorage, IBlobStorage } from "../persistence";
import { IMediaService, MediaContract } from "./";
import { ProgressPromise } from "../progressPromise";
import { Bag } from "./../bag";


export class MediaService implements IMediaService {
    constructor(
        private readonly objectStorage: IObjectStorage,
        private readonly blobStorage: IBlobStorage
    ) { }

    public async getMediaByUrl(permalink: string): Promise<MediaContract> {
        if (!permalink) {
            throw new Error(`Parameter "permalink" not specified.`);
        }

        const result = await this.objectStorage.searchObjects<Bag<MediaContract>>(Constants.mediaRoot, ["permalink"], permalink);
        const uploads = Object.keys(result).map(key => result[key]);

        return uploads.length > 0 ? uploads[0] : null;
    }

    public async searchByProperties(propertyNames: string[], propertyValue: string): Promise<MediaContract[]> {
        const result = await this.objectStorage.searchObjects<Bag<MediaContract>>(Constants.mediaRoot, propertyNames, propertyValue);
        return Object.keys(result).map(key => result[key]);
    }

    public async getMediaByKey(key: string): Promise<MediaContract> {
        if (!key) {
            throw new Error(`Parameter "key" not specified.`);
        }

        const media = await this.objectStorage.getObject<MediaContract>(key);

        if (media.blobKey) {
            try {
                const uri = await this.blobStorage.getDownloadUrl(media.blobKey);

                if (uri) {
                    media.downloadUrl = uri;
                }
            }
            catch (error) {
                // TODO: Check for 404
            }
        }

        return media;
    }

    public async search(pattern: string): Promise<MediaContract[]> {
        const result = await this.searchByProperties(["filename"], pattern);
        return Object.keys(result).map(key => result[key]);

        result.sort((x, y) => {
            const a = x.filename.toUpperCase();
            const b = y.filename.toUpperCase();

            if (a > b) {
                return 1;
            }

            if (a < b) {
                return -1;
            }
            return 0;
        });

        return result;
    }

    public async deleteMedia(media: MediaContract): Promise<void> {
        if (!media) {
            throw new Error(`Parameter "media" not specified.`);
        }

        try {
            await this.objectStorage.deleteObject(media.key);
            await this.blobStorage.deleteBlob(media.blobKey);
        }
        catch (error) {
            // TODO: Do proper handling.
            console.warn(error);
        }
    }

    public createMedia(name: string, content: Uint8Array, mimeType?: string): ProgressPromise<MediaContract> {
        const blobKey = Utils.guid();
        const mediaKey = `${Constants.mediaRoot}/${blobKey}`;
        const media: MediaContract = {
            key: mediaKey,
            filename: name,
            blobKey: blobKey,
            description: "",
            keywords: "",
            permalink: `/content/${name}`,
            mimeType: mimeType
        };
        return this.uploadContent(content, media);
    }

    private uploadContent(content: Uint8Array, media: MediaContract): ProgressPromise<MediaContract> {
        return new ProgressPromise<MediaContract>(async (resolve, reject, progress) => {
            await this.blobStorage
                .uploadBlob(media.blobKey, content, media.mimeType)
                .progress(progress);

            const uri = await this.blobStorage.getDownloadUrl(media.blobKey);

            if (!media.downloadUrl) {
                media.downloadUrl = uri;
                await this.objectStorage.addObject(media.key, media);
            }
            else {
                media.downloadUrl = uri;
                await this.objectStorage.updateObject(media.key, media);
            }

            resolve(media);
        });
    }

    public updateMedia(media: MediaContract): Promise<void> {
        if (!media) {
            throw new Error(`Parameter "media" not specified.`);
        }

        return this.objectStorage.updateObject(media.key, media);
    }

    public updateMediaContent(media: MediaContract, content: Uint8Array): ProgressPromise<MediaContract> {
        if (!media) {
            throw new Error(`Parameter "media" not specified.`);
        }
        if (!content) {
            throw new Error(`Parameter "content" not specified.`);
        }

        return this.uploadContent(content, media);
    }
}