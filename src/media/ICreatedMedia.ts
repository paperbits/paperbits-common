import { MediaContract } from '../media/mediaContract';
import { IPermalink } from '../permalinks/IPermalink';

export interface ICreatedMedia {
    media: MediaContract,
    permalink: IPermalink
}