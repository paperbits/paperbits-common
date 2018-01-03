import { Contract } from "../../contract";

export interface PictureContract extends Contract {
    sourceKey?: string;
    sourceUrl?: string;
    caption?: string;
    action?: string;
    layout?: string;
    animation?: string;
}