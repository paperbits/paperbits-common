import { IBag } from "../core/IBag";

export interface BlogPostContract {
    key?: string;
    title: string;
    description: string;
    keywords: string;
    contentKey?: string;
    permalinkKey?: string;
    anchors?: IBag<string>;
}