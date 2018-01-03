import { MediaContract } from '../media/mediaContract';
import { IPermalink } from '../permalinks/IPermalink';
import { ProgressPromise } from '../core/progressPromise';
import { ICreatedMedia } from '../media/ICreatedMedia';

export interface IMediaService {
    getMediaByKey(key: string): Promise<MediaContract>;
    
    getMediaByPermalink(permalink: string): Promise<MediaContract>;

    searchByProperties(propertyNames: Array<string>, propertyValue: string, startSearch: boolean): Promise<Array<MediaContract>>;

    search(pattern?: string): Promise<Array<MediaContract>>;

    deleteMedia(media: MediaContract): Promise<void>;

    createMedia(name: string, content: Uint8Array, contentType?:string): ProgressPromise<ICreatedMedia>;

    updateMedia(media: MediaContract): Promise<void>;
}