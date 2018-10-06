import { Contract } from "../contract";

export interface LayoutContract extends Contract {
    key?: string;
    title: string;
    description: string;
    uriTemplate: string;
    contentKey?: string;
}