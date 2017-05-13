import { IModel } from "./IModel"; 
export class AudioPlayerModel implements IModel {
    public type: string = "audio-player";
    public sourceUrl: string;
    public sourceKey: string;
    public controls?: boolean;
    public autoplay?: boolean;
}