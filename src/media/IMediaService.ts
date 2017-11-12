import { IMedia } from '../media/IMedia';
import { IPermalink } from '../permalinks/IPermalink';
import { ProgressPromise } from '../core/progressPromise';
import { ICreatedMedia } from '../media/ICreatedMedia';

export interface IMediaService {
    getMediaByKey(key: string): Promise<IMedia>;
    
    getMediaByPermalink(permalink: string): Promise<IMedia>;

    searchByProperties(propertyNames: Array<string>, propertyValue: string, startSearch: boolean): Promise<Array<IMedia>>;

    search(pattern?: string): Promise<Array<IMedia>>;

    deleteMedia(media: IMedia): Promise<void>;

    createMedia(name: string, content: Uint8Array, contentType?:string): ProgressPromise<ICreatedMedia>;

    updateMedia(media: IMedia): Promise<void>;
}