import * as Utils from "../utils";
import { IObjectStorage, IBlobStorage } from "../persistence";
import { IMediaService, MediaContract } from "./";
import { ProgressPromise } from "../progressPromise";

const uploadsPath = "uploads";

export class MediaService implements IMediaService {
    private readonly objectStorage: IObjectStorage;
    private readonly blobStorage: IBlobStorage;

    constructor(objectStorage: IObjectStorage, blobStorage: IBlobStorage) {
        this.objectStorage = objectStorage;
        this.blobStorage = blobStorage;
    }

    public async getMediaByUrl(url: string): Promise<MediaContract> {
        const permalinks = await this.objectStorage.searchObjects<any>("permalinks", ["uri"], url);
        const mediaKey = permalinks[0].targetKey;
        const mediaContract = await this.getMediaByKey(mediaKey);

        return mediaContract;
    }

    public searchByProperties(propertyNames: string[], propertyValue: string, startSearch: boolean): Promise<MediaContract[]> {
        return this.objectStorage.searchObjects<MediaContract>(uploadsPath, propertyNames, propertyValue, startSearch);
    }

    public getMediaByKey(key: string): Promise<MediaContract> {
        if (!key.startsWith(uploadsPath)) {
            return null;
        }
        return this.objectStorage.getObject<MediaContract>(key);
    }

    public async search(pattern: string): Promise<MediaContract[]> {
        const result = await this.searchByProperties(["filename"], pattern, true);

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

    public async deleteMedia(mediaContract: MediaContract): Promise<void> {
        try {
            await this.objectStorage.deleteObject(mediaContract.key);
            await this.blobStorage.deleteBlob(mediaContract.blobKey);
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
        return this.objectStorage.updateObject(media.key, media);
    }
}