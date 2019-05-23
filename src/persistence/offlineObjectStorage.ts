import * as Objects from "../objects";
import * as _ from "lodash";
import { Bag } from "./../bag";
import { IObjectStorage, Query, Operator, OrderDirection } from "../persistence";
import { IObjectStorageMiddleware } from "./IObjectStorageMiddleware";
import { IEventManager } from "../events";


export class OfflineObjectStorage implements IObjectStorage {
    private underlyingStorage: IObjectStorage;      // for storage
    private readonly stateObject: Object;
    private readonly changesObject: Object;
    private readonly past = [];
    private readonly future = [];
    private readonly middlewares: IObjectStorageMiddleware[];

    public isOnline: boolean;
    public autosave: boolean;

    constructor(private readonly eventManager?: IEventManager) {
        this.stateObject = {};
        this.changesObject = {};
        this.underlyingStorage = null;
        this.isOnline = true;
        this.autosave = false;
        this.middlewares = [];

        if (eventManager) {
            this.eventManager.addEventListener("onUndo", () => this.undo());
            this.eventManager.addEventListener("onRedo", () => this.redo());
        }
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

        const cachedItem = Objects.getObjectAt<T>(path, this.stateObject);

        if (cachedItem) {
            return Promise.resolve<T>(cachedItem);
        }

        const result = await this.underlyingStorage.getObject<T>(path);

        if (result) {
            Objects.setValueWithCompensation(path, this.stateObject, Objects.clone(result));
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
    }

    public undo(): void {
        if (this.past.length === 0) {
            return;
        }

        const record = this.past.pop();
        record.undo();
        this.future.push(record);

        if (this.eventManager) {
            this.eventManager.dispatchEvent("onDataPush");
        }

        if (this.autosave) {
            this.saveChanges();
        }
    }

    public redo(): void {
        if (this.future.length === 0) {
            return;
        }

        const record = this.future.pop();
        record.do();
        this.past.push(record);

        if (this.eventManager) {
            this.eventManager.dispatchEvent("onDataPush");
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

        let collection = Object.values(searchObj);

        if (query) {
            if (query.filters.length > 0) {
                collection = collection.filter(x => {
                    let meetsCriteria = true;

                    for (const filter of query.filters) {
                        const left = x[filter.left].toUpperCase();
                        const right = filter.right.toUpperCase();
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

    public async discardChanges(): Promise<void> {
        Object.keys(this.changesObject).forEach(key => delete this.changesObject[key]);
        Object.keys(this.stateObject).forEach(key => delete this.stateObject[key]);
    }

    public async saveChanges(): Promise<void> {
        await this.underlyingStorage.saveChanges(this.changesObject);
        Object.keys(this.changesObject).forEach(key => delete this.changesObject[key]);
    }
}
