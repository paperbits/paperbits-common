import { ContentConfig } from "../../editing/contentNode";

export interface IPictureNode extends ContentConfig {
    sourceKey?: string;
    sourceUrl?: string;
    caption?: string;
    action?: string;
    layout?: string;
    animation?: string;
}