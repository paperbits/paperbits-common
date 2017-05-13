import { ContentConfig } from "../../editing/contentNode";

export interface IAudioPlayerNode extends ContentConfig {
    sourceKey?: string;
    sourceUrl?: string;
    controls?: boolean;
    autoplay?: boolean;
}