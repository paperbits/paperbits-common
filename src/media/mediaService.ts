import { Bag } from "./../bag";
import * as Utils from "../utils";
import { IObjectStorage, IBlobStorage } from "../persistence";
import { IMediaService, MediaContract } from "./";
import { ProgressPromise } from "../progressPromise";

const uploadsPath = "uploads";

export class MediaService implements IMediaService {
    constructor(
        private readonly objectStorage: IObjectStorage,
        private readonly blobStorage: IBlobStorage
    ) { }

    public async getMediaByUrl(permalink: string): Promise<MediaContract> {
        if (!permalink) {
            throw new Error(`Parameter "permalink" not specified.`);
        }

        const result = await this.objectStorage.searchObjects<Bag<MediaContract>>(uploadsPath, ["permalink"], permalink);
        const uploads = Object.keys(result).map(key => result[key]);

        return uploads.length > 0 ? uploads[0] : null;
    }

    public async searchByProperties(propertyNames: string[], propertyValue: string): Promise<MediaContract[]> {
        const result = await this.objectStorage.searchObjects<Bag<MediaContract>>(uploadsPath, propertyNames, propertyValue);
        return Object.keys(result).map(key => result[key]);
    }

    public getMediaByKey(key: string): Promise<MediaContract> {
        if (!key) {
            throw new Error(`Parameter "key" not specified.`);
        }

        return this.objectStorage.getObject<MediaContract>(key);
    }

    public async search(pattern: string): Promise<MediaContract[]> {
        const result = await this.searchByProperties(["filename"], pattern);

        // tslint:disable-next-line:only-arrow-functions
        result.sort(function (x, y) {
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
        return new ProgressPromise<MediaContract>(async (resolve, reject, progress) => {
            const blobKey = Utils.guid();

            await this.blobStorage
                .uploadBlob(blobKey, content, mimeType)
                .progress(progress);

            const uri = await this.blobStorage.getDownloadUrl(blobKey);
            const mediaKey = `${uploadsPath}/${blobKey}`;

            const media: MediaContract = {
                key: mediaKey,
                filename: name,
                blobKey: blobKey,
                description: "",
                keywords: "",
                permalink: `/content/${name}`,
                downloadUrl: uri,
                mimeType: mimeType
            };

            await this.objectStorage.addObject(mediaKey, media);

            resolve(media);
        });
    }

    public updateMedia(media: MediaContract): Promise<void> {
        if (!media) {
            throw new Error(`Parameter "media" not specified.`);
        }

        return this.objectStorage.updateObject(media.key, media);
    }
}