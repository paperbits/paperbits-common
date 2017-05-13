import { IMedia } from '../media/IMedia';
import { IPermalink } from '../permalinks/IPermalink';
import { ProgressPromise } from '../core/progressPromise';
import { ICreatedMedia } from '../media/ICreatedMedia';

export interface IMediaService {
    getMediaByKey(key: string): Promise<IMedia>;

    search(pattern?: string): Promise<Array<IMedia>>;

    deleteMedia(media: IMedia): Promise<void>;

    createMedia(name: string, content: Uint8Array, contentType?:string): ProgressPromise<ICreatedMedia>;

    updateMedia(media: IMedia): Promise<void>;
}