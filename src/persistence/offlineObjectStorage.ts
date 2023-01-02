import * as Objects from "../objects";
import { IObjectStorage, Query, Operator, OrderDirection, Page } from "../persistence";
import { IObjectStorageMiddleware } from "./IObjectStorageMiddleware";
import { EventManager, Events } from "../events";
import { ILocalCache, CachingStrategy } from "../caching";

interface HistoryRecord {
    do: () => Promise<void>;
    undo: () => Promise<void>;
    stateDescription?: string;
}

const changesObjectCacheKey: string = "changesObject";
const stateObjectCacheKey: string = "stateObject";

export class OfflineObjectStorage implements IObjectStorage {
    private remoteObjectStorage: IObjectStorage;
    private readonly past: HistoryRecord[];
    private readonly future: HistoryRecord[];
    private readonly middlewares: IObjectStorageMiddleware[];

    public cachingStrategy: CachingStrategy;
    public autosave: boolean;

    constructor(
        private readonly stateCache: ILocalCache,
        private readonly changesCache: ILocalCache,
        private readonly eventManager?: EventManager,
    ) {
        this.remoteObjectStorage = null;
        this.cachingStrategy = CachingStrategy.NetworkFirst;
        this.autosave = false;
        this.middlewares = [];
        this.past = [];
        this.future = [];

        if (eventManager) {
            this.eventManager.addEventListener(Events.Undo, () => this.undo());
            this.eventManager.addEventListener(Events.Redo, () => this.redo());
        }
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

    public async addObject(path: string, dataObject: Object, changeDescription: string): Promise<void> {
        if (!path) {
            throw new Error("Could not add object: Key is undefined.");
        }

        const dataObjectClone = Objects.clone(dataObject); // To drop any object references

        let compensationOfState;
        let compensationOfChanges;

        const doCommand = async (): Promise<void> => {
            const stateObject = await this.stateCache.getItem<object>(stateObjectCacheKey) || {};
            const changesObject = await this.changesCache.getItem<object>(changesObjectCacheKey) || {};

            /* Writing state */
            compensationOfState = Objects.setValueWithCompensation(path, stateObject, dataObjectClone);

            /* Writng changes */
            compensationOfChanges = Objects.setValueWithCompensation(path, changesObject, dataObjectClone);

            Objects.cleanupObject(stateObject, { removeNulls: true });
            Objects.cleanupObject(changesObject);

            await this.stateCache.setItem(stateObjectCacheKey, stateObject);
            await this.changesCache.setItem(changesObjectCacheKey, changesObject);
        };

        const undoCommand = async (): Promise<void> => {
            const stateObject = await this.stateCache.getItem<object>(stateObjectCacheKey);
            const changesObject = await this.changesCache.getItem<object>(changesObjectCacheKey) || {};

            /* Undoing state */
            Objects.setValueWithCompensation(path, stateObject, compensationOfState);

            /* Undoing changes */
            Objects.setValueWithCompensation(path, changesObject, compensationOfChanges);

            Objects.cleanupObject(stateObject, { removeNulls: true });
            Objects.cleanupObject(changesObject);

            await this.changesCache.setItem(changesObjectCacheKey, changesObject);
            await this.stateCache.setItem(stateObjectCacheKey, stateObject);
        };

        await this.do(doCommand, undoCommand, changeDescription);
    }

    public patchObject<T>(path: string, dataObject: T): Promise<void> {
        throw new Error("Not implemented");
    }

    public async updateObject<T>(path: string, dataObject: T, changeDescription: string): Promise<void> {
        if (!path) {
            throw new Error(`Parameter "path" not specified.`);
        }

        if (dataObject === undefined) { // Note: "null" is acceptable, which means "delete".
            throw new Error(`Parameter "dataObject" not specified.`);
        }

        const dataObjectClone1 = Objects.clone(dataObject); // To drop any object references
        const dataObjectClone2 = Objects.clone(dataObject); // To drop any object references

        let compensationOfState;
        let compensationOfChanges;

        const doCommand = async (): Promise<void> => {
            const stateObject = await this.stateCache.getItem<object>(stateObjectCacheKey) || {};
            const changesObject = await this.changesCache.getItem<object>(changesObjectCacheKey) || {};

            /* Writing state */
            compensationOfState = Objects.setValueWithCompensation(path, stateObject, dataObjectClone1);

            /* Writng changes */
            compensationOfChanges = Objects.setValueWithCompensation(path, changesObject, dataObjectClone2);

            Objects.cleanupObject(stateObject, { removeNulls: true });
            Objects.cleanupObject(changesObject);

            await this.changesCache.setItem(changesObjectCacheKey, changesObject);
            await this.stateCache.setItem(stateObjectCacheKey, stateObject);
        };

        const undoCommand = async (): Promise<void> => {
            const stateObject = await this.stateCache.getItem<object>(stateObjectCacheKey);
            const changesObject = await this.changesCache.getItem<object>(changesObjectCacheKey) || {};

            /* Undoing state */
            Objects.setValueWithCompensation(path, stateObject, compensationOfState);

            /* Undoing changes */
            Objects.setValueWithCompensation(path, changesObject, compensationOfChanges);

            Objects.cleanupObject(stateObject, { removeNulls: true });
            Objects.cleanupObject(changesObject);

            await this.changesCache.setItem(changesObjectCacheKey, changesObject);
            await this.stateCache.setItem(stateObjectCacheKey, stateObject);
        };

        await this.do(doCommand, undoCommand, changeDescription);
    }

    public async getObject<T>(path: string): Promise<T> {
        if (!path) {
            throw new Error(`Parameter "path" not specified.`);
        }

        const stateCacheKey = `${stateObjectCacheKey}/${path}`;
        const stateObject = await this.stateCache.getItem<object>(stateCacheKey);

        const changesCacheKey = `${changesObjectCacheKey}/${path}`;
        const changesObject = await this.changesCache.getItem<object>(changesCacheKey);

        /* 1. Check if there is an object in CHANGES */
        // If there is one, return it right away from STATE (which might be slightly different from CHANGES).
        if (changesObject !== null && changesObject !== undefined) {
            return Objects.clone(stateObject); // Cloning to loose references.
        }

        /* 2. Check if object marked as deleted in CHANGES. */
        if (changesObject === null) {
            /*
               Note: "null" (not undefined) in changesObject specifically means that this object
               has been deleted locally (but not yet saved to underlying storage). Hence, no need to check
               neither local nor underlying storage.
            */
            return undefined;
        }

        /* 3. Check if object cached locally (STATE). If yes, return it (without querying REMOTE). */
        if (stateObject) {
            return Objects.clone(stateObject); // Cloning to loose references.
        }

        /* 4. If no locally changed (CHANGES) or cached (STATE) object, try querying REMOTE. If found, cache it locally. */
        const remoteObjectStorageResult = await this.remoteObjectStorage.getObject<T>(path);

        if (remoteObjectStorageResult !== undefined) {
            const fetchedObject = Objects.clone(remoteObjectStorageResult); // Cloning to loose references.
            await this.stateCache.setItem(stateCacheKey, fetchedObject); // Adding to local cache (STATE).
        }

        return remoteObjectStorageResult;
    }

    public async deleteObject(path: string, changeDescription: string): Promise<void> {
        if (!path) {
            throw new Error(`Parameter "path" not specified.`);
        }

        let compensationOfState;
        let compensationOfChanges;

        const doCommand = async (): Promise<void> => {
            const stateObject = await this.stateCache.getItem<object>(stateObjectCacheKey) || {};
            const changesObject = await this.changesCache.getItem<object>(changesObjectCacheKey) || {};

            /* Writing state */
            compensationOfState = Objects.setValueWithCompensation(path, stateObject, null);

            /* Writng changes */
            compensationOfChanges = Objects.setValueWithCompensation(path, changesObject, null);

            Objects.cleanupObject(stateObject, { removeNulls: true });
            Objects.cleanupObject(changesObject);

            await this.changesCache.setItem(changesObjectCacheKey, changesObject);
            await this.stateCache.setItem(stateObjectCacheKey, stateObject);
        };

        const undoCommand = async (): Promise<void> => {
            const stateObject = await this.stateCache.getItem<object>(stateObjectCacheKey) || {};
            const changesObject = await this.changesCache.getItem<object>(changesObjectCacheKey) || {};

            /* Undoing state */
            Objects.setValueWithCompensation(path, stateObject, compensationOfState);

            /* Undoinf changes */
            Objects.setValueWithCompensation(path, changesObject, compensationOfChanges);

            Objects.cleanupObject(stateObject, { removeNulls: true });
            Objects.cleanupObject(changesObject);

            await this.changesCache.setItem(changesObjectCacheKey, changesObject);
            await this.stateCache.setItem(stateObjectCacheKey, stateObject);
        };

        await this.do(doCommand, undoCommand, changeDescription);
    }

    private async do(doCommand: () => Promise<void>, undoCommand: () => Promise<void>, changeDescription: string): Promise<void> {
        const record: HistoryRecord = { do: doCommand, undo: undoCommand, stateDescription: changeDescription };
        await record.do();

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

    public async undo(): Promise<void> {
        if (!this.canUndo()) {
            return;
        }

        const record = this.past.pop();
        await record.undo();

        this.future.push(record);

        if (this.autosave) {
            this.saveChanges();
        }

        if (this.eventManager) {
            this.eventManager.dispatchEvent("onDataPush");
            this.eventManager.dispatchEvent("onDataChange");
        }
    }

    public async redo(): Promise<void> {
        if (!this.canRedo()) {
            return;
        }

        const record = this.future.pop();
        await record.do();

        this.past.push(record);

        if (this.eventManager) {
            this.eventManager.dispatchEvent("onDataPush");
            this.eventManager.dispatchEvent("onDataChange");
        }
    }

    private async searchLocalState<T>(path: string, query?: Query<T>): Promise<Page<T>> {
        const stateCacheKey = `${stateObjectCacheKey}/${path}`;
        const stateObject = await this.stateCache.getItem<object>(stateCacheKey);

        if (!stateObject) {
            return {
                value: [],
                takeNext: null
            };
        }

        const searchObj = Objects.clone(stateObject);

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

        return {
            value: collection,
            takeNext: null
        };
    }

    private async searchRemote<T>(path: string, query?: Query<T>): Promise<any> {
        const remoteQuery = query.copy();
        const pageOfRemoteSearchResults = await this.remoteObjectStorage.searchObjects<T>(path, remoteQuery);

        const remoteSearchResults = pageOfRemoteSearchResults.value;

        /* Remove locally deleted objects from remote search results */
        const changesCacheKey = `${changesObjectCacheKey}/${path}`;
        const changesObject = await this.changesCache.getItem<object>(changesCacheKey);

        if (changesObject) {
            Object.keys(changesObject)
                .forEach(key => {
                    const index = remoteSearchResults.findIndex(x => x["key"] === `${path}/${key}`);

                    if (index >= 0 && changesObject[key] === null) {
                        remoteSearchResults.splice(index, 1);
                    }
                });
        }

        /* Find locally added/changed objects */
        const localStateSearchResults = await this.searchLocalState(path, query);

        /* Merge local changes search results with remote search results */
        const locallyAddedObjects = [];

        for (const localStateSearchResultItem of localStateSearchResults.value) {
            const searchResultItemIndex = remoteSearchResults.findIndex(r => r["key"] === localStateSearchResultItem["key"]);

            if (searchResultItemIndex !== -1) {
                remoteSearchResults[searchResultItemIndex] = localStateSearchResultItem;
            }
            else {
                locallyAddedObjects.push(localStateSearchResultItem);
            }
        }

        pageOfRemoteSearchResults.value = locallyAddedObjects.concat(remoteSearchResults);

        return pageOfRemoteSearchResults;
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

        let resultPage: Page<T>;

        switch (this.cachingStrategy) {
            case CachingStrategy.NetworkFirst:
                resultPage = await this.searchRemote(path, query);
                break;

            case CachingStrategy.CacheFirst:
                resultPage = await this.searchLocalState<T>(path, query);
                break;

            default:
                throw new Error(`Caching strategy "${this.cachingStrategy}" not yet supported.`);
        }

        return resultPage;
    }

    public getPrevStateDescription(): string {
        if (this.past.length === 0) {
            return undefined;
        }

        const pastState = this.past[this.past.length - 1];
        return pastState.stateDescription;
    }

    public getNextStateDescription(): string {
        if (this.future.length === 0) {
            return undefined;
        }

        const futureState = this.future[this.future.length - 1];
        return futureState.stateDescription;
    }

    public async hasUnsavedChanges(): Promise<boolean> {
        const changesObject = await this.changesCache.getItem<object>(changesObjectCacheKey) || {};
        return Object.keys(changesObject).length > 0;
    }

    public async hasUnsavedChangesAt(key: string): Promise<boolean> {
        const changesObject = await this.changesCache.getItem<object>(changesObjectCacheKey) || {};
        return !!Objects.getObjectAt(key, changesObject);
    }

    public async discardChanges(): Promise<void> {
        const stateObject = await this.stateCache.getItem(stateObjectCacheKey) || {};
        const changesObject = await this.changesCache.getItem<object>(changesObjectCacheKey) || {};

        Object.keys(changesObject).forEach(key => delete changesObject[key]);
        Object.keys(stateObject).forEach(key => delete stateObject[key]);

        await this.stateCache.setItem(stateObjectCacheKey, stateObject);
        await this.changesCache.setItem(changesObjectCacheKey, changesObject);
    }

    public async saveChanges(): Promise<void> {
        const changesObject = await this.changesCache.getItem<object>(changesObjectCacheKey) || {};
        const entities = Object.keys(changesObject);

        if (entities.length === 0) {
            return;
        }

        await this.remoteObjectStorage.saveChanges(changesObject);
        entities.forEach(key => delete changesObject[key]);

        await this.changesCache.setItem(changesObjectCacheKey, changesObject);

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

        const data = await this.stateCache.getItem<object>(stateObjectCacheKey);

        return data;
    }
}
