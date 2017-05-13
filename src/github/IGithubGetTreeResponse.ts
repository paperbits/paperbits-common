import { IGithubCommit } from '../github/IGithubCommit';
import { IGithubTreeItem } from '../github/IGithubTreeItem';

export interface IGithubGetTreeResponse {
    sha: string;
    tree: Array<IGithubTreeItem>;
    truncated: boolean;
    url: string;
    lastCommit?: IGithubCommit;
}