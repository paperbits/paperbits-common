import { IGithubClient } from '../github/IGithubClient';
import { IGithubFile } from '../github/IGithubFile';
import { IHttpHeader } from '../http/IHttpHeader';
import { IGithubCommit } from '../github/IGithubCommit';
import { IGithubReference } from '../github/IGithubReference';
import { IGithubGetTreeResponse } from '../github/IGithubGetTreeResponse';
import { IGithubCreateTreeResponse } from '../github/IGithubCreateTreeResponse';
import { IGithubTreeItem } from '../github/IGithubTreeItem';
import { IGithubCreateBlobReponse } from '../github/IGithubCreateBlobReponse';
import { IGithubBlob } from '../github/IGithubBlob';
import { IGithubGetBlobResponse } from '../github/IGithubGetBlobResponse';
import { IGithubObject } from '../github/IGithubObject';

export interface IGithubClient {
    repositoryName: string;

    getFileContent(path: string): Promise<IGithubFile>;

    getHeads(): Promise<Array<IGithubReference>>;

    getCommit(commitSha: string): Promise<IGithubCommit>;

    createCommit(parentCommitSha: string, tree: string, message: string): Promise<IGithubCommit>;

    createTree(baseTreeSha: string, treeItems: Array<IGithubTreeItem>): Promise<IGithubCreateTreeResponse>;

    createReference(branch: string, commitSha: string);

    deleteReference(branch: string): Promise<void>;

    deleteFile(path: string, blobSha: string, commitMsg: string);

    updateReference(branch: string, commitSha: string): Promise<IGithubReference>;

    push(message: string, branch?: string): Promise<void>;

    pushTree(treeItems: Array<IGithubTreeItem>, message?: string, branch?: string): Promise<IGithubReference>;

    getBlob(blobSha: string): Promise<IGithubBlob>;

    createBlob(path: string, content: Uint8Array): Promise<void>;

    getLatestCommitTree(): Promise<IGithubGetTreeResponse>;

    getLatestCommit(): Promise<IGithubCommit>;
}