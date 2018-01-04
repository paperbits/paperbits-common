import { Contract } from "../../contract";

export interface MapContract extends Contract {
    location: string;
    layout?: string;
    caption?: string;
    zoomControl?: string;
}