import { ContentConfig } from "../../editing/contentNode";

export interface IMapConfig extends ContentConfig {
    location: string;
    layout?: string;
    caption?: string;
    zoomControl?: string;
}