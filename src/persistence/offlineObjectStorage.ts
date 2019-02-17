import * as Objects from "../objects";
import * as _ from "lodash";
import { Bag } from "./../bag";
import { IObjectStorage, Query } from "../persistence";
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

    constructor(private readonly eventManager?: IEventManager) {
        this.stateObject = {};
        this.changesObject = {};
        this.underlyingStorage = null;
        this.isOnline = true;
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

    private setStateObjectAt(key: string, source: Object, recordHistory: boolean = false): void {
        const updates = Objects.clone(source);

        if (recordHistory) {
            this.setValueAt(key, this.stateObject, updates, true);
        }
    }

    private setChangesObjectAt(key: string, source: Object): void {
        const updates = Objects.clone(source);
        Objects.setValueAt(key, this.changesObject, updates, false);
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
            throw new Error(`Could not update object: Key is undefined.`);
        }

        if (!!!dataObject) {
            throw new Error(`Parameter "dataObject" not specified.`);
        }

        this.setChangesObjectAt(key, dataObject);
        this.setStateObjectAt(key, dataObject, true);
    }

    public async getObject<T>(key: string): Promise<T> {
        if (!key) {
            throw new Error(`Path is undefined.`);
        }

        const cachedItem = Objects.getObjectAt<T>(key, this.stateObject);

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
        Objects.deleteNodeAt(key, this.stateObject);
        Objects.setValueAt(key, this.changesObject, null, false);
    }

    public async searchObjects<T>(path: string, query: Query<T>): Promise<Bag<T>> {
        let resultObject = {};

        if (this.isOnline) {
            const searchResultObject = await this.underlyingStorage.searchObjects<Bag<T>>(path, query);
            const changesAt = Objects.getObjectAt(path, Objects.clone(this.changesObject));

            if (changesAt) {
                /* If there are changes at the same path, apply them to search result */
                Objects.mergeDeep(searchResultObject, changesAt);
            }

            /* Complement stateObject with new objects from search result, if any */
            Objects.mergeDeepAt(path, this.stateObject, Objects.clone(searchResultObject));

            resultObject = searchResultObject;
        }

        return resultObject;
    }

    public async saveChanges(): Promise<void> {
        await this.underlyingStorage.saveChanges(this.changesObject);
        Object.keys(this.changesObject).forEach(key => delete this.changesObject[key]);
    }

    public setValueAt(path: string, target: object, value: object, cleanNulls: boolean = true): void {
        let compensation;

        const doCommand = () => {
            compensation = Objects.getObjectAt(path, target);
            Objects.setValueAt(path, target, value);
        };

        const undoCommand = () => {
            Objects.setValueAt(path, target, compensation);
        };

        this.do(doCommand, undoCommand);
    }

    public merge(target: Object, changes: Object, stepCompleteCallback?: () => void): void {
        let compensation;

        const doCommand = () => {
            compensation = Objects.mergeDeep(target, changes);

            if (stepCompleteCallback) {
                stepCompleteCallback();
            }
        };

        const undoCommand = () => {
            Objects.mergeDeep(target, compensation);

            if (stepCompleteCallback) {
                stepCompleteCallback();
            }
        };

        this.do(doCommand, undoCommand);
    }

    public applyChangesAt(path: string, target: Object, changes: Object): void {
        let compensation;

        const doCommand = () => {
            compensation = Objects.mergeDeepAt(path, target, changes);
        };

        const undoCommand = () => {
            Objects.mergeDeep(target, compensation);
        };

        this.do(doCommand, undoCommand);
    }

    public do(doCommand, undoCommand): void {
        const record = { do: doCommand, undo: undoCommand };
        record.do();

        this.past.push(record);

        if (this.past.length > 10) {
            this.past.shift();
        }
    }

    public undo(): void {
        if (this.past.length === 0) {
            return;
        }

        const record = this.past.pop();
        record.undo();
        this.future.push(record);

        this.eventManager.dispatchEvent("onDataPush");
    }

    public redo(): void {
        if (this.future.length === 0) {
            return;
        }

        const record = this.future.pop();
        record.do();
        this.past.push(record);

        this.eventManager.dispatchEvent("onDataPush");
    }
}
