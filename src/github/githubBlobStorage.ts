import { ProgressPromise } from "./../progressPromise";
import { IBlobStorage } from "./../persistence/IBlobStorage";
import { IBag } from '../IBag';
import { IGithubClient } from '../github/IGithubClient';
import { IFileReference } from '../github/IFileReference';
import { IGithubFile } from '../github/IGithubFile';
import { IGithubCommit } from '../github/IGithubCommit';
import { IGithubReference } from '../github/IGithubReference';
import { IGithubTreeItem } from '../github/IGithubTreeItem';
import { IGithubCreateTreeResponse } from '../github/IGithubCreateTreeResponse';
import { IGithubCreateBlobReponse } from '../github/IGithubCreateBlobReponse';
import * as _ from 'lodash';
import * as Utils from '../utils';

export class GithubBlobStorage implements IBlobStorage {
    private readonly githubClient: IGithubClient;

    constructor(githubClient: IGithubClient) {
        this.githubClient = githubClient;
    }

    public uploadBlob(name: string, content: Uint8Array): ProgressPromise<void> {
        let promise = new ProgressPromise<void>(async (resolve, reject, progress) => {
            progress(0);

            name = name.replaceAll("\\", "/");

            if (name.startsWith("/")) {
                name = name.substr(1);
            }

            await this.githubClient.createBlob(name, content);

            progress(100);
            resolve();
        });

        return promise;
    }

    private base64ToUnit8Array(base64: string): Uint8Array {
        var rawData = atob(base64);
        var rawDataLength = rawData.length;
        var byteArray = new Uint8Array(new ArrayBuffer(rawDataLength));

        for (let i = 0; i < rawDataLength; i++) {
            byteArray[i] = rawData.charCodeAt(i);
        }

        return byteArray;
    }

    public async downloadBlob(path: string): Promise<Uint8Array> {
        let githubFile = await this.githubClient.getFileContent(path);

        return this.base64ToUnit8Array(githubFile.content);
    }

    public async getDownloadUrl(permalink: string): Promise<string> {
        throw "Not supported";
    }

    public deleteBlob(path: string): Promise<void> {
        throw "Not supported";
    }

    public async listBlobs(): Promise<Array<string>> {
        let latestCommitTree = await this.githubClient.getLatestCommitTree();
        let blobPaths = latestCommitTree.tree.filter(item => item.type === "blob").map(item => item.path);
        return blobPaths;
    }
}