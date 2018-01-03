import { BackgroundContract } from "./../../ui/background";
import { Contract } from "./../../contract";

export interface SectionConfig extends Contract {
    background?: BackgroundContract;

    /**
     *  Layout types: container, full width.
     */
    layout?: string;

    /**
     * by content, screen size
     */
    height?: string;

    /**
     * Possible values: top, bottom.
     */
    snapping: string;
}