import { MediaContract } from "../media/mediaContract";
import { PermalinkContract } from "../permalinks";

export interface ICreatedMedia {
    media: MediaContract;
    permalink: PermalinkContract;
}