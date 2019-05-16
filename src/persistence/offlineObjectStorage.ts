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
            compensationOfState = Objects.setValueAt(path, this.stateObject, dataObjectClone);

            /* Writng changes */
            compensationOfChanges = Objects.setValueAt(path, this.changesObject, dataObjectClone);

            Objects.cleanupObject(this.stateObject, true);
            Objects.cleanupObject(this.changesObject, true);
        };

        const undoCommand = () => {
            /* Undoing state */
            Objects.setValueAt(path, this.stateObject, compensationOfState);

            /* Undoinf changes */
            Objects.setValueAt(path, this.changesObject, compensationOfChanges);

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

        if (!!!dataObject) {
            throw new Error(`Parameter "dataObject" not specified.`);
        }

        const dataObjectClone = Objects.clone(dataObject); // To drop any object references

        let compensationOfState;
        let compensationOfChanges;

        const doCommand = () => {
            /* Writing state */
            compensationOfState = Objects.setValueAt(path, this.stateObject, dataObjectClone);

            /* Writng changes */
            compensationOfChanges = Objects.setValueAt(path, this.changesObject, dataObjectClone);

            Objects.cleanupObject(this.stateObject, true);
            Objects.cleanupObject(this.changesObject);
        };

        const undoCommand = () => {
            /* Undoing state */
            Objects.setValueAt(path, this.stateObject, compensationOfState);

            /* Undoing changes */
            Objects.setValueAt(path, this.changesObject, compensationOfChanges);

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
            Objects.setValueAt(path, this.stateObject, Objects.clone(result));
        }

        return result;
    }

    public async deleteObject(path: string): Promise<void> {
        let compensationOfState;
        let compensationOfChanges;

        const doCommand = () => {
            /* Writing state */
            compensationOfState = Objects.setValueAt(path, this.stateObject, null);

            /* Writng changes */
            compensationOfChanges = Objects.setValueAt(path, this.changesObject, null);

            Objects.cleanupObject(this.stateObject, true);
            Objects.cleanupObject(this.changesObject);
        };

        const undoCommand = () => {
            /* Undoing state */
            Objects.setValueAt(path, this.stateObject, compensationOfState);

            /* Undoinf changes */
            Objects.setValueAt(path, this.changesObject, compensationOfChanges);

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

    public async searchObjects<T>(path: string, query?: Query<T>): Promise<Bag<T>> {
        let resultObject = {};

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

            resultObject = searchResultObject;
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
