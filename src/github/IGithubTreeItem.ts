export interface IGithubTreeItem {
    sha?: string;
    path: string;
    size?: number;
    type?: string;
    mode?: string;
    url?: string;
    content?: string;
}