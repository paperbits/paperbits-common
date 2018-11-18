import { Bag } from "../Bag";

export interface BlogPostContract {
    key?: string;
    title: string;
    description: string;
    keywords: string;
    contentKey?: string;
    permalinkKey?: string;
    anchors?: Bag<string>;
    created?: string;
    updated?: string;
    author?: string;
}