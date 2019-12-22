import * as Objects from "../objects";
import * as _ from "lodash";
import { Bag } from "./../bag";
import { IObjectStorage, Query, Operator, OrderDirection } from "../persistence";
import { IObjectStorageMiddleware } from "./IObjectStorageMiddleware";
import { EventManager } from "../events";

interface HistoryRecord {
    do: () => void;
    undo: () => void;
}

export class OfflineObjectStorage implements IObjectStorage {
    private underlyingStorage: IObjectStorage;      // for storage
    private readonly stateObject: Object;
    private readonly changesObject: Object;
    private readonly past: HistoryRecord[];
    private readonly future: HistoryRecord[];
    private readonly middlewares: IObjectStorageMiddleware[];

    public isOnline: boolean;
    public autosave: boolean;

    constructor(private readonly eventManager?: EventManager) {
        this.stateObject = {};
        this.changesObject = {};
        this.underlyingStorage = null;
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

    public canUndo(): boolean {
        return this.past.length > 0;
    }

    public canRedo(): boolean {
        return this.future.length > 0;
    }

    public registerUnderlyingStorage(underlyingStorage: IObjectStorage): void {
        this.underlyingStorage = underlyingStorage;
    }

    public registerMiddleware(middleware: IObjectStorageMiddleware): void {
        this.middlewares.push(middleware);
    }

    public async addObject(path: string, dataObject: Object): Promise<void> {
        if (!path) {
            throw new Error("Could not add object: Key is undefined.");
        }

        const dataObjectClone = Objects.clone(dataObject); // To drop any object references

        let compensationOfState;
        let compensationOfChanges;

        const doCommand = () => {
            /* Writing state */
            compensationOfState = Objects.setValueWithCompensation(path, this.stateObject, dataObjectClone);

            /* Writng changes */
            compensationOfChanges = Objects.setValueWithCompensation(path, this.changesObject, dataObjectClone);

            Objects.cleanupObject(this.stateObject, true);
            Objects.cleanupObject(this.changesObject, true);
        };

        const undoCommand = () => {
            /* Undoing state */
            Objects.setValueWithCompensation(path, this.stateObject, compensationOfState);

            /* Undoing changes */
            Objects.setValueWithCompensation(path, this.changesObject, compensationOfChanges);

            Objects.cleanupObject(this.stateObject, true);
            Objects.cleanupObject(this.changesObject, true);
        };

        this.do(doCommand, undoCommand);
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

        const dataObjectClone1 = Objects.clone(dataObject); // To drop any object references
        const dataObjectClone2 = Objects.clone(dataObject); // To drop any object references

        let compensationOfState;
        let compensationOfChanges;

        const doCommand = () => {
            /* Writing state */
            compensationOfState = Objects.setValueWithCompensation(path, this.stateObject, dataObjectClone1);

            /* Writng changes */
            compensationOfChanges = Objects.setValueWithCompensation(path, this.changesObject, dataObjectClone2);

            Objects.cleanupObject(this.stateObject, true);
            Objects.cleanupObject(this.changesObject);
        };

        const undoCommand = () => {
            /* Undoing state */
            Objects.setValueWithCompensation(path, this.stateObject, compensationOfState);

            /* Undoing changes */
            Objects.setValueWithCompensation(path, this.changesObject, compensationOfChanges);

            Objects.cleanupObject(this.stateObject, true);
            Objects.cleanupObject(this.changesObject);
        };

        this.do(doCommand, undoCommand);
    }

    public async getObject<T>(path: string): Promise<T> {
        if (!path) {
            throw new Error(`Path is undefined.`);
        }

        const clonedChanges = <any>Objects.clone(this.changesObject);
        const changesAt = Objects.getObjectAt(path, clonedChanges);

        if (changesAt === null) {
            /*
               Note: "null" (not undefined) in changesObject specifically means that this object
               has been deleted locally (but not yet saved to underlying). Hence, no need to check
               neither local nor underlying storage.
            */

            return undefined;
        }

        let result = Objects.getObjectAt<T>(path, this.stateObject);

        if (!result && this.isOnline) {
            const underlyingStorageResult = await this.underlyingStorage.getObject<T>(path);

            if (underlyingStorageResult) {
                result = Objects.clone(underlyingStorageResult);
                Objects.setValue(path, this.stateObject, result);
            }
        }

        return result;
    }

    public async deleteObject(path: string): Promise<void> {
        let compensationOfState;
        let compensationOfChanges;

        const doCommand = () => {
            /* Writing state */
            compensationOfState = Objects.setValueWithCompensation(path, this.stateObject, null);

            /* Writng changes */
            compensationOfChanges = Objects.setValueWithCompensation(path, this.changesObject, null);

            Objects.cleanupObject(this.stateObject, true);
            Objects.cleanupObject(this.changesObject);
        };

        const undoCommand = () => {
            /* Undoing state */
            Objects.setValueWithCompensation(path, this.stateObject, compensationOfState);

            /* Undoinf changes */
            Objects.setValueWithCompensation(path, this.changesObject, compensationOfChanges);

            Objects.cleanupObject(this.stateObject, true);
            Objects.cleanupObject(this.changesObject);
        };

        this.do(doCommand, undoCommand);
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

    private async searchLocalState<T>(path: string, query?: Query<T>): Promise<Bag<T>> {
        const searchResultObject: Bag<T> = {};
        const data = this.stateObject;

        if (!data) {
            return searchResultObject;
        }

        const searchObj = Objects.getObjectAt(path, data);

        if (!searchObj) {
            return searchResultObject;
        }

        return this.searchInResult<T>(searchObj, query);
    }

    private searchInResult<T>(searchObj: unknown, query?: Query<T>): Bag<T> {
        const searchResultObject: Bag<T> = {};
        let collection = Object.values(searchObj);

        if (query) {
            if (query.filters.length > 0) {
                collection = collection.filter(x => {
                    let meetsCriteria = true;

                    for (const filter of query.filters) {
                        const property = x[filter.left];

                        if (typeof filter.right === "boolean") {
                            if (filter.operator !== Operator.equals) {
                                console.warn("Boolean query operator can be only equals");
                                meetsCriteria = false;
                                return;
                            }

                            if (((property === undefined || property === false) && filter.right === true) ||
                                ((filter.right === undefined || filter.right === false) && property === true)) {
                                meetsCriteria = false;
                            }
                            continue;
                        }

                        if (!property) {
                            meetsCriteria = false;
                            continue;
                        }

                        let left = x[filter.left];
                        let right = filter.right;

                        if (typeof left === "string") {
                            left = left.toUpperCase();
                        }

                        if (typeof right === "string") {
                            right = right.toUpperCase();
                        }

                        const operator = filter.operator;

                        switch (operator) {
                            case Operator.contains:
                                if (!left.contains(right)) {
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
                    const a = x[property].toUpperCase();
                    const b = y[property].toUpperCase();
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

        collection.forEach(item => {
            const segments = item.key.split("/");
            const key = segments[1];

            Objects.setValue(key, searchResultObject, item);
            Objects.cleanupObject(item); // Ensure all "undefined" are cleaned up
        });

        return searchResultObject;
    }

    public async searchObjects<T>(path: string, query?: Query<T>): Promise<Bag<T>> {
        const resultObject = await this.searchLocalState(path, query);

        if (this.isOnline) {
            const searchResultObject = await this.underlyingStorage.searchObjects<Bag<T>>(path, query);

            if (!searchResultObject || Object.keys(searchResultObject).length === 0) {
                return resultObject;
            }

            const changesAt = Objects.getObjectAt(path, Objects.clone(this.changesObject));

            if (changesAt) {
                /* If there are changes at the same path, apply them to search result */
                Objects.mergeDeep(searchResultObject, changesAt);
            }

            /* Complement stateObject with new objects from search result, if any */
            Objects.mergeDeepAt(path, this.stateObject, Objects.clone(searchResultObject));

            Objects.mergeDeep(resultObject, searchResultObject);
        }

        return resultObject;
    }

    public hasUnsavedChanges(): boolean {
        return Object.keys(this.changesObject).length > 0;
    }

    public hasUnsavedChangesAt(key: string): boolean {
        return !!Objects.getObjectAt(key, this.changesObject);
    }

    public async discardChanges(): Promise<void> {
        Object.keys(this.changesObject).forEach(key => delete this.changesObject[key]);
        Object.keys(this.stateObject).forEach(key => delete this.stateObject[key]);
    }

    public async saveChanges(): Promise<void> {
        const entities = Object.keys(this.changesObject);

        if (entities.length === 0) {
            return;
        }

        await this.underlyingStorage.saveChanges(this.changesObject);
        entities.forEach(key => delete this.changesObject[key]);
        this.eventManager.dispatchEvent("onDataChange");
    }
}
