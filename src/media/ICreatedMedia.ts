import { MediaContract } from "../media/mediaContract";
import { IPermalink } from "../permalinks";

export interface ICreatedMedia {
    media: MediaContract;
    permalink: IPermalink;
}