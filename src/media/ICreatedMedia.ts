import { IMedia } from '../media/IMedia';
import { IPermalink } from '../permalinks/IPermalink';

export interface ICreatedMedia {
    media: IMedia,
    permalink: IPermalink
}