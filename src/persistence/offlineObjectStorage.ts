import * as Utils from "../utils";
import * as _ from "lodash";
import { IObjectStorage } from "../persistence/IObjectStorage";
import { LruCache } from "../caching/lruCache";
import { IObjectStorageMiddleware } from "./IObjectStorageMiddleware";


export class OfflineObjectStorage implements IObjectStorage {
    private underlyingStorage: IObjectStorage;      // for storage
    private readonly stateObject: Object;
    private changesObject: Object;

    private middlewares: IObjectStorageMiddleware[];

    public isOnline: boolean;

    constructor() {
        this.stateObject = {};
        this.changesObject = {};
        this.underlyingStorage = null;
        this.isOnline = true;
        this.middlewares = [];
    }

    public registerUnderlyingStorage(underlyingStorage: IObjectStorage): void {
        this.underlyingStorage = underlyingStorage;
    }

    public registerMiddleware(middleware: IObjectStorageMiddleware): void {
        this.middlewares.push(middleware);
    }

    private convertToSearchParam(propertyNames: string[], searchValue: string): Object[] {
        return propertyNames.map(name => {
            const prop = {};
            prop[name] = searchValue;
            return prop;
        });
    }

    private searchPropertyInObject(searchProps: {}[], startAtSearch: boolean, matchedObj: any) {
        return _.find(searchProps, (prop) => {
            if (startAtSearch) {
                const propName = _.keys(prop)[0];
                const test = matchedObj[propName];

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

        const result = await this.underlyingStorage.getObject<T>(key);

        if (result) {
            this.setStateObjectAt(key, result);
        }

        return result;
    }

    public async deleteObject(key: string): Promise<void> {
        Utils.setValue(key, this.changesObject, null);
        Utils.setValue(key, this.stateObject, null);
    }

    public async searchObjects<T>(path: string, propertyNames?: string[], searchValue?: string, startAtSearch?: boolean): Promise<T[]> {
        const resultObject = {};
        const keys = [];

        Object.keys(this.stateObject).map(key => {
            const firstLevelObject = this.stateObject[key];

            Object.keys(firstLevelObject).forEach(subkey => {
                const fullKey = `${key}/${subkey}`;

                if (fullKey.startsWith(path)) {
                    keys.push(fullKey);
                }
            });
        });

        keys.forEach(key => {
            const matchedObj = Utils.getObjectAt(key, this.stateObject);

            if (propertyNames && propertyNames.length && searchValue) {
                const searchProps = this.convertToSearchParam(propertyNames, searchValue);
                const searchProperty = this.searchPropertyInObject(searchProps, startAtSearch, matchedObj);

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
                // }
            }
        });

        if (this.isOnline) {
            const objects = await this.underlyingStorage.searchObjects<T>(path, propertyNames, searchValue, startAtSearch);

            objects.forEach(item => {
                let key;

                if (path === "navigationItems") {
                    key = path;
                }
                else {
                    key = item["key"];

                    if (path === "layouts") {
                        key = `layouts/${key}`;
                    }
                }
                this.setStateObjectAt(key, item);

                resultObject[item["key"]] = item;
            });
        }

        return Object.keys(resultObject).map(x => resultObject[x]);
    }

    public async saveChanges(): Promise<void> {
        console.log("Saving changes...");

        await this.underlyingStorage.saveChanges(this.changesObject);

        this.changesObject = {};

        console.log("Saved.");
    }
}
