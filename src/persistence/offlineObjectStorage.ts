import * as Objects from "../objects";
import * as _ from "lodash";
import { IObjectStorage, Query, Operator, OrderDirection, Page } from "../persistence";
import { IObjectStorageMiddleware } from "./IObjectStorageMiddleware";
import { EventManager } from "../events";
import { ILocalCache } from "../caching";

interface HistoryRecord {
    do: () => void;
    undo: () => void;
}

interface LocalSearchResults<T> {
    value: T;
    totalCount: number;
}

export class OfflineObjectStorage implements IObjectStorage {
    private remoteObjectStorage: IObjectStorage;
    private initializePromise: Promise<void>;
    private readonly changesObject: Object;
    private readonly past: HistoryRecord[];
    private readonly future: HistoryRecord[];
    private readonly middlewares: IObjectStorageMiddleware[];
    private readonly changesObjectCacheKey: string = "changesObject";
    private readonly stateObjectCacheKey: string = "stateObject";

    public isOnline: boolean;
    public autosave: boolean;

    constructor(
        private readonly stateCache: ILocalCache,
        private readonly changesCache: ILocalCache,
        private readonly eventManager?: EventManager,
    ) {
        this.changesObject = {};
        this.remoteObjectStorage = null;
        this.isOnline = true;
        this.autosave = false;
        this.middlewares = [];
        this.past = [];
        this.future = [];

        if (eventManager) {
            this.eventManager.addEventListener("onUndo", () => this.undo());
            this.eventManager.addEventListener("onRedo", () => this.redo());
        }
    }

    private initialize(): Promise<void> {
        if (this.initializePromise) {
            return this.initializePromise;
        }

        this.initializePromise = new Promise<void>(async (resolve) => {
            const cachedChangesObject = await this.changesCache.getItem<Object>(this.changesObjectCacheKey);

            if (cachedChangesObject) {
                Object.assign(this.changesObject, cachedChangesObject);
            }

            const cachedStateObject = await this.changesCache.getItem<Object>(this.stateObjectCacheKey) || {};

            if (cachedStateObject) {
                await this.stateCache.setItem(this.stateObjectCacheKey, cachedStateObject);
            }

            resolve();
        });

        return this.initializePromise;
    }

    public canUndo(): boolean {
        return this.past.length > 0;
    }

    public canRedo(): boolean {
        return this.future.length > 0;
    }

    public setRemoteObjectStorage(underlyingStorage: IObjectStorage): void {
        this.remoteObjectStorage = underlyingStorage;
    }

    public registerMiddleware(middleware: IObjectStorageMiddleware): void {
        this.middlewares.push(middleware);
    }

    public async addObject(path: string, dataObject: Object): Promise<void> {
        if (!path) {
            throw new Error("Could not add object: Key is undefined.");
        }

        await this.initialize();

        const dataObjectClone = Objects.clone(dataObject); // To drop any object references

        let compensationOfState;
        let compensationOfChanges;

        const doCommand = async (): Promise<void> => {
            const stateObject = await this.stateCache.getItem<object>(this.stateObjectCacheKey);

            /* Writing state */
            compensationOfState = Objects.setValueWithCompensation(path, stateObject, dataObjectClone);

            /* Writng changes */
            compensationOfChanges = Objects.setValueWithCompensation(path, this.changesObject, dataObjectClone);

            Objects.cleanupObject(stateObject, true);
            Objects.cleanupObject(this.changesObject, true);

            await this.changesCache.setItem(this.changesObjectCacheKey, this.changesObject);
            await this.stateCache.setItem(this.stateObjectCacheKey, stateObject);
        };

        const undoCommand = async (): Promise<void> => {
            const stateObject = await this.stateCache.getItem<object>(this.stateObjectCacheKey);

            /* Undoing state */
            Objects.setValueWithCompensation(path, stateObject, compensationOfState);

            /* Undoing changes */
            Objects.setValueWithCompensation(path, this.changesObject, compensationOfChanges);

            Objects.cleanupObject(stateObject, true);
            Objects.cleanupObject(this.changesObject, true);

            await this.changesCache.setItem(this.changesObjectCacheKey, this.changesObject);
            await this.stateCache.setItem(this.stateObjectCacheKey, stateObject);
        };

        await this.do(doCommand, undoCommand);
    }

    public async patchObject<T>(path: string, dataObject: T): Promise<void> {
        throw new Error("Not implemented");
    }

    public async updateObject<T>(path: string, dataObject: T): Promise<void> {
        if (!path) {
            throw new Error(`Parameter "path" not specified.`);
        }

        if (dataObject === undefined) { // Note: "null" is acceptable.
            throw new Error(`Parameter "dataObject" not specified.`);
        }

        await this.initialize();

        const dataObjectClone1 = Objects.clone(dataObject); // To drop any object references
        const dataObjectClone2 = Objects.clone(dataObject); // To drop any object references

        let compensationOfState;
        let compensationOfChanges;

        const doCommand = async (): Promise<void> => {
            const stateObject = await this.stateCache.getItem<object>(this.stateObjectCacheKey);

            /* Writing state */
            compensationOfState = Objects.setValueWithCompensation(path, stateObject, dataObjectClone1);

            /* Writng changes */
            compensationOfChanges = Objects.setValueWithCompensation(path, this.changesObject, dataObjectClone2);

            Objects.cleanupObject(stateObject, true);
            Objects.cleanupObject(this.changesObject);

            await this.changesCache.setItem(this.changesObjectCacheKey, this.changesObject);
            await this.stateCache.setItem(this.stateObjectCacheKey, stateObject);
        };

        const undoCommand = async (): Promise<void> => {
            const stateObject = await this.stateCache.getItem<object>(this.stateObjectCacheKey);

            /* Undoing state */
            Objects.setValueWithCompensation(path, stateObject, compensationOfState);

            /* Undoing changes */
            Objects.setValueWithCompensation(path, this.changesObject, compensationOfChanges);

            Objects.cleanupObject(stateObject, true);
            Objects.cleanupObject(this.changesObject);

            await this.changesCache.setItem(this.changesObjectCacheKey, this.changesObject);
            await this.stateCache.setItem(this.stateObjectCacheKey, stateObject);
        };

        await this.do(doCommand, undoCommand);
    }

    public async getObject<T>(path: string): Promise<T> {
        if (!path) {
            throw new Error(`Parameter "path" not specified.`);
        }

        await this.initialize();

        /* 1. Check locally changed object */
        const locallyChangedObject = Objects.getObjectAt<T>(path, this.changesObject);

        // If there is one, return it now.
        if (!!locallyChangedObject) {
            return Objects.clone(locallyChangedObject); // Cloning to loose references.
        }

        /* 2. Check if object marked as deleted. */
        if (locallyChangedObject === null) {
            /*
               Note: "null" (not undefined) in changesObject specifically means that this object
               has been deleted locally (but not yet saved to underlying storage). Hence, no need to check
               neither local nor underlying storage.
            */
            return undefined;
        }

        /* 3. Check if object exists locally. If yes, return it (without querying remote). */
        const stateCacheKey = `${this.stateObjectCacheKey}/${path}`;
        let locallyCachedObject = await this.stateCache.getItem<object>(stateCacheKey);

        if (locallyCachedObject) {
            return Objects.clone(locallyCachedObject); // Cloning to loose references.
        }

        /* 4. If no loally changed of cached object, query remote. If returned, cache locally. */
        const remoteObjectStorageResult = await this.remoteObjectStorage.getObject<T>(path);

        if (!!remoteObjectStorageResult) { // Adding to local cache.
            locallyCachedObject = Objects.clone(remoteObjectStorageResult);
            await this.stateCache.setItem(stateCacheKey, locallyCachedObject);
        }

        return remoteObjectStorageResult;
    }

    public async deleteObject(path: string): Promise<void> {
        if (!path) {
            throw new Error(`Parameter "path" not specified.`);
        }

        await this.initialize();

        let compensationOfState;
        let compensationOfChanges;

        const doCommand = async (): Promise<void> => {
            const stateObject = await this.stateCache.getItem<object>(this.stateObjectCacheKey);

            /* Writing state */
            compensationOfState = Objects.setValueWithCompensation(path, stateObject, null);

            /* Writng changes */
            compensationOfChanges = Objects.setValueWithCompensation(path, this.changesObject, null);

            Objects.cleanupObject(stateObject, true);
            Objects.cleanupObject(this.changesObject);

            await this.changesCache.setItem(this.changesObjectCacheKey, this.changesObject);
            await this.stateCache.setItem(this.stateObjectCacheKey, stateObject);
        };

        const undoCommand = async (): Promise<void> => {
            const stateObject = await this.stateCache.getItem<object>(this.stateObjectCacheKey);

            /* Undoing state */
            Objects.setValueWithCompensation(path, stateObject, compensationOfState);

            /* Undoinf changes */
            Objects.setValueWithCompensation(path, this.changesObject, compensationOfChanges);

            Objects.cleanupObject(stateObject, true);
            Objects.cleanupObject(this.changesObject);

            await this.changesCache.setItem(this.changesObjectCacheKey, this.changesObject);
            await this.stateCache.setItem(this.stateObjectCacheKey, stateObject);
        };

        await this.do(doCommand, undoCommand);
    }

    private do(doCommand: () => void, undoCommand: () => void): void {
        const record = { do: doCommand, undo: undoCommand };
        record.do();

        this.past.push(record);

        if (this.past.length > 10) {
            this.past.shift();
        }

        if (this.autosave) {
            this.saveChanges();
        }

        if (this.eventManager) {
            this.eventManager.dispatchEvent("onDataChange");
        }
    }

    public undo(): void {
        if (!this.canUndo()) {
            return;
        }

        const record = this.past.pop();
        record.undo();
        this.future.push(record);

        if (this.autosave) {
            this.saveChanges();
        }

        if (this.eventManager) {
            this.eventManager.dispatchEvent("onDataPush");
            this.eventManager.dispatchEvent("onDataChange");
        }
    }

    public redo(): void {
        if (!this.canRedo()) {
            return;
        }

        const record = this.future.pop();
        record.do();
        this.past.push(record);

        if (this.eventManager) {
            this.eventManager.dispatchEvent("onDataPush");
            this.eventManager.dispatchEvent("onDataChange");
        }
    }

    private async searchLocalChanges<T>(path: string, query?: Query<T>): Promise<LocalSearchResults<T[]>> {
        const searchObj = Objects.getObjectAt(path, Objects.clone(this.changesObject));

        if (!searchObj) {
            return { value: [], totalCount: 0 };
        }

        let collection = Object.values(searchObj).filter(x => !!x); // skip deleted objects

        if (query) {
            if (query.filters.length > 0) {
                collection = collection.filter(x => {
                    let meetsCriteria = true;

                    for (const filter of query.filters) {
                        let left = Objects.getObjectAt<any>(filter.left, x);
                        let right = filter.right;

                        if (!!right && left === undefined) {
                            meetsCriteria = false;
                            continue;
                        }

                        if (typeof filter.right === "boolean") {
                            if (filter.operator !== Operator.equals) {
                                console.warn("Boolean query operator can be only equals");
                                meetsCriteria = false;
                                return;
                            }

                            if (((left === undefined || left === false) && filter.right === true) ||
                                ((filter.right === undefined || filter.right === false) && left === true)) {
                                meetsCriteria = false;
                            }
                            continue;
                        }

                        if (!left) {
                            meetsCriteria = false;
                            continue;
                        }

                        const operator = filter.operator;

                        if (typeof left === "string") {
                            left = left.toUpperCase();
                        }

                        if (typeof right === "string") {
                            right = right.toUpperCase();
                        }

                        switch (operator) {
                            case Operator.notEmpty:
                                if (typeof left === "string") {
                                    meetsCriteria = !left;
                                    break;
                                }
                                if (Array.isArray(left)) {
                                    meetsCriteria = left.length > 0;
                                }
                                break;
                            case Operator.contains:
                                if (Array.isArray(left) && Array.isArray(right)) {
                                    meetsCriteria = right.filter(value => left.includes(value))?.length > 0;
                                    break;
                                }

                                if (left && !left.includes(right)) {
                                    meetsCriteria = false;
                                }
                                break;

                            case Operator.equals:
                                if (left !== right) {
                                    meetsCriteria = false;
                                }
                                break;

                            default:
                                throw new Error("Cannot translate operator into Firebase Realtime Database query.");
                        }
                    }

                    return meetsCriteria;
                });
            }

            if (query.orderingBy) {
                const property = query.orderingBy;

                collection = collection.sort((x, y) => {
                    const a = Objects.getObjectAt<any>(property, x);
                    const b = Objects.getObjectAt<any>(property, y);
                    const modifier = query.orderDirection === OrderDirection.accending ? 1 : -1;

                    if (a > b) {
                        return modifier;
                    }

                    if (a < b) {
                        return -modifier;
                    }

                    return 0;
                });
            }
        }

        const totalObjectsMatchingCriteria = collection.length;

        return { value: collection, totalCount: totalObjectsMatchingCriteria };
    }

    private convertPage<T>(remotePage: Page<T>): Page<T> {
        const resultPage: Page<T> = {
            value: remotePage.value,
            takeNext: async (n?: number): Promise<Page<T>> => {
                const nextRemotePage = await remotePage.takeNext();
                return this.convertPage(nextRemotePage);
            }
        };

        if (!remotePage.takeNext) {
            resultPage.takeNext = null;
        }

        return resultPage;
    }

    public async searchObjects<T>(path: string, query: Query<T> = Query.from<T>()): Promise<Page<T>> {
        if (!path) {
            throw new Error(`Parameter "path" not specified.`);
        }

        await this.initialize();

        const resultPage: Page<T> = {
            value: [],
            takeNext: null
        };

        /* Find locally added/changed objects */
        const localSearchResults = await this.searchLocalChanges(path, query);
        const remoteQuery = query.copy();
        const pageOfRemoteSearchResults = await this.remoteObjectStorage.searchObjects<T>(path, remoteQuery);
        const remoteSearchResults = pageOfRemoteSearchResults.value;

        if (pageOfRemoteSearchResults.takeNext) {
            resultPage.takeNext = async (): Promise<Page<T>> => {
                const nextRemotePage = await pageOfRemoteSearchResults.takeNext();

                // TODO: Remove all deleted pages from results.

                return this.convertPage(nextRemotePage);
            };
        }

        /* Remove deleted objects from remote search resuls */
        const changesAt = Objects.getObjectAt(path, Objects.clone(this.changesObject));

        if (changesAt) {
            Object.keys(changesAt)
                .forEach(key => {
                    const index = remoteSearchResults.findIndex(x => x["key"] === `${path}/${key}`);

                    if (index >= 0 && changesAt[key] === null) {
                        remoteSearchResults.splice(index, 1);
                    }
                });
        }

        /* Merging local searh results with remote search results */
        const added = [];
        for (let i = 0; i < localSearchResults.value.length; i++) {
            const local = localSearchResults.value[i];
            const updateIndex = remoteSearchResults.findIndex(r => r["key"] === local["key"]);
            if (updateIndex !== -1) {
                remoteSearchResults[updateIndex] = local;
            } else {
                added.push(local);
            }
        }
        resultPage.value = added.concat(remoteSearchResults);

        return resultPage;
    }

    public async hasUnsavedChanges(): Promise<boolean> {
        await this.initialize();
        return Object.keys(this.changesObject).length > 0;
    }

    public async hasUnsavedChangesAt(key: string): Promise<boolean> {
        await this.initialize();
        return !!Objects.getObjectAt(key, this.changesObject);
    }

    public async discardChanges(): Promise<void> {
        const stateObject = await this.stateCache.getItem(this.stateObjectCacheKey);

        Object.keys(this.changesObject).forEach(key => delete this.changesObject[key]);
        Object.keys(stateObject).forEach(key => delete stateObject[key]);

        await this.stateCache.setItem(this.stateObjectCacheKey, stateObject);

        await this.changesCache.setItem(this.changesObjectCacheKey, this.changesObject);
    }

    public async saveChanges(): Promise<void> {
        const entities = Object.keys(this.changesObject);

        if (entities.length === 0) {
            return;
        }

        await this.remoteObjectStorage.saveChanges(this.changesObject);
        entities.forEach(key => delete this.changesObject[key]);

        await this.changesCache.setItem(this.changesObjectCacheKey, this.changesObject);

        this.eventManager.dispatchEvent("onDataChange");
    }

    public async loadData(): Promise<object> {
        if (this.remoteObjectStorage.loadData) {
            const loadedData = await this.remoteObjectStorage.loadData();

            if (loadedData) {
                await this.discardChanges();
                this.eventManager.dispatchEvent("onDataPush");
                this.eventManager.dispatchEvent("onDataChange");
            }
        }
        else {
            console.warn("current ObjectStorage does not implement loadData");
        }

        const data = await this.stateCache.getItem<object>(this.stateObjectCacheKey);

        return data;
    }
}
