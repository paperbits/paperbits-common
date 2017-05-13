import { IGithubTree } from '../github/IGithubTree';

export interface IGithubCommit {
    author: any;
    committer: any;
    sha: string;
    tree: IGithubTree;
    url: string;
}