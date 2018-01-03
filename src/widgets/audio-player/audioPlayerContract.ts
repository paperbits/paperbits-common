import { Contract } from "../../contract";

export interface AudioPlayerContract extends Contract {
    sourceKey?: string;
    sourceUrl?: string;
    controls?: boolean;
    autoplay?: boolean;
}