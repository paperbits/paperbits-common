import { Contract } from "../../editing/contentNode";

export interface IMapConfig extends Contract {
    location: string;
    layout?: string;
    caption?: string;
    zoomControl?: string;
}