import * as Utils from "../utils";
import * as _ from "lodash";
import { IViewManager } from "./../ui/IViewManager";
import { ProgressPromise } from "../progressPromise";
import { IObjectStorage } from "../persistence/IObjectStorage";
import { IEventManager } from "../events/IEventManager";
import { LruCache } from "../caching/lruCache";
import { IPermalinkService } from '../permalinks/IPermalinkService';
import { IObjectStorageMiddleware } from './IObjectStorageMiddleware';


export class OfflineObjectStorage implements IObjectStorage {
    private underlyingStorage: IObjectStorage;      //for storage
    private readonly localStorage: Storage;  //for changes
    private readonly lruCache: LruCache<any>; //lru cache for getting objects
    private readonly stateObject: Object;
    private deletedObjects: Object;
    private changesObject: Object;

    private middlewares: IObjectStorageMiddleware[];

    public isOnline: boolean;

    constructor() {
        this.stateObject = {};
        this.changesObject = {};

        this.localStorage = window.sessionStorage;
        this.underlyingStorage = null;

        this.lruCache = new LruCache<any>(10000);
        this.isOnline = true;

        document["stateObject"] = this.stateObject;
        document["changesObject"] = this.changesObject;

        this.middlewares = [];
    }

    public registerUnderlyingStorage(underlyingStorage: IObjectStorage): void {
        this.underlyingStorage = underlyingStorage;
    }

    public registerMiddleware(middleware: IObjectStorageMiddleware): void {
        this.middlewares.push(middleware);
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

    private setStateObjectAt(key: string, source: Object): void {
        Utils.mergeDeepAt(key, this.stateObject, source);
    }

    private setChangesObjectAt(key: string, source: Object): void {
        Utils.cleanupObject(source);

        Utils.mergeDeepAt(key, this.changesObject, source);
    }

    public async addObject(key: string, dataObject: Object): Promise<void> {
        if (!key) {
            throw new Error("Could not add object: Key is undefined.");
        }

        this.setChangesObjectAt(key, dataObject);
        this.setStateObjectAt(key, dataObject);
    }

    public async updateObject<T>(key: string, dataObject: T): Promise<void> {
        if (!key) {
            throw new Error("Could not update object: Key is undefined.");
        }

        // const promises = this.middlewares.map(x => x.applyChanges(key, dataObject));

        // await Promise.all(promises);

        this.setChangesObjectAt(key, dataObject);
        this.setStateObjectAt(key, dataObject);
    }

    public async getObject<T>(key: string): Promise<T> {
        if (!key) {
            throw new Error("Path is undefined.");
        }

        const cachedItem = Utils.getObjectAt<T>(key, this.stateObject);

        if (cachedItem) {
            return Promise.resolve<T>(cachedItem);
        }

        if (!this.isOnline) {
            throw "No internet connection";
        }

        let result = await this.underlyingStorage.getObject<T>(key);

        if (result) {
            this.setStateObjectAt(key, result);
        }

        return result;
    }

    public async deleteObject(key: string): Promise<void> {
        Utils.setValue(key, this.changesObject, null);
        Utils.setValue(key, this.stateObject, null);
    }

    public async searchObjects<T>(path: string, propertyNames?: Array<string>, searchValue?: string, startAtSearch?: boolean): Promise<Array<T>> {
        let resultObject = {};
        let keys = [];

        Object.keys(this.stateObject).map(key => {
            let firstLevelObject = this.stateObject[key];

            Object.keys(firstLevelObject).forEach(subkey => {
                let fullKey = `${key}/${subkey}`;

                if (fullKey.startsWith(path)) {
                    keys.push(fullKey);
                }
            });
        })

        keys.forEach(key => {
            const matchedObj = Utils.getObjectAt(key, this.stateObject);

            if (propertyNames && propertyNames.length && searchValue) {
                let searchProps = this.convertToSearchParam(propertyNames, searchValue);
                let searchProperty = this.searchPropertyInObject(searchProps, startAtSearch, matchedObj);

                if (searchProperty) {
                    resultObject[matchedObj["key"]] = matchedObj;
                }
            }
            else {
                // if (path === "navigationItems" && key === "navigationItems") {
                //     resultObject[matchedObj["key"]] = matchedObj;
                // }
                // else {
                    if (matchedObj) {
                        const searchId = matchedObj["key"];

                        if (searchId && key.endsWith(searchId)) {
                            resultObject[matchedObj["key"]] = matchedObj;
                        }
                    }
                //}
            }
        });

        if (this.isOnline) {
            let objects = await this.underlyingStorage.searchObjects<T>(path, propertyNames, searchValue, startAtSearch);

            objects.forEach(item => {
                let key;

                if (path === "navigationItems") {
                    key = path;
                }
                else {
                    key = item["key"];

                    if (path === "layouts") {
                        key = `layouts/${key}`
                    }
                }
                this.setStateObjectAt(key, item);

                resultObject[item["key"]] = item;
            });
        }

        return Object.keys(resultObject).map(x => resultObject[x]);
    }

    public async saveChanges(): Promise<void> {
        if (!this.isOnline) {
            throw "No internet connection";
        }

        console.log("Saving changes...");

        await this.underlyingStorage.saveChanges(this.changesObject);
        
        this.changesObject = {};

        console.log("Saved.");
    }
}
