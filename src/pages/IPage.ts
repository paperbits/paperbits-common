import { IBag } from "../core/IBag";

export interface IPage {
    key?: string;
    title: string;
    description: string;
    keywords: string;
    contentKey?: string;
    permalinkKey?: string;
    anchors?: IBag<string>;
}