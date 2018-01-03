import { Contract } from "../../contract";

export interface IMapConfig extends Contract {
    location: string;
    layout?: string;
    caption?: string;
    zoomControl?: string;
}