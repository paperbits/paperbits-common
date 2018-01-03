import { ProgressPromise } from "./../progressPromise";
import { ISettingsProvider } from "./../configuration/ISettingsProvider";
import { IHttpClient } from '../http/IHttpClient';
import { IGithubClient } from '../github/IGithubClient';
import { IGithubFile } from '../github/IGithubFile';
import { IHttpHeader } from '../http/IHttpHeader';
import { HttpMethod } from '../http/httpMethod';
import { IGithubCommit } from '../github/IGithubCommit';
import { IGithubReference } from '../github/IGithubReference';
import { IGithubGetTreeResponse } from '../github/IGithubGetTreeResponse';
import { IGithubCreateTreeResponse } from '../github/IGithubCreateTreeResponse';
import { IGithubTreeItem } from '../github/IGithubTreeItem';
import { IGithubCreateBlobReponse } from '../github/IGithubCreateBlobReponse';
import { IGithubBlob } from '../github/IGithubBlob';
import { IGithubGetBlobResponse } from '../github/IGithubGetBlobResponse';
import { IGithubObject } from '../github/IGithubObject';
import { GithubMode } from '../github/githubMode';
import { GithubTreeItemType } from '../github/githubTreeItemType';
import * as Utils from '../utils';
import * as _ from 'lodash';

declare function moment(): any; // TODO: use proper import 

export class GithubClient implements IGithubClient {
    private readonly settingsProvider: ISettingsProvider;
    private baseUrl: string;
    private baseRepositoriesUrl: string;
    private repositoryOwner: string;
    private authorizationToken: string;
    private readonly httpClient: IHttpClient;
    private mandatoryHttpHeaders: Array<IHttpHeader>;

    private changes: IGithubTreeItem[];

    public repositoryName: string;

    constructor(settingsProvider: ISettingsProvider, httpClient: IHttpClient) {
        // initialization...
        this.settingsProvider = settingsProvider;
        this.httpClient = httpClient;

        // rebinding...
        this.getHeads = this.getHeads.bind(this);
        this.ensureConfig = this.ensureConfig.bind(this);

        this.changes = [];
    }

    private applyConfiguration(githubSettings: Object): Promise<any> {
        this.authorizationToken = githubSettings["authorizationKey"];
        this.repositoryName = githubSettings["repositoryName"];
        this.repositoryOwner = githubSettings["repositoryOwner"];

        this.baseUrl = `https://api.github.com/repos/${this.repositoryOwner}/${this.repositoryName}`;
        this.baseRepositoriesUrl = `${this.baseUrl}/git`;
        this.mandatoryHttpHeaders = [{ name: "Authorization", value: "token " + this.authorizationToken }];

        return Promise.resolve();
    }

    private async ensureConfig(): Promise<void> {
        let settings = await this.settingsProvider.getSetting("github");
        await this.applyConfiguration(settings);
    }

    public async getFileContent(path: string): Promise<IGithubFile> {
        await this.ensureConfig();

        let response = await this.httpClient.send<IGithubFile>({
            url: `${this.baseUrl}/contents/${path}`,
            headers: this.mandatoryHttpHeaders
        });

        return response.toObject();
    }

    /**
     * Deletes a file in a single commit.
     * Please see https://developer.github.com/v3/repos/contents/
     */
    public async deleteFile(path: string, blobSha: string, commitMsg: string): Promise<void> {
        await this.ensureConfig();

        let requestBody = {
            "sha": blobSha,
            "message": commitMsg,
            "branch": "master"
        };

        await this.httpClient.send({
            url: `${this.baseUrl}/contents/${path}`,
            method: HttpMethod.delete,
            headers: this.mandatoryHttpHeaders,
            body: JSON.stringify(requestBody)
        });
    }


    /**
     * Please see http://developer.github.com/v3/git/refs/
     */
    public async getHeads(): Promise<Array<IGithubReference>> {
        await this.ensureConfig();

        let response = await this.httpClient.send<Array<IGithubReference>>({
            url: `${this.baseRepositoriesUrl}/refs/heads`,
            method: HttpMethod.get,
            headers: this.mandatoryHttpHeaders
        });

        return response.toObject();
    }

    /**
     * Please see http://developer.github.com/v3/git/commits/
     */
    public async getCommit(commitSha: string): Promise<IGithubCommit> {
        await this.ensureConfig();

        let response = await this.httpClient.send<IGithubCommit>({
            url: `${this.baseRepositoriesUrl}/commits/${commitSha}`,
            method: HttpMethod.get,
            headers: this.mandatoryHttpHeaders
        });

        return response.toObject();
    }

    /**
     * Please see http://developer.github.com/v3/git/commits/
     */
    public async createCommit(parentCommitSha: string, tree: string, message: string): Promise<IGithubCommit> {
        await this.ensureConfig();

        let requestBody = {
            "message": message,
            "tree": tree,
            "parents": parentCommitSha ? [parentCommitSha] : []
        };

        let response = await this.httpClient.send<IGithubCommit>({
            url: `${this.baseRepositoriesUrl}/commits`,
            method: HttpMethod.post,
            headers: this.mandatoryHttpHeaders,
            body: JSON.stringify(requestBody)
        });

        return response.toObject();
    }

    /**
     * Please see http://developer.github.com/v3/git/trees/
     */
    public async getTree(treeSha: string): Promise<IGithubGetTreeResponse> {
        await this.ensureConfig();

        let response = await this.httpClient.send<IGithubGetTreeResponse>({
            url: `${this.baseRepositoriesUrl}/trees/${treeSha}?recursive=1`,
            method: HttpMethod.get,
            headers: this.mandatoryHttpHeaders
        });

        return response.toObject();
    }

    /**
     * Please see http://developer.github.com/v3/git/trees/
     */
    public async createTree(baseTreeSha: string, treeItems: Array<IGithubTreeItem>): Promise<IGithubCreateTreeResponse> {
        await this.ensureConfig();

        let tree = new Array<Object>();

        treeItems.forEach(treeItem => {
            if (treeItem.path.startsWith("/")) {
                treeItem.path = treeItem.path.substr(1);
            }

            tree.push({
                "path": treeItem.path,
                "sha": treeItem.sha,
                "mode": GithubMode.file,
                "type": GithubTreeItemType.blob
            });
        });

        let requestBody = {
            "base_tree": baseTreeSha,
            "tree": tree
        };

        let response = await this.httpClient.send<IGithubCreateTreeResponse>({
            url: `${this.baseRepositoriesUrl}/trees`,
            method: HttpMethod.post,
            headers: this.mandatoryHttpHeaders,
            body: JSON.stringify(requestBody)
        });

        return response.toObject();
    }

    /**
     * Please see http://developer.github.com/v3/git/refs/
     */
    public async createReference(branch: string, commitSha: string) {
        await this.ensureConfig();

        let requestBody = {
            "ref": `refs/heads/${branch}`,
            "sha": commitSha
        };

        let response = await this.httpClient.send({
            url: `${this.baseRepositoriesUrl}/refs`,
            method: HttpMethod.post,
            headers: this.mandatoryHttpHeaders,
            body: JSON.stringify(requestBody)
        });

        return response.toObject();
    }

    /**
     * Please see http://developer.github.com/v3/git/refs/
     */
    public async deleteReference(branch: string): Promise<void> {
        await this.ensureConfig();

        await this.httpClient.send({
            url: `${this.baseRepositoriesUrl}/refs/heads/${branch}`,
            method: HttpMethod.delete,
            headers: this.mandatoryHttpHeaders
        });
    }

    /**
     * Please see http://developer.github.com/v3/git/refs/
     */
    public async updateReference(branch: string, commitSha: string): Promise<IGithubReference> {
        await this.ensureConfig();

        let requestBody = {
            "sha": commitSha,
            "force": true
        };

        let response = await this.httpClient.send<IGithubReference>({
            url: `${this.baseRepositoriesUrl}/refs/heads/${branch}`,
            method: HttpMethod.patch,
            headers: this.mandatoryHttpHeaders,
            body: JSON.stringify(requestBody)
        });

        return response.toObject();
    }

    public async push(message: string = null, branch: string = "master"): Promise<void> {
        await this.pushTree(this.changes, message, branch);
        this.changes = [];
    }

    public async pushTree(treeItems: Array<IGithubTreeItem>, message: string = null, branch: string = "master"): Promise<IGithubReference> {
        await this.ensureConfig();

        // get the head of the master branch
        let heads = await this.getHeads();

        // get the last commit
        let lastCommitReference = _.last(heads).object;
        let lastCommit = await this.getCommit(lastCommitReference.sha);

        // create tree object (also implicitly creates a blob based on content)
        let createTreeResponse = await this.createTree(lastCommit.tree.sha, treeItems);

        if (!message) {
            message = moment().format("MM/DD/YYYY, hh:mm:ss");
        }

        // create new commit
        let newCommit = await this.createCommit(lastCommit.sha, createTreeResponse.sha, message);

        // update branch to point to new commit
        let head = await this.updateReference(branch, newCommit.sha);

        return head;
    }

    public async getBlob(blobSha: string): Promise<IGithubBlob> {
        await this.ensureConfig();

        let response = await this.httpClient.send<IGithubGetBlobResponse>({
            url: `${this.baseRepositoriesUrl}/blobs/${blobSha}`,
            method: HttpMethod.get,
            headers: this.mandatoryHttpHeaders
        });

        let getBlobReponse = response.toObject();

        let blob: IGithubBlob = {
            content: atob(getBlobReponse.content),
            path: ""
        };

        return blob;
    }

    public async createBlob(path: string, content: Uint8Array): Promise<void> {
        await this.ensureConfig();

        var base64 = Utils.arrayBufferToBase64(content);

        let requestBody = {
            content: base64,
            encoding: "base64"
        };

        let httpResponse = await this.httpClient.send<IGithubCreateBlobReponse>({
            url: `${this.baseRepositoriesUrl}/blobs`,
            method: HttpMethod.post,
            headers: this.mandatoryHttpHeaders,
            body: JSON.stringify(requestBody)
        });

        let response = httpResponse.toObject();

        let treeItem: IGithubTreeItem = {
            path: path,
            sha: response.sha
        };

        this.changes.push(treeItem);
    }

    public async getLatestCommitTree(): Promise<IGithubGetTreeResponse> {
        await this.ensureConfig();

        // get the head of the master branch
        let heads = await this.getHeads();

        // get the last commit
        let lastCommitReference: IGithubObject = _.last(heads).object;
        let lastCommit = await this.getCommit(lastCommitReference.sha);

        // get the last commit tree
        let getTreeResponse = await this.getTree(lastCommit.tree.sha);
        getTreeResponse.lastCommit = lastCommit;

        return getTreeResponse;
    }

    public async getLatestCommit(): Promise<IGithubCommit> {
        await this.ensureConfig();

        // get the head of the master branch
        let heads = await this.getHeads();

        let lastCommitReference: IGithubObject = _.last(heads).object;

        // get the last commit
        let commit = await this.getCommit(lastCommitReference.sha);

        return commit;
    }
}