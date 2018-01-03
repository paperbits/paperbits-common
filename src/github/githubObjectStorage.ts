// import { IBag } from '../IBag';
// import { ILocalCache } from '../caching/ILocalCache';
// import { IGithubClient } from '../github/IGithubClient';
// import { IFileReference } from '../github/IFileReference';
// import { IGithubFile } from '../github/IGithubFile';
// import { IGithubCommit } from '../github/IGithubCommit';
// import { IGithubReference } from '../github/IGithubReference';
// import { IGithubTreeItem } from '../github/IGithubTreeItem';
// import { IObjectStorage } from '../persistence/IObjectStorage';
// import { IGithubCreateTreeResponse } from '../github/IGithubCreateTreeResponse';
// import { IGithubCreateBlobReponse } from '../github/IGithubCreateBlobReponse';
// import * as _ from 'lodash';
// import * as moment from 'moment';


// export class GithubObjectStorage implements IObjectStorage {
//     private readonly localCache: ILocalCache;
//     private readonly githubClient: IGithubClient;
//     private readonly indexFileName: string;

//     public index: IBag<IFileReference>;

//     constructor(localCache: ILocalCache, githubClient: IGithubClient) {
//         this.localCache = localCache;
//         this.githubClient = githubClient;

//         //rebinding...
//         this.saveChanges = this.saveChanges.bind(this);

//         this.index = {};
//         this.indexFileName = githubClient.repositoryName;
//     }

//     private getIndex(): Promise<IBag<IFileReference>> {
//         if (!this.index[this.indexFileName]) {
//             let indexFileContent = this.localCache.getItem<string>(this.indexFileName);

//             if (indexFileContent) {
//                 this.index = JSON.parse(indexFileContent);

//                 return Promise.resolve(this.index);
//             }

//             // return this.githubClient.getFileContent(this.indexFileName).then((file: IGithubFile) => {
//             //     let decodedContent = atob(file.content);
//             //     this.index = JSON.parse(decodedContent);
//             //     this.saveIndex();

//             //     return this.index;
//             // });

//             return null;
//         }
//         else {
//             return Promise.resolve(this.index);
//         }
//     }

//     private saveIndex(): void {
//         this.localCache.setItem(this.indexFileName, JSON.stringify(this.index));
//     }

//     public async saveChanges(): Promise<void> {
//         let keys = this.localCache.getKeys();

//         if (!keys || !keys.length) {
//             return;
//         }

//         let lastCommit = await this.githubClient.getLatestCommit();
//         let newTree = await this.createChangesTree();
//         let tree = await this.githubClient.createTree(null, newTree);
//         let message = `commit: ${moment().format("MM/DD/YYYY, hh:mm:ss")}`;
//         let newCommit = await this.githubClient.createCommit(lastCommit.sha, tree.sha, message);
//         let head = await this.githubClient.updateReference("master", newCommit.sha);

//         console.info("Pushed!");

//         this.saveIndex();
//     }

//     private async createChangesTree(): Promise<Array<IGithubTreeItem>> {
//         let newTree = new Array<IGithubTreeItem>();
//         let createBlobTasks = new Array<Promise<any>>();
//         let keys = Object.keys(this.index);
//         let needToUpdateIndex = false;

//         keys.forEach((key: string) => {
//             let record = this.index[key];

//             if (record.path != this.indexFileName) {
//                 let newTreeItem: IGithubTreeItem = {
//                     path: record.path
//                 };

//                 newTree.push(newTreeItem);

//                 let fileAddedOrUpdated = !record.metadata["sha"] && record.path != this.indexFileName;

//                 if (fileAddedOrUpdated) {
//                     console.info("Uploading " + record.path);
//                     let content = this.localCache.getItem<string>(record.path);

//                     if (!content || content.length == 0) {
//                         throw "Empty content!";
//                     }

//                     let createBlobTask = this.githubClient.createBlobFromString(content);

//                     createBlobTask.then((response: IGithubCreateBlobReponse) => {
//                         newTreeItem.sha = response.sha;
//                         record.metadata["sha"] = response.sha;
//                         needToUpdateIndex = true;
//                     });

//                     createBlobTasks.push(createBlobTask);
//                 }
//                 else {
//                     newTreeItem.sha = record.metadata["sha"];
//                 }
//             }
//         });

//         await Promise.all(createBlobTasks);

//         if (needToUpdateIndex) {
//             console.info("Uploading index file.");
//             let response = await this.githubClient.createBlobFromString(JSON.stringify(this.index));

//             let sha = response.sha;

//             let newTreeItem: IGithubTreeItem = {
//                 path: this.indexFileName,
//                 sha: sha
//             };

//             newTree.push(newTreeItem);

//             return newTree;
//         }
//         else {
//             return newTree;
//         }
//     }

//     // addObject<T>(path:string, content:T, metadata:Paperbits.IBag<string>) {
//     //     this.localCache.setItem(path, content);
//     //
//     //     this.index[path] = {
//     //         path: path,
//     //         metadata: metadata
//     //     };
//     //     this.saveIndex();
//     // }

//     public addObject(path: string, dataObject: any): Promise<void> {
//         return undefined;
//     }

//     public searchObjects<T>(path: string, propertyNames?: Array<string>, searchValue?: string, startAtSearch?: boolean, loadObject = true): Promise<Array<T>> {
//         return undefined;
//     }

//     public searchObjectsByMetadata(path: string, metadataKey: Array<string>, metadataValue: string, exactSearch: boolean): Promise<Array<IFileReference>> {
//         return this.getIndex().then((index: IBag<IFileReference>) => {
//             let result = new Array<IFileReference>();

//             for (var key in index) {
//                 let record = index[key];

//                 if (!record.path.startsWith(path))
//                     continue;

//                 if (exactSearch) {
//                     if (metadataKey.any(tag => record.metadata[tag] == metadataValue)) {
//                         result.push(record);
//                     }
//                 }
//                 else {
//                     if (metadataKey.any(tag => record.metadata[tag].contains(metadataValue))) {
//                         result.push(record);
//                     }
//                 }
//             }

//             return result;
//         });
//     }

//     public getObject<T>(path: string): Promise<T> {
//         let cachedFile = this.localCache.getItem<T>(path);

//         if (cachedFile) {
//             return Promise.resolve(cachedFile);
//         }

//         // return this.githubClient.getFileContent(path).then((file: IGithubFile) => {
//         //     let decodedContent = JSON.parse(atob(file.content));
//         //     this.localCache.setItem(path, decodedContent);
//         //     return decodedContent;
//         // });

//         return null;
//     }

//     public updateObject<T>(path: string, dataObject: T): Promise<T> {
//         let original = this.localCache.getItem(path);

//         if (!_.isEqual(original, dataObject)) {
//             this.localCache.setItem(path, dataObject);

//             let reference: IFileReference = this.index[path];

//             reference.metadata["sha"] = null; //means that we need a new blob
//         }

//         return Promise.resolve(dataObject);
//     }

//     // updateObject<T>(path:string, content:T) {
//     //     let original = this.localCache.getItem(path);
//     //
//     //     if (!_.isEqual(original, content)) {
//     //         this.localCache.setItem(path, content);
//     //
//     //         let reference: IFileReference = this.index[path];
//     //
//     //         reference.metadata["sha"] = null; //means that we need a new blob
//     //     }
//     // }

//     public updateObjectsMetadata(path: string, metadata: IBag<string>) {
//         let reference: IFileReference = this.index[path];
//         $.extend(reference.metadata, metadata);
//     }

//     public deleteObject(path: string): Promise<void> {
//         delete this.index[path];

//         this.localCache.removeItem(path); // track deleting to propagate to github

//         return Promise.resolve();
//     }
// }