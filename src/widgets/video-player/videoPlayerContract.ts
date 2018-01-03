import { Contract } from "../../contract";

export interface VideoPlayerContract extends Contract {
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