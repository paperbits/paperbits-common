import { ContentConfig } from "../../editing/contentNode";

export interface IVideoPlayerNode extends ContentConfig {
    /**
     * Key of the permalink pointing to an actual resource.
     */
    sourceKey?: string;

    /**
     * External UR which is used when sourceKey isn't specified.
     */
    sourceUrl?: string;

    controls?: boolean;
    
    autoplay?: boolean;
}