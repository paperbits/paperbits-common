import { IViewManager } from "./../ui/IViewManager";
import { ProgressPromise } from "../core/progressPromise";
import { IObjectStorage } from "../persistence/IObjectStorage";
import { IEventManager } from "../events/IEventManager";
import { LruCache } from "../caching/lruCache";
import * as _ from "lodash";

const ActionProperty = "action";
const ActionAdd = "add";
const ActionUpdate = "update";

export class OfflineObjectStorage implements IObjectStorage {
    private readonly underlyingStorage: IObjectStorage;      //for storage
    private readonly localStorage: Storage;  //for changes
    private readonly lruCache: LruCache<any>; //lru cache for getting objects
    private deletedObjects: Object;
    
    public isOnline: boolean;

    constructor(underlyingStorage: IObjectStorage) {
        this.localStorage = window.sessionStorage;
        this.underlyingStorage = underlyingStorage;

        this.lruCache = new LruCache<any>(10000);
        this.isOnline = true;
    }

    private getItemFromCache(path: string): any {
        let changedItem = this.localStorage.getItem(path);

        if (changedItem) {
            return JSON.parse(changedItem);
        }

        let cachedItem = this.lruCache.getItem(path);

        if (cachedItem) {
            return cachedItem;
        }
    }

    public async addObject(key: string, dataObject: Object): Promise<void> {
        if (!key) {
            throw new Error("Could not add object: Key is undefined.");
        }

        if (key.startsWith("uploads/")) {
            this.underlyingStorage.addObject(key, dataObject);
        }
        else {
            dataObject[ActionProperty] = ActionAdd;
            this.localStorage.setItem(key, JSON.stringify(dataObject));
        }
    }

    public async updateObject<T>(key: string, dataObject: T): Promise<void> {
        if (!key) {
            throw new Error("Could not update object: Key is undefined.");
        }

        let cachedItem = this.getItemFromCache(key);

        if (cachedItem) {
            if (_.has(cachedItem, ActionProperty)) {
                dataObject[ActionProperty] = cachedItem[ActionProperty];
                dataObject = _.extend(cachedItem, dataObject);
            }
            else {
                dataObject[ActionProperty] = ActionUpdate;
            }
        }
        else {
            dataObject[ActionProperty] = ActionUpdate;
        }

        this.localStorage.setItem(key, JSON.stringify(dataObject));
        this.lruCache.removeItem(key);
    }

    public async getObject<T>(key: string): Promise<T> {
        if (!key) {
            throw new Error("Path is undefined.");
        }

        let cachedItem = this.getItemFromCache(key);

        if (cachedItem) {
            return Promise.resolve<T>(cachedItem);
        }

        if (!this.isOnline) {
            throw "No internet connection";
        }

        let result = await this.underlyingStorage.getObject<T>(key);

        this.lruCache.setItem(key, result);

        return result;
    }

    public async deleteObject(key: string): Promise<void> {
        let cachedItem = this.getItemFromCache(key);

        if (cachedItem && cachedItem[ActionProperty] === ActionAdd) {
            this.localStorage.removeItem(key);
            this.lruCache.removeItem(key);

            return;
        }

        if (!this.isOnline) {
            this.localStorage.removeItem(key);
            this.lruCache.removeItem(key);
            this.deletedObjects[key] = key;
        }
        else {
            await this.underlyingStorage.deleteObject(key);

            this.localStorage.removeItem(key);
            this.lruCache.removeItem(key);
        }
    }

    private getSearchId(item): string {
        if (_.has(item, "key")) {
            return item.key;
        }
        if (_.has(item, "contentId")) {
            return item.contentId;
        }
        if (_.has(item, "permalinkId")) {
            return item.permalinkId;
        }
        return undefined;
    }

    private convertToSearchParam(propertyNames: Array<string>, searchValue: string): Object[] {
        return propertyNames.map(name => {
            let prop = {};
            prop[name] = searchValue;
            return prop;
        });
    }

    private searchPropertyInObject(searchProps: {}[], startAtSearch: boolean, matchedObj: any) {
        return _.find(searchProps, (prop) => {
            if (startAtSearch) {
                let propName = _.keys(prop)[0];
                let test = matchedObj[propName];

                return test && test.toUpperCase().startsWith(prop[propName].toUpperCase());
            }
            else {
                return _.isMatch(matchedObj, prop);
            }
        });
    }

    private mergeResultWithCache<T>(result: Array<T>, path: string, propertyNames?: Array<string>, searchValue?: string, startAtSearch?: boolean): Array<T> {
        let resultIsNotEmpty = result && result.length;
        if (propertyNames && propertyNames.length && searchValue) {
            let searchProps = this.convertToSearchParam(propertyNames, searchValue);
            if (resultIsNotEmpty && startAtSearch) {
                let filteredResult = [];
                result.forEach(item => {
                    let searchProperty = this.searchPropertyInObject(searchProps, true, item);
                    if (searchProperty) {
                        filteredResult.push(item);
                    }
                });

                result = filteredResult;
            }

            //items in local storage created or updated
            //merge search result from storage and from cached
            Object.keys(this.localStorage).forEach(key => {
                if (key.startsWith(path)) {
                    let matchedObj = JSON.parse(this.localStorage.getItem(key));
                    let searchProperty = this.searchPropertyInObject(searchProps, startAtSearch, matchedObj);

                    if (searchProperty) {
                        delete matchedObj[ActionProperty];

                        if (resultIsNotEmpty) {
                            let itemInResult = _.find(result, (item, index) => {
                                let searchId = this.getSearchId(item);

                                if (searchId && key.endsWith(searchId)) {
                                    result[index] = matchedObj;
                                    return true;
                                }
                            });

                            if (!itemInResult) {
                                result.push(matchedObj);
                                this.lruCache.removeItem(key);
                            }
                        } else {
                            result.push(matchedObj);
                            this.lruCache.removeItem(key);
                        }
                    }
                }
            });
        } else {
            //items in local storage created or updated
            //merge search result from storage and from cached
            Object.keys(this.localStorage).forEach(key => {
                if (key.startsWith(path)) {
                    let matchedObj = JSON.parse(this.localStorage.getItem(key));
                    delete matchedObj[ActionProperty];

                    if (resultIsNotEmpty) {
                        let itemInResult = _.find(result, (item, index) => {
                            let searchId = this.getSearchId(item);

                            if (searchId && key.endsWith(searchId)) {
                                result[index] = matchedObj;
                                return true;
                            }
                        });
                        if (!itemInResult) {
                            result.push(matchedObj);
                            this.lruCache.removeItem(key);
                        }
                    } else {
                        result.push(matchedObj);
                        this.lruCache.removeItem(key);
                    }
                }
            });
        }
        return result;
    }

    public async searchObjects<T>(path: string, propertyNames?: Array<string>, searchValue?: string, startAtSearch?: boolean): Promise<Array<T>> {
        let result;

        if (this.isOnline) {
            result = await this.underlyingStorage.searchObjects<T>(path, propertyNames, searchValue, startAtSearch);

            result.forEach(item => {
                let key;

                if (path === "navigationItems") {
                    key = path;
                }
                else {
                    key = this.getSearchId(item);

                    if (path === "layouts") {
                        key = `layouts/${key}`
                    }
                }
                this.lruCache.setItem(key, item);
            });
        }
        else {
            // if offLine then search items in lruCache
            result = [];
            let keys = this.lruCache.getKeys();

            keys.forEach(key => {
                if (key.startsWith(path)) {
                    let matchedObj = this.lruCache.getItem(key);

                    if (propertyNames && propertyNames.length && searchValue) {
                        let searchProps = this.convertToSearchParam(propertyNames, searchValue);
                        let searchProperty = this.searchPropertyInObject(searchProps, startAtSearch, matchedObj);

                        if (searchProperty) {
                            result.push(matchedObj);
                        }
                    }
                    else {
                        if (path === "navigationItems" && key === "navigationItems") {
                            result.push(matchedObj);
                        }
                        else {
                            let searchId = this.getSearchId(matchedObj);

                            if (searchId && key.endsWith(searchId)) {
                                result.push(matchedObj);
                            }
                        }
                    }
                }
            });
        }

        return this.mergeResultWithCache<T>(result, path, propertyNames, searchValue, startAtSearch);
    }

    public async saveChanges(): Promise<void> {
        if (!this.isOnline) {
            throw "No internet connection";
        }

        console.log("Saving changes...");

        let saveTasks = [];

        Object.keys(this.localStorage).forEach(localStorageObjectKey => {
            let localStorageObjectValue = this.localStorage.getItem(localStorageObjectKey);

            if (localStorageObjectValue) {
                let obj = JSON.parse(localStorageObjectValue);

                if (_.has(obj, ActionProperty)) {
                    let isAddAction = obj[ActionProperty] === ActionAdd;

                    delete obj[ActionProperty];

                    if (isAddAction) {
                        saveTasks.push(this.underlyingStorage.addObject(localStorageObjectKey, obj));
                    }
                    else {
                        saveTasks.push(this.underlyingStorage.updateObject(localStorageObjectKey, obj));
                    }
                    this.localStorage.removeItem(localStorageObjectKey);
                    this.lruCache.setItem(localStorageObjectKey, obj);
                }
            }
        });

        await Promise.all(saveTasks);
    }
}