import { IBag } from "../core/IBag";

export interface IBlogPost {
    key?: string;
    title: string;
    description: string;
    keywords: string;
    contentKey?: string;
    permalinkKey?: string;
    anchors?: IBag<string>;
}