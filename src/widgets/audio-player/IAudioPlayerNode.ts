import { Contract } from "../../editing/contentNode";

export interface IAudioPlayerNode extends Contract {
    sourceKey?: string;
    sourceUrl?: string;
    controls?: boolean;
    autoplay?: boolean;
}