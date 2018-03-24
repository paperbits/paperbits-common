import { IBag } from "../IBag";

export interface BlogPostContract {
    key?: string;
    title: string;
    description: string;
    keywords: string;
    contentKey?: string;
    permalinkKey?: string;
    anchors?: IBag<string>;
    created?: string;
    updated?: string;
    author?: string;
}