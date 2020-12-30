import * as Utils from "../utils";
import * as Constants from "./constants";
import { IObjectStorage, IBlobStorage, Query, Operator, Page } from "../persistence";
import { IMediaService, MediaContract } from "./";


export class MediaService implements IMediaService {
    constructor(
        private readonly objectStorage: IObjectStorage,
        private readonly blobStorage: IBlobStorage
    ) { }

    public async getMediaByPermalink(permalink: string): Promise<MediaContract> {
        if (!permalink) {
            throw new Error(`Parameter "permalink" not specified.`);
        }

        const query = Query
            .from<MediaContract>()
            .where("permalink", Operator.equals, permalink);

        const pageOfObjects = await this.objectStorage.searchObjects<MediaContract>(Constants.mediaRoot, query);
        const result = pageOfObjects.value;
        const uploads = Object.values(result);

        return uploads.length > 0 ? uploads[0] : null;
    }

    public async getMediaByKey(key: string): Promise<MediaContract> {
        if (!key) {
            throw new Error(`Parameter "key" not specified.`);
        }

        const media = await this.objectStorage.getObject<MediaContract>(key);

        if (!media) {
            console.warn(`Media with key ${key} not found.`);
            return null;
        }

        if (media.blobKey) {
            const downloadUrl = await this.getDownloadUrlFromBlobKey(media.blobKey);
            media.downloadUrl = downloadUrl || media.downloadUrl;
        }

        return media;
    }

    private async getDownloadUrlFromBlobKey(blobKey: string): Promise<string> {
        try {
            return await this.blobStorage.getDownloadUrl(blobKey);
        }
        catch (error) {
            // TODO: Check for 404
        }
        return undefined;
    }

    private async convertPage(pageOfMedia: Page<MediaContract>): Promise<Page<MediaContract>> {
        for (const media of pageOfMedia.value) {
            if (!media.blobKey) {
                continue;
            }

            media.downloadUrl = await this.getDownloadUrlFromBlobKey(media.blobKey);
        }

        const resultPage: Page<MediaContract> = {
            value: pageOfMedia.value,
            takeNext: async (): Promise<Page<MediaContract>> => {
                const nextPage = await pageOfMedia.takeNext();
                return this.convertPage(nextPage);
            }
        };

        if (!pageOfMedia.takeNext) {
            resultPage.takeNext = null;
        }

        return resultPage;
    }

    public async search(query: Query<MediaContract>): Promise<Page<MediaContract>> {
        if (!query) {
            throw new Error(`Parameter "query" not specified.`);
        }

        try {
            const pageOfResults = await this.objectStorage.searchObjects<MediaContract>(Constants.mediaRoot, query);
            const pageOfMedia = this.convertPage(pageOfResults);

            return pageOfMedia;

        }
        catch (error) {
            throw new Error(`Unable to search media: ${error.stack || error.message}`);
        }
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

    public createMedia(name: string, content: Uint8Array, mimeType?: string): Promise<MediaContract> {
        const blobKey = Utils.guid();
        const mediaKey = `${Constants.mediaRoot}/${blobKey}`;
        const media: MediaContract = {
            key: mediaKey,
            fileName: name,
            blobKey: blobKey,
            description: "",
            keywords: "",
            permalink: `/content/${name}`,
            mimeType: mimeType
        };
        return this.uploadContent(content, media);
    }

    public async createMediaUrl(name: string, downloadUrl: string, mimeType?: string): Promise<MediaContract> {
        const blobKey = Utils.guid();
        const mediaKey = `${Constants.mediaRoot}/${blobKey}`;
        const media: MediaContract = {
            key: mediaKey,
            fileName: name,
            blobKey: undefined,
            downloadUrl: downloadUrl,
            description: "",
            keywords: "",
            permalink: `/content/${name}`,
            mimeType: mimeType
        };
        await this.updateMedia(media);
        return media;
    }

    private async uploadContent(content: Uint8Array, media: MediaContract): Promise<MediaContract> {
        await this.blobStorage.uploadBlob(media.blobKey, content, media.mimeType);
        await this.objectStorage.updateObject(media.key, media);

        media.downloadUrl = await this.blobStorage.getDownloadUrl(media.blobKey);

        return media;
    }

    public updateMedia(media: MediaContract): Promise<void> {
        if (!media) {
            throw new Error(`Parameter "media" not specified.`);
        }

        return this.objectStorage.updateObject(media.key, media);
    }

    public updateMediaContent(media: MediaContract, content: Uint8Array): Promise<MediaContract> {
        if (!media) {
            throw new Error(`Parameter "media" not specified.`);
        }
        if (!content) {
            throw new Error(`Parameter "content" not specified.`);
        }

        return this.uploadContent(content, media);
    }
}