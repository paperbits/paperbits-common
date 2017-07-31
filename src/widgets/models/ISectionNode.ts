import { BackgroundContract } from "./../../ui/draggables/backgorund";
import { ContentConfig } from "./../../editing/contentNode";

export interface SectionConfig extends ContentConfig {
    background: BackgroundContract;

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