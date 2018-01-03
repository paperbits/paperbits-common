import * as Utils from '../utils';
import { IObjectStorage } from '../persistence/IObjectStorage';
import { IBlobStorage } from '../persistence/IBlobStorage';
import { MediaContract } from './MediaContract';
import { IMediaService } from './IMediaService';
import { IPermalinkService } from "./../permalinks/IPermalinkService";
import { ICreatedMedia } from './ICreatedMedia';
import { IPermalink } from '../permalinks/IPermalink';
import { ProgressPromise } from '../progressPromise';

const uploadsPath = "uploads";
const permalinksPath = "permalinks";

export class MediaService implements IMediaService {
    private readonly objectStorage: IObjectStorage;
    private readonly blobStorage: IBlobStorage;
    private readonly permalinkService: IPermalinkService;

    constructor(objectStorage: IObjectStorage, blobStorage: IBlobStorage, permalinkService: IPermalinkService) {
        this.objectStorage = objectStorage;
        this.blobStorage = blobStorage;
        this.permalinkService = permalinkService;
    }

    public searchByProperties(propertyNames: Array<string>, propertyValue: string, startSearch: boolean): Promise<Array<MediaContract>> {
        return this.objectStorage.searchObjects<MediaContract>(uploadsPath, propertyNames, propertyValue, startSearch);
    }

    public getMediaByKey(key: string): Promise<MediaContract> {
        if (!key.startsWith(uploadsPath)) {
            return null;
        }
        return this.objectStorage.getObject<MediaContract>(key);
    }
    
    public async getMediaByPermalink(permalink: string): Promise<MediaContract> {
        if(permalink) {
            let iconPermalink = await this.permalinkService.getPermalinkByKey(permalink);
            if(iconPermalink){
                return this.getMediaByKey(iconPermalink.targetKey);
            }
        }
        return null;
    }

    public async search(pattern: string): Promise<Array<MediaContract>> {
        let result = await this.searchByProperties(["filename"], pattern, true);

        result.sort(function (x, y) {
            var a = x.filename.toUpperCase();
            var b = y.filename.toUpperCase();

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
        try {
            await this.objectStorage.deleteObject(media.key);
            await this.blobStorage.deleteBlob(media.filename);
            await this.permalinkService.deletePermalinkByKey(media.permalinkKey);
        }
        catch (error) {
            // TODO: Do proper handling.
            console.warn(error);
        }
    }

    public createMedia(name: string, content: Uint8Array, contentType?: string): ProgressPromise<ICreatedMedia> {
        return new ProgressPromise<ICreatedMedia>(async (resolve, reject, progress) => {
            await this.blobStorage.uploadBlob(name, content, contentType)
                .progress(progress)
                .then(() => this.blobStorage.getDownloadUrl(name))
                .then(async uri => {
                    var mediaId = `${uploadsPath}/${Utils.guid()}`;
                    var permalinkKey = `${permalinksPath}/${Utils.guid()}`;

                    var media: MediaContract = {
                        key: mediaId,
                        filename: name,
                        description: "",
                        keywords: "",
                        downloadUrl: uri,
                        permalinkKey: permalinkKey,
                        contentType: contentType
                    };

                    var permalink: IPermalink = {
                        key: permalinkKey,
                        targetKey: mediaId,
                        uri: `/content/${name}`
                    };

                    await Promise.all([this.objectStorage.addObject(mediaId, media), this.objectStorage.addObject(permalinkKey, permalink)]);

                    resolve({
                        media: media,
                        permalink: permalink
                    });
                });
        });
    }

    public updateMedia(media: MediaContract): Promise<void> {
        return this.objectStorage.updateObject(media.key, media);
    }
}