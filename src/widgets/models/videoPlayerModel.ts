import { IModel } from "./IModel";

export class VideoPlayerModel implements IModel {
    public type: string = "video";
    sourceKey?: string;
    sourceUrl?: string;
    controls?: boolean;
    autoplay?: boolean;

    constructor() {
    }
}